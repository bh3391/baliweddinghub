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
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from "lucide-react";

interface PlanDetailModalProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
  onProcess: (
    planId: string,
    serviceType: "self_service" | "managed_wo",
    finalAmount: number
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
  const [step, setStep] = useState<1 | 2>(1);
  const [serviceType, setServiceType] = useState<"self_service" | "managed_wo">(
    "self_service"
  );

  // 1. Guard Clause: Jika modal tidak buka atau plan kosong, langsung return null.
  // Ini mencegah error "Cannot read properties of null" pada baris di bawahnya.

  // 2. Logika Pengecekan Status (Aman karena plan sudah dipastikan ada)
  const isLocked =
    plan?.status !== "draft" &&
    plan?.status !== null &&
    plan?.status !== undefined;

  const PLATFORM_FEE = 50000;
  const WO_FEE_DISPLAY = "Start from 5%";

  // Unique code di-generate sekali saat komponen terbuka
  const [uniqueCode] = useState(() => Math.floor(Math.random() * 900) + 100);

  if (!isOpen || !plan) return null;

  const calculations = useMemo(() => {
    const baseTotal = Number(plan?.totalEstimate || 0);
    const isSelf = serviceType === "self_service";

    const transferFee = isSelf ? PLATFORM_FEE + uniqueCode : 0;

    return {
      vendorSubtotal: baseTotal,
      transferAmount: transferFee,
      uniqueCode: isSelf ? uniqueCode : 0,
    };
  }, [plan, serviceType, uniqueCode]);

  const handleNextStep = () => {
    if (serviceType === "self_service" && step === 1) {
      setStep(2);
    } else {
      onProcess(plan.id, serviceType, calculations.transferAmount);
    }
  };

  const getButtonLabel = () => {
    if (isPending) return "Memproses...";
    if (isLocked) return "Rencana Sedang Diproses";

    if (step === 1) {
      return serviceType === "self_service"
        ? "Lanjut ke Pembayaran"
        : "Konfirmasi & Hubungi WO";
    }
    return "Saya Sudah Transfer via QRIS";
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm duration-300">
      <div className="animate-in zoom-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[3rem] border border-white/20 bg-white shadow-2xl duration-300">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 bg-stone-50/50 p-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-stone-100 bg-white p-2 text-stone-400 shadow-sm transition-all hover:text-stone-900 active:scale-90"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="font-serif text-2xl tracking-tight text-stone-900">
                {step === 1 ? plan.planName : "Konfirmasi Pembayaran"}
              </h2>
              <p className="text-sm text-stone-500 italic">
                {step === 1
                  ? "Review rincian biaya & layanan"
                  : "Scan QRIS Aethelia Systems"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="custom-scrollbar flex-grow overflow-y-auto bg-white">
          {step === 1 ? (
            <div className="space-y-6 p-8">
              {/* Daftar Vendor */}
              <div>
                <p className="mb-4 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                  Selected Vendors ({plan.planItems?.length})
                </p>
                <div className="space-y-3">
                  {plan.planItems?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50/30 p-4 transition-all hover:border-amber-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-[10px] font-bold text-amber-400 uppercase">
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
              </div>

              {/* Pemilihan Metode Layanan */}
              <div className="rounded-[2.5rem] border border-amber-100/50 bg-amber-50/30 p-6">
                <div className="mb-4 flex items-center justify-center gap-2 text-stone-500">
                  <Info size={12} className="text-amber-600" />
                  <p className="text-[10px] font-bold tracking-widest uppercase">
                    Pilih Metode Pengurusan
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={isLocked}
                    onClick={() => setServiceType("self_service")}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all ${
                      serviceType === "self_service"
                        ? "scale-[1.02] border-amber-800 bg-white shadow-md"
                        : "border-stone-200 bg-transparent opacity-60 hover:opacity-100"
                    } ${isLocked && "cursor-not-allowed opacity-50"}`}
                  >
                    <User
                      size={20}
                      className={
                        serviceType === "self_service" ? "text-amber-800" : ""
                      }
                    />
                    <div className="text-center">
                      <p className="text-xs font-bold tracking-wide uppercase">
                        Self Service
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600">
                        + Rp 50rb
                      </p>
                    </div>
                    {serviceType === "self_service" && (
                      <Check
                        className="absolute top-3 right-3 text-amber-800"
                        size={14}
                        strokeWidth={4}
                      />
                    )}
                  </button>

                  <button
                    disabled={isLocked}
                    onClick={() => setServiceType("managed_wo")}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all ${
                      serviceType === "managed_wo"
                        ? "scale-[1.02] border-amber-800 bg-white shadow-md"
                        : "border-stone-200 bg-transparent opacity-60 hover:opacity-100"
                    } ${isLocked && "cursor-not-allowed opacity-50"}`}
                  >
                    <Briefcase
                      size={20}
                      className={
                        serviceType === "managed_wo" ? "text-amber-800" : ""
                      }
                    />
                    <div className="text-center">
                      <p className="text-xs font-bold tracking-wide uppercase">
                        Managed WO
                      </p>
                      <p className="text-[10px] font-bold text-amber-600">
                        {WO_FEE_DISPLAY}
                      </p>
                    </div>
                    {serviceType === "managed_wo" && (
                      <Check
                        className="absolute top-3 right-3 text-amber-800"
                        size={14}
                        strokeWidth={4}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: QRIS */
            <div className="animate-in slide-in-from-right flex flex-col items-center p-12 text-center duration-500">
              <div className="mb-8 rounded-[2.5rem] bg-stone-900 p-6 shadow-2xl ring-8 ring-stone-50">
                <div className="mb-4 flex items-center justify-center gap-2 text-amber-400">
                  <QrCode size={20} />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                    QRIS Bali Wedding Hub
                  </span>
                </div>
                <div className="h-56 w-56 overflow-hidden rounded-2xl bg-white p-3">
                  <img
                    src="/images/qris-baliweddinghub.png"
                    alt="QRIS Payment"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="mb-8 space-y-2">
                <p className="text-sm font-medium text-stone-500">
                  Transfer tepat sesuai nominal:
                </p>
                <h3 className="font-mono text-4xl font-bold tracking-tighter text-stone-900">
                  Rp {calculations.transferAmount.toLocaleString("id-ID")}
                </h3>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1 text-[11px] font-bold text-red-600 uppercase">
                  <ShieldCheck size={14} /> Wajib Kode Unik:{" "}
                  {calculations.uniqueCode}
                </div>
              </div>

              <div className="w-full rounded-2xl border border-stone-100 bg-stone-50 p-5 text-left text-[11px] leading-relaxed text-stone-500 italic">
                <strong>Penting:</strong> Verifikasi dilakukan secara manual.
                Akses nomor WhatsApp vendor akan terbuka otomatis setelah
                pembayaran divalidasi oleh Admin.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-stone-100 bg-stone-50 p-8">
          {isLocked && (
            <div className="animate-in slide-in-from-bottom-2 mb-6 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-[11px] leading-relaxed text-amber-800 shadow-sm">
              <Info size={16} className="shrink-0 text-amber-600" />
              <p>
                Rencana ini <strong>sudah diajukan</strong> dan sedang dalam
                tahap verifikasi atau pengurusan. Anda tidak dapat mengubah
                metode layanan saat ini. Silakan pantau status terbaru di menu{" "}
                <strong>Inquiry</strong>.
              </p>
            </div>
          )}

          {step === 1 && !isLocked && (
            <div className="mb-6 space-y-3 px-2">
              <div className="flex justify-between text-sm text-stone-500">
                <span className="flex items-center gap-2">
                  <Receipt size={14} /> Estimasi Belanja Vendor
                </span>
                <span className="font-semibold text-stone-700">
                  Rp {calculations.vendorSubtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-bold text-stone-900">
                <span>
                  {serviceType === "self_service"
                    ? "Platform Fee (Bayar Sekarang)"
                    : "Fee Layanan WO"}
                </span>
                <span className="text-amber-900">
                  {serviceType === "self_service"
                    ? `+ Rp ${calculations.transferAmount.toLocaleString("id-ID")}`
                    : "Negotiable"}
                </span>
              </div>
            </div>
          )}

          <button
            disabled={isPending || isLocked}
            onClick={handleNextStep}
            className={`group flex w-full items-center justify-center gap-3 rounded-2xl py-5 font-bold text-white shadow-xl transition-all active:scale-[0.98] ${
              isLocked
                ? "cursor-not-allowed bg-stone-300 shadow-none"
                : "bg-stone-900 shadow-stone-900/20 hover:bg-stone-800"
            }`}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isLocked ? (
              <ShieldCheck size={18} />
            ) : (
              <Send
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            )}
            {getButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
