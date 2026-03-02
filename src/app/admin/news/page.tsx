"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getNews, setNews, type NewsItem } from "@/lib/content-manager";
import { uploadImage } from "@/lib/image-utils";

export default function AdminNewsPage() {
  const [items, setItemsState] = useState<NewsItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews().then(setItemsState);
  }, []);

  const add = () => {
    setItemsState((n) => [{ id: crypto.randomUUID(), title: "", content: "", date: new Date().toISOString().slice(0, 10) }, ...n]);
  };

  const remove = (id: string) => {
    setItemsState((n) => n.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<NewsItem>) => {
    setItemsState((n) => n.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    setError("");
    try {
      await setNews(items);
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

  const handleImage = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const dataUrl = await uploadImage(file, "news", { maxWidth: 1200, maxHeight: 800, quality: 0.75 });
      update(id, { image: dataUrl });
    } catch {
      setError("Görsel sıkıştırılamadı.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Haberler</h1>
        <div className="flex gap-3">
          <Link href="/haberler" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={add} className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center gap-1.5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Ekle
          </button>
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

      <div className="space-y-4">
        {items.map((n) => (
          <div key={n.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5 flex gap-4">
            <div className="w-24 shrink-0">
              {n.image ? (
                <img src={n.image} alt="" className="w-full aspect-video object-cover rounded-xl border border-[rgba(255,255,255,0.04)]" />
              ) : (
                <div className="w-full aspect-video bg-[#1d1d1f] rounded-xl flex items-center justify-center text-[#48484a] text-xs border border-[rgba(255,255,255,0.04)]">Görsel</div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImage(n.id, e)} className="mt-1 text-xs text-[#6e6e73]" />
            </div>
            <div className="flex-1 space-y-3">
              <input placeholder="Başlık" value={n.title} onChange={(e) => update(n.id, { title: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input type="date" value={n.date} onChange={(e) => update(n.id, { date: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <textarea placeholder="Özet / İçerik" value={n.summary ?? n.content} onChange={(e) => update(n.id, { summary: e.target.value, content: e.target.value })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
              <input placeholder="Kaynak URL (opsiyonel)" value={n.url ?? ""} onChange={(e) => update(n.id, { url: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <button onClick={() => remove(n.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors h-fit">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
