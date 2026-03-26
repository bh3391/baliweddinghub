"use client";

import {
  Calendar,
  MapPin,
  Loader2,
  Trash2,
  ArrowRight,
  Plus,
  Calculator,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { useTransition, useState } from "react";
import { deletePlan, processInquiry } from "@/actions/plan-actions";
import { toast } from "sonner";
import DonationModal from "@/components/dashboard/DonationModal";
import PlanDetailModal from "@/components/dashboard/PlanDetailModal";

export default function MyPlansClient({
  initialPlans,
}: {
  initialPlans: any[];
}) {
  const maxPlans = 3;
  const remainingSlots = maxPlans - initialPlans.length;
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [serviceType, setServiceType] = useState<"self_service" | "managed_wo">(
    "self_service"
  );

  const handleProcess = (
    id: string,
    type: "self_service" | "managed_wo",
    amount: number
  ) => {
    startTransition(async () => {
      try {
        const res = await processInquiry(id, type, amount);

        if (res.success) {
          toast.success(res.message);
          setShowModal(false);
          setSelectedPlan(null); // Reset selection
        } else {
          toast.error(res.message || "Gagal memproses rencana.");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem.");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus rencana "${name}"?`))
      return;

    setDeletingId(id);
    startDeleteTransition(async () => {
      const result = await deletePlan(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* List Rencana yang Ada */}
      {initialPlans.map((plan) => (
        <div
          key={plan.id}
          className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
        >
          <div className="flex-1 p-4 lg:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-700 uppercase">
                {plan.status}
              </div>
              <button
                onClick={() => handleDelete(plan.id, plan.planName)}
                disabled={isDeleting && deletingId === plan.id}
                className="text-stone-300 transition-colors hover:text-red-500 disabled:opacity-50"
              >
                {isDeleting && deletingId === plan.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>

            <h3 className="mb-2 font-serif text-xl text-stone-900 transition-colors group-hover:text-amber-800">
              {plan.planName || "Rencana Tanpa Nama"}
            </h3>

            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Calendar size={14} className="text-amber-600" />
                {plan.ceremonyDate
                  ? format(new Date(plan.ceremonyDate), "dd MMMM yyyy", {
                      locale: id,
                    })
                  : "Tanggal belum diset"}
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Calculator size={14} className="text-amber-600" />
                {plan.planItems?.length || 0} Vendor Terpilih
              </div>
            </div>

            {/* Preview Mini Vendor Icons */}
            <div className="mb-4 flex -space-x-2 overflow-hidden">
              {plan.planItems?.slice(0, 5).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex inline-block h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-[10px] font-bold text-stone-400 ring-2 ring-white"
                  title={item.vendor?.businessName}
                >
                  {item.vendor?.businessName?.charAt(0)}
                </div>
              ))}
              {plan.planItems?.length > 5 && (
                <div className="flex inline-block h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 ring-2 ring-white">
                  +{plan.planItems.length - 5}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50 p-6">
            <div>
              <p className="text-[9px] leading-none font-bold tracking-widest text-stone-400 uppercase">
                Total Estimasi
              </p>
              <p className="text-lg font-bold text-stone-900">
                Rp {Number(plan.totalEstimate).toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={() => setSelectedPlan(plan)}
              className="group/btn rounded-2xl bg-white p-3 shadow-sm transition-all hover:bg-amber-900 hover:text-white"
            >
              <ArrowRight
                size={20}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </button>
          </div>
          <PlanDetailModal
            plan={selectedPlan}
            isOpen={!!selectedPlan}
            onClose={() => setSelectedPlan(null)}
            onProcess={handleProcess}
            isPending={isPending}
          />

          <DonationModal
            isOpen={showDonation}
            onClose={() => setShowDonation(false)}
          />
        </div>
      ))}

      {/* Empty Slots / Add New Plan */}
      {Array.from({ length: remainingSlots }).map((_, idx) => (
        <Link
          href="/dashboard/user/plans"
          key={`empty-${idx}`}
          className="group flex min-h-[350px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-stone-200 p-10 text-center transition-all hover:border-amber-400 hover:bg-amber-50/30"
        >
          <div className="mb-4 rounded-full bg-stone-50 p-6 transition-all group-hover:bg-amber-500 group-hover:text-white">
            <Plus size={32} />
          </div>
          <p className="font-serif text-lg text-stone-400 group-hover:text-amber-900">
            Buat Rencana Baru
          </p>
          <p className="mt-1 text-xs text-stone-400 italic">
            Slot {initialPlans.length + idx + 1} dari 3 tersedia
          </p>
        </Link>
      ))}
    </div>
  );
}
