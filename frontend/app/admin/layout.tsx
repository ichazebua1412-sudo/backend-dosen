"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const token = localStorage.getItem("gradia_admin_token");
    const rawAdmin = localStorage.getItem("gradia_admin");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (rawAdmin) {
      try {
        setAdminUser(JSON.parse(rawAdmin));
      } catch (e) {
        // ignore
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("gradia_admin_token");
    localStorage.removeItem("gradia_admin");
    document.cookie = "gradia_admin_token=; path=/; max-age=0;";
    router.push("/admin/login");
  };

  // If login page, render full screen without dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navLinks = [
    {
      title: "Dashboard Admin",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manajemen Dosen",
      href: "/admin/dosen",
      icon: Users,
    },
    {
      title: "Data Kelas Kampus",
      href: "/admin/kelas",
      icon: BookOpen,
    },
    {
      title: "Master Mahasiswa",
      href: "/admin/mahasiswa",
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] text-white flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Gradia Admin
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/40">
                Pusat Kontrol
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || "admin@gradia.ac.id"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              title="Buka Portal Dosen di tab baru"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Portal Dosen</span>
            </a>
            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-red-900/40"
              title="Keluar"
            >
              <LogOut className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Mobile & Tablet */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between lg:hidden shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <span className="font-bold text-slate-900 text-sm">Gradia Admin</span>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-[#0F172A] text-white p-4 space-y-2 border-b border-slate-800">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive ? "bg-indigo-600 text-white" : "text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <a href="/auth/login" className="text-xs text-indigo-300">
                Portal Dosen
              </a>
              <button onClick={handleLogout} className="text-xs text-red-400 font-semibold">
                Keluar
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
