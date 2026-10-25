'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, UserPlus, FileSpreadsheet, FileText, BarChart3, Sparkles, Printer, User, Shield, HelpCircle, ExternalLink, ChevronRight, CheckCircle2, Lock, Upload, Save, Download, RefreshCw, Award, Users, BookOpen, Star, UserCheck, FileCheck2, FileCode, PenTool, Bell, Eye, Info} from 'lucide-react';

export default function KelolaProfilDosenPage() {
  const router = useRouter();

  // STATE

  const [activeTab, setActiveTab] = useState(
    "Informasi Pribadi & Identitas"
  );

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [formData, setFormData] = useState({
    gelarDepan: "Dr. Ir.",
    namaLengkap: "Hendra",
    gelarBelakang: "M.T.",
    nidn: "0412088201",
    emailResmi: "hendra.dosen@kampus.ac.id",
    nomorHp: "+62 812-3456-7890",
    ruangKerja: "Gedung Lab Terpadu Lt. 3 R.",
    jamKonsultasi: "Senin & Rabu 13:00 - 15:30 WIB",
    notifCapaian: true,
    notifDeadline: true,
  });

  // =========================================================
  // NAVIGASI SIDEBAR
  // =========================================================

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // =========================================================
  // TOAST
  // =========================================================

  const notify = (message: string) => {
    setToastMsg(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // =========================================================
  // FORM HANDLER
  // =========================================================

  const handleInputChange = (
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    notify("Perubahan data profil dosen berhasil disimpan!");
  };

  const handleCancel = () => {
    notify("Perubahan dibatalkan.");
  };

  // =========================================================
  // SIDEBAR ITEM COMPONENT
  // =========================================================

  const SidebarItem = ({
    icon,
    label,
    path,
    active = false,
    badge,
  }: {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    badge?: string;
  }) => {
    return (
      <button
        type="button"
        onClick={() => handleNavigate(path)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition ${
          active
            ? "bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600"
            : "text-slate-600 font-medium hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>

        {badge && (
          <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <AuthGuard>
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">

      {/* =====================================================
          TOAST NOTIFICATION
      ====================================================== */}

      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar currentPath="/Dosen/profil" />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header breadcrumbs={["Portal Akademik", "Portal Penilaian OBE", "Kelola Profil Dosen"]} />

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="p-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>Portal</span>
                <span>/</span>
                <span>Sistem Akademik</span>
                <span>/</span>
                <span>Pengaturan Akun</span>
                <span>/</span>

                <span className="font-semibold text-slate-800">
                  Kelola Profil Dosen
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Kelola Profil Dosen
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Kelola identitas akademik terintegrasi, sinkronisasi NIDN
                PDDikti, beban SKS mengajar, publikasi tridharma, dan tanda
                tangan digital BAP perkuliahan.
              </p>

            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">

              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Terverifikasi PDDikti
              </span>

              <button
                type="button"
                onClick={() =>
                  notify(
                    "Melakukan re-sync data dengan PDDikti Feeder..."
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                Sinkron: 8 Mnt Lalu
              </button>

              <button
                type="button"
                onClick={() =>
                  notify(
                    "Mengunduh Berkas Portofolio Dosen (PDF)..."
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                Cetak Portofolio Dosen
              </button>

            </div>
          </div>

          {/* =================================================
              PROFILE SUMMARY
          ================================================== */}

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">

            <div className="flex items-center justify-between relative z-10">

              {/* Profile */}
              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 font-bold flex items-center justify-center text-3xl shadow-inner">
                  <User className="w-10 h-10 text-indigo-400" />
                </div>

                <div>

                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Dr. Ir. Hendra, M.T.
                    </h3>

                    <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Lektor Kepala (IV/a)
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-900/70 mt-1">
                    Dosen Tetap Yayasan
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">

                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      NIDN: <strong>0412088201</strong>
                    </span>

                    <span>•</span>

                    <span>
                      S1 Teknik Informatika - S2 Elektro
                    </span>

                    <span>•</span>

                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      Status BKD: Memenuhi Syarat (BS)
                    </span>

                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">

                <div className="bg-white/80 backdrop-blur border border-indigo-100 p-3 rounded-2xl text-center min-w-[90px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Beban SKS
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    12{" "}
                    <span className="text-[10px] font-normal text-slate-500">
                      SKS
                    </span>
                  </p>

                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Ganjil 24/25
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur border border-indigo-100 p-3 rounded-2xl text-center min-w-[90px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Total Mhs
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    348{" "}
                    <span className="text-[10px] font-normal text-slate-500">
                      Jiwa
                    </span>
                  </p>

                  <p className="text-[9px] text-emerald-600 font-bold mt-0.5">
                    100% Aktif
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur border border-indigo-100 p-3 rounded-2xl text-center min-w-[90px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Kelas Diampu
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    4{" "}
                    <span className="text-[10px] font-normal text-slate-500">
                      Paralel
                    </span>
                  </p>

                  <p className="text-[9px] text-slate-400 mt-0.5">
                    OBE Terpasang
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur border border-indigo-100 p-3 rounded-2xl text-center min-w-[95px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Skor EDOM
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    4.88{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      / 5.0
                    </span>
                  </p>

                  <p className="text-[9px] text-emerald-600 font-bold mt-0.5">
                    Sangat Memuaskan
                  </p>
                </div>

              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-indigo-100/80 text-xs font-semibold">

              {[
                "Informasi Pribadi & Identitas",
                "Data Akademik & NIDN",
                "Beban Mengajar & Tridharma",
                "Tanda Tangan Digital",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl transition ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-white/50 text-slate-600 hover:bg-white"
                  }`}
                >
                  {tab}
                  {tab === "Tanda Tangan Digital" && " •"}
                </button>
              ))}

            </div>
          </div>

          {/* =================================================
              FORM GRID
          ================================================== */}

          <div className="grid grid-cols-12 gap-6">

            {/* LEFT COLUMN */}
            <div className="col-span-8 space-y-6">

              {/* Identitas Resmi */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Identitas Resmi & Kepegawaian
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Sesuai basis data Kemenristekdikti & Biro Kepegawaian
                      Yayasan
                    </p>
                  </div>

                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    Tersinkronisasi SSO
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">

                  {/* Gelar Depan */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Gelar Depan
                    </label>

                    <input
                      type="text"
                      value={formData.gelarDepan}
                      onChange={(e) =>
                        handleInputChange(
                          "gelarDepan",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>

                  {/* Nama */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Nama Lengkap (Tanpa Gelar)
                    </label>

                    <input
                      type="text"
                      value={formData.namaLengkap}
                      onChange={(e) =>
                        handleInputChange(
                          "namaLengkap",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>

                  {/* Gelar Belakang */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Gelar Belakang
                    </label>

                    <input
                      type="text"
                      value={formData.gelarBelakang}
                      onChange={(e) =>
                        handleInputChange(
                          "gelarBelakang",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>

                  {/* NIDN */}
                  <div>
                    <div className="flex items-center justify-between mb-1">

                      <label className="text-[11px] font-bold text-slate-500">
                        NIDN / NUPN
                      </label>

                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Terkunci PDDikti
                      </span>

                    </div>

                    <input
                      type="text"
                      disabled
                      value={formData.nidn}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 font-bold cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">

                      <label className="text-[11px] font-bold text-slate-500">
                        Email Resmi Kampus
                      </label>

                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        SSO Terverifikasi
                      </span>

                    </div>

                    <input
                      type="email"
                      value={formData.emailResmi}
                      onChange={(e) =>
                        handleInputChange(
                          "emailResmi",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>

                  {/* Nomor HP */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Nomor Kontak WhatsApp / HP
                    </label>

                    <input
                      type="text"
                      value={formData.nomorHp}
                      onChange={(e) =>
                        handleInputChange(
                          "nomorHp",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>

                </div>
              </div>

              {/* Homebase */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Homebase & Penugasan Tridharma
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Unit pengampu, laboratorium riset, dan jadwal bimbingan
                      OBE
                    </p>
                  </div>

                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                    Akreditasi Unggul
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Fakultas
                    </label>

                    <input
                      type="text"
                      disabled
                      value="Fakultas Ilmu Komputer (Fasilkom)"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Program Studi Homebase
                    </label>

                    <input
                      type="text"
                      disabled
                      value="S1 Teknik Informatika"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-2">

                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Bidang Keahlian & Fokus Riset Tridharma
                    </label>

                    <input
                      type="text"
                      defaultValue="Software Engineering, Enterprise Data Architecture, & Cloud Computing System"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />

                    <p className="text-[10px] text-slate-400 mt-1">
                      Digunakan sebagai referensi pembagian modul penilaian
                      Capaian Pembelajaran Lulusan (CPL).
                    </p>

                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Ruang Kerja Dosen
                    </label>

                    <input
                      type="text"
                      value={formData.ruangKerja}
                      onChange={(e) =>
                        handleInputChange(
                          "ruangKerja",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Jam Konsultasi Akademik Mahasiswa
                    </label>

                    <input
                      type="text"
                      value={formData.jamKonsultasi}
                      onChange={(e) =>
                        handleInputChange(
                          "jamKonsultasi",
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                </div>

                {/* Sinta */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between text-xs mt-2">

                  <div>
                    <p className="font-bold text-slate-900">
                      Sinta & Google Scholar ID
                    </p>

                    <p className="text-[10px] text-slate-500">
                      ID: 6028191 | h-index: 14 | i10-index: 18
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      notify("Membuka profil Sinta...")
                    }
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Buka Profil Sinta</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="col-span-4 space-y-6">

              {/* BKD */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

                <div className="flex items-center justify-between">

                  <h3 className="text-xs font-bold text-slate-900">
                    Kelengkapan Berkas BKD
                  </h3>

                  <span className="text-xs font-extrabold text-indigo-600">
                    89% Lengkap
                  </span>

                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[89%]" />
                </div>

                <div className="space-y-2.5 text-xs">

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Sertifikasi Dosen (Serdos) Valid
                    </span>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Tervalidasi
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      SK Mengajar Semester Ganjil
                    </span>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Terunggah
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Laporan BKD Genap Disetujui
                    </span>

                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                      Asesor OK
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100">
                    <span className="flex items-center gap-2 font-medium text-amber-900">
                      <Info className="w-4 h-4 text-amber-500" />
                      Bukti Pengabdian Masyarakat (P3M)
                    </span>

                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      Menunggu File
                    </span>
                  </div>

                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Tanda Tangan Elektronik Resmi
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    BAP & Nilai
                  </span>

                </div>

                <p className="text-[11px] text-slate-400">
                  Tanda tangan digunakan secara otomatis pada Berita Acara
                  Perkuliahan (BAP), rekap nilai akhir semester, dan lembar
                  pengesahan portofolio mata kuliah.
                </p>

                {/* Signature */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center relative min-h-[100px]">

                  <div className="text-center">

                    <svg
                      className="w-48 h-12 text-slate-800 mx-auto"
                      viewBox="0 0 200 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10,30 Q30,5 50,30 T90,30 T130,10 T170,40" />
                    </svg>

                    <div className="mt-1 flex items-center justify-center gap-2 text-[9px] text-slate-400 font-mono">
                      <span>
                        HASH: 8f9a-09ec-9081-d123-f900-a507
                      </span>

                      <span className="text-emerald-600 font-bold">
                        AKTIF • BSRE TERVERIFIKASI
                      </span>
                    </div>

                  </div>
                </div>

                {/* Signature Actions */}
                <div className="grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      notify(
                        "Membuka dialog unggah tanda tangan baru..."
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    Unggah Baru
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      notify(
                        "Memvalidasi sampel tanda tangan pada dokumen BAP..."
                      )
                    }
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    Uji di Dokumen BAP
                  </button>

                </div>

                <p className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Dilindungi enkripsi kriptografi asimetris identitas
                  universitas untuk mencegah pemalsuan pengesahan nilai dan
                  BAP oleh pihak luar.
                </p>
              </div>

              {/* Notifikasi */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Notifikasi & AI OBE Advisor
                </h3>

                <div className="space-y-3 text-xs">

                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-slate-800">
                        Ringkasan AI Capaian OBE Mingguan
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Terima rekomendasi intervensi mahasiswa berisiko rendah
                        via email/aplikasi.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">

                      <input
                        type="checkbox"
                        checked={formData.notifCapaian}
                        onChange={(e) =>
                          handleInputChange(
                            "notifCapaian",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />

                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />

                    </label>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">

                    <div>
                      <p className="font-bold text-slate-800">
                        Peringatan Deadline Input Rekap Nilai
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Kirim pengingat H-3 dan H-1 sebelum batas penguncian
                        portal nilai semester.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">

                      <input
                        type="checkbox"
                        checked={formData.notifDeadline}
                        onChange={(e) =>
                          handleInputChange(
                            "notifDeadline",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />

                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />

                    </label>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =================================================
              SAVE BAR
          ================================================== */}

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-lg flex items-center justify-between sticky bottom-4 z-20">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-indigo-600" />

              <span>
                Perubahan nomor kontak dan jam konsultasi akan segera
                terupdate di portal mahasiswa.
              </span>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Batalkan Perubahan
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan Profil
              </button>

            </div>
          </div>

        </main>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-3 text-[11px] text-slate-400 flex items-center justify-between">

          <p>
            © 2024-2025 Lembaga Layanan Pendidikan Tinggi (LLDIKTI) •
            Gradia Academic Intelligence
          </p>

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => handleNavigate("/bantuan-teknis")}
              className="hover:underline"
            >
              Bantuan Teknis
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={() => handleNavigate("/privasi")}
              className="hover:underline"
            >
              Protokol Privasi
            </button>

          </div>
        </footer>

      </div>
    </div>
    </AuthGuard>
  );
}