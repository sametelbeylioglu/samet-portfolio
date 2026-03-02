"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getAbout, setAbout, type AboutContent } from "@/lib/content-manager";

const DEFAULT: AboutContent = {
  headline: "Yazılım mühendisliği ve görsel tasarımı bir araya getiriyorum.",
  headlineFaded: "Fikri koda, kodu deneyime dönüştürüyorum. Her piksel ve her satır bilinçli bir kararın ürünü.",
  cards: [
    { num: "01", title: "Yazılım", desc: "Modern web teknolojileri ile ölçeklenebilir uygulamalar geliştiriyorum." },
    { num: "02", title: "Tasarım", desc: "Marka kimliği, UI/UX ve kullanıcı odaklı arayüz tasarımı yapıyorum." },
    { num: "03", title: "Strateji", desc: "İş hedeflerini anlayarak teknolojiyi doğru yönde kullanıyorum." },
  ],
};

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutContent>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAbout().then((d) => d && setData(d));
  }, []);

  const save = async () => {
    setError("");
    try {
      await setAbout(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      if (e instanceof Error && e.message === "STORAGE_FULL") {
        setError("Depolama alanı dolu.");
      } else {
        setError("Kaydetme sırasında bir hata oluştu.");
      }
    }
  };

  const addCard = () => {
    const num = String(data.cards.length + 1).padStart(2, "0");
    setData((d) => ({ ...d, cards: [...d.cards, { num, title: "", desc: "" }] }));
  };

  const removeCard = (i: number) => {
    setData((d) => ({ ...d, cards: d.cards.filter((_, idx) => idx !== i) }));
  };

  const updateCard = (i: number, updates: Partial<AboutContent["cards"][0]>) => {
    setData((d) => ({
      ...d,
      cards: d.cards.map((c, idx) => (idx === i ? { ...c, ...updates } : c)),
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Hakkımda</h1>
        <div className="flex gap-3">
          <Link href="/#hakkımda" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
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
          <h2 className="text-[11px] text-[#6e6e73] font-mono tracking-[0.15em] uppercase mb-6">Manifesto Metni</h2>
          <p className="text-[12px] text-[#48484a] mb-6 leading-relaxed">Ana sayfadaki büyük hakkımda yazısı. İki parçadan oluşur: beyaz (vurgulu) ve gri (devam) metin.</p>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Ana metin <span className="text-[#48484a]">— beyaz, vurgulu kısım</span></label>
              <textarea value={data.headline} onChange={(e) => setData((d) => ({ ...d, headline: e.target.value }))} rows={3} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Devam metin <span className="text-[#48484a]">— gri, ikinci kısım</span></label>
              <textarea value={data.headlineFaded} onChange={(e) => setData((d) => ({ ...d, headlineFaded: e.target.value }))} rows={3} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] text-[#6e6e73] font-mono tracking-[0.15em] uppercase">Yaklaşım Kartları</h2>
            <button onClick={addCard} className="inline-flex items-center gap-1.5 text-[12px] text-[#86868b] hover:text-[#f5f5f7] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Ekle
            </button>
          </div>
          <div className="space-y-4">
            {data.cards.map((card, i) => (
              <div key={i} className="bg-[#1d1d1f] rounded-xl p-4 border border-[rgba(255,255,255,0.04)] space-y-3">
                <div className="flex gap-3 items-center">
                  <input value={card.num} onChange={(e) => updateCard(i, { num: e.target.value })} placeholder="01" className="w-14 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-lg px-3 py-2 text-sm text-center font-mono outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                  <input value={card.title} onChange={(e) => updateCard(i, { title: e.target.value })} placeholder="Başlık" className="flex-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-lg px-4 py-2 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                  <button onClick={() => removeCard(i)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-1.5 transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea value={card.desc} onChange={(e) => updateCard(i, { desc: e.target.value })} placeholder="Açıklama" rows={2} className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-lg px-4 py-2 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
