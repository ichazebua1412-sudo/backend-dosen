"use client";

import React, { useEffect, useState } from "react";

interface HeaderProps {
  breadcrumbs?: string[];
}

export default function Header({
  breadcrumbs = ["Portal", "Sistem Akademik", "Dashboard Dosen"],
}: HeaderProps) {
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

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span>&rsaquo;</span>}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? "text-slate-700 font-semibold"
                  : "hover:text-slate-600 transition"
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Stats & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3 py-1 rounded-full text-slate-600 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">Semester Ganjil 2024/2025</span>
        </div>
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="text-right">
            <p className="font-bold text-slate-800 text-xs leading-none">
              {lecturer?.fullName || lecturer?.name || "Dosen Pengampu"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              NIDN: {lecturer?.nidn || "—"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
            {lecturer?.name?.[0] || lecturer?.fullName?.[0] || "D"}
          </div>
        </div>
      </div>
    </header>
  );
}
