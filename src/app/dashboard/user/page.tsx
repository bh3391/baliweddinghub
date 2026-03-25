"use client";

import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Wallet,
  Heart,
  ArrowRight,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Data dummy untuk tampilan awal
  const stats = [
    {
      name: "Sisa Hari",
      value: "124 Hari",
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      name: "Estimasi Budget",
      value: "Rp 150jt",
      icon: Wallet,
      color: "text-emerald-600",
    },
    {
      name: "Vendor Terpilih",
      value: "12 Vendor",
      icon: Heart,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <header>
        <h1 className="font-serif text-3xl text-amber-900">
          Selamat Datang, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 font-light text-stone-500 italic">
          Mari susun momen tak terlupakan di Pulau Dewata.
        </p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-xl bg-stone-50 p-3 ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs tracking-wider text-stone-400 uppercase">
                  {item.name}
                </p>
                <p className="text-xl font-semibold text-stone-800">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Vendors Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-amber-900 text-stone-800">
            Rekomendasi Vendor Teratas
          </h2>
          <Link
            href="/dashboard/user/vendors"
            className="flex items-center gap-1 text-sm font-medium text-amber-800 hover:underline"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contoh Card Vendor 1 */}
          <div className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all hover:shadow-xl">
            <div className="relative h-48 bg-stone-200">
              {/* Placeholder Gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.9
                (120 Review)
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h3 className="font-semibold text-stone-800 transition-colors group-hover:text-amber-800">
                  The Royal Uluwatu Venue
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                  <MapPin className="h-3 w-3" /> Uluwatu, Bali
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-stone-50 pt-2">
                <span className="text-xs text-stone-500">Mulai dari</span>
                <span className="font-bold text-amber-900">Rp 45.000.000</span>
              </div>
            </div>
          </div>

          {/* Contoh Card Vendor 2 */}
          <div className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all hover:shadow-xl">
            <div className="relative h-48 bg-stone-300">
              <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-xs text-white backdrop-blur-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 5.0
                (85 Review)
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h3 className="font-semibold text-stone-800 transition-colors group-hover:text-amber-800">
                  Bali Bloom Florals
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                  <MapPin className="h-3 w-3" /> Seminyak, Bali
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-stone-50 pt-2">
                <span className="text-xs text-stone-500">Mulai dari</span>
                <span className="font-bold text-amber-900">Rp 12.500.000</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
