import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Process from "@/sections/Process";
import Pricing from "@/sections/Pricing";
import { div } from "framer-motion/client";
import Navbar from "../components/public/Navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <main className="px-1">
        <Hero />
        <Features />
        <Process />
        <Pricing />
      </main>
    </div>
  );
}
