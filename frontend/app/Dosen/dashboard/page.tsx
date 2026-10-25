"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Users,
  Sparkles,
  Plus,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Megaphone,
  ChevronRight,
  ExternalLink,
  Layers,
  FileText,
  BarChart3,
  AlertCircle,
} from "lucide-react";

export default function LecturerDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingGrading: 0,
    aiReportsReady: 0,
    accuracyRubric: "0%",
  });

  useEffect(() => {
    apiFetch("/dashboard")
      .then((res) => {
        if (res.stats) {
          setStats({
            totalClasses: res.stats.totalClasses ?? 0,
            totalStudents: res.stats.totalStudents ?? 0,
            pendingGrading: res.stats.pendingGrading ?? 0,
            aiReportsReady: res.stats.aiReportsReady ?? 0,
            accuracyRubric: res.stats.accuracyRubric ?? "0%",
          });
        }
        if (res.classes) {
          setClasses(res.classes);
        }
      })
      .catch((err) => {
        console.warn("Koneksi dashboard backend:", err.message);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        {/* ================= SIDEBAR ================= */}
        <Sidebar currentPath="/Dosen/dashboard" />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOP HEADER */}
          <Header breadcrumbs={["Portal", "Sistem Akademik", "Dashboard Dosen"]} />

          {/* MAIN DASHBOARD CONTENT */}
          <main className="p-6 space-y-6">
            {/* HEADER ACTION BANNER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Dashboard Dosen
                  </h2>
                  <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                    2024/2025 Ganjil Aktif
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  Monitoring rekapitulasi capaian akademik & kompilasi evaluasi mahasiswa berbasis
                  Outcome-Based Education (OBE).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Tombol Export Laporan PDF */}
                <Link
                  href="/Dosen/cetakPDF"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Laporan PDF</span>
                </Link>

                {/* Tombol Input Nilai Baru */}
                <Link
                  href="/Dosen/inputnilai"
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Input Nilai Baru</span>
                </Link>

                {/* Tombol Generate AI Feedback */}
                <Link
                  href="/Dosen/analitikAI"
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Feedback</span>
                </Link>
              </div>
            </div>

          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 font-medium">Total Kelas Diampu</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.totalClasses}</span>
                <span className="text-slate-600 font-medium">Kelas Aktif</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-indigo-600 font-semibold">
                <span>📈 100%</span>
                <span className="text-slate-400 font-normal">Kapasitas ruang optimal</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 font-medium">Total Mahasiswa</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.totalStudents}</span>
                <span className="text-slate-600 font-medium">Terdaftar</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px]">
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Aktif KRS
                </span>
                <span className="text-slate-400">• 3 Program Studi</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 font-medium">Rekap Tertunda</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-600">{stats.pendingGrading}</span>
                <span className="text-amber-700 font-medium">Kelas Tertunda</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                <Clock className="w-3 h-3" />
                <span>Sisa 6 hari pengisian</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 font-medium">Analitik OBE & AI</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{stats.aiReportsReady}</span>
                <span className="text-slate-600 font-medium">Laporan Siap</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-purple-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                <span>Akurasi rubrik 98.4%</span>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS */}
            <div className="lg:col-span-2 space-y-6">
              {/* JADWAL MENGAJAR HARI INI */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Jadwal Mengajar Hari Ini</h3>
                      <p className="text-[10px] text-slate-400">
                        Sinkronisasi langsung dengan Sistem Akademik Kampus
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                    Kamis, 24 Okt 2024
                  </span>
                </div>

                <div className="space-y-3">
                  {classes.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-medium">Belum ada jadwal mengajar atau kelas yang diampu.</p>
                      <Link
                        href="/Dosen/tambahkelas"
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-semibold text-xs hover:bg-blue-100 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Kelas Baru
                      </Link>
                    </div>
                  ) : (
                    classes.map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex items-center justify-between gap-4 hover:border-slate-200 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-white border border-slate-200 rounded-lg p-2 text-center min-w-[70px] shadow-2xs">
                            <p className="font-bold text-indigo-600 text-xs">{c.code}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{c.sks} SKS</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-900 text-xs">{c.title}</h4>
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full text-[9px]">
                                Aktif
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {c.room || "Ruang Teori"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-slate-400" /> {c.enrolled_count || 0} Mahasiswa Terdaftar
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link
                          href="/Dosen/manajemenkelas"
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-2xs text-xs shrink-0"
                        >
                          <span>Kelola Kelas</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PROGRESS PENGINPUTAN NILAI OBE */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Progress Penginputan Nilai OBE
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Status rekap CPL (Capaian Pembelajaran Lulusan)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Target Final: 30 Nov 2024
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Progress Item 1 */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          Rekayasa Perangkat Lunak - Kls A
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          32 dari 38 Mahasiswa telah dinilai komprehensif
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-indigo-600">85%</span>
                        <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-semibold rounded-md hover:bg-indigo-100 transition-all text-[11px]">
                          Lanjutkan Edit
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Komponen: Tugas (100%), UTS (100%), UAS (60%)</span>
                      <span className="text-purple-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Rekomendasi siap
                      </span>
                    </div>
                  </div>

                  {/* Progress Item 2 */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          Interaksi Manusia & Komputer - Kls C
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          48 dari 48 Mahasiswa dinilai penuh
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-emerald-600">100%</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200 flex items-center gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Terkunci / Selesai
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Arsip dikirim ke BAAK pada 22 Okt 2024</span>
                      <span className="text-slate-600 font-medium">BAP Berita Acara: Terbit</span>
                    </div>
                  </div>

                  {/* Progress Item 3 */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          Sistem Basis Data Terdistribusi - Kls B
                        </h4>
                        <p className="text-[10px] text-slate-400">0 dari 42 Mahasiswa dinilai</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-slate-400">0%</span>
                        <button className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all text-[11px]">
                          Mulai Input
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-slate-300 h-full rounded-full" style={{ width: "0%" }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Belum ada nilai tugas terunggah
                      </span>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Gunakan Template Excel
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (SIDEBAR PANELS) */}
            <div className="space-y-6">
              {/* AKTIVITAS TERBARU */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Aktivitas Terbaru</h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                    4 Log Baru
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Activity Item 1 */}
                  <div className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded text-[9px] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Generated
                      </span>
                      <span className="text-[10px] text-slate-400">10m lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Feedback otomatis rubrik Capaian Pembelajaran kelas RPL-A berhasil diterbitkan.
                    </p>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded text-[9px]">
                        Nilai Disimpan
                      </span>
                      <span className="text-[10px] text-slate-400">1j lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Draf penilaian Tugas Proyek Kelompok 2 disinkronisasi ke server pusat.
                    </p>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded text-[9px] flex items-center gap-1">
                        <Megaphone className="w-2.5 h-2.5" /> Portal BAAK
                      </span>
                      <span className="text-[10px] text-slate-400">3j lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Batas akhir perbaikan revisi komponen nilai semester genap: 10 Des 2024.
                    </p>
                  </div>

                  {/* Activity Item 4 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded text-[9px]">
                        Cetak PDF
                      </span>
                      <span className="text-[10px] text-slate-400">Kemarin</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Dokumen Berita Acara Perkuliahan resmi IMK-C berhasil diekspor berformat PDF.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <a
                    href="#"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Lihat Riwayat Log Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* PENGUMUMAN FAKULTAS */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Pengumuman Fakultas</h3>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                    Penting
                  </span>
                </div>

                {/* Banner Card */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white p-4 min-h-[120px] flex flex-col justify-end">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-slate-800 opacity-60 flex items-center justify-center text-slate-600 font-mono text-[9px]">
                    [ Banner Image Placeholder ]
                  </div>
                  <div className="relative z-20">
                    <span className="text-[9px] uppercase tracking-wider text-indigo-300 font-bold">
                      SEMINAR FAKULTAS
                    </span>
                    <h4 className="font-bold text-sm leading-snug mt-0.5">
                      Faculty Seminar: Digital Campus Transformation
                    </h4>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                    Sosialisasi Penjaminan Mutu Akademik & Evaluasi OBE
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Diharapkan seluruh koordinator mata kuliah menghadiri agenda pembekalan kurikulum
                    digital dan peningkatan akreditasi internasional pada hari Jumat mendatang.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Auditorium Utama & Zoom</span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 font-semibold rounded-md hover:bg-indigo-100 transition-all text-xs border border-indigo-200 shrink-0">
                    <span>Daftar Sekarang</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between text-[11px] text-slate-400">
          <p>© 2024 Lembaga Layanan Pendidikan Tinggi (LLDIKTI). Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SLA 99.98% Available</span>
          </div>
        </footer>
      </div>
    </div>
    </AuthGuard>
  );
}