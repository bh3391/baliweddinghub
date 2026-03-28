import { db } from "../../../../../db";
import { vendorProfile } from "../../../../../db/schema";
import VendorAdminClient from "./AdminVendorsClient";
import { desc } from "drizzle-orm";

export const metadata = {
  title: "Admin | Manage Vendors - Bali Wedding Hub",
};

export default async function AdminVendorPage() {
  // Ambil semua vendor, urutkan dari yang terbaru diupdate
  const allVendors = await db.query.vendorProfile.findMany({
    with: {
      packages: true,
      user: true, // Ambil data paket sekaligus jika ada relasinya
    },
    orderBy: [desc(vendorProfile.updatedAt)],
  });

  return (
    <div className="min-h-screen bg-stone-50/50 p-8">
      <VendorAdminClient initialVendors={allVendors} />
    </div>
  );
}
