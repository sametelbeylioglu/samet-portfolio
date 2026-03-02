"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, ExternalLink } from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { getBlogPosts, setBlogPosts, type BlogPost } from "@/lib/content-manager";
import { uploadImage } from "@/lib/image-utils";

export default function AdminBlogPage() {
  const [posts, setPostsState] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogPosts().then(setPostsState);
  }, []);

  const add = () => {
    const post: BlogPost = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      excerpt: "",
      published: false,
      createdAt: new Date().toISOString(),
    };
    setPostsState((p) => [post, ...p]);
    setEditing(post);
  };

  const remove = (id: string) => {
    setPostsState((p) => p.filter((x) => x.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const update = (id: string, updates: Partial<BlogPost>) => {
    setPostsState((p) => p.map((x) => (x.id === id ? { ...x, ...updates } : x)));
    if (editing?.id === id) setEditing({ ...editing, ...updates });
  };

  const save = async () => {
    setError("");
    try {
      await setBlogPosts(posts);
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
      const dataUrl = await uploadImage(file, "blog", { maxWidth: 1200, maxHeight: 800, quality: 0.75 });
      update(id, { image: dataUrl });
    } catch {
      setError("Görsel sıkıştırılamadı.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Blog</h1>
        <div className="flex gap-3">
          <Link href="/blog" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={add} className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center gap-1.5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Yeni Yazı
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className={`glass rounded-2xl border p-5 transition-colors ${editing?.id === p.id ? "border-[rgba(255,255,255,0.15)]" : "border-[rgba(255,255,255,0.04)]"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#f5f5f7]">{p.title || "Başlıksız"}</h3>
                  <p className="text-sm text-[#6e6e73] line-clamp-1 mt-1">{p.excerpt || p.content?.slice(0, 50)}</p>
                  <span className={`text-xs mt-1 inline-block ${p.published ? "text-[#30d158]" : "text-[#ff9f0a]"}`}>{p.published ? "Yayında" : "Taslak"}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="text-[#48484a] hover:text-[#86868b] hover:bg-[rgba(255,255,255,0.04)] rounded-full p-2 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <Link href={`/blog?id=${p.id}`} target="_blank" className="text-[#48484a] hover:text-[#86868b] hover:bg-[rgba(255,255,255,0.04)] rounded-full p-2 transition-colors inline-flex">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button onClick={() => remove(p.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6 space-y-5">
            <input placeholder="Başlık" value={editing.title} onChange={(e) => update(editing.id, { title: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Özet</label>
              <textarea value={editing.excerpt} onChange={(e) => update(editing.id, { excerpt: e.target.value })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">Kapak görseli</label>
              <input type="file" accept="image/*" onChange={(e) => handleImage(editing.id, e)} className="text-sm text-[#6e6e73]" />
              {editing.image && <img src={editing.image} alt="" className="mt-3 w-full max-h-40 object-cover rounded-xl border border-[rgba(255,255,255,0.04)]" />}
            </div>
            <div>
              <label className="text-xs text-[#6e6e73] block mb-1.5">İçerik</label>
              <RichTextEditor value={editing.content} onChange={(html) => update(editing.id, { content: html })} className="mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#86868b]">
              <input type="checkbox" checked={editing.published} onChange={(e) => update(editing.id, { published: e.target.checked })} className="accent-[#f5f5f7]" />
              Yayınla
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
