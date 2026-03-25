import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../../../db";
import PlansClient from "./PlansClient";

export default async function WeddingPlannerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Mengambil data vendor asli dari database
  const vendors = await db.query.vendorProfile.findMany({
    with: {
      user: true, // Jika ingin menampilkan nama owner atau foto profil
      packages: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <header className="mb-10">
        <h1 className="mb-2 font-serif text-4xl text-amber-900">
          Plan Your Wedding
        </h1>
        <p className="font-light text-stone-500 italic">
          Susun simulasi upacara Pawiwahan, dari Banten hingga Babi Guling.
        </p>
      </header>

      {/* Melempar data ke Client Component */}
      <PlansClient initialVendors={vendors} />
    </div>
  );
}
