"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Star, MapPin, Users } from "lucide-react";

interface VendorModalProps {
  vendor: any;
  selectedItems: any;
  onClose: () => void;
  onTogglePackage: (vendor: any, pkg: any) => void;
}

export default function VendorModal({
  vendor,
  selectedItems,
  onClose,
  onTogglePackage,
}: VendorModalProps) {
  if (!vendor) return null;

  // Ambil tier yang sedang terpilih untuk vendor ini (jika ada)
  const currentTier = selectedItems[vendor.category]?.find(
    (p: any) => p.vendorId === vendor.id
  )?.tier;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop dengan Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Main Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 h-full max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[3rem] bg-white shadow-2xl"
        >
          {/* Header Sticky Mobile */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 rounded-full border border-stone-100 bg-white/80 p-3 shadow-sm backdrop-blur-md transition-transform hover:rotate-90 active:scale-90"
          >
            <X size={20} className="text-stone-500" />
          </button>

          <div className="flex h-full flex-col lg:flex-row">
            {/* Kiri: Visual Portofolio */}
            <div className="relative h-64 w-full lg:h-auto lg:w-5/12">
              <img
                src={
                  vendor.imageUrl ||
                  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
                }
                className="h-full w-full object-cover"
                alt={vendor.businessName}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
            </div>

            {/* Kanan: Info & Paket */}
            <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto p-8 md:p-12">
              <div className="mb-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-700 uppercase">
                    Buleleng Wedding Partner
                  </span>
                  <div className="flex text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>

                <h2 className="font-serif text-4xl text-stone-900 md:text-5xl">
                  {vendor.businessName}
                </h2>

                <div className="flex gap-6 text-[11px] font-bold tracking-widest text-stone-400 uppercase">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-amber-600" />
                    <span>Singaraja, Bali</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-amber-600" />
                    <span>Layanan Eksklusif</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {vendor.packages
                  ?.sort((a: any, b: any) => Number(a.price) - Number(b.price))
                  .map((pkg: any) => {
                    const isSelected = currentTier === pkg.tier;

                    return (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ y: -5 }}
                        className={`relative flex flex-col rounded-[2.5rem] border-2 p-6 transition-all ${
                          isSelected
                            ? "border-stone-900 bg-stone-50 shadow-lg"
                            : "border-stone-100 bg-white hover:border-amber-200"
                        }`}
                      >
                        <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-amber-700 uppercase">
                          {pkg.tier}
                        </p>
                        <p className="mb-6 font-serif text-xl font-bold text-stone-900">
                          Rp {(Number(pkg.price) / 1000000).toFixed(1)}Jt
                        </p>

                        <ul className="mb-8 flex-1 space-y-3">
                          {pkg.features
                            ?.slice(0, 5)
                            .map((f: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[10px] leading-relaxed text-stone-600"
                              >
                                <CheckCircle2
                                  size={12}
                                  className="mt-0.5 shrink-0 text-emerald-500"
                                />
                                {f}
                              </li>
                            ))}
                        </ul>

                        <button
                          onClick={() => onTogglePackage(vendor, pkg)}
                          className={`w-full rounded-full py-3 text-[10px] font-bold tracking-widest uppercase transition-all ${
                            isSelected
                              ? "bg-stone-900 text-white"
                              : "border border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                          }`}
                        >
                          {isSelected ? "Terpilih" : "Pilih Tier"}
                        </button>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
