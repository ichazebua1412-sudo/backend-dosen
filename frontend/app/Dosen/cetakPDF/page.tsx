"use client";

import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import { Printer } from "lucide-react";

export default function CetakLaporanPDFPage() {
  const [lecturer, setLecturer] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("gradia_lecturer") : null;
    if (stored) {
      try {
        setLecturer(JSON.parse(stored));
      } catch (e) {}
    }

    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          setSelectedClassId(res.classes[0].id);
          fetchGrades(res.classes[0].id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn(err.message);
        setIsLoading(false);
      });
  }, []);

  const fetchGrades = (classId: number) => {
    setIsLoading(true);
    apiFetch(`/grades/${classId}`)
      .then((res) => {
        setGrades(res.grades || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    fetchGrades(classId);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const lecturerDisplayName = lecturer
    ? `${lecturer.title_prefix ? lecturer.title_prefix + " " : ""}${lecturer.name}${lecturer.title_suffix ? ", " + lecturer.title_suffix : ""}`
    : "Dosen Pengampu";

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        {/* SIDEBAR (Hidden during print) */}
        <div className="print:hidden">
          <Sidebar currentPath="/Dosen/cetakPDF" />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header (Hidden during print) */}
          <div className="print:hidden">
            <Header breadcrumbs={["Portal", "Laporan & Evaluasi", "Cetak Rekap Nilai PDF"]} />
          </div>

          <main className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Filter selector & Print button (Hidden during print) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="font-semibold text-slate-700">Pilih Kelas / Mata Kuliah:</label>
                <select
                  value={selectedClassId || ""}
                  onChange={(e) => handleClassChange(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {classes.length === 0 ? (
                    <option value="">Belum ada kelas aktif</option>
                  ) : (
                    classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code || "KLS"} - {c.name} ({c.prodi || "Informatika"})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-slate-400 text-[11px] hidden sm:block">
                  Siap dicetak dalam format dokumen A4 resmi.
                </p>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition shadow-indigo-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen (PDF)</span>
                </button>
              </div>
            </div>

            {/* DOKUMEN CETAK RESMI (Formatted for A4 Print) */}
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
              {/* Kop Surat Dokumen */}
              <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
                </h2>
                <h3 className="text-xs font-semibold uppercase text-slate-800 mt-0.5">
                  FAKULTAS ILMU KOMPUTER & TEKNOLOGI INFORMASI
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Sistem Informasi Akademik & Portal Penilaian OBE Gradia
                </p>
              </div>

              {/* Judul Laporan */}
              <div className="text-center my-6">
                <h1 className="text-base font-bold text-slate-900 uppercase underline tracking-wide">
                  BERITA ACARA REKAPITULASI PENILAIAN AKADEMIK
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Semester Ganjil Tahun Ajaran 2024/2025
                </p>
              </div>

              {/* Identitas Mata Kuliah */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-transparent print:p-0">
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">Mata Kuliah:</span>
                  <span className="font-bold text-slate-800">{currentClass?.name || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">Kode / SKS:</span>
                  <span className="font-semibold text-slate-800">{currentClass?.code || "-"} ({currentClass?.sks || 3} SKS)</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">Dosen Pengampu:</span>
                  <span className="font-bold text-slate-800">{lecturerDisplayName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">NIDN Dosen:</span>
                  <span className="font-semibold text-slate-800">{lecturer?.nidn || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">Program Studi:</span>
                  <span className="font-semibold text-slate-800">{currentClass?.prodi || "Teknik Informatika"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium w-32 inline-block">Jadwal & Ruang:</span>
                  <span className="font-semibold text-slate-800">
                    {currentClass ? `${currentClass.day || "Senin"}, ${currentClass.start_time || "08:00"} (${currentClass.room || "R-101"})` : "-"}
                  </span>
                </div>
              </div>

              {/* Tabel Penilaian */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold">
                      <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                      <th className="border border-slate-300 px-3 py-2 text-left w-28">NIM</th>
                      <th className="border border-slate-300 px-3 py-2 text-left">Nama Mahasiswa</th>
                      <th className="border border-slate-300 px-2 py-2 text-center w-14">Tugas (30%)</th>
                      <th className="border border-slate-300 px-2 py-2 text-center w-14">UTS (35%)</th>
                      <th className="border border-slate-300 px-2 py-2 text-center w-14">UAS (35%)</th>
                      <th className="border border-slate-300 px-2 py-2 text-center w-16">Nilai Akhir</th>
                      <th className="border border-slate-300 px-2 py-2 text-center w-12">Grade</th>
                      <th className="border border-slate-300 px-3 py-2 text-left">Feedback AI / Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="border border-slate-300 px-4 py-8 text-center text-slate-400">
                          {isLoading ? "Memuat data penilaian..." : "Belum ada data nilai mahasiswa di kelas ini."}
                        </td>
                      </tr>
                    ) : (
                      grades.map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="border border-slate-300 px-2 py-2 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 px-3 py-2 font-mono">{g.nim}</td>
                          <td className="border border-slate-300 px-3 py-2 font-medium">{g.name}</td>
                          <td className="border border-slate-300 px-2 py-2 text-center">{g.tugas ?? "-"}</td>
                          <td className="border border-slate-300 px-2 py-2 text-center">{g.uts ?? "-"}</td>
                          <td className="border border-slate-300 px-2 py-2 text-center">{g.uas ?? "-"}</td>
                          <td className="border border-slate-300 px-2 py-2 text-center font-bold">{g.final_score ?? "-"}</td>
                          <td className="border border-slate-300 px-2 py-2 text-center font-bold">{g.letter_grade ?? "-"}</td>
                          <td className="border border-slate-300 px-3 py-2 text-[10px] text-slate-600">{g.ai_feedback || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 mt-12 pt-6 text-xs text-center">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-semibold text-slate-800 mt-0.5">Ketua Program Studi</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900 underline">( .................................................... )</p>
                  <p className="text-[10px] text-slate-400">NIP / NIDN Kaprodi</p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Kota Kampus, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="font-semibold text-slate-800 mt-0.5">Dosen Pengampu Mata Kuliah</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900 underline">{lecturerDisplayName}</p>
                  <p className="text-[10px] text-slate-500">NIDN: {lecturer?.nidn || "-"}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
