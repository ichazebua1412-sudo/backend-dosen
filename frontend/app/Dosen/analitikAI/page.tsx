"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import {
  Sparkles,
  Star,
  Award,
  Flag,
  AlertTriangle,
  ArrowRight,
  Printer,
  Send,
  Bot,
} from "lucide-react";

export default function AnalitikAIPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    strength: string;
    improvement: string;
    recommendation: string;
    source: string;
  } | null>(null);

  // Load classes
  useEffect(() => {
    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          setSelectedClassId(res.classes[0].id);
          loadClassGrades(res.classes[0].id);
        }
      })
      .catch((err) => console.warn(err.message));
  }, []);

  const loadClassGrades = async (classId: number) => {
    setSelectedClassId(classId);
    try {
      const res = await apiFetch(`/grades/${classId}`);
      setStudents(res.grades || []);
    } catch (err: any) {
      console.warn("Error loading grades:", err.message);
      setStudents([]);
    }
  };

  // Compute live statistics
  const total = students.length;
  let sumScore = 0;
  let passCount = 0;
  let remedialCount = 0;
  let sumTugas = 0, countTugas = 0;
  let sumUts = 0, countUts = 0;
  let sumUas = 0, countUas = 0;

  students.forEach((s) => {
    const finalScore = s.final_score !== null ? Number(s.final_score) : null;
    if (finalScore !== null) {
      sumScore += finalScore;
      if (finalScore >= 65) passCount++;
      else remedialCount++;
    } else {
      remedialCount++;
    }
    if (s.tugas !== null) { sumTugas += Number(s.tugas); countTugas++; }
    if (s.uts !== null) { sumUts += Number(s.uts); countUts++; }
    if (s.uas !== null) { sumUas += Number(s.uas); countUas++; }
  });

  const avgScore = total > 0 ? (sumScore / total).toFixed(1) : "0.0";
  const passRate = total > 0 ? Math.round((passCount / total) * 100) : 0;
  const avgTugas = countTugas > 0 ? (sumTugas / countTugas).toFixed(1) : "0.0";
  const avgUts = countUts > 0 ? (sumUts / countUts).toFixed(1) : "0.0";
  const avgUas = countUas > 0 ? (sumUas / countUas).toFixed(1) : "0.0";

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handleGenerateAI = async () => {
    if (!selectedClassId) return;
    setGeneratingAI(true);
    try {
      const summaryPayload = {
        className: selectedClass?.name || "Mata Kuliah",
        totalStudents: total,
        avgScore: Number(avgScore),
        passRate,
        remedialCount,
      };

      const res = await apiFetch("/ai/feedback", {
        method: "POST",
        body: JSON.stringify({ classSummary: summaryPayload }),
      });

      setAiAnalysis({
        strength: res.strength || "Tingkat pemahaman materi secara umum memadai.",
        improvement: res.improvement || "Penguatan diperlukan untuk materi evaluasi akhir.",
        recommendation: res.recommendation || "Disarankan menambah latihan studi kasus mandiri.",
        source: res.source || "sistem",
      });
    } catch (err: any) {
      alert("Gagal melakukan analisis AI: " + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        <Sidebar currentPath="/Dosen/analitikAI" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header breadcrumbs={["Portal", "Sistem Akademik", "Analitik & AI Feedback"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  <span>Portal</span> • <span>Sistem Akademik</span> • <span className="underline">Analitik & AI Feedback</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analitik & AI Feedback Akademik</h2>
                <p className="text-sm text-slate-500 mt-0.5">Monitoring kurva distribusi nilai mahasiswa, evaluasi ketercapaian CPMK, dan telaah otomatis AI engine.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {classes.length > 0 ? (
                  <select
                    value={selectedClassId || ""}
                    onChange={(e) => loadClassGrades(Number(e.target.value))}
                    className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                    Belum ada kelas aktif
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generatingAI || total === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition shadow-indigo-600/20"
                >
                  <Sparkles size={14} className={generatingAI ? "animate-spin" : ""} />
                  {generatingAI ? "Menganalisis..." : "+ Generate Analisis Baru"}
                </button>
              </div>
            </div>

            {/* 3 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai Kelas</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-4xl font-black text-slate-900">{avgScore}</h3>
                      <span className="text-xs font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Star size={20} />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">Target KKM: 65.0</span>
                  <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-1 rounded-lg">{total} Mahasiswa</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Kelulusan OBE</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-4xl font-black text-slate-900">{passRate}%</h3>
                      <span className="text-xs font-semibold text-slate-400">Akumulasi</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{passCount} dari {total} tuntas KKM</span>
                  <span className={`font-bold px-2 py-1 rounded-lg ${passRate >= 75 ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"}`}>
                    {passRate >= 75 ? "Optimal" : "Perlu Perhatian"}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Butuh Pendampingan</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-4xl font-black text-rose-600">{remedialCount}</h3>
                      <span className="text-xs font-bold text-slate-700">Mahasiswa</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Flag size={20} />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-100">Nilai &lt; 65 / Belum Lengkap</span>
                  <button
                    type="button"
                    onClick={() => router.push("/Dosen/inputnilai")}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    Buka Nilai <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Section: Breakdown & AI Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Rincian Komponen Nilai */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Rata-Rata Komponen Penilaian</h3>
                    <p className="text-xs text-slate-500">Ketercapaian indikator evaluasi berbasis bobot perkuliahan</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tugas & Praktikum (Bobot 30%)
                        </span>
                        <span className="font-bold text-slate-900">{avgTugas} <span className="text-slate-400 font-normal">/ 100</span></span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, Number(avgTugas)))}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Ujian Tengah Semester (UTS - Bobot 35%)
                        </span>
                        <span className="font-bold text-slate-900">{avgUts} <span className="text-slate-400 font-normal">/ 100</span></span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, Number(avgUts)))}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Ujian Akhir Semester (UAS - Bobot 35%)
                        </span>
                        <span className="font-bold text-slate-900">{avgUas} <span className="text-slate-400 font-normal">/ 100</span></span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, Number(avgUas)))}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benchmark Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mata Kuliah Aktif</p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {selectedClass ? `${selectedClass.name} (${selectedClass.code}) - ${selectedClass.sks || 3} SKS` : "Pilih kelas untuk melihat analitik"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    OBE Terintegrasi
                  </span>
                </div>
              </div>

              {/* AI Feedback Panel */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Bot size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Telaah & AI Feedback</h3>
                        <p className="text-[10px] text-slate-400">
                          {aiAnalysis ? `Sumber Engine: ${aiAnalysis.source.toUpperCase()}` : "Model: Gradia OBE Intelligence"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                      Aktif
                    </span>
                  </div>

                  {/* Strength */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <Sparkles size={14} className="text-emerald-600" />
                      <span>Kekuatan & Ketercapaian Kelas</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {aiAnalysis
                        ? aiAnalysis.strength
                        : total > 0
                        ? `Tingkat kelulusan saat ini berada pada ${passRate}% dengan rata-rata nilai ${avgScore}. Klik tombol "+ Generate Analisis Baru" untuk telaah mendalam AI.`
                        : "Silakan input nilai mahasiswa atau import file CSV/Excel untuk memicu analisis AI."}
                    </p>
                  </div>

                  {/* Improvement */}
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                      <AlertTriangle size={14} className="text-amber-600" />
                      <span>Area Perlu Penguatan</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {aiAnalysis
                        ? aiAnalysis.improvement
                        : remedialCount > 0
                        ? `Terdapat ${remedialCount} mahasiswa yang perlu perhatian atau belum melengkapi seluruh komponen nilai.`
                        : "Seluruh mahasiswa telah memenuhi standar kelulusan KKM."}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                      <Bot size={14} className="text-indigo-600" />
                      <span>Rekomendasi Tindakan Dosen</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {aiAnalysis
                        ? aiAnalysis.recommendation
                        : "Lakukan sinkronisasi nilai secara berkala dan pantau mahasiswa yang membutuhkan asistensi praktikum sebelum evaluasi akhir semester."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => router.push("/Dosen/cetakPDF")}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Printer size={14} /> Cetak PDF Laporan
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/Dosen/inputnilai")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20"
                    >
                      <Send size={14} /> Input Nilai
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}