"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertVendor } from "../../actions/vendor";
import { toast } from "sonner";
import settings from "@/data/settings.json";
import {
  Save,
  X,
  Building2,
  Mail,
  MapPin,
  Tag,
  Info,
  CheckCircle2,
  Star,
} from "lucide-react";

interface VendorFormProps {
  initialData?: any; // Jika ada, berarti mode Edit
}

export default function VendorForm({ initialData }: VendorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    email: initialData?.user?.email || "",
    businessName: initialData?.businessName || "",
    category: initialData?.category || settings.vendor_categories[1],
    location: initialData?.location || "Buleleng",
    address: initialData?.address || "",
    basePrice: initialData?.basePrice || "0",
    description: initialData?.description || "",
    isVerified: initialData?.isVerified || false,
    isRecommended: initialData?.isRecommended || false,
    images: initialData?.images || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await upsertVendor(formData, initialData?.id);

      if (res.success) {
        toast.success(
          initialData ? "Vendor updated!" : "New vendor & account created!"
        );
        router.push("/admin/vendors");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-8 md:flex-row md:items-center">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">
            {initialData ? "Edit Curated Vendor" : "Onboard New Vendor"}
          </h1>
          <p className="mt-1 text-sm font-light text-stone-500">
            {initialData
              ? `Updating profile for ${initialData.businessName}`
              : "Create a new vendor profile and system account."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 px-6 py-3 text-[10px] font-bold tracking-widest text-stone-600 uppercase transition-all hover:bg-stone-50"
          >
            <X size={14} /> Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-2xl bg-stone-900 px-8 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-stone-900/20 transition-all hover:bg-amber-900 disabled:opacity-50"
          >
            <Save size={14} /> {isPending ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Main Info */}
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-6 rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Building2 size={16} className="text-amber-600" />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase">
                Business Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                  Business Name
                </label>
                <input
                  required
                  placeholder="e.g. The Royal Balinese Catering"
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                  Account Email (Login)
                </label>
                <input
                  required
                  type="email"
                  disabled={!!initialData}
                  placeholder="vendor@email.com"
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Describe what makes this vendor special..."
                className="w-full resize-none rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-amber-600" />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase">
                Location & Address
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                  Area
                </label>
                <select
                  className="w-full appearance-none rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                >
                  <option value="Ubud">Ubud</option>
                  <option value="Canggu">Canggu</option>
                  <option value="Seminyak">Seminyak</option>
                  <option value="Uluwatu">Uluwatu</option>
                  <option value="Buleleng">Buleleng / Lovina</option>
                  <option value="Tabanan">Tabanan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                  Full Address
                </label>
                <input
                  placeholder="Street name, number..."
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings & Categories */}
        <div className="space-y-8">
          <div className="space-y-6 rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Tag size={16} className="text-amber-600" />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase">
                Pricing & Category
              </h3>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                Category
              </label>
              <select
                className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {settings.vendor_categories
                  .filter((c) => c !== "Semua")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-bold text-stone-500 uppercase">
                Starting Price (IDR)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xs font-bold text-stone-400">
                  Rp
                </span>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 pl-10 text-sm transition-all outline-none focus:border-amber-200 focus:bg-white"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Star size={16} className="text-amber-600" />
              <h3 className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase">
                Admin Curations
              </h3>
            </div>

            <label className="group flex cursor-pointer items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${formData.isVerified ? "border-blue-200 bg-blue-50 text-blue-600" : "border-stone-100 bg-stone-50 text-stone-300 group-hover:border-blue-200"}`}
              >
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-stone-700 uppercase">
                  Verified
                </p>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isVerified}
                  onChange={(e) =>
                    setFormData({ ...formData, isVerified: e.target.checked })
                  }
                />
                <p className="text-[9px] text-stone-400 italic">
                  Mark as trustable.
                </p>
              </div>
            </label>

            <label className="group flex cursor-pointer items-center gap-4 pt-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${formData.isRecommended ? "border-amber-200 bg-amber-50 text-amber-600" : "border-stone-100 bg-stone-50 text-stone-300 group-hover:border-amber-200"}`}
              >
                <Star
                  size={20}
                  className={formData.isRecommended ? "fill-amber-600" : ""}
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-stone-700 uppercase">
                  Recommended
                </p>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isRecommended}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isRecommended: e.target.checked,
                    })
                  }
                />
                <p className="text-[9px] text-stone-400 italic">
                  Show on premium picks.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
