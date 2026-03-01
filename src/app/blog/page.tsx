"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getBlogPosts, type BlogPost } from "@/lib/content-manager";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function R({ children, cls }: { children: React.ReactNode; cls?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`fade-up ${cls ?? ""}`}>{children}</div>;
}

function Content() {
  const params = useSearchParams();
  const slug = params.get("post");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  useEffect(() => { getBlogPosts().then(setPosts); }, []);

  if (slug) {
    const post = posts.find(p => p.slug === slug || p.id === slug);
    if (!post && posts.length > 0) return <p className="text-[#3a3a3c] pt-40 text-center text-sm">Yazı bulunamadı.</p>;
    if (!post) return <p className="text-[#3a3a3c] pt-40 text-center text-sm">Yükleniyor…</p>;

    return (
      <article className="pt-32 pb-40 px-6">
        <div className="max-w-[680px] mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <p className="font-mono text-[11px] text-[#3a3a3c] tracking-[0.15em] mb-8">
            {post.publishedAt ? format(new Date(post.publishedAt), "d MMMM yyyy", { locale: tr }).toUpperCase() : ""}
            {post.readTime && ` · ${post.readTime}`}
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.04em] leading-[1.1] text-[#f5f5f7] mb-10">{post.title}</h1>
          {(post.coverImage || post.image) && (
            <div className="img-zoom mb-12"><img src={post.coverImage || post.image} alt={post.title} className="w-full rounded-xl" /></div>
          )}
          <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    );
  }

  const published = posts.filter(p => p.status === "published" || p.published);

  return (
    <div className="pt-32 pb-40 px-6">
      <div className="max-w-[1000px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Geri
        </Link>
        <R><span className="label">Blog</span></R>
        <R cls="mt-10 mb-20">
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
            Yazılar<span className="text-[#3a3a3c]">.</span>
          </h1>
        </R>

        {published.length === 0 ? (
          <p className="text-[#3a3a3c] text-sm">Henüz yazı eklenmedi.</p>
        ) : (
          <div>
            {published.map(p => (
              <R key={p.id}>
                <Link href={`/blog?post=${p.slug || p.id}`}>
                  <div className="group py-10 border-b border-[rgba(255,255,255,0.03)] last:border-0 flex justify-between items-start gap-8">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-[#3a3a3c] mb-3 flex items-center gap-3">
                        {p.publishedAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(p.publishedAt), "d MMMM yyyy", { locale: tr })}</span>}
                        {p.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.readTime}</span>}
                      </p>
                      <h2 className="text-[#f5f5f7] text-xl font-semibold tracking-[-0.02em] mb-2 group-hover:text-white transition-colors">{p.title}</h2>
                      <p className="text-[#48484a] text-[14px] leading-[1.6] line-clamp-2 max-w-xl">{p.excerpt}</p>
                    </div>
                    {(p.coverImage || p.image) && (
                      <div className="hidden md:block w-[160px] shrink-0 img-zoom">
                        <img src={p.coverImage || p.image} alt={p.title} className="w-full aspect-[16/10] object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                </Link>
              </R>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />
      <Suspense fallback={<div className="pt-40 text-center text-[#3a3a3c] text-sm">Yükleniyor…</div>}><Content /></Suspense>
      <Footer />
    </div>
  );
}
