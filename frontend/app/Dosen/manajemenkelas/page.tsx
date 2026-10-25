"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import {
  ExternalLink,
  Search,
  ChevronDown,
  Download,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Check,
  Layers,
  FileEdit,
  Printer,
  GraduationCap,
  BarChart3,
  Database,
  ClipboardCheck,
  Wifi,
  Sparkles,
  BookOpen,
} from "lucide-react";

/* TYPE DATA KELAS */

type ClassData = {
  id: string;
  title: string;
  code: string;
  sks: string;
  prodi: string;
  semester: number;

  tag: string;
  tagType: "active" | "warning" | "locked" | "ai";

  academicYear: string;
  capacity: string;
  schedule: string;
  room: string;

  progressPercent?: number;
  progressLabel?: string;
  progressSubtext?: string;

  note: string;

  icon: string;
  accentColor: string;

  actionBtn: string;
  btnVariant: "indigo" | "darkBlue" | "outline" | "purple";

  hasDeadlineWarning?: boolean;
  deadlineDays?: string;
};

/* =========================================================
   TYPE FORM TAMBAH KELAS
========================================================= */

type ClassFormData = {
  title: string;
  code: string;
  sks: string;
  prodi: string;
  semester: string;
  capacity: string;
  schedule: string;
  room: string;
};

/* =========================================================
   TYPE NAVIGATION ITEM
========================================================= */

type NavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
};

/* =========================================================
   TYPE CLASS CARD
========================================================= */

type ClassCardProps = {
  data: ClassData;
  onManageStudents?: (classId: string) => void;
  onAnalytics?: (classId: string) => void;
  onAction?: (data: ClassData) => void;
};

/* =========================================================
   DATA AWAL KELAS (BERSIH DARI DATA DUMMY)
========================================================= */

const INITIAL_CLASSES: ClassData[] = [];

/*   KONSTANTA PAGINATION   */

const ITEMS_PER_PAGE = 4;

/*   MAIN APP */

