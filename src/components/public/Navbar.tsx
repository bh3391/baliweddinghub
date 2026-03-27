"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import settings from "@/data/settings.json";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? "bg-white/80 backdrop-blur-md border-b border-stone-100 py-4" : "bg-white/60 py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-stone-900 tracking-tighter">
          BALI WEDDING<span className="text-amber-800 italic">HUB</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {settings.navigation.map((item, i) => (
            <Link key={i} href={item.href} className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-amber-900 transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="px-6 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-amber-900 transition-all">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}