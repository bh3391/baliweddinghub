"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Star,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteVendor } from "../../../../actions/vendor";
import settings from "@/data/settings.json";

interface VendorAdminProps {
  initialVendors: any[];
}

export default function VendorAdminClient({
  initialVendors,
}: VendorAdminProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredVendors = useMemo(() => {
    return initialVendors.filter((v) => {
      const matchesSearch = v.businessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua" || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, initialVendors]);

  // FUNGSI DELETE
  const handleDelete = (id: string, userId: string, name: string) => {
    if (
      confirm(
        `Hapus vendor "${name}"? Tindakan ini juga akan menghapus akun user terkait.`
      )
    ) {
      startTransition(async () => {
        const res = await deleteVendor(userId);
        if (res.success) {
          toast.success("Vendor berhasil dihapus.");
        } else {
          toast.error(res.error);
        }
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">
            Vendor Management
          </h1>
          <p className="text-sm font-light text-stone-500">
            Kelola kurasi vendor terbaik untuk Bali Wedding Hub.
          </p>
        </div>
        <Link
          href="/dashboard/admin/vendors/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-stone-900/10 transition-all hover:bg-amber-900"
        >
          <Plus size={16} /> Add New Vendor
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            Total Terdaftar
          </p>
          <p className="mt-2 font-serif text-3xl text-stone-900">
            {initialVendors.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-xl shadow-stone-900/5">
        <div className="space-y-4 border-b border-stone-50 bg-stone-50/30 p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Cari nama vendor..."
                className="w-full rounded-2xl border border-stone-100 bg-white py-3 pr-4 pl-12 text-xs shadow-sm outline-none focus:border-amber-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2 border-r border-stone-200 pr-2">
                <Filter size={14} className="text-stone-400" />
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                  Filter:
                </span>
              </div>
              {[...settings.vendor_categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-bold tracking-widest whitespace-nowrap uppercase transition-all ${
                    selectedCategory === cat
                      ? "bg-stone-900 text-white shadow-md"
                      : "border border-stone-100 bg-white text-stone-500 hover:border-amber-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-stone-100 bg-stone-50/50">
              <tr className="text-[10px] font-bold tracking-[0.15em] text-stone-500 uppercase">
                <th className="px-8 py-5">Vendor Name</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="group transition-colors hover:bg-stone-50/30"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-stone-50 bg-stone-100">
                          {vendor.images?.[0]?.url ? (
                            <Image
                              src={vendor.images[0].url}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-stone-200 text-[8px] text-stone-400 uppercase italic">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">
                            {vendor.businessName}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            IDR{" "}
                            {Number(vendor.basePrice).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-block rounded-lg bg-stone-100 px-2 py-1 text-[9px] font-bold tracking-wider text-stone-600 uppercase">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-light text-stone-600">
                      {vendor.location}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        {vendor.isVerified && (
                          <CheckCircle2 size={16} className="text-blue-500" />
                        )}
                        {vendor.isRecommended && (
                          <Star
                            size={16}
                            className="fill-amber-500 text-amber-500"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/vendors/${vendor.slug}`}
                          target="_blank"
                          className="p-2 text-stone-400 transition-colors hover:text-stone-900"
                        >
                          <ExternalLink size={18} />
                        </Link>

                        {/* EDIT BUTTON */}
                        <Link
                          href={`/admin/vendors/${vendor.id}/edit`}
                          className="p-2 text-stone-400 transition-colors hover:text-amber-700"
                        >
                          <Edit3 size={18} />
                        </Link>

                        {/* DELETE BUTTON */}
                        <button
                          disabled={isPending}
                          onClick={() =>
                            handleDelete(
                              vendor.id,
                              vendor.userId,
                              vendor.businessName
                            )
                          }
                          className="p-2 text-stone-400 transition-colors hover:text-red-700 disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-sm text-stone-400 italic"
                  >
                    Data vendor tidak ditemukan...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
