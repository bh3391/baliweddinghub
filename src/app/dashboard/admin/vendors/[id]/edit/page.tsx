import { db } from "../../../../../../../db";
import { vendorProfile } from "../../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import VendorForm from "@/components/dashboard/VendorForm";

export default async function EditVendorPage({
  params,
}: {
  params: { id: string };
}) {
  // Ambil data vendor beserta data User-nya (untuk email)
  const data = await db.query.vendorProfile.findFirst({
    where: eq(vendorProfile.id, params.id),
    with: {
      user: true,
    },
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <VendorForm initialData={data} />
    </div>
  );
}
