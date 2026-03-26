"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Phone, Eye, EyeOff, Lock } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // State untuk show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validasi Regex: Minimal 8 karakter, 1 Huruf, 1 Angka
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password minimal 8 karakter dan mengandung angka.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      data: {
        phone: phoneNumber,
        role: "user",
      },
      callbackURL: "/dashboard/user",
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
      <div className="animate-in fade-in zoom-in w-full max-w-md duration-500">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-4xl tracking-tight text-amber-900">
            Mulai Rencanamu
          </h1>
          <p className="text-sm font-light text-stone-500 italic">
            Wujudkan pernikahan impian di Bali bersama kami
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-stone-100 bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="I Gede Bhakti"
                className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 transition-all outline-none focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-50"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="081234567..."
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 pl-12 transition-all outline-none focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-50"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <Phone
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
                  size={18}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 transition-all outline-none focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-50"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Utama */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Buat Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 pr-12 pl-12 transition-all outline-none focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-50"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition-colors hover:text-amber-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="mb-2 block text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                Ulangi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50/50 p-4 pr-12 pl-12 transition-all outline-none focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-50"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Lock
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-300"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition-colors hover:text-amber-800"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="animate-pulse text-[11px] font-medium text-red-500 italic">
                * {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-stone-900 p-4 font-bold text-white shadow-xl shadow-stone-200 transition-all hover:bg-amber-900 active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Buat Akun Sekarang"
                )}
              </span>
            </button>
          </form>

          <div className="mt-10 border-t border-stone-50 pt-8 text-center">
            <p className="text-sm text-stone-400">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-amber-800 transition-colors hover:text-amber-900"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
