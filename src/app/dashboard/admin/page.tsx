"use client";

import { authClient } from "@/lib/auth-client";

export default function UserDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Data dummy untuk tampilan awal

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <header>
        <h1 className="font-serif text-3xl text-amber-900">
          Selamat Datang, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 font-light text-stone-500 italic"></p>
      </header>

      {/* Quick Stats Grid */}
    </div>
  );
}
