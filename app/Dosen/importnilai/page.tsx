'use client';

import Link from "next/link";
import React from "react";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, ShieldCheck, FileEdit, Layers, UserPlus, FileSpreadsheet, BarChart3, Sparkles, Printer, User, Shield, HelpCircle, ExternalLink, ChevronRight, Download, History, FileCode, Check, CheckCircle2, Lock, LockKeyhole, Upload,  RefreshCw } from 'lucide-react';


/* DATA MOCKUP */

const INITIAL_PREVIEW_DATA = [
  {
    nim: "21881010041",
    name: "Ahmad Fauzan Rifai",
    tugas: 88.0,
    kuis: 82.5,
    uts: 85.0,
    uas: 90.0,
    status: "Valid",
  },
  {
    nim: "21881010042",
    name: "Bunga Citra Amanda",
    tugas: 92.0,
    kuis: 90.0,
    uts: 88.5,
    uas: 94.0,
    status: "Valid",
  },
  {
    nim: "21881010043",
    name: "Danang Wicaksono",
    tugas: 78.0,
    kuis: 75.0,
    uts: 70.0,
    uas: 80.0,
    status: "Valid",
  },
  {
    nim: "21881010044",
    name: "Dinda Ayu Sekar",
    tugas: 85.0,
    kuis: 80.0,
    uts: 82.0,
    uas: 86.0,
    status: "Valid",
  },
  {
    nim: "21881010045",
    name: "Fikri Haikal Rahman",
    tugas: 65.0,
    kuis: 60.0,
    uts: 68.0,
    uas: 72.0,
    status: "Valid",
  },
  {
    nim: "21881010046",
    name: "Gita Nirmala Putri",
    tugas: 90.0,
    kuis: 95.0,
    uts: 92.0,
    uas: 96.0,
    status: "Valid",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function ImportNilaiExcel() {
  const router = useRouter();

  /* =======================================================
     STATE
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(3);

  const [uploadedFile, setUploadedFile] = useState({
    name: "Nilai_IF202_KlsB.xlsx",
    size: "2.4 MB",
    rows: 38,
    uploadedAt: "12 menit yang lalu",
  });

  const [previewData, setPreviewData] = useState(
    INITIAL_PREVIEW_DATA
  );

  const [isLocked, setIsLocked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* =======================================================
     TOAST
  ======================================================= */

  const notify = (message: string) => {
    setToastMsg(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = (path: string, message?: string) => {
    if (message) {
      notify(message);
    }

    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  /* =======================================================
     NAVIGATION SIDEBAR
  ======================================================= */

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleClassManagement = () => {
    navigate("/kelas");
  };

  const handleAddClass = () => {
    navigate("/tambah-kelas");
  };

  const handleInputNilai = () => {
    navigate("/input-nilai");
  };

  const handleAnalytic = () => {
    navigate("/analitik-ai");
  };

  const handleGenerateAI = () => {
    navigate("/generate-ai");
  };

  const handleReport = () => {
    navigate("/cetak-laporan");
  };

  const handleProfile = () => {
    navigate("/kelola-profil");
  };

  const handleSecurity = () => {
    navigate("/keamanan");
  };

  /* =======================================================
     HEADER ACTION
  ======================================================= */

  const handleHistory = () => {
    navigate(
      "/riwayat-import",
      "Membuka riwayat unggahan..."
    );
  };

  const handleDownloadTemplate = () => {
    notify("Template Excel (.xlsx) sedang disiapkan...");

    setTimeout(() => {
      notify("Template Excel berhasil disiapkan.");
    }, 1000);
  };

  /* =======================================================
     STEPPER
  ======================================================= */

  const handleStepChange = (step: number) => {
    if (isLocked && step < 4) {
      notify(
        "Nilai sudah dikunci. Tahapan sebelumnya tidak dapat diubah."
      );
      return;
    }

    setCurrentStep(step);

    const stepMessages: Record<number, string> = {
      1: "Membuka tahap unggah file...",
      2: "Membuka tahap pemetaan kolom...",
      3: "Membuka tahap validasi & pratinjau AI...",
      4: "Membuka tahap penyimpanan database...",
    };

    notify(stepMessages[step]);
  };

  /* =======================================================
     FILE UPLOAD
  ======================================================= */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      notify(
        "Format file tidak valid. Gunakan file .xlsx atau .xls."
      );

      event.target.value = "";
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        rows: 38,
        uploadedAt: "Baru saja",
      });

      setIsUploading(false);
      setCurrentStep(3);

      notify(
        `Berhasil mengunggah file baru: ${file.name}`
      );
    }, 1000);
  };

  /* =======================================================
     CALCULATION
  ======================================================= */

  const calculateTotal = (
    tugas: number,
    kuis: number,
    uts: number,
    uas: number
  ) => {
    const total =
      tugas * 0.2 +
      kuis * 0.15 +
      uts * 0.3 +
      uas * 0.35;

    return total.toFixed(1);
  };

  /* =======================================================
     LOCK DATA
  ======================================================= */

  const handleLockData = () => {
    if (isLocked) {
      notify("Nilai sudah dikunci.");
      return;
    }

    setIsLocked(true);
    setCurrentStep(4);

    notify(
      "Nilai berhasil dikunci dan disinkronkan ke Database / Buku Nilai Ledger!"
    );
  };

  /* =======================================================
     CANCEL IMPORT
  ======================================================= */

  const handleCancel = () => {
    setIsLocked(false);
    setCurrentStep(1);
    setPreviewData(INITIAL_PREVIEW_DATA);

    notify("Proses import dibatalkan.");
  };

  /* =======================================================
     FOOTER
  ======================================================= */

  const handleTechnicalHelp = () => {
    notify("Membuka bantuan teknis...");
  };

  const handlePrivacy = () => {
    notify("Membuka protokol privasi...");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
      {/* TOAST */}

      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />

          <span>{toastMsg}</span>
        </div>
      )}

      {/*  SIDEBAR   */}

      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 p-4 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* BRAND */}

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
                <h1 className="font-bold text-slate-900 text-base leading-tight">
                  Gradia
                </h1>

                <p className="text-xs text-slate-400">
                  Portal Dosen
                </p>
              </div>
            </div>

            <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
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
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium transition-all"
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
                  href="/Dosen/analitikAI"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
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
                  href="/Dosen/profil"
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

        {/* Sidebar Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 transition-all"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold">Panduan Dosen</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono">v1.0</span>
          </a>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* TOP NAVBAR */}

        <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={handleDashboard}
              className="hover:text-indigo-600 transition"
            >
              Portal
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            <span>Sistem Akademik</span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            <span className="font-semibold text-slate-900">
              Ruang Kerja Dosen
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                notify(
                  "Semester Ganjil 2024/2025 sedang aktif."
                )
              }
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              Semester Ganjil 2024/2025
            </button>

            <button
              type="button"
              onClick={handleProfile}
              className="flex items-center gap-3 border-l border-slate-200 pl-4 hover:opacity-80 transition"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">
                  Dr. Ir. Hendra, M.T.
                </p>

                <p className="text-[10px] text-slate-400">
                  NIDN: 0412088201
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                H
              </div>
            </button>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="p-8 space-y-6">
          {/* HEADER */}

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-1">
                <span>OBE ENGINE V2.4</span>

                <span className="text-slate-300">•</span>

                <span className="text-slate-500">
                  Parser Skema Terpadu
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Import & Validasi Nilai Excel
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Unggah file spreadsheet nilai, validasi otomatis
                skema kolom OBE, dan sinkronisasi ke buku nilai
                ledger.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleHistory}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <History className="w-4 h-4 text-slate-500" />

                Riwayat Unggahan
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition shadow-sm"
              >
                <Download className="w-4 h-4 text-indigo-600" />

                Unduh Format Template Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* =================================================
              STEPPER
          ================================================= */}

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="relative flex items-center justify-between max-w-4xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 z-0" />

              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-500 z-0"
                style={{
                  width: `${((currentStep - 1) / 3) * 100}%`,
                }}
              />

              {/* STEP 1 */}

              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep >= 1
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentStep > 1 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "1"
                  )}
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    currentStep >= 1
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  1. Unggah File
                </span>
              </button>

              {/* STEP 2 */}

              <button
                type="button"
                onClick={() => handleStepChange(2)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep >= 2
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentStep > 2 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "2"
                  )}
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    currentStep >= 2
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  2. Pemetaan Kolom
                </span>
              </button>

              {/* STEP 3 */}

              <button
                type="button"
                onClick={() => handleStepChange(3)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep >= 3
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  3
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    currentStep >= 3
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  3. Validasi & Pratinjau AI
                </span>
              </button>

              {/* STEP 4 */}

              <button
                type="button"
                onClick={() => handleStepChange(4)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep >= 4
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  4
                </div>

                <span
                  className={`text-xs font-bold mt-2 ${
                    currentStep >= 4
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  4. Simpan ke Database
                </span>
              </button>
            </div>
          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid grid-cols-12 gap-6">
            {/* LEFT COLUMN */}

            <div className="col-span-4 space-y-6">
              {/* FILE CARD */}

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Berkas Terunggah
                  </span>

                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />

                    Tervalidasi
                  </span>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCode className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {uploadedFile.name}
                      </h4>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {uploadedFile.size} •{" "}
                        {uploadedFile.rows} Baris Mahasiswa
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Diunggah {uploadedFile.uploadedAt}
                  </span>

                  <label className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                    {isUploading ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3" />
                    )}

                    <span>
                      {isUploading
                        ? "Mengunggah..."
                        : "Ganti File Baru"}
                    </span>

                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* PARAMETER CARD */}

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Parameter Kelas & Kurikulum
                </span>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    MATA KULIAH
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      notify(
                        "Parameter mata kuliah Algoritma Lanjut dipilih."
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between hover:bg-slate-100 transition"
                  >
                    <span className="text-xs font-bold text-slate-900">
                      Algoritma Lanjut
                    </span>

                    <span className="text-[10px] bg-slate-200/60 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                      IF-301 • 3 SKS
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    notify(
                      "Semester Ganjil 2024/2025 sedang digunakan."
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between text-xs hover:bg-slate-100 transition"
                >
                  <span className="text-slate-500 font-medium">
                    Semester Akademik
                  </span>

                  <span className="font-bold text-slate-900">
                    Ganjil 2024/2025
                  </span>
                </button>

                {/* BOBOT */}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      BOBOT SKEMA OBE
                    </span>

                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      100% Terpetakan
                    </span>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: "20%" }}
                      className="bg-blue-500 h-full"
                    />

                    <div
                      style={{ width: "15%" }}
                      className="bg-purple-500 h-full"
                    />

                    <div
                      style={{ width: "30%" }}
                      className="bg-amber-500 h-full"
                    />

                    <div
                      style={{ width: "35%" }}
                      className="bg-emerald-500 h-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-600">
                        Tugas: <strong>20%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-slate-600">
                        Kuis: <strong>15%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-slate-600">
                        UTS: <strong>30%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-600">
                        UAS: <strong>35%</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OBE RULE */}

              <button
                type="button"
                onClick={() =>
                  notify(
                    "Kaidah OBE: data yang dikunci membutuhkan izin Ketua Jurusan untuk diubah."
                  )
                }
                className="w-full text-left bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3 hover:bg-amber-50 transition"
              >
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-amber-900 mb-1">
                    Kaidah Penilaian OBE
                  </h4>

                  <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    Data nilai yang dikunci tidak dapat diubah
                    tanpa izin Ketua Jurusan. Pastikan hasil
                    perhitungan komputasi AI sesuai dengan
                    silabus kontrak kuliah.
                  </p>
                </div>
              </button>
            </div>

            {/* RIGHT COLUMN */}

            <div className="col-span-8 space-y-4">
              {/* AI VALIDATION */}

              <button
                type="button"
                onClick={() =>
                  notify(
                    "Validasi AI selesai: 38 data valid dan 0 error."
                  )
                }
                className="w-full bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between hover:bg-indigo-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        Modul AI Validasi Format
                      </h4>

                      <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                        100% Akurat
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <strong className="text-emerald-600">
                        38 data terdeteksi valid
                      </strong>
                      , 0 error format pada struktur ledger
                      & tipe data numerik.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                  Pengecekan Tuntas
                </span>
              </button>

              {/* TABLE */}

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      Pratinjau Lembar Rekap Nilai
                    </h3>

                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      6 dari 38 ditampilkan
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Toleransi Nilai:{" "}
                    <strong>0.0 - 100.0</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">NIM</th>
                        <th className="py-3 px-4">
                          NAMA MAHASISWA
                        </th>
                        <th className="py-3 px-3 text-center">
                          TUGAS (20%)
                        </th>
                        <th className="py-3 px-3 text-center">
                          KUIS (15%)
                        </th>
                        <th className="py-3 px-3 text-center">
                          UTS (30%)
                        </th>
                        <th className="py-3 px-3 text-center">
                          UAS (35%)
                        </th>
                        <th className="py-3 px-3 text-center">
                          TOTAL AKHIR
                        </th>
                        <th className="py-3 px-4 text-center">
                          STATUS
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {previewData.map((row, index) => {
                        const total = calculateTotal(
                          row.tugas,
                          row.kuis,
                          row.uts,
                          row.uas
                        );

                        return (
                          <tr
                            key={row.nim || index}
                            className="hover:bg-slate-50/80 transition"
                          >
                            <td className="py-3.5 px-4 font-semibold text-slate-500 text-[11px]">
                              {row.nim}
                            </td>

                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {row.name}
                            </td>

                            <td className="py-3.5 px-3 text-center font-medium">
                              {row.tugas.toFixed(1)}
                            </td>

                            <td className="py-3.5 px-3 text-center font-medium">
                              {row.kuis.toFixed(1)}
                            </td>

                            <td className="py-3.5 px-3 text-center font-medium">
                              {row.uts.toFixed(1)}
                            </td>

                            <td className="py-3.5 px-3 text-center font-medium">
                              {row.uas.toFixed(1)}
                            </td>

                            <td className="py-3.5 px-3 text-center font-black text-indigo-600 text-sm">
                              {total}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Valid
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ACTION */}

                <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      notify(
                        "Seluruh baris memenuhi kaidah rentang nilai."
                      )
                    }
                    className="flex items-center gap-2 text-xs text-slate-600 font-medium hover:text-slate-900 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                    <span>
                      Seluruh baris memenuhi kaidah rentang
                      nilai (0 - 100).
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-slate-200/70 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      Batalkan
                    </button>

                    <button
                      type="button"
                      onClick={handleLockData}
                      disabled={isLocked}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md ${
                        isLocked
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                      }`}
                    >
                      <LockKeyhole className="w-4 h-4" />

                      {isLocked
                        ? "Nilai Telah Dikunci"
                        : "Proses & Kunci Nilai Mahasiswa"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-3 text-[11px] text-slate-400 flex items-center justify-between">
          <p>
            © 2024-2025 Lembaga Layanan Pendidikan Tinggi
            (LLDIKTI) • Gradia Academic Intelligence
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleTechnicalHelp}
              className="hover:underline hover:text-slate-700 transition"
            >
              Bantuan Teknis
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={handlePrivacy}
              className="hover:underline hover:text-slate-700 transition"
            >
              Protokol Privasi
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
