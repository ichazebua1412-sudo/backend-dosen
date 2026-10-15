"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import { LayoutDashboard, Layers, Users, FileEdit, UserPlus, BarChart3, FileSpreadsheet, FileText, Bot, Settings, Shield, ChevronDown, Sparkles, Star, Award, Flag, TrendingUp, AlertTriangle, ArrowRight, Printer, Send, HelpCircle, Menu, User, Bell, ShieldCheck, } from 'lucide-react';

export default function AcademicDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 p-4 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src={logoImg}
                  alt="Logo Gradia"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-tight">Gradia</h1>
                <p className="text-xs text-slate-500">Portal Dosen</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
              v2.4
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-5">
            {/* Group 1: UTAMA */}
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                UTAMA
              </p>
              <div className="space-y-1">
                <a
                  href="/Dosen/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="/Dosen/manajemenkelas"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Manajemen Data Kelas</span>
                </a>
                <a
                  href="/Dosen/tambahkelas"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Tambah Kelas & Mahasiswa</span>
                </a>
              </div>
            </div>

            {/* Group 2: PENILAIAN & EVALUASI */}
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                PENILAIAN & EVALUASI
              </p>
              <div className="space-y-1">
                <a
                  href="/Dosen/inputnilai"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <FileEdit className="w-4 h-4 text-slate-400" />
                  <span>Input Rekap Nilai</span>
                </a>
                <a
                  href="/Dosen/importnilai"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <span>Import Nilai Excel</span>
                </a>
              </div>
            </div>

            {/* Group 3: KECERDASAN BUATAN & LAPORAN */}
            <div>
              <p 
              className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                KECERDASAN BUATAN & LAPORAN
              </p>
              <div className="space-y-1">
                <a
                  href="/Dosen/analitik-AI"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>Analitik & AI Feedback</span>
                </a>
                <a
                  href="/Dosen/generateAI"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>Generate AI Feedback</span>
                  </div>
                  <span className="text-[9px] bg-purple-100 text-purple-600 font-bold px-1.5 py-0.2 rounded-full">
                    Baru
                  </span>
                </a>
                <a
                  href="/Dosen/cetakPDF"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Cetak PDF & Laporan</span>
                </a>
              </div>
            </div>

            {/* Group 4: PENGATURAN AKUN */}
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                PENGATURAN AKUN
              </p>
              <div className="space-y-1">
                <a
                  href="/dashboard/profil"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Kelola Profil</span>
                </a>
                <a
                  href="/Dosen/keamanan"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Keamanan & Akun</span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Sidebar (Panduan Dosen) */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Panduan Dosen v1.0</span>
            <ExternalLinkIcon />
          </div>
        </div>
      </aside>

      {/* KANDUNGAN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPNAV / HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Portal</span> / <span>Sistem Akademik</span> / <span className="text-slate-800 font-semibold">Ruang Kerja Dosen</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Semester Ganjil 2024/2025
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">Dr. Ir. Hendra, M.T.</p>
                <p className="text-[11px] text-slate-400">NIDN: 0412088201</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                H
              </div>
            </div>
          </div>
        </header>

        {/* KANDUNGAN BODY */}
        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Bar Tajuk & Tindakan Pantas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <span>Portal</span> • <span>Sistem Akademik</span> • <span className="underline">Analitik & AI Feedback</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analitik & AI Feedback Akademik</h2>
              <p className="text-sm text-slate-500 mt-0.5">Monitoring kurva distribusi nilai mahasiswa, evaluasi ketercapaian CPMK, dan telaah otomatis AI engine.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 shadow-sm">
                <span>Pemrograman Web - Kelas A (32 Mhs)</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 shadow-sm">
                <span>Ujian Tengah Semester (UTS)</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
                <Sparkles size={14} /> + Generate Analisis Baru
              </button>
            </div>
          </div>

          {/* 3 KAD STATISTIK UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Kad 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai Kelas</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-black text-slate-900">78.5</h3>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Star size={20} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">+3.5 pts vs target KKM 75.0</span>
                <span className="text-emerald-700 font-bold bg-emerald-50/80 px-2 py-1 rounded-lg">Optimal</span>
              </div>
            </div>

            {/* Kad 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Kelulusan OBE</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-black text-slate-900">92%</h3>
                    <span className="text-xs font-semibold text-slate-400">Akumulasi</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award size={20} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">29 dari 32 mahasiswa tuntas KKM</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">Aman</span>
              </div>
            </div>

            {/* Kad 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Butuh Pendampingan</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-4xl font-black text-rose-600">3</h3>
                    <span className="text-xs font-bold text-slate-700">Mahasiswa</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Flag size={20} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-lg border border-amber-100">Alert Skor &lt; 65</span>
                <button className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                  Lihat Rekomendasi <ArrowRight size={12} />
                </button>
              </div>
            </div>

          </div>

          {/* BAHAGIAN UTAMA: GRAFIK & AI FEEDBACK */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bahagian Kiri (Grafik & Statistik Ringkas) - 2 Kolum */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Kurva Distribusi */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Kurva Distribusi Nilai Kelas</h3>
                    <p className="text-xs text-slate-500">Sebaran nilai komparatif Ujian Tengah Semester (UTS) dengan standar KKM 75</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold">
                    N = 32 Peserta
                  </span>
                </div>

                {/* Simulasi Grafik Garis Kurva */}
                <div className="h-48 w-full bg-slate-50/50 border border-dashed border-slate-200 rounded-xl relative flex items-end justify-center p-4">
                  <div className="absolute inset-x-0 bottom-12 flex justify-center items-center">
                    {/* Lukisan Kurva Lonceng menggunakan SVG */}
                    <svg className="w-full h-28 overflow-visible" viewBox="0 0 500 100">
                      <path d="M 0 90 Q 150 90 220 50 T 350 70 Q 450 90 500 90" fill="none" stroke="#6366f1" strokeWidth="3" />
                      <path d="M 0 90 Q 150 90 220 50 T 350 70 Q 450 90 500 90 L 500 100 L 0 100 Z" fill="url(#grad)" opacity="0.15" />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute bottom-2 inset-x-4 flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>&lt; 50 (1)</span>
                    <span>50-65 (2)</span>
                    <span>66-70 (7)</span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">80-89 (14)</span>
                    <span>90-95 (6)</span>
                    <span>95+ (2)</span>
                  </div>
                </div>

                {/* 3 Kotak Bawah Grafik */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Standar Deviasi (σ)</p>
                    <p className="text-xl font-black text-slate-800 mt-1">8.42</p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">Sebaran data homogen</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Kategori Distribusi</p>
                    <p className="text-base font-black text-indigo-700 mt-1">Positif Terbimbing</p>
                    <p className="text-[11px] text-slate-500 mt-1">Condong ke rentang tinggi</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Nilai Median / Modus</p>
                    <p className="text-xl font-black text-slate-800 mt-1">81.0 / 83.5</p>
                    <p className="text-[11px] text-slate-500 mt-1">Pemusatan nilai ideal</p>
                  </div>
                </div>
              </div>

              {/* Komparasi Komponen Penilaian */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Komparasi Komponen Penilaian</h3>
                    <p className="text-xs text-slate-500">Evaluasi multi-instrumen penentu nilai akhir mahasiswa</p>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold">
                    Bobot Terkalkulasi
                  </span>
                </div>

                {/* Bar 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Tugas Mandiri & Proyek Portofolio <span className="text-slate-400 font-normal">(Bobot 30%)</span>
                    </span>
                    <span className="font-bold text-slate-900">84.2 <span className="text-slate-400 font-normal">/ 100</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>96% submisi terverifikasi</span>
                    <span className="text-emerald-600 font-semibold">+9.2 di atas KKM</span>
                  </div>
                </div>

                {/* Bar 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Ujian Tengah Semester (UTS Teori) <span className="text-slate-400 font-normal">(Bobot 35%)</span>
                    </span>
                    <span className="font-bold text-slate-900">72.0 <span className="text-slate-400 font-normal">/ 100</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Rata-rata terendah semester berjalan</span>
                    <span className="text-rose-600 font-semibold">-3.0 di bawah ambang</span>
                  </div>
                </div>

                {/* Bar 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Praktikum Lab & Koding Terapan <span className="text-slate-400 font-normal">(Bobot 35%)</span>
                    </span>
                    <span className="font-bold text-slate-900">79.3 <span className="text-slate-400 font-normal">/ 100</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '79%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Kesesuaian rubrik CPMK 2 & 3</span>
                    <span className="text-emerald-600 font-semibold">+4.3 di atas KKM</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bahagian Kanan (AI Feedback Panel) - 1 Kolum */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Tajuk Panel AI */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Bot size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Telaah & AI Feedback</h3>
                      <p className="text-[10px] text-slate-400">Model: Gradia Academic GPT-4o OBE</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                    Live 10m lalu
                  </span>
                </div>

                {/* Kotak Kekuatan Kelas */}
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Kekuatan Kelas (CPMK 1 Tercapai)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemahaman konseptual pada implementasi layout responsif dan manipulasi DOM tergolong tinggi, <strong className="text-slate-800">88% mahasiswa</strong> menyelesaikan modul praktikum tepat waktu dengan akurasi semantik kode yang konsisten.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="text-[10px] bg-white text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">CSS Grid / Flex</span>
                    <span className="text-[10px] bg-white text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">DOM Rendering</span>
                  </div>
                </div>

                {/* Kotak Area Perlu Ditingkatkan */}
                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>Area Perlu Ditingkatkan (CPMK 3 Vulnerable)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Terdapat penurunan skor rata-rata sebesar <strong className="text-slate-800">14% pada soal logika asynchronous JavaScript</strong> (Promise, async/await) dan integrasi REST API dasar pada hasil evaluasi UTS.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="text-[10px] bg-white text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">Fetch API</span>
                    <span className="text-[10px] bg-white text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">Error Handling</span>
                  </div>
                </div>

                {/* Kotak Rekomendasi Tindakan Dosen */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Bot size={14} className="text-indigo-600" />
                    <span>Rekomendasi Tindakan Dosen</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Jadwalkan <strong className="text-slate-800">1 sesi remedial interaktif asynchronous fetching</strong> sebelum Modul 6. Berikan materi pengayaan studi kasus praktis khusus untuk <strong className="text-slate-800">3 mahasiswa dengan performa di bawah batas KKM</strong>.
                  </p>
                  <div className="pt-1">
                    <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      Lihat daftar 3 mahasiswa <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Butang Tindakan Bawah Panel AI */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                    <Printer size={14} /> Cetak PDF Laporan
                  </button>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                    <Send size={14} /> Kirim Rekomendasi
                  </button>
                </div>

              </div>

              {/* Kad Benchmark Semester Lalu */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Benchmark Semester Lalu</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Kelas Serupa (Genap 2023/2024): <span className="text-slate-900 font-bold">74.8 pts</span></p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  +3.7 pts Trend
                </span>
              </div>

            </div>

          </div>

        </main>

        {/* FOOTER BAWAH */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2024-2025 Lembaga Layanan Pendidikan Tinggi & Gradia Academic Intelligence.</p>
          <div className="flex items-center gap-4 font-medium">
            <a href="#" className="hover:underline">Bantuan Teknis</a>
            <span>•</span>
            <a href="#" className="hover:underline">Protokol Privasi</a>
          </div>
        </footer>

      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
    </svg>
  );
}