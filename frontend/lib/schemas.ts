import { z } from "zod";
import { zfd } from "zod-form-data";

/**
 * =========================================================
 * SCHEMA ZOD BERSAMA (lib/schemas.ts)
 * Digunakan bersama untuk validasi di Klien dan Server
 * =========================================================
 */

// 1. Skema Validasi Kelas
export const classSchema = zfd.formData({
  code: zfd.text(
    z
      .string()
      .trim()
      .min(1, "Kode mata kuliah wajib diisi.")
      .min(3, "Kode mata kuliah minimal 3 karakter.")
      .max(20, "Kode mata kuliah maksimal 20 karakter.")
  ),
  title: zfd.text(
    z
      .string()
      .trim()
      .min(1, "Nama mata kuliah wajib diisi.")
      .min(3, "Nama mata kuliah minimal 3 karakter.")
      .max(100, "Nama mata kuliah maksimal 100 karakter.")
  ),
  sks: zfd.numeric(
    z
      .number()
      .int("SKS harus bilangan bulat.")
      .min(1, "SKS minimal 1.")
      .max(6, "SKS maksimal 6.")
  ),
  prodi: zfd.text(
    z
      .string()
      .trim()
      .min(2, "Program studi wajib dipilih/diisi.")
  ),
  semester: zfd.numeric(
    z
      .number()
      .int("Semester harus bilangan bulat.")
      .min(1, "Semester minimal 1.")
      .max(8, "Semester maksimal 8.")
  ),
  capacity: zfd.numeric(
    z
      .number()
      .int("Kapasitas harus bilangan bulat.")
      .min(1, "Kapasitas minimal 1 mahasiswa.")
      .max(200, "Kapasitas maksimal 200 mahasiswa.")
  ),
  schedule: zfd.text(
    z
      .string()
      .trim()
      .min(1, "Jadwal kuliah wajib diisi.")
      .min(3, "Jadwal kuliah minimal 3 karakter (contoh: Senin, 08:00 WIB).")
  ),
  room: zfd.text(
    z
      .string()
      .trim()
      .min(1, "Ruangan kuliah wajib diisi.")
      .min(2, "Ruangan kuliah minimal 2 karakter (contoh: Lab Kom 1).")
  ),
});

export type ClassInput = z.infer<typeof classSchema>;

// Helper validasi aman (safeParse) untuk klien dan server
export function validateClassInput(data: unknown) {
  return classSchema.safeParse(data);
}

// 2. Skema Validasi Mahasiswa
export const studentSchema = zfd.formData({
  nim: zfd.text(
    z
      .string()
      .trim()
      .min(1, "NIM wajib diisi.")
      .min(5, "NIM minimal 5 digit/karakter.")
      .max(20, "NIM maksimal 20 digit.")
  ),
  name: zfd.text(
    z
      .string()
      .trim()
      .min(1, "Nama mahasiswa wajib diisi.")
      .min(3, "Nama mahasiswa minimal 3 karakter.")
      .max(100, "Nama mahasiswa maksimal 100 karakter.")
  ),
  email: zfd.text(
    z
      .string()
      .trim()
      .email("Format email mahasiswa tidak valid.")
      .optional()
      .or(z.literal(""))
  ),
  prodi: zfd.text(
    z
      .string()
      .trim()
      .min(2, "Program studi wajib diisi.")
  ),
  status: zfd.text(
    z.enum(["Aktif", "Cuti"]).default("Aktif")
  ),
});

export type StudentInput = z.infer<typeof studentSchema>;

export function validateStudentInput(data: unknown) {
  return studentSchema.safeParse(data);
}
