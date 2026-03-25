"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCFB] p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-4xl text-amber-900">
            Bergabunglah
          </h1>
          <p className="text-sm font-light text-stone-500">
            Mulai langkah awal menuju hari bahagiamu
          </p>
        </div>

        {/* Card Section */}
        <div className="rounded-2xl border border-stone-100 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="I Gede Bhakti..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Buat Password
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role Selection - Lebih Visual */}
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Daftar Sebagai
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-700 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  <option value="user">Calon Pengantin</option>
                  <option value="vendor">Vendor Wedding</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-amber-800 p-4 font-medium text-white transition-all hover:bg-amber-900 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sedang Mendaftarkan..." : "Daftar Akun"}
            </button>
          </form>

          <div className="mt-8 border-t border-stone-50 pt-6 text-center">
            <p className="text-sm text-stone-500">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-800 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-[10px] tracking-widest text-stone-400 uppercase">
          Bali Wedding Hub &bull; Est. 2026
        </p>
      </div>
    </div>
  );
}
