"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile, getHero, setProfile, setHero, type Profile, type HeroContent } from "@/lib/content-manager";
import { compressImage } from "@/lib/image-utils";

export default function AdminProfilePage() {
  const [profile, setProfileState] = useState<Profile>({ name: "", title: "", bio: "" });
  const [hero, setHeroState] = useState<HeroContent>({
    greeting: "",
    headline: "",
    subheadline: "",
    ctaText: "Çalışmalarımı İncele",
    ctaLink: "/#projeler",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then((p) => p && setProfileState(p));
    getHero().then((h) => h && setHeroState(h));
  }, []);

  const handleSave = async () => {
    setError("");
    try {
      await setProfile(profile);
      await setHero({ ...hero, headline: profile.name, subheadline: profile.bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      if (e instanceof Error && e.message === "STORAGE_FULL") {
        setError("Depolama alanı dolu. Görselleri küçültün veya bazı verileri silin.");
      } else {
        setError("Kaydetme sırasında bir hata oluştu.");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const dataUrl = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.75 });
      setProfileState((p) => ({ ...p, image: dataUrl }));
    } catch {
      setError("Görsel sıkıştırılamadı. Farklı bir dosya deneyin.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Profil & Ana Sayfa</h1>
        <div className="flex gap-3">
          <Link href="/" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={handleSave} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.2)] text-[#ff453a] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="text-[11px] text-[#6e6e73] font-mono tracking-[0.15em] uppercase mb-6">Kişisel Bilgiler</h2>
          <p className="text-[12px] text-[#48484a] mb-6 leading-relaxed">Bu bilgiler ana sayfanın hero bölümünde görünür.</p>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Ad Soyad <span className="text-[#48484a]">— ana sayfadaki büyük başlık</span></label>
              <input value={profile.name} onChange={(e) => setProfileState((p) => ({ ...p, name: e.target.value }))} placeholder="örn: Samet Elbeylioğlu" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Unvan <span className="text-[#48484a]">— ismin altındaki mor yazı</span></label>
              <input value={profile.title} onChange={(e) => setProfileState((p) => ({ ...p, title: e.target.value }))} placeholder="örn: Yazılım Geliştirici & Grafik Tasarımcı" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Kısa Açıklama <span className="text-[#48484a]">— unvanın altındaki açıklama yazısı</span></label>
              <textarea value={profile.bio} onChange={(e) => setProfileState((p) => ({ ...p, bio: e.target.value }))} rows={3} placeholder="örn: Dijital deneyimler tasarlıyor ve geliştiriyorum." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Profil Fotoğrafı <span className="text-[#48484a]">— ismin üstündeki yuvarlak resim</span></label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-[#6e6e73]" />
              {profile.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={profile.image} alt="Profil" className="w-20 h-20 rounded-full object-cover border border-[rgba(255,255,255,0.04)]" />
                  <button onClick={() => setProfileState((p) => ({ ...p, image: undefined }))} className="text-xs text-[#ff453a] hover:underline">Kaldır</button>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Özgeçmiş URL <span className="text-[#48484a]">— opsiyonel</span></label>
              <input value={profile.resumeUrl ?? ""} onChange={(e) => setProfileState((p) => ({ ...p, resumeUrl: e.target.value || undefined }))} placeholder="https://..." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="text-[11px] text-[#6e6e73] font-mono tracking-[0.15em] uppercase mb-6">Hero Ayarları</h2>
          <p className="text-[12px] text-[#48484a] mb-6 leading-relaxed">Ana sayfa hero bölümünün ek ayarları.</p>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Karşılama Metni <span className="text-[#48484a]">— ismin üstünde küçük yazı (boş bırakılabilir)</span></label>
              <input value={hero.greeting} onChange={(e) => setHeroState((h) => ({ ...h, greeting: e.target.value }))} placeholder="örn: Merhaba, ben" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#6e6e73] block mb-1.5">Buton Metni</label>
                <input value={hero.ctaText} onChange={(e) => setHeroState((h) => ({ ...h, ctaText: e.target.value }))} placeholder="Çalışmalarımı İncele" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-[#6e6e73] block mb-1.5">Buton Linki</label>
                <input value={hero.ctaLink} onChange={(e) => setHeroState((h) => ({ ...h, ctaLink: e.target.value }))} placeholder="/#projeler" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
