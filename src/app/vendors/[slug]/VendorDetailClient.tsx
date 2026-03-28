"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import {
  MapPin,
  Tag,
  Star,
  Package,
  Check,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Image as ImageIcon, // Alias agar tidak bentrok dengan next/image
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface VendorPackage {
  id: string;
  tier: string;
  packageName: string;
  price: string;
  features: string[] | null;
  description: string | null;
}

interface VendorImage {
  url: string;
  alt?: string;
}

interface VendorProps {
  vendor: {
    id: string;
    businessName: string;
    category: string;
    basePrice: string | null;
    location: string | null;
    description: string | null;
    isVerified: boolean | null;
    isRecommended: boolean | null;
    slug: string;
    images: VendorImage[] | null;
  };
  packages: VendorPackage[];
}

export default function VendorDetailClient({ vendor, packages }: VendorProps) {
  const hasPaid = false;

  // 1. Amankan data images
  const allImages = vendor.images || [];

  // 2. Tentukan Hero Image (Gunakan gambar pertama jika ada)
  const heroImageSrc =
    allImages.length > 0
      ? allImages[0].url
      : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FDFCFB]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-stone-900 pt-40 pb-20 text-white">
        <div className="absolute inset-0 opacity-40 grayscale">
          <Image
            src={heroImageSrc}
            alt={vendor.businessName}
            fill
            priority // Penting untuk LCP
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="mb-6 flex flex-wrap gap-3">
              {vendor.isRecommended && (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-900 px-4 py-1.5 text-[9px] font-bold tracking-widest text-white uppercase">
                  <Star size={10} className="fill-amber-400 text-amber-400" />{" "}
                  Recommended
                </span>
              )}
              {vendor.isVerified && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-900/50 px-4 py-1.5 text-[9px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            <h1 className="mb-8 font-serif text-5xl leading-tight tracking-tighter md:text-7xl">
              {vendor.businessName}
            </h1>
            <div className="flex flex-col gap-6 text-sm font-light text-stone-300 md:flex-row">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-800" />{" "}
                {vendor.location || "Bali"}
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-amber-800" /> Mulai IDR{" "}
                {Number(vendor.basePrice).toLocaleString("id-ID")}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="flex-1 space-y-20">
            {/* Description */}
            <div>
              <h2 className="mb-6 font-serif text-3xl text-stone-900">
                Tentang Vendor
              </h2>
              <p className="leading-relaxed font-light whitespace-pre-line text-stone-600">
                {vendor.description || "Vendor profesional terkurasi di Bali."}
              </p>
            </div>

            {/* GALLERY SECTION - Hanya muncul jika ada lebih dari 1 gambar */}
            {allImages.length > 1 && (
              <div>
                <h2 className="mb-10 flex items-center gap-3 font-serif text-3xl text-stone-900">
                  Galeri Foto <ImageIcon size={24} className="text-amber-600" />
                </h2>

                <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
                  {allImages.map((img, index) => {
                    // Logic Masonry sederhana
                    const isLarge = index === 0;
                    const isWide = index === 3;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className={`relative overflow-hidden rounded-3xl border border-stone-100 ${
                          isLarge
                            ? "col-span-2 row-span-2"
                            : isWide
                              ? "col-span-2"
                              : ""
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || `Gallery ${vendor.businessName}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PACKAGES SECTION */}
            <div>
              <h2 className="mb-10 flex items-center gap-3 font-serif text-3xl text-stone-900">
                Pilihan Paket{" "}
                <Zap size={24} className="fill-amber-600 text-amber-600" />
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packages.length > 0 ? (
                  packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`flex flex-col justify-between rounded-[2.5rem] border p-8 ${
                        pkg.tier === "utama"
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-stone-100 bg-white"
                      }`}
                    >
                      <div>
                        <p className="mb-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                          {pkg.tier}
                        </p>
                        <h3 className="mb-4 font-serif text-2xl text-stone-900">
                          {pkg.packageName}
                        </h3>
                        <p className="mb-8 font-serif text-2xl text-amber-900">
                          IDR {Number(pkg.price).toLocaleString("id-ID")}
                        </p>

                        <ul className="mb-8 space-y-3">
                          {pkg.features?.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm font-light text-stone-600"
                            >
                              <Check
                                size={14}
                                className="mt-1 flex-shrink-0 text-amber-700"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-light text-stone-400 italic">
                    Belum ada paket tersedia.
                  </p>
                )}
              </div>
            </div>

            {/* Managed Box CTA */}
            <div className="flex flex-col items-center gap-8 rounded-[3rem] border border-amber-100 bg-amber-50 p-10 md:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-amber-900 shadow-sm">
                <Package size={28} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-2xl text-stone-900">
                  Ingin Terima Beres?
                </h3>
                <p className="mt-2 text-sm font-light text-stone-500">
                  Bapak Bhakti, biarkan tim kami yang menangani negosiasi dan
                  teknis hari-H.
                </p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-amber-900 uppercase">
                Konsultasi <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[380px]">
            <div className="sticky top-32 rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-xl shadow-stone-900/5">
              <p className="mb-6 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                ingin menghubungi Vendor?
              </p>
              {!hasPaid ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900">
                    <Sparkles
                      size={18}
                      className="fill-amber-600 text-amber-600"
                    />
                    <span className="text-xs font-bold">
                      Penawaran Eksklusif
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed font-light text-stone-500">
                    Dapatkan detail kontak dan perencanaan pernikahan dengan
                    mendaftar melalui website resmi kami.
                  </p>
                  <Link
                    href="/register"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 py-5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-amber-900"
                  >
                    Daftar <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <Link
                  href={`https://wa.me/628...`}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-5 text-[10px] font-bold tracking-widest text-white uppercase"
                >
                  <Phone size={16} fill="white" /> Hubungi WhatsApp
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
