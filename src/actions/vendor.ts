"use server";

import { db } from "../../db";
import { vendorProfile, user } from "../../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; // 1. Import bcrypt

type ActionResponse = {
  success: boolean;
  error: string | null;
  data?: any;
};

export async function upsertVendor(
  formData: any,
  vendorId?: string
): Promise<ActionResponse> {
  try {
    const result = await db.transaction(async (tx) => {
      let finalUserId = formData.userId;

      // 1. Jika ini Vendor BARU, buat USER-nya dulu
      if (!vendorId) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("bali123456", salt);

        const newUser = await tx
          .insert(user)
          .values({
            id: crypto.randomUUID(),
            name: formData.businessName,
            email: formData.email,
            password: hashedPassword,
            role: "vendor",
            image: formData.images?.[0]?.url || null,
          })
          .returning({ id: user.id });

        if (!newUser[0]) throw new Error("Gagal membuat akun user.");
        finalUserId = newUser[0].id;
      }

      // 2. Generate Slug
      const slug = formData.businessName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      const vendorData = {
        userId: finalUserId,
        businessName: formData.businessName,
        slug: slug,
        category: formData.category,
        basePrice: formData.basePrice.toString(),
        description: formData.description,
        location: formData.location,
        address: formData.address, // Pastikan address juga masuk
        isVerified: formData.isVerified,
        isRecommended: formData.isRecommended,
        images: formData.images || [],
        updatedAt: new Date(),
      };

      if (vendorId) {
        // EDIT MODE
        await tx
          .update(vendorProfile)
          .set(vendorData)
          .where(eq(vendorProfile.id, vendorId));
      } else {
        // ADD MODE
        await tx.insert(vendorProfile).values(vendorData);
      }

      return { success: true, error: null };
    });

    revalidatePath("/admin/vendors");
    return result;
  } catch (error: any) {
    console.error("Vendor Action Error:", error);

    // Cek error email duplikat (Postgres code 23505)
    if (
      error.code === "23505" ||
      error.message?.includes("unique constraint")
    ) {
      return {
        success: false,
        error: "Email sudah terdaftar. Silakan gunakan email lain.",
      };
    }

    return {
      success: false,
      error: error.message || "Gagal menyimpan data vendor.",
    };
  }
}
export async function deleteVendor(userId: string) {
  try {
    // Kita hapus User-nya, maka Profile-nya otomatis terhapus (Cascade)
    await db.delete(user).where(eq(user.id, userId));

    revalidatePath("/admin/vendors");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Gagal menghapus vendor." };
  }
}
