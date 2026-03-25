"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import Link from "next/link";
import navData from "@/data/navigation.json";

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user as any;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const roleKey = (user?.role as keyof typeof navData) || "user";
  const menuItems = navData[roleKey] || navData.user;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-stone-100 bg-white lg:flex">
      <div className="p-8">
        <h2 className="font-serif text-xl tracking-tight text-amber-900">
          Bali Wedding Hub
        </h2>
        <p className="mt-1 text-[10px] tracking-widest text-stone-400 uppercase">
          {user?.role} Panel
        </p>
      </div>

      <nav className="no-scrollbar flex-grow space-y-1 overflow-y-auto px-4">
        {menuItems.map((item: any) => {
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-50 text-amber-900 shadow-sm"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <IconComponent
                className={`h-5 w-5 ${isActive ? "text-amber-700" : "text-stone-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-100 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <Icons.LogOut className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
