"use server";

import { db } from "../../db";
import { inquiries, planItems } from "../../db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, count, desc, and } from "drizzle-orm";

export async function getVendorsWithPackages() {
  return await db.query.vendorProfile.findMany({
    with: {
      packages: true, // Mengambil relasi vendorPackages
    },
  });
}

export async function saveWeddingPlan(
  selectedItems: Record<string, any>, // Sekarang berisi data paket { vendorId, packageId, price, category }
  planName: string,
  ceremonyDate: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Silakan login terlebih dahulu");

    const userId = session.user.id;

    // Validasi kuota tetap sama
    const userPlans = await db
      .select({ value: count() })
      .from(inquiries)
      .where(eq(inquiries.userId, userId));
    if (userPlans[0].value >= 3)
      throw new Error("Batas maksimal rencana tercapai (Maks 3).");

    // Hitung total berdasarkan harga paket yang dipilih
    const totalCalc = Object.values(selectedItems).reduce((acc, item) => {
      const price = parseFloat(item.price) || 0; // Menggunakan item.price (harga paket)
      return acc + price;
    }, 0);

    return await db.transaction(async (tx) => {
      const [newInquiry] = await tx
        .insert(inquiries)
        .values({
          userId: userId,
          status: "draft",
          totalEstimate: totalCalc.toString(),
          ceremonyDate: ceremonyDate,
          planName: planName,
        })
        .returning({ id: inquiries.id });

      const itemsToInsert = Object.values(selectedItems).map((item) => ({
        planId: newInquiry.id,
        vendorId: item.vendorId,
        packageId: item.packageId, // Menyimpan ID Paket (Alit/Madya/Utama)
        category: item.category,
        priceAtTime: item.price.toString(),
      }));

      if (itemsToInsert.length > 0) {
        await tx.insert(planItems).values(itemsToInsert);
      }

      // --- LEADS TRACKING LOGIC (Simple) ---
      console.log(`[LEAD] User ${userId} melakukan simulasi: ${planName}`);

      revalidatePath("/dashboard/user/plans");
      return { success: true, message: "Rencana berhasil disimpan!" };
    });
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUserPlans() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return await db.query.inquiries.findMany({
    where: eq(inquiries.userId, session.user.id),
    orderBy: [desc(inquiries.createdAt)],
    with: {
      planItems: {
        with: {
          vendor: true,
          package: true, // Pastikan paket juga ikut terambil untuk ditampilkan di UI
        },
      },
    },
  });
}

export async function deletePlan(planId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Silakan login terlebih dahulu");

    // Gunakan transaksi untuk memastikan kedua tabel terhapus dengan bersih
    return await db.transaction(async (tx) => {
      // 1. Hapus detail item vendor terlebih dahulu
      await tx.delete(planItems).where(eq(planItems.planId, planId));

      // 2. Hapus header rencana (Pastikan milik user yang sedang login)
      const deleted = await tx
        .delete(inquiries)
        .where(
          and(eq(inquiries.id, planId), eq(inquiries.userId, session.user.id))
        )
        .returning();

      if (deleted.length === 0) {
        throw new Error(
          "Rencana tidak ditemukan atau Anda tidak memiliki akses."
        );
      }

      revalidatePath("/dashboard/user/my-plans");
      return { success: true, message: "Rencana pernikahan berhasil dihapus." };
    });
  } catch (error: any) {
    console.error("Gagal menghapus:", error.message);
    return { success: false, message: error.message };
  }
}
export async function processInquiry(
  planId: string,
  serviceType: "self_service" | "managed_wo"
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Silakan login terlebih dahulu");

    const updated = await db
      .update(inquiries)
      .set({
        status: "on-process",
        serviceType: serviceType, // Menyimpan pilihan 'Karya Mandiri' atau 'Karya Pandu'
      })
      .where(
        and(eq(inquiries.id, planId), eq(inquiries.userId, session.user.id))
      )
      .returning();

    if (updated.length === 0) throw new Error("Rencana tidak ditemukan.");

    revalidatePath("/dashboard/user/my-plans");
    return {
      success: true,
      message:
        serviceType === "managed_wo"
          ? "Inquiry dikirim! Tim WO kami akan segera menghubungi Anda."
          : "Inquiry berhasil! Silakan hubungi vendor secara mandiri.",
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
