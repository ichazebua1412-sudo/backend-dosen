"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Search, RefreshCw, GraduationCap, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminKelasPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await apiFetch("/admin/classes");
      setClasses(res.classes || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memuat data kelas kampus.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = classes.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lecturer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prodi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Monitoring Akademik
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Seluruh Kelas Kampus
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap mata kuliah yang diampu oleh seluruh dosen beserta kapasitas mahasiswa
          </p>
        </div>

        <button
          onClick={fetchClasses}
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors self-start sm:self-auto"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari kelas berdasarkan kode, nama matkul, dosen pengampu, atau prodi..."
          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Mata Kuliah & Kode</th>
                <th className="py-4 px-4">Dosen Pengampu</th>
                <th className="py-4 px-4">Prodi & Semester</th>
                <th className="py-4 px-4 text-center">SKS</th>
                <th className="py-4 px-4 text-center">Terisi / Kapasitas</th>
                <th className="py-4 px-6 text-right">Jadwal & Ruang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Memuat data kelas...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada kelas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-extrabold text-slate-900 text-sm">{c.title}</p>
                      <span className="font-mono text-[11px] text-slate-400">{c.code}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{c.lecturer_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">NIDN: {c.lecturer_nidn}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-700 font-medium">{c.prodi}</p>
                      <p className="text-[11px] text-slate-400">Semester {c.semester}</p>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      {c.sks} SKS
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                        <Users className="w-3.5 h-3.5" />
                        {c.enrolled_count} / {c.capacity || 40}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <p className="font-medium text-slate-700">{c.schedule || "-"}</p>
                      <p className="text-[11px] text-slate-400">{c.room || "-"}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
