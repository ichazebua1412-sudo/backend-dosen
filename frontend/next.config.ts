import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/dashboard", destination: "/Dosen/dashboard" },
      { source: "/Dosen/Dashboard", destination: "/Dosen/dashboard" },
      { source: "/dashboard/export-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/dashboard/input-nilai", destination: "/Dosen/inputnilai" },
      { source: "/dashboard/ai-feedback", destination: "/Dosen/analitikAI" },
      { source: "/dashboard/profil", destination: "/Dosen/profil" },
      { source: "/kelas", destination: "/Dosen/manajemenkelas" },
      { source: "/tambah-kelas", destination: "/Dosen/tambahkelas" },
      { source: "/input-nilai", destination: "/Dosen/inputnilai" },
      { source: "/import-nilai", destination: "/Dosen/importnilai" },
      { source: "/import-excel", destination: "/Dosen/importnilai" },
      { source: "/analitik-ai", destination: "/Dosen/analitikAI" },
      { source: "/Dosen/analitik-AI", destination: "/Dosen/analitikAI" },
      { source: "/generate-ai", destination: "/Dosen/generateAI" },
      { source: "/cetak-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/export-laporan", destination: "/Dosen/cetakPDF" },
      { source: "/kelola-profil", destination: "/Dosen/profil" },
      { source: "/keamanan", destination: "/Dosen/keamanan" },
      { source: "/panduan", destination: "/Dosen/dashboard" },
    ];
  },
};

export default nextConfig;

