import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Font untuk Judul & Kesan Mewah (Luxury Bali Vibes)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// Font untuk Body & Tulisan Detail (Clean & Modern)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bali Wedding Hub | Rencanakan Pernikahan Impianmu",
  description:
    "Platform kalkulator budget dan direktori vendor wedding terbaik di Bali.",
  manifest: "/manifest.json", // Penting untuk PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FDFCFB] font-sans text-stone-900">
        {/* Background halus bertema stone/paper agar tidak terlalu putih polos */}
        <main className="flex-grow">
          {children}
          <Toaster position="top-center" richColors />
        </main>

        {/* Footer Sederhana */}
        <footer className="border-t border-stone-100 py-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Bali Wedding Hub - Karya Lokal Bali
        </footer>
      </body>
    </html>
  );
}
