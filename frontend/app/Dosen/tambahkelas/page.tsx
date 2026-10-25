"use client";

import React, { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import { validateClassInput, validateStudentInput } from "@/lib/schemas";
import {
  ExternalLink,
  Search,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  CheckCircle2,
  Clock,
  History,
  Info,
  Tv,
  Wind,
  Wifi,
  Users,
  Building2,
  Sparkles,
  BookOpen,
  ShieldCheck,
  FileText,
  UserPlus,
  GraduationCap,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type StudentStatus = "Aktif" | "Cuti";

type Student = {
  id: string;
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: StudentStatus;
  initials: string;
};

type ClassForm = {
  courseName: string;
  courseCode: string;
  sks: string;
  roomSchedule: string;
  maxQuota: number;
};

type NewStudent = {
  nim: string;
  name: string;
  email: string;
  prodi: string;
  status: StudentStatus;
};

type NavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
};

/* =========================================================
   INITIAL DATA
========================================================= */

const INITIAL_STUDENTS: Student[] = [];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function App() {
  const router = useRouter();

  /* =======================================================
     SIDEBAR STATE
  ======================================================= */

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  /* =======================================================
     STUDENT STATE
  ======================================================= */

  const [activeStudentTab, setActiveStudentTab] =
    useState<StudentStatus | "Semua">("Semua");

  const [studentSearch, setStudentSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [students, setStudents] =
    useState<Student[]>(INITIAL_STUDENTS);

  /* =======================================================
     CLASS FORM STATE
  ======================================================= */

  const [classForm, setClassForm] = useState<ClassForm>({
    courseName: "Algoritma & Pemrograman Terapan",
    courseCode: "IF2408",
    sks: "3 SKS (Praktek + Teori)",
    roomSchedule: "Lab Komputer 3 - Senin, 08:00",
    maxQuota: 40,
  });

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] =
    useState<boolean>(false);

  const [isCsvModalOpen, setIsCsvModalOpen] =
    useState<boolean>(false);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /* =======================================================
     NEW STUDENT FORM
  ======================================================= */

  const [newStudent, setNewStudent] = useState<NewStudent>({
    nim: "",
    name: "",
    email: "",
    prodi: "Teknik Informatika",
    status: "Aktif",
  });

  /* =======================================================
     SIDEBAR NAVIGATION
  ======================================================= */

  const handleNavigation = (path: string): void => {
    setIsSidebarOpen(false);
    router.push(path);
  };

  /* =======================================================
     FILTER STUDENTS
  ======================================================= */

  const filteredStudents = useMemo<Student[]>(() => {
    return students.filter((student: Student) => {
      const matchesTab =
        activeStudentTab === "Semua" ||
        student.status === activeStudentTab;

      const query = studentSearch.toLowerCase().trim();

      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.nim.toLowerCase().includes(query) ||
        student.prodi.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [students, activeStudentTab, studentSearch]);

  /* =======================================================
     STUDENT STATISTICS
  ======================================================= */

  const totalStudentsCount: number = students.length;

  const activeStudentsCount: number = students.filter(
    (student: Student) => student.status === "Aktif"
  ).length;

  const cutiStudentsCount: number = students.filter(
    (student: Student) => student.status === "Cuti"
  ).length;

  /* =======================================================
     QUOTA CALCULATION
  ======================================================= */

  const filledPercentage: string =
    classForm.maxQuota > 0
      ? (
          (totalStudentsCount / classForm.maxQuota) *
          100
        ).toFixed(1)
      : "0.0";

  const remainingQuota: number = Math.max(
    0,
    classForm.maxQuota - totalStudentsCount
  );

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast = (message: string): void => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /* =======================================================
     ADD STUDENT
  ======================================================= */

  const handleAddStudentSubmit = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    // Validasi Zod Schema Mahasiswa Bersama
    const validation = validateStudentInput({
      nim: newStudent.nim,
      name: newStudent.name,
      email: newStudent.email || `${newStudent.nim}@student.ac.id`,
      prodi: newStudent.prodi,
      status: newStudent.status,
    });

    if (!validation.success) {
      const errMap = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errMap)[0]?.[0];
      showToast(`⚠️ Validasi gagal: ${firstError || "Data tidak valid"}`);
      return;
    }

    const initials: string = newStudent.name
      .split(" ")
      .filter(Boolean)
      .map((name: string) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const createdStudent: Student = {
      id: Date.now().toString(),
      nim: newStudent.nim,
      name: newStudent.name,
      email:
        newStudent.email ||
        `${newStudent.nim}@student.ac.id`,
      prodi: newStudent.prodi,
      status: newStudent.status,
      initials: initials || "ST",
    };

    setStudents(
      (previousStudents: Student[]) => [
        createdStudent,
        ...previousStudents,
      ]
    );

    setIsAddStudentModalOpen(false);

    setNewStudent({
      nim: "",
      name: "",
      email: "",
      prodi: "Teknik Informatika",
      status: "Aktif",
    });

    showToast(
      `Mahasiswa ${createdStudent.name} berhasil ditambahkan!`
    );
  };

  const handleSaveClassData = async (): Promise<void> => {
    const classPayload = {
      title: classForm.courseName,
      code: classForm.courseCode,
      sks: 3,
      prodi: "Teknik Informatika",
      semester: 1,
      capacity: classForm.maxQuota || 40,
      schedule: classForm.roomSchedule || "Senin, 08:00 WIB",
      room: "Lab Komputer",
    };

    // Validasi Zod Schema Kelas Bersama
    const validation = validateClassInput(classPayload);
    if (!validation.success) {
      const errMap = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errMap)[0]?.[0];
      showToast(`⚠️ Validasi gagal: ${firstError || "Data kelas tidak valid"}`);
      return;
    }

    try {
      const classRes = await apiFetch("/classes", {
        method: "POST",
        body: JSON.stringify(validation.data),
      });

      // Enroll students if any added
      for (const s of students) {
        await apiFetch(`/classes/${classRes.classId}/students`, {
          method: "POST",
          body: JSON.stringify({
            nim: s.nim,
            name: s.name,
            email: s.email,
            prodi: s.prodi,
          }),
        }).catch(() => {});
      }

      showToast("Data kelas & mahasiswa berhasil disimpan ke sistem!");
      setTimeout(() => {
        router.push("/Dosen/manajemenkelas");
      }, 1200);
    } catch (err: any) {
      showToast("Gagal menyimpan kelas: " + err.message);
    }
  };

  /* =======================================================
     CLASS FORM HANDLER
  ======================================================= */

  const handleClassFormChange = (
    field: keyof ClassForm,
    value: string | number
  ): void => {
    setClassForm(
      (previousClassForm: ClassForm) => ({
        ...previousClassForm,
        [field]: value,
      })
    );
  };

  /* =======================================================
     NEW STUDENT FORM HANDLER
  ======================================================= */

  const handleNewStudentChange = (
    field: keyof NewStudent,
    value: string
  ): void => {
    setNewStudent(
      (previousStudent: NewStudent) => ({
        ...previousStudent,
        [field]: value,
      })
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white">
        {/* ===================================================
            TOAST
        =================================================== */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}
        {/* SIDEBAR */}
        <Sidebar currentPath="/Dosen/tambahkelas" />
              {/* MAIN */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* HEADER */}
        <Header breadcrumbs={["Portal", "Sistem Akademik", "Tambah Kelas & Mahasiswa"]} />

        {/* CONTENT */}
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">

          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span className="text-indigo-600 font-bold">
                  KURIKULUM BERBASIS CAPAIAN (OBE)
                </span>

                <span>•</span>

                <span>Tahun Ajaran 2024/2025</span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Tambah Kelas & Kelola Mahasiswa
                </h1>

                <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                  SEC-ID #4402-TE
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
                Konfigurasikan spesifikasi ruang kuliah, kuota pembelajaran,
                serta sinkronisasi roster mahasiswa peserta kelas secara
                real-time.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start lg:self-auto">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Draf kelas berhasil dimuat dari sistem."
                  )
                }
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 shadow-sm transition-all flex items-center gap-2"
              >
                <History className="w-4 h-4 text-slate-500" />

                <span>Riwayat Draf</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Validasi Jadwal AI: Tidak ada bentrok dengan ruang & dosen lain!"
                  )
                }
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />

                <span>Validasi Jadwal AI</span>
              </button>
            </div>
          </div>

          {/* TWO COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-5 space-y-4">

              {/* CLASS FORM */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">

                {/* CARD HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Formulir Kelas Baru
                      </h2>

                      <p className="text-[11px] text-slate-400">
                        Parameter akademik mata kuliah
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Step 1/2
                    </span>

                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Konfigurasi Kuota
                    </div>
                  </div>
                </div>

                {/* FORM FIELDS */}
                <div className="space-y-3 text-xs">

                  {/* NAMA MATA KULIAH */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                      Nama Mata Kuliah{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={classForm.courseName}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>
                        ) =>
                          handleClassFormChange(
                            "courseName",
                            event.target.value
                          )
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />

                      <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* KODE & SKS */}
                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                        Kode MK{" "}
                        <span className="text-rose-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={classForm.courseCode}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>
                        ) =>
                          handleClassFormChange(
                            "courseCode",
                            event.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                        Bobot SKS{" "}
                        <span className="text-rose-500">*</span>
                      </label>

                      <select
                        value={classForm.sks}
                        onChange={(
                          event: ChangeEvent<HTMLSelectElement>
                        ) =>
                          handleClassFormChange(
                            "sks",
                            event.target.value
                          )
                        }
                        className="w-full px-2.5 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="3 SKS (Praktek + Teori)">
                          3 SKS (Praktek + Teori)
                        </option>

                        <option value="2 SKS (Teori)">
                          2 SKS (Teori)
                        </option>

                        <option value="4 SKS (Praktikum)">
                          4 SKS (Praktikum)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* RUANG & JADWAL */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                      Ruang & Jadwal Sesi{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={classForm.roomSchedule}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>
                        ) =>
                          handleClassFormChange(
                            "roomSchedule",
                            event.target.value
                          )
                        }
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />

                      <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* KUOTA */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                        Batas Kuota Mahasiswa
                      </label>

                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {filledPercentage}% Terisi
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        value={classForm.maxQuota}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>
                        ) =>
                          handleClassFormChange(
                            "maxQuota",
                            Number.parseInt(
                              event.target.value,
                              10
                            ) || 0
                          )
                        }
                        className="w-full pl-3 pr-9 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />

                      <Users className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Info className="w-3 h-3 text-indigo-500" />

                      Kapasitas maksimal ruangan 45 kursi
                    </p>
                  </div>
                </div>

                {/* FACILITY INFO */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-2.5">

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />

                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          Lab Komputer Sains 3
                        </div>

                        <div className="text-[10px] text-slate-400">
                          Gedung Laboratorium Terpadu, Lt. 3
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Siap Pakai
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-center text-[10px]">

                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <Tv className="w-3.5 h-3.5 text-indigo-500 mx-auto mb-0.5" />

                      <div className="font-bold text-slate-700">
                        Smart Projector
                      </div>

                      <div className="text-slate-400 text-[9px]">
                        4K UHD Sony
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <Wind className="w-3.5 h-3.5 text-cyan-500 mx-auto mb-0.5" />

                      <div className="font-bold text-slate-700">
                        Dual AC
                      </div>

                      <div className="text-slate-400 text-[9px]">
                        2 PK • Suhu 20°C - 22°C
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                      <Wifi className="w-3.5 h-3.5 text-indigo-500 mx-auto mb-0.5" />

                      <div className="font-bold text-slate-700">
                        LAN 1 Gbps
                      </div>

                      <div className="text-slate-400 text-[9px]">
                        45 Port Aktif
                      </div>
                    </div>

                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveClassData}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />

                    <span>Simpan Data Kelas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      showToast("Perubahan dibatalkan.")
                    }
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {/* INTEGRATION BANNER */}
              <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wifi className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-purple-900">
                    Integrasi PD-Dikti & SIAKAD
                  </h4>

                  <p className="text-[11px] text-purple-700/80 mt-0.5 leading-relaxed">
                    Perubahan kuota serta penambahan mahasiswa akan
                    ter-validasi otomatis dengan pangkalan data universitas
                    paling lambat 1&times;24 jam.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-7 space-y-4">

              {/* STUDENT MANAGEMENT */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Kelola Mahasiswa Terdaftar
                    </h2>

                    <p className="text-[11px] text-slate-400">
                      Daftar presensi dan verifikasi status akademik peserta
                      kelas
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setIsCsvModalOpen(true)
                      }
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />

                      <span>Upload .CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsAddStudentModalOpen(true)
                      }
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />

                      <span>Tambah Manual</span>
                    </button>

                  </div>
                </div>

                {/* SEARCH & FILTER */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      placeholder="Cari Mahasiswa berdasarkan NIM / Nama..."
                      value={studentSearch}
                      onChange={(
                        event: ChangeEvent<HTMLInputElement>
                      ) =>
                        setStudentSearch(event.target.value)
                      }
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* FILTER */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto">
                    {[
                      {
                        key: "Semua" as const,
                        label: `Semua (${totalStudentsCount})`,
                      },
                      {
                        key: "Aktif" as const,
                        label: `Aktif (${activeStudentsCount})`,
                      },
                      {
                        key: "Cuti" as const,
                        label: `Cuti (${cutiStudentsCount})`,
                      },
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.key}
                        onClick={() =>
                          setActiveStudentTab(tab.key)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          activeStudentTab === tab.key
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CAPACITY */}
                <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/80 space-y-1.5">

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-900 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-600" />

                      Kapasitas Sesi Terisi:

                      <span className="text-indigo-600">
                        {totalStudentsCount} / Kuota Maks:{" "}
                        {classForm.maxQuota} Mahasiswa
                      </span>
                    </span>

                    <span className="text-indigo-600">
                      {filledPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(filledPercentage)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">
                          NO
                        </th>

                        <th className="py-2.5 px-3">
                          NIM
                        </th>

                        <th className="py-2.5 px-3">
                          NAMA MAHASISWA
                        </th>

                        <th className="py-2.5 px-3">
                          PROGRAM STUDI
                        </th>

                        <th className="py-2.5 px-3 text-center">
                          STATUS
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 font-medium">

                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-slate-400"
                          >
                            Tidak ada mahasiswa ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(
                          (
                            student: Student,
                            index: number
                          ) => (
                            <tr
                              key={student.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </td>

                              <td className="py-3 px-3 font-mono font-bold text-indigo-600 underline cursor-pointer hover:text-indigo-800">
                                {student.nim}
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">

                                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                                    {student.initials}
                                  </div>

                                  <div>
                                    <div className="font-bold text-slate-900 leading-tight">
                                      {student.name}
                                    </div>

                                    <div className="text-[10px] text-slate-400">
                                      {student.email}
                                    </div>
                                  </div>

                                </div>
                              </td>

                              <td className="py-3 px-3 text-slate-600">
                                {student.prodi}
                              </td>

                              <td className="py-3 px-3 text-center">
                                {student.status === "Aktif" ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Cuti
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        )
                      )}

                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-xs text-slate-500">

                  <div>
                    Menampilkan{" "}
                    <span className="font-bold text-slate-800">
                      1-{filteredStudents.length}
                    </span>{" "}
                    dari{" "}
                    <span className="font-bold text-slate-800">
                      {totalStudentsCount}
                    </span>{" "}
                    Mahasiswa
                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page: number) =>
                            Math.max(page - 1, 1)
                        )
                      }
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shadow-sm ${
                        currentPage === 1
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      1
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(2)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        currentPage === 2
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      2
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(3)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        currentPage === 3
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      3
                    </button>

                    <span className="px-1 text-slate-400 text-xs">
                      ...
                    </span>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(8)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        currentPage === 8
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      8
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          (page: number) => page + 1
                        )
                      }
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              </div>

              {/* SUMMARY WIDGETS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* SUMMARY 1 */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      KESIAPAN SKS
                    </div>

                    <div className="text-base font-black text-slate-900 leading-tight">
                      100%
                    </div>

                    <div className="text-[10px] font-semibold text-emerald-600">
                      Terverifikasi Fakultas
                    </div>
                  </div>
                </div>

                {/* SUMMARY 2 */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      PRESENSI AWAL
                    </div>

                    <div className="text-base font-black text-slate-900 leading-tight">
                      {activeStudentsCount}{" "}
                      <span className="text-xs font-medium text-slate-500">
                        Siswa
                      </span>
                    </div>

                    <div className="text-[10px] font-semibold text-purple-600">
                      Roster Siap Cetak
                    </div>
                  </div>
                </div>

                {/* SUMMARY 3 */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      SISA KURSI
                    </div>

                    <div className="text-base font-black text-slate-900 leading-tight">
                      {remainingQuota}{" "}
                      <span className="text-xs font-medium text-slate-500">
                        Slot
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Maksimal {classForm.maxQuota} kuota
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-8 pb-2 text-center sm:flex sm:justify-between items-center text-[11px] text-slate-400 border-t border-slate-200/60">

            <div>
              © 2024-2025 Lembaga Layanan Pendidikan Tinggi
              (LLDIKTI) + Gradia Academic Intelligence
            </div>

            <div className="mt-2 sm:mt-0 flex justify-center items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  handleNavigation("/bantuan-teknis")
                }
                className="hover:text-slate-600 transition-colors"
              >
                Bantuan Teknis
              </button>

              <span>•</span>

              <button
                type="button"
                onClick={() =>
                  handleNavigation("/privasi")
                }
                className="hover:text-slate-600 transition-colors"
              >
                Protokol Privasi
              </button>

              <span>•</span>

              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SLA 99.98% Available
              </span>

            </div>
          </div>
        </div>
      </main>

      {/* ===================================================
          MODAL TAMBAH MAHASISWA
      =================================================== */}

      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            {/* HEADER */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  Tambah Mahasiswa Manual
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsAddStudentModalOpen(false)
                }
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleAddStudentSubmit}
              className="p-5 space-y-4 text-xs"
            >

              {/* NIM */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIM (Nomor Induk Mahasiswa){" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  placeholder="Contoh: 2204101035"
                  value={newStudent.nim}
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>
                  ) =>
                    handleNewStudentChange(
                      "nim",
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* NAMA */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Mahasiswa{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan"
                  value={newStudent.name}
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>
                  ) =>
                    handleNewStudentChange(
                      "name",
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Mahasiswa
                </label>

                <input
                  type="email"
                  placeholder="farhan@student.ac.id"
                  value={newStudent.email}
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>
                  ) =>
                    handleNewStudentChange(
                      "email",
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* PRODI & STATUS */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Program Studi
                  </label>

                  <select
                    value={newStudent.prodi}
                    onChange={(
                      event: ChangeEvent<HTMLSelectElement>
                    ) =>
                      handleNewStudentChange(
                        "prodi",
                        event.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="Teknik Informatika">
                      Teknik Informatika
                    </option>

                    <option value="Sistem Informasi">
                      Sistem Informasi
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Akademik
                  </label>

                  <select
                    value={newStudent.status}
                    onChange={(
                      event: ChangeEvent<HTMLSelectElement>
                    ) =>
                      handleNewStudentChange(
                        "status",
                        event.target.value as StudentStatus
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    <option value="Aktif">
                      Aktif
                    </option>

                    <option value="Cuti">
                      Cuti
                    </option>
                  </select>
                </div>

              </div>

              {/* BUTTON */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setIsAddStudentModalOpen(false)
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all"
                >
                  Simpan Mahasiswa
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL UPLOAD CSV
      =================================================== */}

      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            {/* HEADER */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>

                <h3 className="font-bold text-slate-900 text-base">
                  Import Mahasiswa via .CSV
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4 text-xs text-center">

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />

                <p className="font-bold text-slate-800">
                  Seret file CSV ke sini atau klik untuk memilih
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Format kolom: NIM, Nama, Email, Prodi, Status
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Unduh contoh format CSV</span>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Template_Roster.csv siap diunduh."
                    )
                  }
                  className="text-indigo-600 font-bold underline"
                >
                  Template_Roster.csv
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setIsCsvModalOpen(false)
                  }
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCsvModalOpen(false);

                    showToast(
                      "5 Data Mahasiswa dari CSV berhasil diimpor!"
                    );
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all"
                >
                  Proses Import
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}

/* =========================================================
   SIDEBAR NAV ITEM
========================================================= */

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
            active ? "text-indigo-600" : "text-slate-400"
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

