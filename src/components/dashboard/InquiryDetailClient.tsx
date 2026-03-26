"use client";

import { useState } from "react";
import {
  MessageCircle,
  CheckCircle2,
  Clock,
  Construction,
  GlassWater,
  Heart,
  Lock,
  Loader2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function InquiryDetailClient({ inquiry }: { inquiry: any }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Status Config untuk visualisasi progres Managed WO
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "checking_availability":
        return {
          label: "Mengecek Vendor",
          color: "text-blue-600",
          bg: "bg-blue-50",
          icon: Clock,
        };
      case "waiting_confirmation":
        return {
          label: "Menunggu Konfirmasi",
          color: "text-amber-600",
          bg: "bg-amber-50",
          icon: Construction,
        };
      case "negotiating":
        return {
          label: "Negosiasi Harga",
          color: "text-purple-600",
          bg: "bg-purple-50",
          icon: GlassWater,
        };
      case "completed":
        return {
          label: "Selesai & Terkunci",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          icon: CheckCircle2,
        };
      default:
        return {
          label: "Proses Antrean WO",
          color: "text-stone-500",
          bg: "bg-stone-50",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(inquiry.status);
  const isPaid = inquiry.paymentStatus === "paid";
  const isManaged = inquiry.serviceType === "managed_wo";

  // Fungsi hubungi PIC WO (Bapak)
  const handleContactPIC = () => {
    const picPhone = "628123456789"; // GANTI DENGAN NOMOR WA BAPAK
    const msg = encodeURIComponent(
      `Halo Bali Wedding Hub, saya ingin bertanya update untuk rencana "${inquiry.planName}".`
    );
    window.open(`https://wa.me/${picPhone}?text=${msg}`, "_blank");
  };

  const handleContactVendor = async (
    vendorId: string,
    vendorName: string,
    phone: string
  ) => {
    if (!phone) {
      toast.error("Nomor WhatsApp vendor tidak tersedia.");
      return;
    }
    setLoadingId(vendorId);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const cleanPhone = phone.replace(/\D/g, "");
      const finalPhone = cleanPhone.startsWith("0")
        ? "62" + cleanPhone.slice(1)
        : cleanPhone;
      const msg = encodeURIComponent(
        `Halo ${vendorName}, saya menemukan Anda melalui Bali Wedding Hub...`
      );
      window.open(`https://wa.me/${finalPhone}?text=${msg}`, "_blank");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="animate-in fade-in mx-auto max-w-4xl space-y-8 p-4 duration-700 md:p-6">
      {/* 1. Header Progress (Khusus Managed WO) */}
      {isManaged && (
        <div
          className={`flex flex-col justify-between gap-6 rounded-[2.5rem] border p-8 md:flex-row md:items-center ${config.bg} ${config.color} relative overflow-hidden border-current/10 shadow-sm`}
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <config.icon size={28} />
            </div>
            <div>
              <p className="mb-1 text-[10px] leading-none font-bold tracking-widest uppercase opacity-70">
                Status Penanganan WO
              </p>
              <h2 className="font-serif text-2xl font-bold tracking-tight">
                {config.label}
              </h2>
            </div>
          </div>

          <button
            onClick={handleContactPIC}
            className="relative z-10 flex items-center justify-center gap-2 rounded-2xl border-2 border-current bg-white px-6 py-3 text-sm font-bold transition-all hover:border-stone-900 hover:bg-stone-900 hover:text-white active:scale-95"
          >
            <UserCheck size={18} />
            Hubungi PIC WO
          </button>
        </div>
      )}

      {/* 2. Vendor List Section */}
      <div className="space-y-4">
        <h3 className="px-2 font-serif text-xl text-stone-900">
          Daftar Vendor Pilihan
        </h3>

        <div className="grid gap-4">
          {(inquiry.planItems || []).map((item: any) => {
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-stone-900 text-amber-400">
                    <Heart size={18} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                      {item.category}
                    </p>
                    <h4 className="text-lg font-bold text-stone-800">
                      {item.businessName}
                    </h4>
                    {/* Status per vendor jika Managed */}
                    {isManaged && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-blue-500 uppercase">
                        <Clock size={10} /> Sedang dikonfirmasi oleh tim
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  {isManaged ? (
                    // TAMPILAN STATUS (Managed WO)
                    <div className="rounded-full border border-stone-100 bg-stone-50 px-5 py-2 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                      Handled by WO
                    </div>
                  ) : isPaid ? (
                    // TOMBOL WA (Self Service - Paid)
                    <button
                      disabled={loadingId === item.id}
                      onClick={() =>
                        handleContactVendor(
                          item.id,
                          item.businessName,
                          item.phoneNumber
                        )
                      }
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700"
                    >
                      {loadingId === item.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <MessageCircle size={16} />
                      )}
                      Hubungi Vendor
                    </button>
                  ) : (
                    // TAMPILAN LOCK (Self Service - Unpaid)
                    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-6 py-3 text-sm font-bold text-stone-400">
                      <Lock size={14} /> Akses Terkunci
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Notes Section (Personal Touch) */}
      {isManaged && (
        <div className="rounded-[2.5rem] bg-stone-900 p-8 text-white shadow-2xl">
          <div className="mb-4 flex items-center gap-2 text-amber-400">
            <Heart size={20} fill="currentColor" className="animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Pesan Personal WO
            </span>
          </div>
          <p className="font-serif text-base leading-relaxed text-stone-300 italic">
            "Halo Pak Bhakti, kami sedang memastikan semua vendor tersedia
            sesuai rencana Anda. Klik tombol <b>Hubungi PIC WO</b> di atas jika
            ada perubahan mendadak."
          </p>
        </div>
      )}
    </div>
  );
}
