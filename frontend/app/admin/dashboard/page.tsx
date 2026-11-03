"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  PlusCircle,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch("/admin/dashboard");
      setData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memuat data dashboard admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              Kontrol Keamanan Akses Dosen Aktif
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Pusat Kendali Akademik Kampus
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Pendaftaran mandiri dosen telah ditutup. Hanya dosen terdaftar yang diinput oleh Administrator yang memiliki hak akses masuk ke Portal Dosen Gradia.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/dosen"
              className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              Kelola & Tambah Dosen
            </Link>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
          <span>⚠️ {errorMsg}</span>
          <button onClick={fetchDashboard} className="underline text-xs font-bold">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dosen */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Dosen</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isLoading ? "..." : data?.stats?.totalLecturers || 0}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isLoading ? "..." : data?.stats?.activeLecturers || 0} Dosen Aktif</span>
            </div>
          </div>
        </div>

        {/* Total Kelas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isLoading ? "..." : data?.stats?.totalClasses || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Tersebar di seluruh prodi</p>
          </div>
        </div>

        {/* Total Mahasiswa */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mahasiswa Terdaftar</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isLoading ? "..." : data?.stats?.totalStudents || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Data master terpusat</p>
          </div>
        </div>

        {/* Total Nilai Masuk */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rekap Nilai Masuk</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isLoading ? "..." : data?.stats?.totalGrades || 0}
            </h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Tersimpan di SQLite DB</p>
          </div>
        </div>
      </div>

      {/* Tables Section: Dosen Terdaftar & Kelas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dosen Terbaru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daftar Dosen Terbaru</h2>
              <p className="text-xs text-slate-500">Dosen yang memiliki hak akses sistem</p>
            </div>
            <Link
              href="/admin/dosen"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Dosen</th>
                  <th className="pb-3">NIDN</th>
                  <th className="pb-3 text-center">Kelas</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Memuat data dosen...
                    </td>
                  </tr>
                ) : data?.recentLecturers?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Belum ada dosen terdaftar.
                    </td>
                  </tr>
                ) : (
                  data?.recentLecturers?.map((l: any) => (
                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-2">
                        <p className="font-bold text-slate-900">{l.name}</p>
                        <p className="text-[11px] text-slate-400">{l.email}</p>
                      </td>
                      <td className="py-3.5 font-mono text-slate-600">{l.nidn}</td>
                      <td className="py-3.5 text-center font-bold text-slate-700">
                        {l.class_count}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === "inactive"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {l.status === "inactive" ? "Nonaktif" : "Aktif"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kelas Terbaru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelas Kampus Terbaru</h2>
              <p className="text-xs text-slate-500">Mata kuliah yang sedang berlangsung</p>
            </div>
            <Link
              href="/admin/kelas"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Mata Kuliah</th>
                  <th className="pb-3">Dosen Pengampu</th>
                  <th className="pb-3 text-center">Mahasiswa</th>
                  <th className="pb-3 text-right">SKS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Memuat data kelas...
                    </td>
                  </tr>
                ) : data?.recentClasses?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Belum ada kelas dibuat.
                    </td>
                  </tr>
                ) : (
                  data?.recentClasses?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-2">
                        <p className="font-bold text-slate-900">{c.title}</p>
                        <p className="text-[11px] text-slate-400">{c.code} • {c.prodi}</p>
                      </td>
                      <td className="py-3.5 text-slate-700 font-medium">{c.lecturer_name}</td>
                      <td className="py-3.5 text-center font-bold text-indigo-600">
                        {c.student_count}
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-600">
                        {c.sks} SKS
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
