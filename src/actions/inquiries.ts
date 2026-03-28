"use server";

import { db } from "../../db";
import { inquiries, planItems } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Get All Inquiries (Untuk Dashboard Admin)
export async function getAllInquiries() {
  return await db.query.inquiries.findMany({
    with: {
      // Kita hanya ambil data user yang perlu saja
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      // Ambil planItems dan join ke vendor
      planItems: {
        with: {
          vendor: {
            columns: {
              id: true,
              businessName: true, // Pastikan nama kolom sesuai di vendor_profile
              category: true,
            },
          },
        },
      },
    },
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
  });
}

// 2. Update Status & PIC (Assign) sekaligus
export async function updateInquiry(
  id: string,
  data: Partial<typeof inquiries.$inferInsert>
) {
  await db
    .update(inquiries)
    .set({
      ...data,
      // updatedAt: new Date() // Jika ada kolom updatedAt
    })
    .where(eq(inquiries.id, id));

  revalidatePath("/dashboard/admin/inquiries");
  return { success: true };
}

export async function updateVendorStatus(
  planItemId: string,
  isCompleted: boolean
) {
  try {
    const newStatus = isCompleted ? "completed" : "pending";

    await db
      .update(planItems)
      .set({
        status: newStatus,
        // Optional: Jika Bapak ada kolom updatedAt di planItems
        // updatedAt: new Date()
      })
      .where(eq(planItems.id, planItemId));

    // Refresh data agar UI di Modal/Table langsung terupdate
    revalidatePath("/dashboard/admin/inquiries");

    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Failed to update vendor status:", error);
    return { error: "Gagal memperbarui status vendor" };
  }
}
