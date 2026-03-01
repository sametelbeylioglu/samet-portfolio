"use client";

import { useEffect, useState } from "react";
import { getSectionVisibility, setSectionVisibility, getSiteTitle, setSiteTitle, getFavicon, setFavicon, type SectionVisibility } from "@/lib/content-manager";

export default function AdminSettingsPage() {
  const [visibility, setVisibilityState] = useState<SectionVisibility>({
    hero: true, about: true, services: true, projects: true, skills: true,
    experience: true, education: true, certificates: true, blog: true, news: true, contact: true,
  });
  const [siteTitle, setSiteTitleState] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSectionVisibility().then(setVisibilityState);
    getSiteTitle().then(setSiteTitleState);
  }, []);

  const save = async () => {
    await setSectionVisibility(visibility);
    await setSiteTitle(siteTitle);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: keyof SectionVisibility) => {
    setVisibilityState((v) => ({ ...v, [key]: !v[key] }));
  };

  const handleFavicon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFavicon(reader.result as string);
    reader.readAsDataURL(file);
  };

  const sections: { key: keyof SectionVisibility; label: string }[] = [
    { key: "hero", label: "Hero" },
    { key: "about", label: "Hakkımda" },
    { key: "services", label: "Hizmetler" },
    { key: "projects", label: "Projeler" },
    { key: "skills", label: "Yetkinlikler" },
    { key: "certificates", label: "Sertifikalar" },
    { key: "experience", label: "Deneyim" },
    { key: "education", label: "Eğitim" },
    { key: "blog", label: "Blog" },
    { key: "news", label: "Haberler" },
    { key: "contact", label: "İletişim" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Ayarlar</h1>
        <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="section-label mb-6">Genel</h2>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Site Başlığı (sekme)</label>
              <input value={siteTitle} onChange={(e) => setSiteTitleState(e.target.value)} placeholder="Samet Elbeylioğlu | Portfolyo" className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Favicon</label>
              <input type="file" accept="image/*" onChange={handleFavicon} className="text-sm text-[#6e6e73]" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="section-label mb-2">Bölüm Görünürlüğü</h2>
          <p className="text-sm text-[#6e6e73] mb-6">Ana sayfada hangi bölümlerin görüneceğini seçin.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((s) => (
              <label key={s.key} className="flex items-center gap-3 cursor-pointer text-sm text-[#86868b] hover:text-[#f5f5f7] transition-colors">
                <input type="checkbox" checked={visibility[s.key]} onChange={() => toggle(s.key)} className="accent-[#f5f5f7]" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
