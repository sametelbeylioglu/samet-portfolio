"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getNews, type NewsItem } from "@/lib/content-manager";
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

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => { getNews().then(setNews); }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />
      <main className="pt-32 pb-40 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <R><span className="label">Haberler</span></R>
          <R cls="mt-10 mb-20">
            <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
              Güncel<span className="text-[#3a3a3c]">.</span>
            </h1>
          </R>

          {news.length === 0 ? (
            <p className="text-[#3a3a3c] text-sm">Henüz haber eklenmedi.</p>
          ) : news.map(n => (
            <R key={n.id}>
              <div className="py-8 border-b border-[rgba(255,255,255,0.03)] last:border-0 group flex justify-between items-start gap-6">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] text-[#3a3a3c] mb-2 tracking-[0.1em]">
                    {n.date ? format(new Date(n.date), "d MMMM yyyy", { locale: tr }).toUpperCase() : ""}
                    {n.source && ` · ${n.source.toUpperCase()}`}
                  </p>
                  <h2 className="text-[#f5f5f7] text-[16px] font-medium tracking-[-0.01em] group-hover:text-white transition-colors">
                    {n.url ? (
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        {n.title} <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#5856d6]" />
                      </a>
                    ) : n.title}
                  </h2>
                  {n.summary && <p className="text-[#48484a] text-[13px] leading-[1.6] mt-2 max-w-2xl">{n.summary}</p>}
                </div>
                {n.image && (
                  <div className="hidden md:block w-16 h-16 shrink-0 img-zoom">
                    <img src={n.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </R>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
