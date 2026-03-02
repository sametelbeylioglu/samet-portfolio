"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, ImagePlus } from "lucide-react";
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
      images: [],
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

  const handleImages = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError("");
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        const dataUrl = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.75 });
        newImages.push(dataUrl);
      }
      const project = projects.find((p) => p.id === id);
      const existing = project?.images ?? [];
      const merged = [...existing, ...newImages];
      const cover = project?.image || merged[0];
      update(id, { images: merged, image: cover });
    } catch {
      setError("Görsel sıkıştırılamadı.");
    }
    e.target.value = "";
  };

  const setCover = (id: string, imgUrl: string) => {
    update(id, { image: imgUrl });
  };

  const removeImage = (id: string, imgIndex: number) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const imgs = [...(project.images ?? [])];
    const removed = imgs[imgIndex];
    imgs.splice(imgIndex, 1);
    const newCover = project.image === removed ? (imgs[0] || undefined) : project.image;
    update(id, { images: imgs, image: newCover });
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

      <div className="space-y-6">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-3">
                <input placeholder="Başlık" value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                <textarea placeholder="Açıklama" value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="URL (opsiyonel)" value={p.url ?? ""} onChange={(e) => update(p.id, { url: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                  <input placeholder="GitHub URL (opsiyonel)" value={p.github ?? ""} onChange={(e) => update(p.id, { github: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                </div>
                <input placeholder="Etiketler (virgülle ayırın)" value={p.tags?.join(", ") ?? ""} onChange={(e) => update(p.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                <label className="flex items-center gap-2 text-sm text-[#86868b]">
                  <input type="checkbox" checked={p.featured ?? false} onChange={(e) => update(p.id, { featured: e.target.checked })} className="accent-[#f5f5f7]" />
                  Öne çıkan
                </label>
              </div>
              <button onClick={() => remove(p.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors ml-3 shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.04)] pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-[#6e6e73] font-mono tracking-[0.1em] uppercase">
                  Görseller {(p.images?.length ?? 0) > 0 && `(${p.images!.length})`}
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-[12px] text-[#86868b] hover:text-[#f5f5f7] transition-colors">
                  <ImagePlus className="w-3.5 h-3.5" /> Ekle
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImages(p.id, e)} className="hidden" />
                </label>
              </div>
              {(p.images?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {p.images!.map((img, i) => (
                    <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-[rgba(255,255,255,0.04)]">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setCover(p.id, img)}
                          title="Kapak yap"
                          className={`p-1.5 rounded-full transition-colors ${p.image === img ? "bg-[#5856d6] text-white" : "bg-[rgba(255,255,255,0.1)] text-[#86868b] hover:text-white"}`}
                        >
                          <Star className="w-3 h-3" fill={p.image === img ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => removeImage(p.id, i)}
                          title="Sil"
                          className="p-1.5 rounded-full bg-[rgba(255,255,255,0.1)] text-[#ff453a] hover:bg-[rgba(255,69,58,0.2)] transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {p.image === img && (
                        <div className="absolute top-1 left-1 bg-[#5856d6] text-white text-[8px] font-mono px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          Kapak
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full py-8 rounded-xl border border-dashed border-[rgba(255,255,255,0.06)] flex items-center justify-center">
                  <p className="text-[12px] text-[#3a3a3c]">Henüz görsel eklenmedi</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
