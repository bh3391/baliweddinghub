import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Memastikan environment variable dari .env terbaca
dotenv.config();

export default defineConfig({
  schema: "./db/schema.ts", // Sesuaikan dengan lokasi file schema Anda
  out: "./drizzle", // Folder untuk menyimpan history migrasi
  dialect: "postgresql", // Kita menggunakan Postgres (Neon)
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
