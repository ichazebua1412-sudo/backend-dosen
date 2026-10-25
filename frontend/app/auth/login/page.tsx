"use client";

import React, {useState, type ChangeEvent, type FormEvent,} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import ilutrasiImg from "@/public/image/login.png";



import {ArrowRight,  BarChart3,  Building2,  Clock, Eye, EyeOff, Lock, Mail, ShieldCheck,  Sparkles,  UserCheck,  UserPlus,} from "lucide-react";

import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    name: "",
    nidn: "",
    email: "",
    titlePrefix: "Dr. Ir.",
    titleSuffix: "M.T.",
    rememberMe: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (activeTab === "register") {
        if (!formData.name || !formData.nidn || !formData.email || !formData.password) {
          setErrorMsg("Semua kolom berbintang wajib diisi.");
          setIsLoading(false);
          return;
        }

        const res = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            nidn: formData.nidn,
            email: formData.email,
            password: formData.password,
            titlePrefix: formData.titlePrefix,
            titleSuffix: formData.titleSuffix,
          }),
        });

        localStorage.setItem("gradia_token", res.token);
        localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer));
        router.push("/Dosen/dashboard");
      } else {
        if (!formData.identifier || !formData.password) {
          setErrorMsg("NIDN/Email dan password wajib diisi.");
          setIsLoading(false);
          return;
        }

        const res = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password,
          }),
        });

        localStorage.setItem("gradia_token", res.token);
        localStorage.setItem("gradia_lecturer", JSON.stringify(res.lecturer));
        router.push("/Dosen/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memproses permintaan Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* BAGIAN KIRI: FORM LOGIN */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm overflow-hidden">
                <Image
                  src="/image/logo.png"
                  alt=""
                  width={50}
                  height={50}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                  Gradia
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Sistem Informasi Akademik
                </p>
              </div>
            </div>

            {/* Judul & Deskripsi */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Selamat Datang!
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Masuk ke akun Anda untuk mengakses sistem informasi akademik terintegrasi.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="bg-[#F1F5F9] p-1.5 rounded-2xl flex gap-1 mb-6">
              {/* LOGIN */}
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "login"
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Masuk / Login Dosen
              </button>

              {/* REGISTER */}
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "register"
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Daftar Akun Baru
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {activeTab === "register" ? (
                <>
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Contoh: Hendra"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* NIDN */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        NIDN *
                      </label>
                      <input
                        type="text"
                        name="nidn"
                        value={formData.nidn}
                        onChange={handleChange}
                        placeholder="Contoh: 0412068201"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                        required
                      />
                    </div>

                    {/* Email Kampus */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Kampus *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hendra@kampus.ac.id"
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* NIDN / Email Kampus Login */
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    NIDN / Email Kampus
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>

                    <input
                      id="identifier"
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Masukkan NIDN atau Email Anda"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password / Kata Sandi *
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-indigo-300 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
                  ) : activeTab === "register" ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Daftar Akun Dosen Baru
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Masuk ke Portal Dosen
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Bantuan */}
          <div className="pt-8 text-xs text-slate-400 flex items-center gap-3 border-t border-slate-100 mt-6 font-medium">
            <a href="#bantuan" className="hover:text-slate-600">
              Bantuan Teknis
            </a>
            <span>•</span>
            <a href="#privasi" className="hover:text-slate-600">
              Protokol Privasi
            </a>
          </div>
        </div>

        {/* BAGIAN KANAN: INFORMASI AI & ILUSTRASI*/}
        <div className="lg:col-span-6 bg-[#F8FAFC] p-8 md:p-10 flex flex-col justify-between border-l border-slate-100">
          
          {/* Badge Atas */}
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-emerald-100 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full " />
              Mendukung Transformasi Digital Pendidikan
            </div>
          </div>

          {/* Container Gambar Ilustrasi */}
          <div className="my-6">
            <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <Image
                src="/image/login.png"
                alt="Gradia"
                width={800}
                height={450}
                className="w-full h-auto object-cover rounded-2xl border-slate-200/80  "
                priority
              />
            </div>

            {/* Deskripsi Fitur */}
            <div className="mt-8 text-left">
              <h3 className="text-xl font-bold text-[#4F46E5] leading-snug">
                Sistem Informasi Akademik Terintegrasi & AI Feedback Engine
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mt-3 text-justify hyphens-auto [text-justify:inter-word]">
                Sistem yang dirancang untuk mengelola berbagai aktivitas
                akademik, seperti data mahasiswa, kelas, nilai, dan laporan
                pembelajaran dalam satu platform yang terhubung. Sistem ini
                dilengkapi dengan teknologi kecerdasan buatan (AI) yang mampu
                memberikan umpan balik, analisis, dan rekomendasi secara
                otomatis berdasarkan data akademik, sehingga dapat membantu
                dosen dan mahasiswa meningkatkan efektivitas proses belajar
                mengajar.
              </p>
            </div>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Terintegrasi */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Terintegrasi
              </p>
              <p className="text-[10px] text-slate-400">
                Semua data akademik
              </p>
            </div>

            {/* AI Feedback */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                AI Feedback
              </p>
              <p className="text-[10px] text-slate-400">
                Analisis berbasis data
              </p>
            </div>

            {/* Lebih Efisien */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Lebih Efisien
              </p>
              <p className="text-[10px] text-slate-400">
                Pangkas waktu proses
              </p>
            </div>

            {/* Aman */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Aman
              </p>
              <p className="text-[10px] text-slate-400">
                Standar keamanan
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}