"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import navData from "@/data/navigation.json";
import { authClient } from "@/lib/auth-client";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const roleKey = (user?.role as keyof typeof navData) || "user";
  // Batasi menu yang tampil di bottom nav (misal maksimal 5 menu utama)
  const menuItems = (navData[roleKey] || navData.user).slice(0, 5);

  return (
    <nav className="pb-safe fixed right-0 bottom-0 left-0 z-[100] border-t border-stone-100 bg-white/80 px-2 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {menuItems.map((item: any) => {
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1"
            >
              <div
                className={`rounded-xl p-1.5 transition-colors ${isActive ? "bg-amber-100 text-amber-900" : "text-stone-400"}`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <span
                className={`w-full truncate text-center text-[9px] font-bold tracking-tighter uppercase ${isActive ? "text-amber-900" : "text-stone-400"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
