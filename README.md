# Gradia - Portal Dosen & Manajemen Kelas

Aplikasi Manajemen Kelas Dosen OBE terintegrasi dengan validasi Zod bersama, Server Actions Next.js, update optimistik, dan Backend Express.js dengan SQLite.

---

## 🚀 Panduan Menjalankan Proyek (Urutan Wajib)

Agar aplikasi berjalan lancar, **jalankan Backend terlebih dahulu**, baru kemudian Frontend.

### 1. Jalankan Backend Terlebih Dahulu (Terminal 1)
Buka terminal pertama:
```bash
cd Backend
npm install
npm run dev
```
> Server backend Express akan aktif di: `http://localhost:5000`  
> Database SQLite (`gradia.db`) otomatis diinisialisasi beserta data akun dosen pengujian.

---

### 2. Jalankan Frontend (Terminal 2)
Buka terminal kedua (jangan tutup terminal backend):
```bash
cd frontend
npm install
npm run dev
```
> Aplikasi frontend Next.js akan aktif di: `http://localhost:3000`

---

## 🔑 Akun Login Dosen untuk Pengujian

Gunakan kredensial yang telah tersedia di database untuk login di halaman `/auth/login`:
* **NIDN**: `0412068201`
* **Password**: `password123`
*(Atau gunakan tombol daftar untuk membuat akun baru)*

---

## 📦 Fitur Pertemuan 10 (CRUD Form dengan Schema Bersama)
1. **Schema Zod Bersama**: Tersedia di `frontend/lib/schemas.ts` dan `Backend/src/schemas.ts` untuk validasi form kelas dan mahasiswa.
2. **Server Action & Error per Field**: Menggunakan `next-safe-action` (`createClassAction`) dan hook React 19 `useActionState` sehingga pesan error validasi muncul tepat di bawah input field yang salah.
3. **Update Optimistik**: Menggunakan `useOptimistic` pada halaman Manajemen Kelas, sehingga data kelas baru langsung muncul seketika di daftar sebelum digantikan secara permanen oleh respons server.
4. **Wrapper next-safe-action**: Memastikan autentikasi aktif pada setiap mutasi data (pengguna yang belum login ditolak).
