"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Calendar,
  Package,
  ArrowUpRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Info,
} from "lucide-react";
import InquiryDetailClient from "@/components/dashboard/InquiryDetailClient"; // Import UI Detail yang kita buat tadi

export default function InquiryClient({ initialData }: { initialData: any[] }) {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Fungsi untuk menentukan style badge status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10";
      case "managed_by_wo":
      case "checking_availability":
      case "negotiating":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10";
      default:
        return "bg-stone-50 text-stone-600 border-stone-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Menunggu Pembayaran Fee";
      case "managed_by_wo":
        return "Antrean WO";
      case "checking_availability":
        return "WO: Mengecek Vendor";
      case "negotiating":
        return "WO: Negosiasi";
      case "completed":
        return "Akses Vendor Terbuka";
      default:
        return status;
    }
  };

  // Jika ada inquiry yang dipilih, tampilkan halaman detail
  if (selectedInquiry) {
    return (
      <div className="animate-in fade-in slide-in-from-right space-y-6 duration-500">
        <button
          onClick={() => setSelectedInquiry(null)}
          className="group flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
        >
          <div className="rounded-full bg-stone-100 p-2 transition-colors group-hover:bg-stone-200">
            <ArrowLeft size={18} />
          </div>
          Kembali ke Daftar Inquiry
        </button>

        <InquiryDetailClient inquiry={selectedInquiry} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {initialData.map((inquiry) => (
        <div
          key={inquiry.id}
          onClick={() => setSelectedInquiry(inquiry)}
          className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-1 transition-all hover:shadow-xl hover:shadow-stone-200/50"
        >
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
            {/* Ikon & Status */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-stone-900 text-amber-400 transition-transform duration-500 group-hover:scale-105">
              <Package size={32} strokeWidth={1.5} />
            </div>

            {/* Info Utama */}
            <div className="flex-grow space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase ring-1 ring-inset ${getStatusStyle(inquiry.status)}`}
                >
                  {inquiry.status === "pending_payment" ? (
                    <CreditCard size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {getStatusLabel(inquiry.status)}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                  <Calendar size={12} />
                  {new Date(inquiry.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>

              <h3 className="font-serif text-xl text-stone-900 transition-colors group-hover:text-amber-900">
                {inquiry.planName}
              </h3>

              <div className="flex items-center gap-4 text-sm text-stone-500">
                <p>
                  Metode:{" "}
                  <span className="font-semibold text-stone-700 capitalize">
                    {inquiry.serviceType.replace("_", " ")}
                  </span>
                </p>
                <div className="h-1 w-1 rounded-full bg-stone-300" />
                <p>{inquiry.itemsCount} Vendor Terpilih</p>
              </div>
            </div>

            {/* Nominal & Action */}
            <div className="flex flex-row items-center justify-between gap-2 border-t border-stone-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-8">
              <div className="text-left md:text-right">
                <p className="mb-1 text-[10px] leading-none font-bold tracking-widest text-stone-400 uppercase">
                  Total Estimasi
                </p>
                <p className="font-mono text-lg font-bold text-stone-900">
                  Rp {Number(inquiry.totalEstimate).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-all group-hover:rotate-45 group-hover:bg-amber-900 group-hover:text-white">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          {/* Progress Bar Dinamis */}
          <div className="h-1.5 w-full bg-stone-50">
            <div
              className={`h-full transition-all duration-1000 ${
                inquiry.status === "completed"
                  ? "w-full bg-emerald-500"
                  : inquiry.status === "negotiating"
                    ? "w-3/4 bg-purple-500"
                    : inquiry.status === "checking_availability"
                      ? "w-1/2 bg-blue-500"
                      : "w-1/4 bg-amber-500"
              }`}
            />
          </div>
        </div>
      ))}

      {initialData.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-stone-200 py-20 text-center">
          <div className="mb-4 rounded-full bg-stone-50 p-6 text-stone-300">
            <Package size={48} />
          </div>
          <h3 className="font-serif text-xl text-stone-900">
            Belum ada rencana
          </h3>
          <p className="text-sm text-stone-500">
            Mulai buat rencana pernikahan Anda di My Plans.
          </p>
        </div>
      )}
    </div>
  );
}
