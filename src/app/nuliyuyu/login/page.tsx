"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Tum alanlari doldurun."); return; }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      router.push("/nuliyuyu");
    } else {
      setError(result.error ?? "Giris basarisiz.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      <div className="grain" />
      <div className="mesh-gradient mesh-1" style={{ top: "10%", left: "10%" }} />
      <div className="mesh-gradient mesh-2" style={{ bottom: "10%", right: "10%" }} />

      <div className="relative z-10 w-full max-w-[380px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfa
        </Link>

        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[rgba(255,255,255,0.04)] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-[#6e6e73]" />
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.03em] text-[#f5f5f7] mb-2">Yonetim Paneli</h1>
          <p className="text-[13px] text-[#48484a]">Devam etmek icin giris yapin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">E-POSTA</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              className="w-full h-11 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111] px-4 text-[14px] text-[#f5f5f7] placeholder:text-[#3a3a3c] focus:outline-none focus:border-[rgba(255,255,255,0.15)] transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">SIFRE</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sifrenizi girin"
                autoComplete="current-password"
                className="w-full h-11 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111] px-4 pr-11 text-[14px] text-[#f5f5f7] placeholder:text-[#3a3a3c] focus:outline-none focus:border-[rgba(255,255,255,0.15)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3a3c] hover:text-[#6e6e73] transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-[#ff453a] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-40"
          >
            {loading ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>

        <p className="text-[11px] text-[#2d2d2f] text-center mt-8 font-mono">
          Supabase Auth
        </p>
      </div>
    </div>
  );
}