export default function DataKelasPage() {

  const router = useRouter();

  /*      STATE    */

  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<string>("Semua");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortOption, setSortOption] =
    useState<string>("Terkini");

  const [classesData, setClassesData] =
    useState<ClassData[]>([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const fetchClasses = () => {
    setIsLoading(true);
    apiFetch("/classes")
      .then((res) => {
        if (res.classes) {
          const mapped: ClassData[] = res.classes.map((c: any) => ({
            id: String(c.id),
            title: c.title,
            code: c.code,
            sks: `${c.sks} SKS`,
            prodi: c.prodi,
            semester: c.semester,
            tag: c.enrolled_count > 0 ? "Aktif Berjalan" : "Belum Ada Mahasiswa",
            tagType: c.enrolled_count > 0 ? "active" : "warning",
            academicYear: c.academic_year || "2024/2025 Ganjil",
            capacity: `${c.capacity || 40} Mhs`,
            schedule: c.schedule || "Senin, 08:00 WIB",
            room: c.room || "Ruang Kuliah",
            progressPercent: c.enrolled_count > 0 ? 50 : 0,
            progressLabel: "Rekap Nilai",
            progressSubtext: `${c.enrolled_count} Mahasiswa Terdaftar`,
            note: c.enrolled_count === 0 ? "Belum ada mahasiswa yang didaftarkan." : "Kelas aktif.",
            icon: "code",
            accentColor: "indigo",
            actionBtn: "Input Nilai",
            btnVariant: "indigo",
          }));
          setClassesData(mapped);
        }
      })
      .catch((err) => console.warn(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const [isModalOpen, setIsModalOpen] =
    useState<boolean>(false);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState<boolean>(false);

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  /* FORM STATE TAMBAH KELAS */

  const [formData, setFormData] =
    useState<ClassFormData>({
      title: "",
      code: "",
      sks: "3 SKS Teori/Praktik",
      prodi: "S1 Informatika",
      semester: "3",
      capacity: "30 Mhs",
      schedule: "Senin, 10:00",
      room: "Lab Kom 1",
    });

  /* =========================================================
     HELPER NAVIGASI
  ========================================================= */

  const navigate = (path: string): void => {
    setIsSidebarOpen(false);
    router.push(path);
  };

  /* =========================================================
     RESET PAGINATION SAAT FILTER BERUBAH
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOption]);

  /* =========================================================
     FILTER DATA KELAS
  ========================================================= */

  const filteredClasses = useMemo<ClassData[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    return classesData.filter((item: ClassData) => {
      const matchesSemester =
        activeTab === "Semua" ||
        (activeTab === "Semester 3" &&
          item.semester === 3) ||
        (activeTab === "Semester 5" &&
          item.semester === 5);

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.prodi.toLowerCase().includes(query);

      return matchesSemester && matchesSearch;
    });
  }, [classesData, activeTab, searchQuery]);

  /* =========================================================
     SORT DATA KELAS
  ========================================================= */

  const sortedClasses = useMemo<ClassData[]>(() => {
    const sorted = [...filteredClasses];

    if (sortOption === "SKS") {
      sorted.sort((a, b) => {
        const sksA = parseInt(a.sks, 10) || 0;
        const sksB = parseInt(b.sks, 10) || 0;

        return sksB - sksA;
      });
    }

    if (sortOption === "Kapasitas") {
      sorted.sort((a, b) => {
        const capacityA =
          parseInt(a.capacity.replace(/\D/g, ""), 10) || 0;

        const capacityB =
          parseInt(b.capacity.replace(/\D/g, ""), 10) || 0;

        return capacityB - capacityA;
      });
    }

    return sorted;
  }, [filteredClasses, sortOption]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(sortedClasses.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedClasses = useMemo<ClassData[]>(() => {
    const startIndex =
      (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return sortedClasses.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [sortedClasses, safeCurrentPage]);

  /* =========================================================
     STATISTIK DINAMIS
  ========================================================= */

  const totalStudents = useMemo<number>(() => {
    return classesData.reduce((total, item) => {
      const capacity =
        parseInt(item.capacity.replace(/\D/g, ""), 10) || 0;

      return total + capacity;
    }, 0);
  }, [classesData]);

  /* =========================================================
     TAMBAH KELAS
  ========================================================= */

  const handleAddClass = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.code.trim()) {
      return;
    }

    const capacityNumber =
      parseInt(formData.capacity.replace(/\D/g, ""), 10) || 40;
    const sksNumber =
      parseInt(formData.sks.replace(/\D/g, ""), 10) || 3;

    try {
      await apiFetch("/classes", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title.trim(),
          code: formData.code.trim().toUpperCase(),
          sks: sksNumber,
          prodi: formData.prodi,
          semester: parseInt(formData.semester, 10) || 1,
          capacity: capacityNumber,
          schedule: formData.schedule,
          room: formData.room,
        }),
      });

      setIsModalOpen(false);
      fetchClasses();
      setFormData({
        title: "",
        code: "",
        sks: "3 SKS Teori/Praktik",
        prodi: "S1 Informatika",
        semester: "3",
        capacity: "30 Mhs",
        schedule: "Senin, 10:00",
        room: "Lab Kom 1",
      });
    } catch (err: any) {
      alert("Gagal menambahkan kelas: " + err.message);
    }
  };

  /* EXPORT RINGKASAN */

  const handleExportSummary = (): void => {
    /*
      Untuk sementara diarahkan ke halaman laporan.
      Nanti bisa diganti dengan API export Excel.
    */
    navigate("/cetak-laporan");
  };
  

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs">
        <Sidebar currentPath="/Dosen/manajemenkelas" />

        {/* =====================================================
            MAIN
        ===================================================== */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* TOP HEADER */}
          <Header breadcrumbs={["Portal", "Sistem Akademik", "Manajemen Data Kelas"]} />

        {/* CONTENT */}

        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Stat 1 */}

            <button
              type="button"
              onClick={() => navigate("/kelas")}
              className="text-left bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >

              <div>

                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                  TOTAL KELAS AKTIF
                </div>

                <div className="flex items-baseline gap-2">

                  <span className="text-2xl font-black text-slate-900">
                    {classesData.length}
                  </span>

                  <span className="text-xs text-slate-500 font-medium">
                    Rombel
                  </span>

                </div>

              </div>

              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>

            </button>

            {/* Stat 2 */}

            <button
              type="button"
              onClick={() => navigate("/mahasiswa")}
              className="text-left bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >

              <div>

                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                  MAHASISWA TERDAFTAR
                </div>

                <div className="flex items-baseline gap-2">

                  <span className="text-2xl font-black text-slate-900">
                    {totalStudents}
                  </span>

                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    100% Aktif
                  </span>

                </div>

              </div>

              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>

            </button>

            {/* Stat 3 */}

            <button
              type="button"
              onClick={() => navigate("/analitik-ai")}
              className="text-left bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >

              <div>

                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                  CAPAIAN OBE RATA-RATA
                </div>

                <div className="flex items-baseline gap-2">

                  <span className="text-2xl font-black text-slate-900">
                    81.4%
                  </span>

                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                    Memenuhi CPL
                    <Check className="w-3 h-3" />
                  </span>

                </div>

              </div>

              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>

            </button>

            {/* Stat 4 */}

            <button
              type="button"
              onClick={() => navigate("/sinkronisasi")}
              className="text-left bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >

              <div>

                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                  SYNC PDDIKTI FEEDER
                </div>

                <div className="flex items-center gap-1.5 mt-1">

                  <span className="text-base font-bold text-slate-900">
                    Terkoneksi
                  </span>

                  <span className="w-2 h-2 rounded-full bg-emerald-500" />

                </div>

              </div>

              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

            </button>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">

            <div>

              <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase mb-1 flex items-center gap-2">

                <span>
                  TAHUN AJARAN 2024/2025
                </span>

                <span>•</span>

                <span className="text-slate-500 font-medium">
                  Akreditasi LAM INFOKOM Unggul
                </span>

              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Manajemen Data Kelas Dosen
              </h1>

              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
                Kelola kurikulum mata kuliah aktif, monitoring progres
                penilaian OBE per kelas, dan status sinkronisasi PDDikti.
              </p>

            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">

              {/* EXPORT */}

              <button
                type="button"
                onClick={handleExportSummary}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Ringkasan XLS</span>
              </button>

              {/* TAMBAH KELAS */}

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>

            </div>

          </div>

          {/* =================================================
              FILTER
          ================================================= */}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/70 shadow-sm">

            {/* FILTER TAB */}

            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl">

              {[
                {
                  label: "Semua (4)",
                  value: "Semua",
                },
                {
                  label: "Semester 3",
                  value: "Semester 3",
                },
                {
                  label: "Semester 5",
                  value: "Semester 5",
                },
              ].map((tab) => {

                const isActive =
                  activeTab === tab.value;

                return (
                  <button
                    type="button"
                    key={tab.value}
                    onClick={() =>
                      setActiveTab(tab.value)
                    }
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );

              })}

            </div>

            {/* SEARCH & SORT */}

            <div className="flex items-center gap-2 flex-1 sm:flex-initial">

              {/* SEARCH */}

              <div className="relative flex-1 sm:w-64">

                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Cari nama mata kuliah atau kode..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />

              </div>

              {/* SORT */}

              <div className="relative">

                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value)
                  }
                  className="appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >

                  <option value="Terkini">
                    Urutkan: Terkini
                  </option>

                  <option value="SKS">
                    Urutkan: SKS
                  </option>

                  <option value="Kapasitas">
                    Urutkan: Kapasitas
                  </option>

                </select>

                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

              </div>

            </div>

          </div>

          {/* =================================================
              CLASS LIST
          ================================================= */}

          {paginatedClasses.length === 0 ? (

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-800">
                Mata Kuliah Tidak Ditemukan
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Coba sesuaikan pencarian atau kata kunci filter Anda.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {paginatedClasses.map((item) => (

                <ClassCard
                  key={item.id}
                  data={item}

                  onManageStudents={(classId) =>
                    router.push(
                      `/Dosen/tambahkelas?classId=${classId}`
                    )
                  }

                  onAnalytics={(classId) =>
                    router.push(
                      `/Dosen/analitikAI?classId=${classId}`
                    )
                  }

                  onAction={(classData) =>
                    router.push(
                      `/Dosen/inputnilai?classId=${classData.id}`
                    )
                  }
                />

              ))}

            </div>

          )}

          {/* =================================================
              SYNC INFO
          ================================================= */}

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

            <div className="flex items-start gap-3.5">

              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Database className="w-5 h-5" />
              </div>

              <div>

                <h4 className="text-sm font-bold text-slate-900">
                  Sinkronisasi Nilai Otomatis ke SIAKAD & PDDikti
                </h4>

                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Data rekapitulasi OBE kelas yang berstatus 100%
                  tervalidasi dapat langsung dikirimkan ke Biro
                  Administrasi Akademik dengan 1-klik tanda tangan
                  elektronik.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/sinkronisasi")}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-2 whitespace-nowrap self-end md:self-center"
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Log Sinkronisasi</span>
            </button>

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200/60 text-xs text-slate-500">

            <div>

              Menampilkan{" "}

              <span className="font-bold text-slate-800">
                {paginatedClasses.length}
              </span>{" "}

              dari{" "}

              <span className="font-bold text-slate-800">
                {sortedClasses.length}
              </span>{" "}

              kelas aktif

            </div>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(p - 1, 1)
                  )
                }
                disabled={safeCurrentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  type="button"
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                    safeCurrentPage === page
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium"
                  }`}
                >
                  {page}
                </button>

              ))}

              {/* NEXT */}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={
                  safeCurrentPage === totalPages
                }
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="pt-6 pb-2 text-center sm:flex sm:justify-between items-center text-[11px] text-slate-400 border-t border-slate-100">

            <div>
              © 2024-2025 Lembaga Layanan Pendidikan Tinggi
              (LLDIKTI) + Gradia Academic Intelligence
            </div>

            <div className="mt-2 sm:mt-0 flex justify-center gap-4">

              <button
                type="button"
                onClick={() => navigate("/bantuan")}
                className="hover:text-slate-600 transition-colors"
              >
                Bantuan Teknis
              </button>

              <span>•</span>

              <button
                type="button"
                onClick={() => navigate("/privasi")}
                className="hover:text-slate-600 transition-colors"
              >
                Protokol Privasi
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          MODAL TAMBAH KELAS
      ===================================================== */}

      {isModalOpen && (

        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >

          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  Tambah Kelas Baru
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddClass}
              className="p-5 space-y-4"
            >

              {/* NAMA */}

              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Mata Kuliah
                </label>

                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Mobile"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />

              </div>

              {/* KODE & SEMESTER */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kode Matkul
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Contoh: TIF-4010"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Semester
                  </label>

                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >

                    <option value="3">
                      Semester 3
                    </option>

                    <option value="5">
                      Semester 5
                    </option>

                  </select>

                </div>

              </div>

              {/* PRODI & KAPASITAS */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Program Studi
                  </label>

                  <select
                    value={formData.prodi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prodi: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  >

                    <option value="S1 Informatika">
                      S1 Informatika
                    </option>

                    <option value="S1 Sistem Informasi">
                      S1 Sistem Informasi
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kapasitas
                  </label>

                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />

                </div>

              </div>

              {/* JADWAL & RUANG */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jadwal Kuliah
                  </label>

                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schedule: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ruang OBE
                  </label>

                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        room: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />

                </div>

              </div>

              {/* BUTTON */}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all"
                >
                  Simpan Kelas
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
      </div>
    </AuthGuard>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
      {title}
    </div>
  );
}

/* NAV ITEM */

function NavItem({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        active
          ? "bg-indigo-50 text-indigo-600 font-bold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >

      <div className="flex items-center gap-2.5">

        <span
          className={
            active
              ? "text-indigo-600"
              : "text-slate-400"
          }
        >
          {icon}
        </span>

        <span>{label}</span>

      </div>

      {badge && (
        <span className="text-[9px] font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}

    </button>
  );
}

/* =========================================================
   CLASS CARD
========================================================= */

function ClassCard({
  data,
  onManageStudents,
  onAnalytics,
  onAction,
}: ClassCardProps) {

  /* =======================================================
     BADGE STYLE
  ======================================================= */

  const getBadgeStyle = (): string => {
    switch (data.tagType) {

      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "locked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "ai":
        return "bg-purple-50 text-purple-700 border-purple-200/60";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  /* =======================================================
     TOP RIGHT ICON
  ======================================================= */

  const getTopRightIcon = (): ReactNode => {

    if (data.tagType === "warning") {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <ClipboardCheck className="w-4 h-4" />
        </div>
      );
    }

    if (data.tagType === "locked") {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Wifi className="w-4 h-4" />
        </div>
      );
    }

    if (data.tagType === "ai") {
      return (
        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <BookOpen className="w-4 h-4" />
      </div>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">

      {/* TOP HEADER */}

      <div>

        <div className="flex items-start justify-between gap-2 mb-2">

          <div className="flex flex-wrap items-center gap-2">

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle()}`}
            >

              <span className="w-1.5 h-1.5 rounded-full bg-current" />

              {data.tag}

            </span>

            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {data.academicYear}
            </span>

          </div>

          {getTopRightIcon()}

        </div>

        {/* TITLE */}

        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          {data.title}
        </h3>

        {/* META */}

        <div className="text-xs text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-1.5">

          <span className="font-bold text-indigo-600">
            {data.code}
          </span>

          <span>•</span>

          <span>{data.sks}</span>

          <span>•</span>

          <span>{data.prodi}</span>

        </div>

      </div>

      {/* DETAILS */}

      <div className="bg-slate-50/80 rounded-xl p-3 grid grid-cols-3 gap-2 border border-slate-100 text-center">

        <div>

          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Kapasitas
          </div>

          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {data.capacity}
          </div>

        </div>

        <div className="border-x border-slate-200/60">

          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Jadwal Kuliah
          </div>

          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {data.schedule}
          </div>

        </div>

        <div>

          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Ruang OBE
          </div>

          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {data.room}
          </div>

        </div>

      </div>

      {/* PROGRESS / WARNING */}

      <div>

        {data.hasDeadlineWarning ? (

          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3">

            <div className="flex items-center justify-between mb-1">

              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">

                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />

                <span>
                  Batas Pengisian Terjadwal
                </span>

              </div>

              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {data.deadlineDays}
              </span>

            </div>

            <p className="text-[11px] text-amber-700/90 leading-tight">
              {data.note}
            </p>

          </div>

        ) : (

          <div className="space-y-1.5">

            <div className="flex items-center justify-between text-xs">

              <span className="font-bold text-slate-700 flex items-center gap-1">

                {data.progressPercent === 100 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}

                {data.progressLabel}

              </span>

              <span className="font-bold text-indigo-600">

                {data.progressPercent}%{" "}

                <span className="text-slate-400 font-normal">
                  ({data.progressSubtext})
                </span>

              </span>

            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  data.progressPercent === 100
                    ? "bg-emerald-500"
                    : data.tagType === "ai"
                    ? "bg-purple-600"
                    : "bg-indigo-600"
                }`}
                style={{
                  width: `${data.progressPercent ?? 0}%`,
                }}
              />

            </div>

            <p className="text-[11px] text-slate-400 leading-tight pt-0.5">
              {data.note}
            </p>

          </div>

        )}

      </div>

      {/* ACTION FOOTER */}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">

        <div className="flex items-center gap-2">

          {/* KELOLA MAHASISWA */}

          <button
            type="button"
            onClick={() =>
              onManageStudents?.(data.id)
            }
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-1.5"
          >

            <Users className="w-3.5 h-3.5 text-slate-500" />

            <span>
              Kelola Mhs
            </span>

          </button>

          {/* ANALITIK */}

          <button
            type="button"
            onClick={() =>
              onAnalytics?.(data.id)
            }
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 transition-all flex items-center gap-1.5"
          >

            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />

            <span>
              Analitik
            </span>

          </button>

        </div>

        {/* DARK BLUE ACTION */}

        {data.btnVariant === "darkBlue" && (

          <button
            type="button"
            onClick={() => onAction?.(data)}
            className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >

            <ClipboardCheck className="w-3.5 h-3.5" />

            <span>
              {data.actionBtn}
            </span>

          </button>

        )}

        {/* PURPLE ACTION */}

        {data.btnVariant === "purple" && (

          <button
            type="button"
            onClick={() => onAction?.(data)}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >

            <Sparkles className="w-3.5 h-3.5" />

            <span>
              {data.actionBtn}
            </span>

          </button>

        )}

        {/* INDIGO ACTION */}

        {data.btnVariant === "indigo" && (

          <button
            type="button"
            onClick={() => onAction?.(data)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            {data.actionBtn}
          </button>

        )
        }

        {/* OUTLINE ACTION */}

        {data.btnVariant === "outline" && (

          <button
            type="button"
            onClick={() => onAction?.(data)}
            className="px-4 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            {data.actionBtn}
          </button>

        )}

      </div>

    </div>
  );
}
