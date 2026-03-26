"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Calculator,
  CheckCircle2,
  Waves,
  Utensils,
  Flower2,
  Camera,
  Music,
  UserCheck,
  Trash2,
  ChevronRight,
  Info,
  Gift,
  SpotlightIcon,
  Loader2,
  Calendar as CalendarIcon,
  ChevronLeft,
} from "lucide-react";
import { saveWeddingPlan } from "@/actions/plan-actions";
import VendorModal from "@/components/dashboard/VendorModal";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface SelectedPackage {
  vendorId: string;
  packageId: string;
  price: string | number;
  tier: string;
  businessName: string;
  category: string;
}

type SelectedItemsState = Record<string, SelectedPackage[]>;

const STEPS = [
  { id: "venue", name: "Venue", icon: Waves, desc: "Lokasi pernikahan" },
  {
    id: "dekorasi",
    name: "Dekorasi Bali",
    icon: Flower2,
    desc: "Dekorasi Hiasan Rumah",
  },
  {
    id: "upacara",
    name: "Banten & Adat",
    icon: Flower2,
    desc: "Sulinggih & Sesajen",
  },
  {
    id: "makeup",
    name: "Rias & Payas",
    icon: UserCheck,
    desc: "Payas Agung & Madya",
  },
  {
    id: "catering",
    name: "Kuliner Bali",
    icon: Utensils,
    desc: "Babi Guling & Prasmanan",
  },
  {
    id: "snack",
    name: "Snack & Drink",
    icon: SpotlightIcon,
    desc: "Jajanan Bali & Minuman Segar",
  },
  {
    id: "souvenir",
    name: "Souvenir",
    icon: Gift,
    desc: "Pernak Pernik dan Seserahan",
  },
  { id: "photo", name: "Dokumentasi", icon: Camera, desc: "Foto & Video" },
  { id: "music", name: "Hiburan", icon: Music, desc: "Gamelan & Tari" },
];

