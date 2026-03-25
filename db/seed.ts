import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { user, vendorProfile } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Sedang membersihkan data lama...");
  // Hapus data lama agar tidak duplikat saat testing (Hati-hati di production!)
  await db.delete(vendorProfile);
  await db.delete(user);

  console.log("Menanam data user & vendor...");

  // 1. Buat Akun User (Calon Pengantin)
  const [pengantin] = await db
    .insert(user)
    .values({
      id: "user_01",
      name: "I Gede Putu",
      email: "putu@example.com",
      role: "user",
      phone: "628123456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // 2. Buat Akun-Akun Vendor
  const vendorsData = [
    {
      id: "v_01",
      name: "Ni Luh MUA Bali",
      email: "niluh@muabali.com",
      businessName: "Ni Luh Wedding Makeup",
      category: "MUA",
      basePrice: "3500000",
      location: "Denpasar",
      isVerified: true,
    },
    {
      id: "v_02",
      name: "Wayan Decor",
      email: "wayan@decor.com",
      businessName: "Wayan Klasik Decoration",
      category: "Decor",
      basePrice: "15000000",
      location: "Ubud",
      isRecommended: true,
    },
    {
      id: "v_03",
      name: "Ibu Kadek Banten",
      email: "kadek@banten.com",
      businessName: "Griya Sari Banten",
      category: "Banten",
      basePrice: "5000000",
      location: "Gianyar",
      isVerified: true,
    },
    {
      id: "v_04",
      name: "Agus Photo",
      email: "agus@photo.com",
      businessName: "Agus Lens Photography",
      category: "Documentation",
      basePrice: "7000000",
      location: "Canggu",
      isRecommended: true,
    },
  ];

  for (const v of vendorsData) {
    // Simpan ke tabel user dulu
    const [u] = await db
      .insert(user)
      .values({
        id: v.id,
        name: v.name,
        email: v.email,
        role: "vendor",
        phone: "62877000000",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Lalu simpan ke profil vendor
    await db.insert(vendorProfile).values({
      userId: u.id,
      businessName: v.businessName,
      category: v.category,
      basePrice: v.basePrice,
      location: v.location,
      isVerified: v.isVerified || false,
      isRecommended: v.isRecommended || false,
      description: `Spesialis ${v.category} terbaik di area ${v.location}.`,
    });
  }

  console.log(
    "Seeding selesai! Sekarang database Anda sudah berisi contoh vendor Bali."
  );
}

main().catch((err) => {
  console.error("Seeding gagal:", err);
  process.exit(1);
});
