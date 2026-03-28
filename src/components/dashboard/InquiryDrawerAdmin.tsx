"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog"; // Ganti ke Dialog
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  CalendarDays,
  MapPin,
  CreditCard,
  User,
  ClipboardList,
} from "lucide-react";
import { updateVendorStatus } from "@/actions/inquiries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface InquiryDetailProps {
  data: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryDetail({
  data,
  isOpen,
  onClose,
}: InquiryDetailProps) {
  if (!data) return null;
  const router = useRouter(); // 3. Inisialisasi router
  const [isPending, startTransition] = useTransition();

  const formatCurrency = (val: string | number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-none p-0 shadow-2xl sm:max-w-[600px]">
        {/* Header Kustom agar lebih elegan */}
        <div className="bg-slate-900 p-6 text-white">
          <div className="mb-4 flex items-start justify-between">
            <Badge className="bg-gold-500 hover:bg-gold-600 border-none text-slate-900">
              {data.serviceType === "full_managed"
                ? "Managed by WO"
                : "Self Service"}
            </Badge>
            <div className="text-right">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Inquiry ID
              </p>
              <p className="font-mono text-xs">{data.id.slice(0, 8)}</p>
            </div>
          </div>
          <DialogTitle className="mb-1 font-serif text-2xl italic">
            {data.planName || "Wedding Itinerary"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Rincian rencana pernikahan dan pemilihan vendor.
          </DialogDescription>
        </div>

        <div className="space-y-6 p-6">
          {/* Section: Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Customer</p>
                <p className="text-sm font-semibold">
                  {data.user?.name || "User"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <CalendarDays className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">
                  Event Date
                </p>
                <p className="text-sm font-semibold">
                  {data.ceremonyDate || "TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Vendors List */}
          {/* Section: Vendors List (Ambil dari relasi plans_items) */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold tracking-wider text-slate-600 uppercase">
                Selected Vendors & Items
              </h3>
            </div>
            <div className="space-y-3">
              {data.planItems?.length > 0 ? (
                data.planItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      {/* Indikator Urutan */}
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                        {idx + 1}
                      </div>
                      <div>
                        {/* Menampilkan Nama Vendor dari relasi, kalau tidak ada baru tampilkan ID */}
                        <p className="text-sm font-semibold text-slate-800">
                          {item.vendor?.businessName ||
                            item.itemName ||
                            `Vendor ID: ${item.vendorId?.slice(0, 8)}`}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-xs font-bold tracking-tight text-blue-600">
                            {formatCurrency(item.priceAtTime || 0)}
                          </p>
                          <span className="text-[10px] text-slate-400">•</span>
                          <p className="text-[10px] font-medium text-slate-400 uppercase">
                            {item.category || "General"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Checkbox untuk update status langsung dari Modal */}
                      <input
                        type="checkbox"
                        disabled={isPending}
                        checked={item.status === "completed"}
                        onChange={(e) => {
                          const isChecked = e.target.checked;

                          startTransition(async () => {
                            // Kita bungkus action-nya
                            const promise = updateVendorStatus(
                              item.id,
                              isChecked
                            ).then((res) => {
                              if (res.error) throw new Error(res.error);

                              // REFRESH DISINI
                              router.refresh();
                              return res;
                            });

                            toast.promise(promise, {
                              loading: "Updating status...",
                              success: "Status updated!",
                              error: (err) => `Error: ${err.message}`,
                            });
                          });
                        }}
                      />
                      <Badge variant="outline" className="...">
                        {item.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed bg-slate-50/50 py-10 text-center">
                  <ClipboardList className="mx-auto mb-2 h-8 w-8 text-slate-200" />
                  <p className="text-sm text-slate-400">
                    Belum ada vendor/item dalam rencana ini.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Section: Billing Summary */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5">
            {/* Dekorasi watermark kecil */}
            <CreditCard className="absolute -right-4 -bottom-4 h-24 w-24 -rotate-12 text-slate-200/50" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Platform Fee</span>
                <span className="font-medium">
                  {formatCurrency(data.platformFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Payment Status</span>
                <Badge
                  className={
                    data.paymentStatus === "paid"
                      ? "bg-green-600"
                      : "bg-amber-500"
                  }
                >
                  {data.paymentStatus?.toUpperCase() || "UNPAID"}
                </Badge>
              </div>
              <Separator className="bg-slate-200" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold text-slate-700">
                  Estimated Total
                </span>
                <span className="text-xl font-black text-blue-600">
                  {formatCurrency(data.totalEstimate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
