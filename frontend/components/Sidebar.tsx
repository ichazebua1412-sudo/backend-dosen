"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoImg from "@/public/image/logo.png";
import {
  LayoutDashboard,
  Layers,
  UserPlus,
  FileEdit,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  Printer,
  User,
  ShieldCheck,
  BookOpen,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  currentPath?: string;
}

export default function Sidebar({ currentPath = "/Dosen/dashboard" }: SidebarProps) {
  const router = useRouter();
  const [lecturer, setLecturer] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gradia_lecturer");
      if (stored) {
        try {
          setLecturer(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gradia_token");
      localStorage.removeItem("gradia_lecturer");
      document.cookie = "gradia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    router.push("/auth/login");
  };

  const menuGroups = [
    {
      group: "UTAMA",
      items: [
        {
          label: "Dashboard",
          href: "/Dosen/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Manajemen Data Kelas",
          href: "/Dosen/manajemenkelas",
          icon: Layers,
        },
        {
          label: "Tambah Kelas & Mahasiswa",
          href: "/Dosen/tambahkelas",
          icon: UserPlus,
        },
      ],
    },
    {
      group: "PENILAIAN & EVALUASI",
      items: [
        {
          label: "Input Rekap Nilai",
          href: "/Dosen/inputnilai",
          icon: FileEdit,
        },
        {
          label: "Import Nilai Excel",
          href: "/Dosen/importnilai",
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      group: "KECERDASAN BUATAN & LAPORAN",
      items: [
        {
          label: "Analitik & AI Feedback",
          href: "/Dosen/analitikAI",
          icon: BarChart3,
        },
        {
          label: "Generate AI Feedback",
          href: "/Dosen/generateAI",
          icon: Sparkles,
          badge: "Baru",
        },
        {
          label: "Cetak PDF & Laporan",
          href: "/Dosen/cetakPDF",
          icon: Printer,
        },
      ],
    },
    {
      group: "PENGATURAN AKUN",
      items: [
        {
          label: "Kelola Profil",
          href: "/Dosen/profil",
          icon: User,
        },
        {
          label: "Keamanan & Akun",
          href: "/Dosen/keamanan",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 p-4 sticky top-0 h-screen overflow-y-auto z-20">
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Link href="/Dosen/dashboard" className="flex items-center gap-3">
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
              <h1 className="font-bold text-sm text-slate-900 leading-none">Gradia</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Portal Dosen</p>
            </div>
          </Link>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.5 rounded">
            v2.4
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.group}>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentPath.toLowerCase() === item.href.toLowerCase();

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-blue-600" : "text-slate-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        <div className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
            {lecturer?.name?.[0] || lecturer?.fullName?.[0] || "D"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 text-xs truncate leading-none">
              {lecturer?.fullName || lecturer?.name || "Dosen Pengampu"}
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {lecturer?.nidn ? `NIDN: ${lecturer.nidn}` : "Akademik Aktif"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
