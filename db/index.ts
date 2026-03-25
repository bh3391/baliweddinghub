// src/db/index.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema"; // IMPORT SEMUA SCHEMA ANDA DI SINI

// Konfigurasi Websocket untuk environment Node.js (Next.js)
// Ini diperlukan agar db.transaction() bisa berjalan di driver neon-serverless
if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = ws;
}

/**
 * Menggunakan Connection Pool untuk efisiensi koneksi ke Neon.
 * Pool mendukung transaksi penuh melalui protokol Websocket.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Inisialisasi Drizzle dengan Schema.
 * Menambahkan { schema } memungkinkan penggunaan:
 * await db.query.tableName.findMany()
 */
export const db = drizzle(pool, { schema });
