"use client";

import React, {useState, type ChangeEvent, type FormEvent,} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";
import ilutrasiImg from "@/public/image/login.png";



import {ArrowRight,  BarChart3,  Building2,  Clock, Eye, EyeOff, Lock, Mail, ShieldCheck,  Sparkles,  UserCheck,  UserPlus,} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      return;
    }

    router.push("/Dosen/dashboard");
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
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "login"
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Masuk / Login Dosen
              </button>


            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NIDN / Email Kampus */}
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
                    placeholder="hendra@kampus.ac.id"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password / Kata Sandi
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
                    placeholder="secretpassword123"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                  Ingat saya di perangkat ini
                </label>

                <a
                  href="#forgot"
                  className="text-[#4F46E5] font-semibold hover:underline"
                >
                  Lupa password?
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  Masuk ke Portal Dosen
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="w-full py-3 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Masuk dengan Kampus SSO ID
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