"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/public/Navbar";
import settings from "@/data/settings.json";
import { Search, Star, ArrowRight, MapPin } from "lucide-react";
import Footer from "../../components/public/Footer";
import Link from "next/link";
import Image from "next/image"; // Tambahkan import Image

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  basePrice: string | null;
  location: string | null;
  isRecommended: boolean | null;
  slug: string;
  images: { url: string; alt?: string }[] | null; // Tambahkan field images
}

export default function VendorsClient({
  initialVendors,
}: {
  initialVendors: Vendor[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = useMemo(() => {
    return initialVendors.filter((vendor) => {
      const matchesCategory =
        selectedCategory === "Semua" || vendor.category === selectedCategory;
      const matchesSearch = vendor.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, initialVendors]);

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      {/* Header (Sama) */}
      <section className="bg-stone-900 pt-32 pb-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 font-serif text-4xl md:text-6xl"
          >
            Koleksi Vendor Pilihan
          </motion.h1>
          <p className="mx-auto max-w-xl font-light text-stone-400 italic">
            Dikurasi manual untuk kesakralan hari bahagia Anda di Bali.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar (Sama) */}
      <section className="sticky top-[72px] z-30 border-b border-stone-100 bg-white/90 py-4 backdrop-blur-md">
        {/* ... (isi filter tetap sama) ... */}
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto md:w-auto">
            {settings.vendor_categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-5 py-2 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase transition-all ${
                  selectedCategory === cat
                    ? "border-amber-900 bg-amber-900 text-white shadow-lg"
                    : "border-stone-100 bg-white text-stone-400 hover:border-amber-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Cari nama vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-stone-100 bg-stone-50 py-3 pr-4 pl-10 text-xs outline-none focus:border-amber-200"
            />
            <Search
              size={14}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
            />
          </div>
        </div>
      </section>

      {/* Grid Vendors */}
      <section className="container mx-auto min-h-[400px] px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredVendors.map((vendor) => {
              // Ambil gambar pertama sebagai thumbnail
              const thumbnail =
                vendor.images && vendor.images.length > 0
                  ? vendor.images[0].url
                  : null;

              return (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="group block cursor-pointer"
                  >
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-stone-100 bg-stone-100 shadow-sm">
                      {/* Tampilkan Gambar Jika Ada */}
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={vendor.businessName}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-widest text-stone-400 uppercase italic">
                          No Image Available
                        </div>
                      )}

                      {/* Overlay Gradient (Selalu tampil agar teks putih terbaca) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-80" />

                      {vendor.isRecommended && (
                        <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 rounded-full bg-amber-900 px-4 py-1.5 text-[8px] font-bold tracking-widest text-white uppercase shadow-lg shadow-amber-900/20">
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />{" "}
                          Recommended
                        </div>
                      )}

                      <div className="absolute bottom-8 left-8 z-10 text-white">
                        <p className="mb-2 text-[9px] font-bold tracking-[0.2em] uppercase opacity-70">
                          {vendor.category}
                        </p>
                        <h3 className="font-serif text-3xl leading-tight">
                          {vendor.businessName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                          <MapPin size={12} className="text-amber-800" />{" "}
                          {vendor.location}
                        </div>
                        <p className="font-serif text-xl text-amber-900">
                          IDR {Number(vendor.basePrice).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-stone-100 bg-white text-stone-400 shadow-sm transition-all group-hover:border-stone-900 group-hover:bg-stone-900 group-hover:text-white group-hover:shadow-lg">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredVendors.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-xl text-stone-400 italic">
              Tidak ada vendor ditemukan di kategori ini.
            </p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
