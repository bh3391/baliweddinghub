// src/app/vendors/[slug]/page.tsx
import { db } from "../../../../db";
import { vendorProfile, vendorPackages } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import VendorDetailClient from "./VendorDetailClient";

// 1. Perbaiki Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // <--- WAJIB DI-AWAIT

  const vendor = await db
    .select()
    .from(vendorProfile)
    .where(eq(vendorProfile.slug, slug))
    .limit(1)
    .then((res) => res[0]);

  if (!vendor) return { title: "Vendor Not Found" };

  return {
    title: `${vendor.businessName} | Bali Wedding Hub`,
    description: vendor.description,
  };
}

// 2. Perbaiki Page Component
export default async function VendorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Ambil Data Vendor
  const vendor = await db
    .select()
    .from(vendorProfile)
    .where(eq(vendorProfile.slug, slug))
    .limit(1)
    .then((res) => res[0]);

  if (!vendor) notFound();

  // 2. Ambil Data Paket milik Vendor ini
  const packages = await db
    .select()
    .from(vendorPackages)
    .where(eq(vendorPackages.vendorId, vendor.id))
    .orderBy(vendorPackages.price); // Urutkan dari harga terendah

  return <VendorDetailClient vendor={vendor} packages={packages} />;
}
