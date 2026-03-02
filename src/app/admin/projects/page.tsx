"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getProjects, setProjects, type Project } from "@/lib/content-manager";
import { compressImage } from "@/lib/image-utils";

export default function AdminProjectsPage() {
  const [projects, setProjectsState] = useState<Project[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects().then(setProjectsState);
  }, []);

  const add = () => {
    setProjectsState((p) => [...p, {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      tags: [],
      order: projects.length,
      createdAt: new Date().toISOString(),
      featured: false,
    }]);
  };

  const remove = (id: string) => {
    setProjectsState((p) => p.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Project>) => {
    setProjectsState((p) => p.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    setError("");
    try {
      const withOrder = projects.map((p, i) => ({ ...p, order: i }));
      await setProjects(withOrder);
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
      const dataUrl = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.75 });
      update(id, { image: dataUrl });
    } catch {
      setError("Görsel sıkıştırılamadı.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Projeler</h1>
        <div className="flex gap-3">
          <Link href="/projeler" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
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
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5 flex gap-4">
            <div className="w-32 shrink-0">
              {p.image ? (
                <img src={p.image} alt="" className="w-full aspect-video object-cover rounded-xl border border-[rgba(255,255,255,0.04)]" />
              ) : (
                <div className="w-full aspect-video bg-[#1d1d1f] rounded-xl flex items-center justify-center text-[#48484a] text-sm border border-[rgba(255,255,255,0.04)]">Görsel yok</div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImage(p.id, e)} className="mt-2 text-xs text-[#6e6e73]" />
            </div>
            <div className="flex-1 space-y-3">
              <input placeholder="Başlık" value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <textarea placeholder="Açıklama" value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
              <input placeholder="URL (opsiyonel)" value={p.url ?? ""} onChange={(e) => update(p.id, { url: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="GitHub URL (opsiyonel)" value={p.github ?? ""} onChange={(e) => update(p.id, { github: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="Etiketler (virgülle ayırın)" value={p.tags?.join(", ") ?? ""} onChange={(e) => update(p.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <label className="flex items-center gap-2 text-sm text-[#86868b]">
                <input type="checkbox" checked={p.featured ?? false} onChange={(e) => update(p.id, { featured: e.target.checked })} className="accent-[#f5f5f7]" />
                Öne çıkan
              </label>
            </div>
            <button onClick={() => remove(p.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors h-fit">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
