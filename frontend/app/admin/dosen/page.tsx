"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Phone,
  Building,
  X,
  RefreshCw
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminDosenPage() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);

  // Add form state
  const [formData, setFormData] = useState({
    nidn: "",
    name: "",
    email: "",
    password: "",
    titlePrefix: "Dr. ",
    titleSuffix: "M.Kom.",
    phone: "",
    officeRoom: "",
    consultHours: "Senin & Rabu, 13:00 - 15:00",
  });

  // Reset password form state
  const [newPassword, setNewPassword] = useState("");

  const fetchLecturers = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await apiFetch("/admin/lecturers");
      setLecturers(res.lecturers || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memuat data dosen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (!formData.nidn || !formData.name || !formData.email) {
        setErrorMsg("NIDN, Nama Lengkap, dan Email wajib diisi.");
        return;
      }

      const res = await apiFetch("/admin/lecturers", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccessMsg(
        `Berhasil membuat akun dosen: ${formData.name}. Kata sandi awal: ${formData.password || "DosenGradia123!"}`
      );
      setIsAddModalOpen(false);
      setFormData({
        nidn: "",
        name: "",
        email: "",
        password: "",
        titlePrefix: "",
        titleSuffix: "",
        phone: "",
        officeRoom: "",
        consultHours: "",
      });
      fetchLecturers();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menambahkan dosen.");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await apiFetch(`/admin/lecturers/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setSuccessMsg(`Status dosen berhasil diubah menjadi ${newStatus}.`);
      fetchLecturers();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengubah status dosen.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }

    try {
      await apiFetch(`/admin/lecturers/${selectedLecturer.id}`, {
        method: "PUT",
        body: JSON.stringify({ newPassword }),
      });
      setSuccessMsg(`Password dosen ${selectedLecturer.name} berhasil direset.`);
      setIsResetModalOpen(false);
      setNewPassword("");
      setSelectedLecturer(null);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mereset password.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus akun dosen "${name}"? Seluruh kelas dan nilai terkait akan ikut terhapus.`)) {
      return;
    }

    try {
      await apiFetch(`/admin/lecturers/${id}`, { method: "DELETE" });
      setSuccessMsg(`Akun dosen "${name}" berhasil dihapus.`);
      fetchLecturers();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghapus dosen.");
    }
  };

  const filteredLecturers = lecturers.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nidn.includes(searchTerm) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Manajemen Pengguna Resmi
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Dosen Terdaftar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat dan kelola akun dosen yang memiliki hak akses resmi ke Portal Dosen Gradia
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLecturers}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setErrorMsg("");
              setSuccessMsg("");
              setIsAddModalOpen(true);
            }}
            className="py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Akun Dosen
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan Nama Dosen, NIDN, atau Email..."
          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Lecturer Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Dosen & Identitas</th>
                <th className="py-4 px-4">Kontak & Ruangan</th>
                <th className="py-4 px-4 text-center">Kelas Diampu</th>
                <th className="py-4 px-4 text-center">Status Akses</th>
                <th className="py-4 px-6 text-right">Aksi Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Memuat data dosen dari database...
                  </td>
                </tr>
              ) : filteredLecturers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada data dosen yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredLecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Dosen & NIDN */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {lecturer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">
                            {lecturer.title_prefix ? `${lecturer.title_prefix} ` : ""}
                            {lecturer.name}
                            {lecturer.title_suffix ? `, ${lecturer.title_suffix}` : ""}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] text-slate-500 font-semibold">
                              NIDN: {lecturer.nidn}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500">{lecturer.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kontak & Ruang */}
                    <td className="py-4 px-4">
                      <p className="text-slate-700 font-medium">
                        {lecturer.office_room || "Belum diisi"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {lecturer.phone || "No HP belum ada"}
                      </p>
                    </td>

                    {/* Jumlah Kelas */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">
                        {lecturer.class_count} Kelas
                      </span>
                    </td>

                    {/* Status Akses */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(lecturer.id, lecturer.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          lecturer.status === "inactive"
                            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title="Klik untuk ubah status aktif/nonaktif"
                      >
                        {lecturer.status === "inactive" ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Nonaktif (Diblokir)
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktif
                          </>
                        )}
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLecturer(lecturer);
                            setIsResetModalOpen(true);
                          }}
                          className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-colors"
                          title="Reset Password Dosen"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lecturer.id, lecturer.name)}
                          className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-colors"
                          title="Hapus Akun Dosen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TAMBAH DOSEN RESMI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Terbitkan Akun Dosen</h3>
                  <p className="text-xs text-slate-400">Input dosen resmi kampus untuk akses Gradia</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Depan
                  </label>
                  <input
                    type="text"
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    placeholder="Contoh: Dr. Ir."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Belakang
                  </label>
                  <input
                    type="text"
                    value={formData.titleSuffix}
                    onChange={(e) => setFormData({ ...formData, titleSuffix: e.target.value })}
                    placeholder="Contoh: M.Kom., Ph.D"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Dosen *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama tanpa gelar, contoh: Hendra Kusuma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIDN Dosen *
                  </label>
                  <input
                    type="text"
                    value={formData.nidn}
                    onChange={(e) => setFormData({ ...formData, nidn: e.target.value })}
                    placeholder="10 Digit NIDN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Kampus *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dosen@kampus.ac.id"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Awal
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kosongkan jika ingin default: DosenGradia123!"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Dosen dapat mengubah sandi ini secara mandiri di halaman profil keamanan mereka.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ruang Kerja / Kantor
                  </label>
                  <input
                    type="text"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    placeholder="Gedung F, R. 302"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Terbitkan Akun Dosen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {isResetModalOpen && selectedLecturer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Reset Password Dosen</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[220px]">
                    {selectedLecturer.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Baru *
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
