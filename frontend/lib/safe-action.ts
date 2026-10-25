import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { cookies } from "next/headers";

/**
 * =========================================================
 * WRAPPER NEXT-SAFE-ACTION (lib/safe-action.ts)
 * Kriteria 4: Memaksa autentikasi di setiap mutasi
 * Pengguna yang belum login ditolak oleh action
 * =========================================================
 */

// 1. Base Safe Action Client dengan Error Handling terpusat
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("[SafeAction Server Error]:", error);
    if (error instanceof Error) {
      return error.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

// 2. Authenticated Action Client: Memaksa autentikasi di setiap mutasi
// Menolak request jika user belum login atau token tidak ditemukan di sesi/cookies
export const authActionClient = actionClient.use(async ({ next }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("gradia_token")?.value;

  if (!token) {
    throw new Error("Akses ditolak: Anda belum login atau sesi telah berakhir. Silakan login terlebih dahulu.");
  }

  return next({
    ctx: {
      token,
    },
  });
});
