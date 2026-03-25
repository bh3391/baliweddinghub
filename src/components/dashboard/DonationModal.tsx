"use client";

import { CheckCircle2, Coffee } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 p-4 backdrop-blur-md duration-500">
      <div className="animate-in zoom-in w-full max-w-md rounded-[3rem] bg-white p-10 text-center shadow-2xl duration-300">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="mb-2 font-serif text-2xl font-bold text-stone-900 italic">
          Terima Kasih!
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-stone-500">
          Inquiry Anda telah berhasil dikirim. Kami berharap hari bahagia Anda
          di Buleleng berjalan lancar!
        </p>

        <div className="mb-6 rounded-3xl border border-amber-100/50 bg-amber-50/50 p-6">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-amber-800 uppercase">
            Support Platform Lokal
          </p>
          <p className="mb-4 text-[12px] text-stone-600 italic">
            "Buleleng Wedding Hub dikelola secara mandiri untuk memajukan vendor
            lokal. Donasi kopi membantu kami tetap semangat!"
          </p>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700">
            <Coffee size={18} /> Traktir Kopi Tim Dev
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-medium text-stone-400 transition-colors hover:text-stone-800"
        >
          Tutup & Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
