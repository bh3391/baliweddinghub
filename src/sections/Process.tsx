"use client";

import { motion } from "framer-motion";
import settings from "@/data/settings.json";
import { ArrowRight } from "lucide-react";

export default function ProcessSection() {
  const { steps } = settings;

  return (
    <section className="border-y border-stone-100 bg-[#FDFCFB] py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-serif text-3xl text-stone-900 md:text-5xl"
          >
            Langkah Menuju Bahagia
          </motion.h2>
          <p className="font-light text-stone-500 italic">
            Proses transparan, hasil maksimal.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-10 right-[15%] left-[15%] z-0 hidden h-[1px] bg-stone-200 md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative z-10 text-center"
            >
              {/* Number Circle */}
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-stone-100 bg-white shadow-sm transition-all group-hover:border-amber-900 group-hover:shadow-lg group-hover:shadow-amber-900/10">
                <span className="font-serif text-2xl text-amber-900">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-4 font-serif text-2xl text-stone-900">
                {step.title}
              </h3>
              <p className="px-4 text-sm leading-relaxed font-light text-stone-500">
                {step.description}
              </p>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="mt-8 flex justify-center text-stone-200 md:hidden">
                  <ArrowRight className="rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="mb-6 text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            Siap untuk memulai?
          </p>
          <button className="border-b-2 border-amber-900 px-8 py-4 text-sm font-bold tracking-widest text-amber-900 uppercase transition-all duration-500 hover:bg-amber-900 hover:text-white">
            Daftar Sekarang
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-4xl"
        >
          <div className="flex flex-col items-center gap-8 rounded-[2rem] border border-amber-100 bg-amber-50/50 p-8 md:flex-row md:p-12">
            <div className="flex-1 text-center md:text-left">
              <h4 className="mb-3 font-serif text-2xl text-stone-900">
                {settings.support_note.title}
              </h4>
              <p className="leading-relaxed font-light text-stone-500">
                {settings.support_note.description}
              </p>
            </div>
            <div className="flex min-w-[200px] flex-col gap-3">
              <button className="rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-amber-900">
                Hubungi Tim Kami
              </button>
              <button className="rounded-xl border border-stone-200 px-6 py-3 text-xs font-bold tracking-widest text-stone-600 uppercase transition-all hover:bg-white">
                Mulai Pilih Vendor
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
