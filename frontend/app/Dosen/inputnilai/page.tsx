"use client";

import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import {
  Search,
  ArrowUpDown,
  Upload,
  Save,
  Calculator,
  Edit,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
} from "lucide-react";

/* =========================================================
   TYPE
========================================================= */

type StudentStatus =
  | "Tersimpan"
  | "Perlu remedial"
  | "Belum lengkap";

type ScoreField = "tugas" | "uts" | "uas";

type Student = {
  id: number;
  nim: string;
  name: string;
  type: string;
  avatar: string;
  tugas: number | null;
  uts: number | null;
  uas: number | null;
  aiFeedback: string;
  status: StudentStatus;
};

type GradeResult = {
  score: string | null;
  grade: string;
};

type FilterTab = "Semua" | "Lulus" | "Remedial";

/* =========================================================
   DATA AWAL (BERSIH DARI DATA DUMMY)
========================================================= */

const INITIAL_STUDENTS: Student[] = [];

/* =========================================================
   KOMPONEN UTAMA
========================================================= */

export default function DashboardPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<any[]>([]);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const loadGradesForClass = (classId: number) => {
    setActiveClassId(classId);
    apiFetch(`/grades/${classId}`)
      .then((gradeRes) => {
        if (gradeRes.grades) {
          const mapped: Student[] = gradeRes.grades.map((g: any, idx: number) => ({
            id: g.enrollment_id || idx + 1,
            nim: g.nim,
            name: g.name,
            type: `${g.prodi || "Teknik Informatika"} - Reguler`,
            avatar: (g.name || "M").substring(0, 2).toUpperCase(),
            tugas: g.tugas,
            uts: g.uts,
            uas: g.uas,
            aiFeedback: g.ai_feedback || "Belum ada feedback AI",
            status: (g.status as StudentStatus) || "Belum lengkap",
          }));
          setStudents(mapped);
        }
      })
      .catch((err) => console.warn(err.message));
  };

  useEffect(() => {
    apiFetch("/classes")
      .then((res) => {
        if (res.classes && res.classes.length > 0) {
          setClasses(res.classes);
          const firstClassId = res.classes[0].id;
          loadGradesForClass(firstClassId);
        }
      })
      .catch((err) => console.warn(err.message));
  }, []);

  const [activeTab, setActiveTab] = useState<FilterTab>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveGrades = async () => {
    if (!activeClassId) {
      notify("Silakan pilih kelas terlebih dahulu!");
      return;
    }
    try {
      await apiFetch(`/grades/${activeClassId}`, {
        method: "PUT",
        body: JSON.stringify({ grades: students }),
      });
      notify("Data rekap nilai berhasil disimpan ke sistem!");
    } catch (err: any) {
      notify("Gagal menyimpan rekap nilai: " + err.message);
    }
  };

  /* =========================================================
     NAVIGASI
  ========================================================= */

  const navigate = (path: string): void => {
    router.push(path);
  };

  /* =========================================================
     KONFIGURASI BOBOT OBE
  ========================================================= */

  const BOBOT = {
    tugas: 0.25,
    uts: 0.35,
    uas: 0.4,
  };

  /* =========================================================
     HELPER MENGHITUNG NILAI
  ========================================================= */

  const calculateFinalGrade = (
    tugas: number | null,
    uts: number | null,
    uas: number | null
  ): GradeResult => {
    if (
      tugas === null ||
      uts === null ||
      uas === null ||
      uas === undefined
    ) {
      return {
        score: null,
        grade: "-",
      };
    }

    const score =
      tugas * BOBOT.tugas +
      uts * BOBOT.uts +
      uas * BOBOT.uas;

    let grade = "E";

    if (score >= 85) {
      grade = "A";
    } else if (score >= 80) {
      grade = "A-";
    } else if (score >= 75) {
      grade = "B+";
    } else if (score >= 70) {
      grade = "B";
    } else if (score >= 65) {
      grade = "C+";
    } else if (score >= 55) {
      grade = "C";
    } else if (score >= 45) {
      grade = "D";
    }

    return {
      score: score.toFixed(1),
      grade,
    };
  };


  /* =========================================================
     UBAH NILAI
  ========================================================= */

  const handleScoreChange = (
    id: number,
    field: ScoreField,
    val: string
  ): void => {
    const num: number | null =
      val === "" ? null : parseFloat(val);

    setStudents((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updated: Student = {
          ...item,
          [field]: num,
        };

        if (
          updated.tugas !== null &&
          updated.uts !== null &&
          updated.uas !== null
        ) {
          const { score } = calculateFinalGrade(
            updated.tugas,
            updated.uts,
            updated.uas
          );

          if (
            score !== null &&
            parseFloat(score) < 65
          ) {
            updated.status = "Perlu remedial";
          } else {
            updated.status = "Tersimpan";
          }
        } else {
          updated.status = "Belum lengkap";
        }

        return updated;
      })
    );
  };

  /* =========================================================
     SELECT ALL
  ========================================================= */

  const handleSelectAll = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.checked) {
      setSelectedIds(
        filteredStudents.map((student) => student.id)
      );
    } else {
      setSelectedIds([]);
    }
  };

  /* =========================================================
     SELECT SINGLE
  ========================================================= */

  const handleSelectOne = (id: number): void => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredStudents = useMemo<Student[]>(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery);

      const { score } = calculateFinalGrade(
        student.tugas,
        student.uts,
        student.uas
      );

      const isLulus =
        score !== null && parseFloat(score) >= 65;

      const isRemedial =
        student.status === "Perlu remedial";

      if (activeTab === "Lulus") {
        return matchSearch && isLulus;
      }

      if (activeTab === "Remedial") {
        return matchSearch && isRemedial;
      }

      return matchSearch;
    });
  }, [students, searchQuery, activeTab]);

  /* =========================================================
     RATA-RATA
  ========================================================= */

  const averages = useMemo(() => {
    let sumTugas = 0;
    let countTugas = 0;

    let sumUts = 0;
    let countUts = 0;

    let sumUas = 0;
    let countUas = 0;

    let sumFinal = 0;
    let countFinal = 0;

    students.forEach((student) => {
      if (student.tugas !== null) {
        sumTugas += student.tugas;
        countTugas++;
      }

      if (student.uts !== null) {
        sumUts += student.uts;
        countUts++;
      }

      if (student.uas !== null) {
        sumUas += student.uas;
        countUas++;
      }

      const { score } = calculateFinalGrade(
        student.tugas,
        student.uts,
        student.uas
      );

      if (score !== null) {
        sumFinal += parseFloat(score);
        countFinal++;
      }
    });

    return {
      tugas: countTugas
        ? (sumTugas / countTugas).toFixed(1)
        : "-",

      uts: countUts
        ? (sumUts / countUts).toFixed(1)
        : "-",

      uas: countUas
        ? (sumUas / countUas).toFixed(1)
        : "-",

      final: countFinal
        ? (sumFinal / countFinal).toFixed(1)
        : "-",
    };
  }, [students]);

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-hidden">

        {/* =====================================================
            TOAST
        ===================================================== */}

        {showToast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm border border-slate-700 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SIDEBAR */}
        <Sidebar currentPath="/Dosen/inputnilai" />
        

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* ================= HEADER ================= */}
        <Header breadcrumbs={["Portal", "Sistem Akademik", "Input Rekap Nilai Mahasiswa"]} />

        {/* ================= CONTENT ================= */}

        <main className="p-8 space-y-6">

          {/* Section Header */}

          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-1">

                <span>
                  OBE INTEGRATED V2.4
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span className="text-slate-500">
                  Sinkronisasi PDDikti Aktif
                </span>

              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Input Rekap Nilai Mahasiswa
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Kalkulasi nilai otomatis, penyesuaian bobot standar evaluasi Outcome-Based Education (OBE), dan integrasi catatan AI Feedback Engine.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => router.push("/Dosen/importnilai")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                Import Excel (.xlsx / .csv)
              </button>

              <button
                type="button"
                onClick={handleSaveGrades}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              >
                <Save className="w-4 h-4" />
                Simpan Rekap Nilai
              </button>

            </div>

          </div>

          {/* ================= SUMMARY ================= */}

          <div className="grid grid-cols-12 gap-4">

            {/* Mata Kuliah */}

            <div className="col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative overflow-hidden">

              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                MATA KULIAH AKTIF
              </span>

              {classes.length === 0 ? (
                <div className="py-1">
                  <p className="text-xs text-amber-600 font-medium">Belum ada kelas aktif</p>
                  <button
                    type="button"
                    onClick={() => router.push("/Dosen/tambahkelas")}
                    className="text-[11px] text-indigo-600 font-semibold underline mt-1 block"
                  >
                    + Buat Kelas Baru
                  </button>
                </div>
              ) : (
                <select
                  value={activeClassId || ""}
                  onChange={(e) => loadGradesForClass(Number(e.target.value))}
                  className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-indigo-500 mb-1"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code || "KLS"}) - {cls.room || "Ruang Kuliah"}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">

                <span>
                  <strong className="text-slate-700">
                    {classes.find((c) => c.id === activeClassId)?.sks || 3}
                  </strong>{" "}
                  SKS
                </span>

                <span>•</span>

                <span>
                  {classes.find((c) => c.id === activeClassId)?.room || "Lab"}
                </span>

                <span>•</span>

                <span>
                  <strong className="text-slate-700">
                    {students.length}
                  </strong>{" "}
                  Mahasiswa
                </span>

              </div>

            </div>

            {/* Status */}

            <div className="col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">

              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                STATUS INPUT & VALIDASI
              </span>

              <div className="flex items-center gap-2 mb-1">

                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>

                  96% Terisi Lengkap

                </span>

              </div>

              <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                1 mahasiswa belum tervalidasi / remedial
              </p>

            </div>

            {/* Bobot */}

            <div className="col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm relative">

              <div className="flex items-center justify-between mb-1">

                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  SKEMA PEMBOBOTAN (OBE)
                </span>

                <button
                  type="button"
                  onClick={() =>
                    notify("Membuka pengaturan skema bobot...")
                  }
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Ubah
                </button>

              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">

                <span>
                  Tugas:{" "}
                  <span className="text-indigo-600">
                    25%
                  </span>
                </span>

                <span>
                  UTS:{" "}
                  <span className="text-indigo-600">
                    35%
                  </span>
                </span>

              </div>

              <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded mb-2">
                UAS: 40%
              </div>

              <p className="text-[11px] text-slate-400">
                Total Terbobot: 100% (Valid)
              </p>

            </div>

            {/* Hitung Rata-rata */}

            <div className="col-span-3 bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">

              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                AKSI PERHITUNGAN CEPAT
              </span>

              <button
                type="button"
                onClick={() =>
                  notify(
                    "Perhitungan rata-rata otomatis berhasil dilakukan!"
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold py-2 rounded-xl text-xs transition my-1"
              >
                <Calculator className="w-4 h-4 text-indigo-600" />
                Hitung Rata-rata Otomatis
              </button>

              <p className="text-[11px] text-slate-400 text-right">
                Sinkron terakhir: 4 mnt lalu
              </p>

            </div>

          </div>

          {/* ================= TABLE CONTROLS ================= */}

          <div className="flex items-center justify-between pt-2">

            {/* Filter */}

            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium">

              <button
                type="button"
                onClick={() => setActiveTab("Semua")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "Semua"
                    ? "bg-slate-900 text-white font-bold shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua (32)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Lulus")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "Lulus"
                    ? "bg-slate-900 text-white font-bold shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lulus (29)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Remedial")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "Remedial"
                    ? "bg-slate-900 text-white font-bold shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Remedial (3)
              </button>

            </div>

            {/* Search & Sort */}

            <div className="flex items-center gap-3">

              <div className="relative w-72">

                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  placeholder="Cari nama atau NIM mahasiswa..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />

              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-medium">

                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />

                <span>
                  Urutkan:{" "}
                  <strong>NIM (Terkecil)</strong>
                </span>

              </div>

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">

                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedIds.length > 0 &&
                          selectedIds.length ===
                            filteredStudents.length
                        }
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>

                    <th className="py-3 px-2 w-10 text-center">
                      NO
                    </th>

                    <th className="py-3 px-3 w-28">
                      NIM
                    </th>

                    <th className="py-3 px-4">
                      NAMA MAHASISWA
                    </th>

                    <th className="py-3 px-3 text-center">
                      TUGAS (25%)
                    </th>

                    <th className="py-3 px-3 text-center">
                      UTS (35%)
                    </th>

                    <th className="py-3 px-3 text-center">
                      UAS (40%)
                    </th>

                    <th className="py-3 px-3 text-center">
                      NILAI AKHIR
                    </th>

                    <th className="py-3 px-3 text-center">
                      HURUF
                    </th>

                    <th className="py-3 px-4">
                      CATATAN / FEEDBACK AI OBE
                    </th>

                    <th className="py-3 px-3 text-center">
                      STATUS
                    </th>

                    <th className="py-3 px-3 text-center">
                      AKSI
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">

                  {filteredStudents.map(
                    (item, index) => {

                      const { score, grade } =
                        calculateFinalGrade(
                          item.tugas,
                          item.uts,
                          item.uas
                        );

                      const isSelected =
                        selectedIds.includes(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 transition ${
                            isSelected
                              ? "bg-indigo-50/30"
                              : ""
                          }`}
                        >

                          <td className="py-3.5 px-4 text-center">

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleSelectOne(item.id)
                              }
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />

                          </td>

                          <td className="py-3.5 px-2 text-center font-medium text-slate-400">
                            {index + 1}
                          </td>

                          <td className="py-3.5 px-3 font-semibold text-slate-900">
                            {item.nim}
                          </td>

                          <td className="py-3.5 px-4">

                            <div className="flex items-center gap-2.5">

                              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                                {item.avatar}
                              </div>

                              <div>

                                <p className="font-bold text-slate-900 leading-tight">
                                  {item.name}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  {item.type}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* TUGAS */}

                          <td className="py-3.5 px-3 text-center">

                            <input
                              type="number"
                              value={item.tugas ?? ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  item.id,
                                  "tugas",
                                  e.target.value
                                )
                              }
                              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />

                          </td>

                          {/* UTS */}

                          <td className="py-3.5 px-3 text-center">

                            <input
                              type="number"
                              value={item.uts ?? ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  item.id,
                                  "uts",
                                  e.target.value
                                )
                              }
                              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />

                          </td>

                          {/* UAS */}

                          <td className="py-3.5 px-3 text-center">

                            <input
                              type="number"
                              value={item.uas ?? ""}
                              placeholder="0.0"
                              onChange={(e) =>
                                handleScoreChange(
                                  item.id,
                                  "uas",
                                  e.target.value
                                )
                              }
                              className={`w-16 border rounded-lg px-2 py-1 text-center font-bold focus:outline-none focus:ring-2 ${
                                item.uas === null
                                  ? "bg-rose-50 border-rose-200 text-rose-500 placeholder-rose-300 focus:ring-rose-500/30"
                                  : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:ring-indigo-500/30"
                              }`}
                            />

                          </td>

                          {/* NILAI AKHIR */}

                          <td className="py-3.5 px-3 text-center font-black text-slate-900 text-sm">
                            {score ?? "-"}
                          </td>

                          {/* GRADE */}

                          <td className="py-3.5 px-3 text-center">

                            {grade !== "-" ? (

                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-extrabold text-xs ${
                                  grade.startsWith("A")
                                    ? "bg-emerald-100 text-emerald-800"
                                    : grade.startsWith("B")
                                    ? "bg-blue-100 text-blue-800"
                                    : grade.startsWith("C")
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {grade}
                              </span>

                            ) : (

                              <span className="text-slate-400 font-bold">
                                -
                              </span>

                            )}

                          </td>

                          {/* FEEDBACK */}

                          <td className="py-3.5 px-4 max-w-xs">

                            <div className="flex items-start gap-1.5 text-[11px]">

                              {item.status ===
                              "Perlu remedial" ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              ) : item.status ===
                                "Belum lengkap" ? (
                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              )}

                              <span
                                className={`line-clamp-2 ${
                                  item.status ===
                                  "Perlu remedial"
                                    ? "text-amber-800 font-medium"
                                    : item.status ===
                                      "Belum lengkap"
                                    ? "text-rose-600 font-medium"
                                    : "text-slate-600"
                                }`}
                              >
                                {item.aiFeedback}
                              </span>

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="py-3.5 px-3 text-center">

                            {item.status ===
                              "Tersimpan" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                Tersimpan
                              </span>
                            )}

                            {item.status ===
                              "Perlu remedial" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Perlu remedial
                              </span>
                            )}

                            {item.status ===
                              "Belum lengkap" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                Belum lengkap
                              </span>
                            )}

                          </td>

                          {/* AKSI */}

                          <td className="py-3.5 px-3 text-center">

                            <div className="flex items-center justify-center gap-1 text-slate-400">

                              <button
                                type="button"
                                onClick={() =>
                                  notify(
                                    `Edit data ${item.name}`
                                  )
                                }
                                className="p-1 hover:text-indigo-600 rounded transition"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  notify(
                                    `Membuka menu aksi ${item.name}`
                                  )
                                }
                                className="p-1 hover:text-slate-700 rounded transition"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* RATA-RATA */}

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 font-bold text-slate-900">

                  <BarChart3 className="w-4 h-4 text-indigo-600" />

                  <span>
                    Rata-rata Kelas Sementara
                  </span>

                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  (N=31 Lengkap)
                </span>

              </div>

              <div className="flex items-center gap-8 font-bold text-slate-900">

                <span className="w-16 text-center">
                  {averages.tugas}
                </span>

                <span className="w-16 text-center">
                  {averages.uts}
                </span>

                <span className="w-16 text-center">
                  {averages.uas}
                </span>

                <span className="w-16 text-center text-indigo-600 font-black text-sm">
                  {averages.final}
                </span>

                <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full">
                  B+
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="text-slate-500 text-[11px]">
                  Ketercapaian CPMK Kurikulum:
                </span>

                <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                  92.4% (Tinggi)
                </span>

              </div>

            </div>

          </div>

          {/* ================= MASS ACTION ================= */}

          <div className="flex items-center justify-between pt-2">

            <div className="flex items-center gap-3">

              <span className="text-xs text-slate-400 font-medium">
                Aksi Massal:
              </span>

              <button
                type="button"
                onClick={() =>
                  notify(
                    `Feedback AI terkirim ke ${
                      selectedIds.length || "semua"
                    } mahasiswa!`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-purple-600" />
                Kirim Feedback AI
              </button>

              <button
                type="button"
                onClick={() =>
                  notify("Nilai berhasil di-reset.")
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                Reset Nilai
              </button>

            </div>

            {/* Pagination */}

            <div className="flex items-center gap-4 text-xs text-slate-500">

              <span>
                Menampilkan <strong>5</strong> dari{" "}
                <strong>32</strong> mahasiswa
              </span>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  onClick={() =>
                    notify("Halaman sebelumnya")
                  }
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-400 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    notify("Kamu berada di halaman 1")
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm"
                >
                  1
                </button>

                <button
                  type="button"
                  onClick={() =>
                    notify("Membuka halaman 2")
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs"
                >
                  2
                </button>

                <button
                  type="button"
                  onClick={() =>
                    notify("Membuka halaman 3")
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs"
                >
                  3
                </button>

                <button
                  type="button"
                  onClick={() =>
                    notify("Halaman berikutnya")
                  }
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>

            </div>

          </div>

        </main>

        {/* ================= FOOTER ================= */}

        <footer className="mt-auto border-t border-slate-200 bg-white px-8 py-3 text-[11px] text-slate-400 flex items-center justify-between">

          <p>
            © 2024-2025 Lembaga Layanan Pendidikan Tinggi
            (LLDIKTI) • Gradia Academic Intelligence
          </p>

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => navigate("/bantuan")}
              className="hover:underline"
            >
              Bantuan Teknis
            </button>

            <span>•</span>

            <button
              type="button"
              onClick={() => navigate("/privasi")}
              className="hover:underline"
            >
              Protokol Privasi
            </button>

            <span>•</span>

            <span className="flex items-center gap-1 text-emerald-600 font-semibold">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>

              SLA 99.98% Available

            </span>

          </div>

        </footer>

      </div>
    </div>
  </AuthGuard>
  );
}

