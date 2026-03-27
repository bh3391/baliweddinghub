"use client";

import { motion } from "framer-motion";
import settings from "@/data/settings.json";
import { Check, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const { pricing } = settings;

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl text-stone-900 md:text-5xl">
            {pricing.section_title}
          </h2>
          <p className="font-light text-stone-500 italic">
            {pricing.section_subtitle}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {pricing.plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative rounded-[3rem] border p-10 md:p-14 ${
                plan.highlight
                  ? "border-amber-200 bg-amber-50/30 shadow-2xl shadow-amber-900/5"
                  : "border-stone-100 bg-stone-50/30"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-900 px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                  Rekomendasi Ahli
                </span>
              )}

              <div className="mb-8">
                <h3 className="mb-2 font-serif text-2xl text-stone-900">
                  {plan.name}
                </h3>
                <p className="mb-6 text-xs font-light tracking-widest text-stone-400 uppercase">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold tracking-tighter text-stone-400 uppercase">
                    IDR
                  </span>
                  <span className="font-serif text-5xl text-amber-900">
                    {plan.price}
                  </span>
                  {plan.name === "Self-Service" && (
                    <span className="font-light text-stone-400">
                      / sekali bayar
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-10 space-y-4">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white">
                      <Check className="text-amber-800" size={12} />
                    </div>
                    <span className="text-sm font-light text-stone-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-xs font-bold tracking-widest uppercase transition-all ${
                  plan.highlight
                    ? "bg-amber-900 text-white hover:bg-stone-900"
                    : "border border-stone-200 bg-white text-stone-800 hover:bg-stone-900 hover:text-white"
                }`}
              >
                {plan.button_text}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Note Tambahan */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">
            * Seluruh vendor telah melewati verifikasi tim Bali Wedding Hub
          </p>
        </div>
      </div>
    </section>
  );
}
