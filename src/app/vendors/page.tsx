import { db } from "../../../db"; // Sesuaikan path db Bapak
import { vendorProfile } from "../../../db/schema"; // Sesuaikan path schema
import VendorsClient from "./VendorsClient";

export const metadata = {
  title: "Katalog Vendor | Bali Wedding Hub",
  description:
    "Cari vendor pernikahan terbaik di Bali, mulai dari Venue hingga Banten & Adat.",
};

export default async function VendorsPage() {
  // Fetch data langsung dari database (Server-side)
  const vendors = await db
    .select()
    .from(vendorProfile)
    .orderBy(vendorProfile.createdAt);

  // Kirim data ke Client Component
  return <VendorsClient initialVendors={vendors} />;
}
