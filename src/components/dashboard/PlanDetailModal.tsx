"use client";

import { useState, useMemo } from "react";
import {
  X,
  Send,
  Loader2,
  User,
  Briefcase,
  Check,
  Info,
  Receipt,
} from "lucide-react";

interface PlanDetailModalProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
  onProcess: (
    planId: string,
    serviceType: "self_service" | "managed_wo"
  ) => void;
  isPending: boolean;
}

export default function PlanDetailModal({
  plan,
  isOpen,
  onClose,
  onProcess,
  isPending,
}: PlanDetailModalProps) {
  // State untuk memilih tipe layanan
  const [serviceType, setServiceType] = useState<"self_service" | "managed_wo">(
    "self_service"
  );

  // Konfigurasi Biaya
  const PLATFORM_FEE = 50000;
  const WO_FEE_PERCENT = 0.07;

  // Kalkulasi Otomatis berdasarkan pilihan user
  const calculations = useMemo(() => {
    const baseTotal = Number(plan?.totalEstimate || 0);
    const additionalFee =
      serviceType === "managed_wo" ? baseTotal * WO_FEE_PERCENT : PLATFORM_FEE;

    return {
      base: baseTotal,
      extra: additionalFee,
      grandTotal: baseTotal + additionalFee,
    };
  }, [plan, serviceType]);

  if (!isOpen || !plan) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm duration-300">
      <div className="animate-in zoom-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[3rem] bg-white shadow-2xl duration-300">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 bg-stone-50 p-8">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">
              {plan.planName}
            </h2>
            <p className="text-sm text-stone-500 italic">
              Review rincian biaya & layanan
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-stone-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Daftar Vendor (Scrollable) */}
        <div className="custom-scrollbar flex-grow space-y-3 overflow-y-auto bg-white p-8">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            Vendor Terpilih
          </p>
          {plan.planItems?.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/30 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[10px] font-bold text-amber-700 uppercase">
                  {item.category.slice(0, 2)}
                </div>
                <div>
                  <p className="mb-1 text-[10px] leading-none font-bold tracking-widest text-stone-400 uppercase">
                    {item.category}
                  </p>
                  <p className="text-sm leading-tight font-semibold text-stone-800">
                    {item.vendor?.businessName}
                  </p>
                </div>
              </div>
              <p className="font-mono text-sm font-bold text-stone-900">
                Rp {Number(item.priceAtTime).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* TOGGLE SERVICE TYPE SECTION */}
        <div className="shrink-0 border-t border-stone-100 bg-amber-50/40 px-8 py-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Info size={12} className="text-amber-700" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase">
              Pilih Metode Pengurusan
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Self Service */}
            <button
              onClick={() => setServiceType("self_service")}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                serviceType === "self_service"
                  ? "scale-[1.02] border-amber-800 bg-white shadow-md"
                  : "border-stone-200 bg-transparent text-stone-400 opacity-60"
              }`}
            >
              <User
                size={20}
                className={
                  serviceType === "self_service" ? "text-amber-800" : ""
                }
              />
              <div className="text-center">
                <p className="text-xs font-bold uppercase">Self Service</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-600">
                  + Rp 50rb
                </p>
              </div>
              {serviceType === "self_service" && (
                <div className="absolute top-2 right-2 text-amber-800">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Managed by WO */}
            <button
              onClick={() => setServiceType("managed_wo")}
              className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                serviceType === "managed_wo"
                  ? "scale-[1.02] border-amber-800 bg-white shadow-md"
                  : "border-stone-200 bg-transparent text-stone-400 opacity-60"
              }`}
            >
              <Briefcase
                size={20}
                className={serviceType === "managed_wo" ? "text-amber-800" : ""}
              />
              <div className="text-center">
                <p className="text-xs font-bold uppercase">Managed by WO</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-600">
                  + 7% Fee + Tax
                </p>
              </div>
              {serviceType === "managed_wo" && (
                <div className="absolute top-2 right-2 text-amber-800">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer & Action (Total Dinamis) */}
        <div className="shrink-0 border-t border-stone-100 bg-stone-50 p-8">
          <div className="mb-6 space-y-2 px-2">
            <div className="flex justify-between text-sm text-stone-500">
              <span className="flex items-center gap-2">
                <Receipt size={14} /> Subtotal Vendor
              </span>
              <span>Rp {calculations.base.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-emerald-700">
              <span>
                {serviceType === "self_service"
                  ? "Platform Fee (Akses Data)"
                  : "Layanan WO (Koordinasi)"}
              </span>
              <span>+ Rp {calculations.extra.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="font-bold text-stone-900">Total Estimasi:</span>
              <span className="font-serif text-2xl font-bold text-amber-900">
                Rp {calculations.grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {plan.status === "draft" ? (
            <button
              disabled={isPending}
              onClick={() => onProcess(plan.id, serviceType)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-stone-900 py-5 font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-900 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {serviceType === "self_service"
                ? "Bayar & Minta Penawaran"
                : "Konfirmasi & Hubungi WO"}
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 py-4 text-center text-sm font-bold text-emerald-700">
              Rencana ini sudah dalam tahap pengajuan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
