"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import settings from "@/data/settings.json";

export default function HeroSection() {
  const { hero } = settings;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-900">
      {/* Background Image with Overlay */}
      <div
        className="animate-slow-zoom animate-slow-zoom absolute inset-0 z-0 scale-110 bg-cover bg-center bg-no-repeat transition-transform duration-[10s]"
        style={{ backgroundImage: `url('${hero.image_url}')` }}
      >
        {/* Dark Overlay untuk menjaga keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-900" />
      </div>

      {/* Decorative Blur Elements (tetap dipertahankan untuk kedalaman visual) */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full opacity-20">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-amber-600 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-stone-500 blur-[100px]" />
      </div>

      <div className="relative z-20 container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block text-[10px] font-bold tracking-[0.4em] text-amber-400 uppercase drop-shadow-md"
          >
            Bali Wedding Hub • Est. 2026
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 font-serif text-5xl leading-[1.1] text-white drop-shadow-xl md:text-8xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-light text-stone-200 drop-shadow-md md:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Link
              href="/register"
              className="w-full rounded-2xl bg-amber-800 px-12 py-5 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-amber-700 hover:shadow-2xl hover:shadow-amber-900/40 active:scale-95 sm:w-auto"
            >
              {hero.cta_primary}
            </Link>

            <Link
              href="https://wa.me/62xxxxxxxx"
              className="w-full rounded-2xl border border-white/30 px-12 py-5 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-sm transition-all hover:bg-white hover:text-stone-900 sm:w-auto"
            >
              {hero.cta_secondary}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="mx-auto h-16 w-[1px] bg-gradient-to-b from-amber-400 to-transparent" />
      </motion.div>
    </section>
  );
}
