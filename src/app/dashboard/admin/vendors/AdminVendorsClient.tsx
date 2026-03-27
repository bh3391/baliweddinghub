"use client";

import { useState, useMemo } from "react"; // Tambahkan useMemo
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Star,
  Filter // Tambahkan icon Filter
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import settings from "@/data/settings.json"; // Ambil kategori dari settings

interface VendorAdminProps {
  initialVendors: any[];
}

export default function VendorAdminClient({ initialVendors }: VendorAdminProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua"); // State kategori baru

  // Logic Filtering Gabungan (Search + Category)
  const filteredVendors = useMemo(() => {
    return initialVendors.filter((v) => {
      const matchesSearch = v.businessName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, initialVendors]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Vendor Management</h1>
          <p className="text-sm font-light text-stone-500">Kelola kurasi vendor terbaik untuk Bali Wedding Hub.</p>
        </div>
        <Link 
          href="/admin/vendors/new" 
          className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-amber-900 shadow-lg shadow-stone-900/10"
        >
          <Plus size={16} /> Add New Vendor
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Vendor</p>
          <p className="mt-2 text-3xl font-serif text-stone-900">{initialVendors.length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-[2.5rem] border border-stone-100 bg-white shadow-xl shadow-stone-900/5 overflow-hidden">
        
        {/* Filter & Search Bar Admin Edition */}
        <div className="border-b border-stone-50 bg-stone-50/30 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama vendor..."
                className="w-full rounded-2xl border border-stone-100 bg-white py-3 pl-12 pr-4 text-xs outline-none focus:border-amber-200 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Pills (Admin Version) */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              <div className="flex items-center gap-2 pr-2 border-r border-stone-200">
                <Filter size={14} className="text-stone-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Filter:</span>
              </div>
              {[ ...settings.vendor_categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                    selectedCategory === cat
                      ? "bg-stone-900 text-white shadow-md"
                      : "bg-white text-stone-500 border border-stone-100 hover:border-amber-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50/50 border-b border-stone-100">
              <tr className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">
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
                  <tr key={vendor.id} className="group hover:bg-stone-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100 border border-stone-50">
                          {vendor.images?.[0]?.url ? (
                            <Image src={vendor.images[0].url} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-stone-200 text-[8px] uppercase text-stone-400 italic">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{vendor.businessName}</p>
                          <p className="text-[10px] text-stone-400">IDR {Number(vendor.basePrice).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-block rounded-lg bg-stone-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-600">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-stone-600 font-light">{vendor.location}</td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        {vendor.isVerified && <CheckCircle2 size={16} className="text-blue-500"  />}
                        {vendor.isRecommended && <Star size={16} className="text-amber-500 fill-amber-500"  />}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/vendors/${vendor.slug}`} 
                          target="_blank"
                          className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button className="p-2 text-stone-400 hover:text-amber-700 transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-red-700 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-stone-400 italic text-sm font-serif">Data vendor tidak ditemukan...</p>
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