"use client";

import Link from "next/link";
import settings from "@/data/settings.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          
          {/* Brand Side */}
          <div className="max-w-xs">
            <Link href="/" className="font-serif text-2xl text-stone-900 tracking-tighter">
              BALI WEDDING<span className="text-amber-800 italic">HUB</span>
            </Link>
            <p className="mt-4 text-stone-500 font-light text-sm leading-relaxed">
              Platform kurasi vendor pernikahan terbaik di Bali. Mewujudkan kesakralan hari bahagia Anda dengan transparansi dan profesionalisme.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900">Eksplorasi</h4>
              <nav className="flex flex-col gap-3">
                {settings.navigation.map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href} 
                    className="text-sm text-stone-500 hover:text-amber-900 transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-900">Kontak</h4>
              <div className="flex flex-col gap-3 text-sm text-stone-500 font-light">
                <p>Singaraja, Bali</p>
                <a href={`mailto:${settings.contact.email}`} className="hover:text-amber-900 transition-colors">
                  {settings.contact.email}
                </a>
                <a href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g,'')}`} className="hover:text-amber-900 transition-colors">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">
            © {currentYear} I Gede Bhakti Pratama.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-stone-300 uppercase tracking-widest">Crafted by</span>
            <span className="text-[10px] font-serif text-stone-500 italic uppercase tracking-tighter">Aethelia Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
}