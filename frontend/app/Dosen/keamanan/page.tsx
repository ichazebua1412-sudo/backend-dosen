"use client";

import React, { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { apiFetch } from "@/lib/api";
import { Key, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";

export default function KeamananAkunPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setToastMsg("Semua kolom kata sandi wajib diisi.");
      setIsError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMsg("Konfirmasi kata sandi baru tidak cocok.");
      setIsError(true);
      return;
    }
    setIsSubmitting(true);
    try {
      await apiFetch("/lecturer/password", {
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setToastMsg("Kata sandi berhasil diperbarui dengan aman.");
      setIsError(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setToastMsg(err.message || "Gagal memperbarui kata sandi.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans text-xs overflow-hidden">
        <Sidebar currentPath="/Dosen/keamanan" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header breadcrumbs={["Portal", "Pengaturan Akun", "Keamanan & Akun"]} />

          <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Keamanan & Akun Dosen</h1>
              <p className="text-slate-500 text-xs mt-1">
                Kelola kata sandi, otentikasi dua langkah, dan proteksi akun akademik Anda.
              </p>
            </div>

            {toastMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  isError
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>{toastMsg}</span>
              </div>
            )}

            {/* FORM GANTI PASSWORD */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <Key className="w-4 h-4 text-indigo-600" />
                <h2 className="font-bold text-sm text-slate-900">Perbarui Kata Sandi</h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Saat Ini
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter kombinasi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
                >
                  Simpan Kata Sandi Baru
                </button>
              </form>
            </div>

            {/* 2FA SECTION */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">Verifikasi Dua Langkah (2FA)</h3>
                    <p className="text-[11px] text-slate-500">
                      Tingkatkan keamanan akun dengan kode verifikasi OTP saat masuk.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    twoFactor
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {twoFactor ? "Aktif" : "Non-Aktif"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
