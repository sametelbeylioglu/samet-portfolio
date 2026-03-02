"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getNews, type NewsItem } from "@/lib/content-manager";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  social_image: string | null;
  published_at: string;
  tag_list: string[];
  user: { name: string };
  reading_time_minutes: number;
}

const DEVTO_TAGS = ["design", "webdev", "ai", "uxdesign", "vibecoding"];
const SEP = "\n||||\n";

async function translateBatch(texts: string[]): Promise<string[]> {
  if (texts.length === 0) return [];
  const chunks: string[][] = [];
  let current: string[] = [];
  let len = 0;
  for (const t of texts) {
    if (len + t.length > 4000 && current.length > 0) {
      chunks.push(current);
      current = [];
      len = 0;
    }
    current.push(t);
    len += t.length + SEP.length;
  }
  if (current.length > 0) chunks.push(current);

  const translated: string[] = [];
  for (const chunk of chunks) {
    const combined = chunk.join(SEP);
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(combined)}`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json();
      const full = (data[0] as [string][]).map((s) => s[0]).join("");
      const parts = full.split("||||").map((s: string) => s.trim());
      translated.push(...parts);
    } catch {
      translated.push(...chunk);
    }
  }
  return translated;
}

async function fetchByTag(tag: string): Promise<DevToArticle[]> {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?tag=${tag}&per_page=8&top=7`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchDevToArticles(): Promise<NewsItem[]> {
  const results = await Promise.all(DEVTO_TAGS.map(fetchByTag));
  const all = results.flat();

  const seen = new Set<number>();
  const unique = all.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  unique.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const sliced = unique.slice(0, 25);

  const titles = sliced.map((a) => a.title);
  const descs = sliced.map((a) => a.description);

  const [trTitles, trDescs] = await Promise.all([
    translateBatch(titles),
    translateBatch(descs),
  ]);

  return sliced.map((a, i) => ({
    id: `devto-${a.id}`,
    title: trTitles[i] ?? a.title,
    content: trDescs[i] ?? a.description,
    summary: trDescs[i] ?? a.description,
    source: `dev.to / ${a.user.name}`,
    url: a.url,
    date: a.published_at.slice(0, 10),
    image: a.cover_image || a.social_image || undefined,
  }));
}

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

type Tab = "all" | "manual" | "devto";

export default function NewsPage() {
  const [manual, setManual] = useState<NewsItem[]>([]);
  const [devto, setDevto] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    Promise.all([
      getNews(),
      fetchDevToArticles(),
    ]).then(([m, d]) => {
      setManual(m);
      setDevto(d);
      setLoading(false);
    });
  }, []);

  const refreshDevTo = async () => {
    setLoading(true);
    const d = await fetchDevToArticles();
    setDevto(d);
    setLoading(false);
  };

  const allNews = tab === "manual" ? manual
    : tab === "devto" ? devto
    : [...manual, ...devto].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <R cls="mt-10 mb-12">
            <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
              Güncel<span className="text-[#3a3a3c]">.</span>
            </h1>
          </R>

          <R cls="mb-16">
            <div className="flex items-center gap-3 flex-wrap">
              {([
                ["all", "Tümü"],
                ["devto", "Dev.to"],
                ["manual", "Kendi Haberlerim"],
              ] as [Tab, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`text-[13px] px-4 py-2 rounded-full border transition-all ${
                    tab === key
                      ? "border-[rgba(255,255,255,0.15)] text-[#f5f5f7] bg-[rgba(255,255,255,0.04)]"
                      : "border-[rgba(255,255,255,0.06)] text-[#48484a] hover:text-[#6e6e73] hover:border-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={refreshDevTo}
                disabled={loading}
                className="text-[13px] text-[#48484a] hover:text-[#6e6e73] transition-colors flex items-center gap-1.5 ml-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Yenile
              </button>
            </div>
          </R>

          {loading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-5 h-5 text-[#3a3a3c] animate-spin" />
            </div>
          ) : allNews.length === 0 ? (
            <p className="text-[#3a3a3c] text-sm">Henüz haber yok.</p>
          ) : allNews.map(n => (
            <R key={n.id}>
              <div className="py-8 border-b border-[rgba(255,255,255,0.03)] last:border-0 group flex justify-between items-start gap-6">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] text-[#3a3a3c] mb-2 tracking-[0.1em]">
                    {n.date ? format(new Date(n.date), "d MMMM yyyy", { locale: tr }).toUpperCase() : ""}
                    {n.source && <span className="text-[#2d2d2f]"> · {n.source.toUpperCase()}</span>}
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
