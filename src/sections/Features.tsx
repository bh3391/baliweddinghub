"use client";

import { motion } from "framer-motion";
import settings from "@/data/settings.json";
import { CheckCircle2, Star, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  const { stats, features } = settings;

  // Map icon manual karena JSON tidak bisa menyimpan komponen
  const icons = [<Star />, <ShieldCheck />, <CheckCircle2 />];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Statistics Row */}
        <div className="mb-24 grid grid-cols-2 gap-8 md:grid-cols-3">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[2rem] border border-stone-100 bg-stone-50/50 p-8 text-center"
            >
              <h2 className="mb-2 font-serif text-4xl text-amber-900 md:text-5xl">
                {item.value}
              </h2>
              <p className="text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features Content */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-3xl text-stone-900 md:text-4xl">
            Mengapa Memilih Kami?
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-amber-800" />
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-900 transition-colors group-hover:bg-amber-900 group-hover:text-white">
                {icons[index]}
              </div>
              <h3 className="mb-4 font-serif text-xl text-stone-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed font-light text-stone-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
