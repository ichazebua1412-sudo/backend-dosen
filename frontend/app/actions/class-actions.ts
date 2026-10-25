"use server";

import { authActionClient } from "@/lib/safe-action";
import { classSchema, type ClassInput } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * =========================================================
 * SERVER ACTION: createClassAction
 * Kriteria 2: safeParse di server, tampil lewat useActionState
 * Kriteria 4: Wrapper next-safe-action memaksa autentikasi
 * =========================================================
 */
export const createClassAction = authActionClient
  .inputSchema(classSchema)
  .stateAction(async ({ parsedInput, ctx }) => {
    // parsedInput telah divalidasi dengan aman melalui Zod safeParse di server!
    const response = await fetch(`${BACKEND_API_URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.token}`,
      },
      body: JSON.stringify({
        title: parsedInput.title,
        code: parsedInput.code,
        sks: parsedInput.sks,
        prodi: parsedInput.prodi,
        semester: parsedInput.semester,
        capacity: parsedInput.capacity,
        schedule: parsedInput.schedule,
        room: parsedInput.room,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Gagal menyimpan data kelas ke database.");
    }

    // Revalidasi cache halaman Next.js
    revalidatePath("/Dosen/manajemenkelas");
    revalidatePath("/Dosen/tambahkelas");

    return {
      success: true,
      message: "Kelas berhasil dibuat dan tersimpan di database!",
      classId: data.classId,
      createdClass: {
        id: String(data.classId || Date.now()),
        title: parsedInput.title,
        code: parsedInput.code,
        sks: `${parsedInput.sks} SKS`,
        prodi: parsedInput.prodi,
        semester: parsedInput.semester,
        tag: "Kelas Baru",
        tagType: "active" as const,
        academicYear: "2024/2025 Ganjil",
        capacity: `${parsedInput.capacity} Mhs`,
        schedule: parsedInput.schedule,
        room: parsedInput.room,
        progressPercent: 0,
        progressLabel: "Rekap Nilai",
        progressSubtext: "0 Mahasiswa Terdaftar",
        note: "Kelas baru berhasil dibuat.",
        icon: "code",
        accentColor: "indigo",
        actionBtn: "Input Nilai",
        btnVariant: "indigo" as const,
      },
    };
  });
