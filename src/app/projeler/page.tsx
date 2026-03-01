"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProjects, type Project } from "@/lib/content-manager";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => { getProjects().then(setProjects); }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />
      <main className="pt-32 pb-40 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <R><span className="label">Projeler</span></R>
          <R cls="mt-10 mb-20">
            <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
              Tüm Çalışmalar<span className="text-[#3a3a3c]">.</span>
            </h1>
          </R>

          {projects.length === 0 ? (
            <p className="text-[#3a3a3c] text-sm">Henüz proje eklenmedi.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                <R key={p.id}>
                  <div className="spotlight-card group">
                    {p.image && (
                      <div className="img-zoom"><img src={p.image} alt={p.title} className="w-full aspect-[2.2/1] object-cover" style={{ borderRadius: "16px 16px 0 0" }} /></div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        {p.year && <span className="font-mono text-[11px] text-[#3a3a3c] block mb-3">{p.year}</span>}
                        <h2 className="text-[#f5f5f7] text-2xl font-bold tracking-[-0.03em] mb-3">{p.title}</h2>
                        <p className="text-[#6e6e73] text-[14px] leading-[1.7] max-w-xl">{p.description}</p>
                        {p.tags && <div className="flex flex-wrap gap-2 mt-5">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>}
                      </div>
                      {(p.demoUrl || p.githubUrl || p.url || p.github) && (
                        <a href={p.demoUrl || p.url || p.githubUrl || p.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#3a3a3c] group-hover:text-[#f5f5f7] group-hover:border-[rgba(255,255,255,0.15)] transition-all shrink-0">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </R>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