export default function PlansClient({
  initialVendors,
}: {
  initialVendors: any[];
}) {
  const [activeTab, setActiveTab] = useState("venue");
  const [selectedItems, setSelectedItems] = useState<SelectedItemsState>({});
  const [planName, setPlanName] = useState("");
  const [ceremonyDate, setCeremonyDate] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewingVendor, setViewingVendor] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  // State untuk Slider Mobile
  const [activeVendorIndex, setActiveVendorIndex] = useState(0);

  const vendors = useMemo(
    () =>
      initialVendors.map((v) => ({
        ...v,
        packages: v.packages || [],
      })),
    [initialVendors]
  );

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchCategory = v.category.toLowerCase() === activeTab;
      const matchLocation = selectedLocation
        ? v.location?.toLowerCase() === selectedLocation.toLowerCase()
        : true;
      return matchCategory && matchLocation;
    });
  }, [vendors, activeTab, selectedLocation]);

  useEffect(() => {
    setActiveVendorIndex(0);
  }, [activeTab, selectedLocation]);

  const completedSteps = Object.keys(selectedItems).filter(
    (key) => selectedItems[key].length > 0
  ).length;
  const totalSteps = STEPS.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const totalEstimate = useMemo(() => {
    return Object.values(selectedItems)
      .flat()
      .reduce((acc, item) => acc + Number(item.price), 0);
  }, [selectedItems]);

  const handleTogglePackage = (vendor: any, pkg: any) => {
    setSelectedItems((prev) => {
      const currentCategoryItems = prev[vendor.category] || [];
      const isAlreadySelected = currentCategoryItems.some(
        (item) => item.packageId === pkg.id
      );
      let newCategoryItems: SelectedPackage[];

      if (isAlreadySelected) {
        newCategoryItems = currentCategoryItems.filter(
          (item) => item.packageId !== pkg.id
        );
      } else {
        const otherVendorsItems = currentCategoryItems.filter(
          (item) => item.vendorId !== vendor.id
        );
        newCategoryItems = [
          ...otherVendorsItems,
          {
            vendorId: vendor.id,
            packageId: pkg.id,
            price: pkg.price,
            tier: pkg.tier,
            businessName: vendor.businessName,
            category: vendor.category,
          },
        ];
      }

      if (newCategoryItems.length === 0) {
        const { [vendor.category]: _, ...remainingState } = prev;
        return remainingState;
      }

      return { ...prev, [vendor.category]: newCategoryItems };
    });
  };

  const handleRemoveAllFromVendor = (vendorId: string, category: string) => {
    setSelectedItems((prev) => {
      const filtered = (prev[category] || []).filter(
        (item) => item.vendorId !== vendorId
      );
      if (filtered.length === 0) {
        const { [category]: _, ...remainingState } = prev;
        return remainingState;
      }
      return { ...prev, [category]: filtered };
    });
  };

  const handleSave = () => {
    if (completedSteps === 0) return toast.error("Pilih minimal satu vendor");
    if (!planName.trim())
      return toast.error("Beri nama rencana pernikahan Anda");
    if (!ceremonyDate)
      return toast.error("Tentukan tanggal upacara pernikahan");

    startTransition(async () => {
      const itemsToSave = Object.values(selectedItems).flat();

      try {
        const result = await saveWeddingPlan(
          itemsToSave,
          planName,
          ceremonyDate
        );

        if (result.success) {
          toast.success(result.message);

          // Memberi jeda sedikit agar user sempat melihat toast sukses sebelum pindah halaman
          setTimeout(() => {
            router.push("/dashboard/user/my-plans");
            router.refresh(); // Opsional: Memastikan data di halaman tujuan adalah yang paling baru
          }, 1500);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat menyimpan rencana");
      }
    });
  };

  // Logic Swipe Gesture
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (
      info.offset.x < -swipeThreshold &&
      activeVendorIndex < filteredVendors.length - 1
    ) {
      setActiveVendorIndex((prev) => prev + 1);
    } else if (info.offset.x > swipeThreshold && activeVendorIndex > 0) {
      setActiveVendorIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-10 pb-32 lg:grid-cols-12">
      {/* KOLOM KIRI: Navigasi Kategori */}
      <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
        <div className="hidden rounded-[2.5rem] border border-amber-100 bg-white p-8 shadow-sm lg:block">
          <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
            Total Estimasi
          </p>
          <p className="font-serif text-3xl font-bold text-amber-900">
            Rp {totalEstimate.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="space-y-3">
          {/* MOBILE NAV CHIPS */}
          <div className="no-scrollbar sticky top-0 z-20 -mx-4 flex gap-3 overflow-x-auto bg-[#fdfcfb]/80 px-4 py-2 pb-4 backdrop-blur-md lg:hidden">
            {STEPS.map((step) => {
              const isDone = (selectedItems[step.id]?.length || 0) > 0;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-5 py-3 transition-all ${
                    isActive
                      ? "border-amber-900 bg-amber-900 text-white shadow-md"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <step.icon
                    size={14}
                    className={isActive ? "text-amber-300" : "text-amber-700"}
                  />
                  <span className="text-[11px] font-bold tracking-tighter uppercase">
                    {step.name}
                  </span>
                  {isDone && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden flex-col gap-3 lg:flex">
            {STEPS.map((step) => {
              const isDone = (selectedItems[step.id]?.length || 0) > 0;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                    isActive
                      ? "scale-[1.02] border-amber-900 bg-amber-900 text-white shadow-lg"
                      : "border-stone-100 bg-white text-stone-600 hover:border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-lg p-2 ${isActive ? "bg-amber-800" : "bg-stone-50"}`}
                    >
                      <step.icon
                        className={`h-5 w-5 ${isActive ? "text-white" : "text-amber-700"}`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{step.name}</p>
                      <p
                        className={`text-[10px] ${isActive ? "text-amber-100" : "text-stone-400"}`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {isDone && (
                    <CheckCircle2
                      className={`h-5 w-5 ${isActive ? "text-amber-300" : "text-emerald-500"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KOLOM KANAN: Content */}
      <div className="space-y-8 lg:col-span-8">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 gap-6 rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm md:grid-cols-2 md:rounded-[2.5rem] md:p-8">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              Nama Rencana
            </label>
            <input
              type="text"
              placeholder="Contoh: Wedding di Lovina"
              className="w-full rounded-2xl border-none bg-stone-50 px-5 py-3 text-sm focus:ring-2 focus:ring-amber-500"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              Tanggal Acara
            </label>
            <div className="relative">
              <CalendarIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="date"
                className="w-full rounded-2xl border-none bg-stone-50 py-3 pr-5 pl-12 text-sm uppercase focus:ring-2 focus:ring-amber-500"
                value={ceremonyDate}
                onChange={(e) => setCeremonyDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
          {["Semua", "Singaraja", "Lovina", "Munduk", "Ubud"].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc === "Semua" ? null : loc)}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                (loc === "Semua" && !selectedLocation) ||
                selectedLocation === loc
                  ? "bg-amber-900 text-white shadow-md"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* MOBILE VENDOR SLIDER */}
        <div className="relative lg:hidden">
          <AnimatePresence mode="wait">
            {filteredVendors.length > 0 ? (
              <motion.div
                key={filteredVendors[activeVendorIndex].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="w-full touch-pan-y"
              >
                <div className="rounded-[2.5rem] border-2 border-stone-100 bg-white p-6 shadow-xl">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-amber-900">
                        {filteredVendors[activeVendorIndex].businessName}
                      </h3>
                      <div className="mt-1 flex gap-2">
                        {filteredVendors[activeVendorIndex].isVerified && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-bold tracking-widest text-amber-700 uppercase">
                            Verified
                          </span>
                        )}
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[8px] font-bold tracking-widest text-stone-500 uppercase">
                          {activeVendorIndex + 1} of {filteredVendors.length}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setViewingVendor(filteredVendors[activeVendorIndex])
                      }
                      className="rounded-full bg-stone-50 p-3 text-amber-900"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                  <div className="h-100 w-full shrink-0 overflow-hidden rounded-xl border border-amber-100">
                    <img
                      src={`https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=200&auto=format&fit=crop`}
                      alt="Vendor"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {filteredVendors[activeVendorIndex].packages
                      ?.sort(
                        (a: any, b: any) => Number(a.price) - Number(b.price)
                      )
                      .map((pkg: any) => {
                        const isSelected = (
                          selectedItems[activeTab] || []
                        ).some((p: any) => p.packageId === pkg.id);
                        return (
                          <button
                            key={pkg.id}
                            onClick={() =>
                              handleTogglePackage(
                                filteredVendors[activeVendorIndex],
                                pkg
                              )
                            }
                            className={`relative flex w-full flex-col items-center rounded-2xl border-2 p-4 text-center transition-all duration-300 active:scale-95 ${
                              isSelected
                                ? "border-amber-900 bg-amber-900 text-white shadow-md"
                                : "border-stone-100 bg-stone-50/50 text-stone-600 hover:border-amber-200"
                            }`}
                          >
                            {/* Label Tier - Dibuat lebih tipis & elegant */}
                            <p
                              className={`mb-2 text-[8px] font-medium tracking-[0.2em] uppercase ${
                                isSelected ? "text-amber-300" : "text-stone-400"
                              }`}
                            >
                              {pkg.tier}
                            </p>

                            {/* Harga - Dibuat lebih menonjol namun tetap proporsional */}
                            <p className="font-mono text-[10px] font-bold">
                              {(Number(pkg.price) / 1000000).toFixed(1)}Jt
                            </p>

                            {/* Indicator - Posisi absolute di pojok agar tidak merusak alignment teks */}
                            <div className="mt-3">
                              {isSelected ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-amber-400"
                                />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-stone-200" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>

                  {/* Manual Nav Buttons for Accessibility */}
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() =>
                        activeVendorIndex > 0 &&
                        setActiveVendorIndex((prev) => prev - 1)
                      }
                      className="flex-1 rounded-2xl bg-stone-100 py-4 text-stone-400 disabled:opacity-30"
                      disabled={activeVendorIndex === 0}
                    >
                      <ChevronLeft className="mx-auto" />
                    </button>
                    <button
                      onClick={() =>
                        activeVendorIndex < filteredVendors.length - 1 &&
                        setActiveVendorIndex((prev) => prev + 1)
                      }
                      className="flex-1 rounded-2xl bg-amber-900 py-4 text-white disabled:opacity-30"
                      disabled={
                        activeVendorIndex === filteredVendors.length - 1
                      }
                    >
                      <ChevronRight className="mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center rounded-[3rem] border-2 border-dashed border-stone-100 bg-white py-24 text-center">
                <ShoppingBag className="mb-4 h-10 w-10 text-stone-200" />
                <p className="px-8 font-serif text-stone-400 italic">
                  Belum ada vendor di kategori ini.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* DESKTOP VENDOR GRID */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-2">
          {filteredVendors.map((vendor) => {
            const vendorSelectedPackages =
              selectedItems[vendor.category]?.filter(
                (item: any) => item.vendorId === vendor.id
              ) || [];
            return (
              <div
                key={vendor.id}
                className={`flex flex-col gap-6 rounded-[3rem] border-2 bg-white p-8 transition-all ${vendorSelectedPackages.length > 0 ? "border-amber-800 shadow-2xl" : "border-stone-100 shadow-sm"}`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-2xl leading-tight text-stone-900">
                    {vendor.businessName}
                  </h3>
                  <button
                    onClick={() => setViewingVendor(vendor)}
                    className="p-2 text-stone-400 hover:text-amber-900"
                  >
                    <Info size={20} />
                  </button>
                </div>
                <div className="h-50 w-full shrink-0 overflow-hidden rounded-xl border border-amber-100">
                  <img
                    src={`https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                    alt="Vendor"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {vendor.packages?.map((pkg: any) => {
                    const isPackageSelected = vendorSelectedPackages.some(
                      (p: any) => p.packageId === pkg.id
                    );
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => handleTogglePackage(vendor, pkg)}
                        className={`relative flex flex-col items-center gap-2 rounded-3xl border p-4 transition-all ${isPackageSelected ? "scale-[1.02] border-stone-900 bg-stone-900 text-white shadow-lg" : "border-stone-100 bg-white hover:border-amber-500"}`}
                      >
                        <p
                          className={`text-[9px] font-bold uppercase ${isPackageSelected ? "text-amber-400" : "text-stone-400"}`}
                        >
                          {pkg.tier}
                        </p>
                        <p className="text-[13px] font-bold">
                          {(Number(pkg.price) / 1000000).toFixed(1)}Jt
                        </p>
                        {isPackageSelected && (
                          <div className="absolute -top-2 -right-2 rounded-full bg-amber-500 p-1 text-white">
                            <CheckCircle2 size={12} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
                  <span className="text-sm font-semibold text-amber-700">
                    {vendorSelectedPackages.length > 0
                      ? `${vendorSelectedPackages[0].tier} Terpilih`
                      : "Belum memilih"}
                  </span>
                  {vendorSelectedPackages.length > 0 && (
                    <button
                      onClick={() =>
                        handleRemoveAllFromVendor(vendor.id, vendor.category)
                      }
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VendorModal
        vendor={viewingVendor}
        selectedItems={selectedItems}
        onClose={() => setViewingVendor(null)}
        onTogglePackage={handleTogglePackage}
      />
      <AnimatePresence>
        {completedSteps > 0 && (
          <>
            {/* Floating Circle Button */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed right-6 bottom-20 z-[160]"
            >
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white shadow-2xl transition-all hover:bg-amber-900 active:scale-90"
              >
                <ShoppingBag size={24} className="text-amber-400" />

                {/* Badge Jumlah Pilihan */}
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold">
                  {completedSteps}
                </div>
              </button>
            </motion.div>

            {/* DRAWER OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(true)}
              className={`fixed inset-0 z-[200] ${isDrawerOpen ? "pointer-events-auto bg-stone-900/40 backdrop-blur-sm" : "pointer-events-none opacity-0"}`}
            />

            {/* DRAWER CONTENT */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: isDrawerOpen ? 0 : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[210] mx-auto max-h-[90vh] max-w-4xl overflow-y-auto rounded-t-[2.5rem] bg-white p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
              {/* Handle Bar */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-stone-200" />

              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-stone-900">
                  Rincian Rencana
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-stone-400 hover:text-stone-900"
                >
                  Tutup
                </button>
              </div>

              {/* List Vendor yang Dipilih */}
              <div className="space-y-4">
                {Object.values(selectedItems)
                  .flat()
                  .map((item) => (
                    <div
                      key={item.packageId}
                      className="flex items-center justify-between rounded-2xl bg-stone-50 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-700">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-tighter text-stone-400 uppercase">
                            {item.category}
                          </p>
                          <p className="font-bold text-stone-900">
                            {item.businessName}
                          </p>
                          <p className="text-[10px] text-stone-500 uppercase">
                            Paket {item.tier}
                          </p>
                        </div>
                      </div>
                      <p className="font-mono text-sm font-bold text-amber-900">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Total & Action */}
              <div className="mt-8 border-t border-stone-100 pt-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-stone-500">Total Estimasi</span>
                  <span className="font-serif text-2xl font-bold text-amber-900">
                    Rp {totalEstimate.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-stone-900 py-4 text-white transition-all hover:bg-amber-900 active:scale-95 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Calculator size={18} className="text-amber-400" />
                      <span className="font-bold">Konfirmasi & Simpan</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
