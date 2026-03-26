// src/app/dashboard/user/inquiries/page.tsx
import { auth } from "@/lib/auth";
import { db } from "../../../../../db";
import { inquiries, planItems, vendorProfile } from "../../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import InquiryClient from "./InquiryClient";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function InquiryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // 1. Ambil semua inquiry milik user
  const userInquiries = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.userId, session.user.id))
    .orderBy(desc(inquiries.createdAt));

  // 2. Hydrate setiap inquiry dengan data dari tabel planItems & vendorProfile
  const formattedInquiries = await Promise.all(
    userInquiries.map(async (inq) => {
      // Query JOIN: Mengambil item rencana + profil vendornya
      const items = await db
        .select({
          id: planItems.id,
          category: planItems.category,
          priceAtTime: planItems.priceAtTime,
          // Ambil data profil dari vendor_profile
          businessName: vendorProfile.businessName,
          // Kita butuh phone number untuk tombol WA nanti
          // Note: Pastikan di tabel vendor_profile ada field phoneNumber atau tambahkan ke schema jika belum ada
        })
        .from(planItems)
        .leftJoin(vendorProfile, eq(planItems.vendorId, vendorProfile.id))
        .where(eq(planItems.planId, inq.id));

      return {
        ...inq,
        totalEstimate: Number(inq.totalEstimate),
        platformFee: Number(inq.platformFee),
        // Kita kirimkan hasil join tadi sebagai planItems
        planItems: items.map((item) => ({
          ...item,
          // Fallback jika data vendor tidak ditemukan
          businessName: item.businessName || "Vendor belum terdaftar",
          // Untuk WA, sementara pakai hardcode atau ambil dari profil user vendor
          phoneNumber: "628123456789", // Nanti kita sesuaikan dengan field phone asli
        })),
        itemsCount: items.length,
      };
    })
  );

  return (
    <div className="min-h-screen bg-stone-50/50 p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="font-serif text-3xl tracking-tight text-stone-900">
            Update Inquiry Saya
          </h1>
          <p className="text-sm text-stone-500 italic">
            Kelola inquiry dan akses vendor pernikahan Anda
          </p>
        </header>

        <InquiryClient initialData={formattedInquiries} />
      </div>
    </div>
  );
}
