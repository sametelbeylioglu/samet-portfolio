"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
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

function ProjectDetail({ project }: { project: Project }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const allImages = project.images?.length ? project.images : (project.image ? [project.image] : []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => i !== null ? (i + 1) % allImages.length : null);
      if (e.key === "ArrowLeft") setLightbox((i) => i !== null ? (i - 1 + allImages.length) % allImages.length : null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, allImages.length]);

  return (
    <>
      <Link href="/projeler" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Tüm Projeler
      </Link>

      <R>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            {project.year && <span className="font-mono text-[11px] text-[#3a3a3c] block mb-3">{project.year}</span>}
            <h1 className="text-[clamp(36px,5vw,64px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">{project.title}</h1>
          </div>
          {(project.demoUrl || project.url || project.githubUrl || project.github) && (
            <a
              href={project.demoUrl || project.url || project.githubUrl || project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0"
            >
              Projeyi Gör <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </R>

      {project.description && (
        <R cls="mb-12">
          <p className="text-[#6e6e73] text-[17px] leading-[1.7] max-w-2xl">{project.description}</p>
        </R>
      )}

      {project.tags && project.tags.length > 0 && (
        <R cls="mb-16">
          <div className="flex flex-wrap gap-2">
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </R>
      )}

      {allImages.length > 0 && (
        <R cls="mb-16">
          <div className={`grid gap-3 ${allImages.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={`overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.04)] cursor-zoom-in group ${i === 0 && allImages.length > 1 ? "md:col-span-2" : ""}`}
              >
                <img
                  src={img}
                  alt={`${project.title} - ${i + 1}`}
                  className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  style={{ aspectRatio: i === 0 && allImages.length > 1 ? "2.2/1" : "16/10" }}
                />
              </button>
            ))}
          </div>
        </R>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-[#6e6e73] hover:text-white transition-colors z-10">
            <X className="w-6 h-6" />
          </button>
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + allImages.length) % allImages.length); }}
                className="absolute left-4 md:left-8 text-[#6e6e73] hover:text-white transition-colors z-10 p-2"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % allImages.length); }}
                className="absolute right-4 md:right-8 text-[#6e6e73] hover:text-white transition-colors z-10 p-2"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <img
            src={allImages[lightbox]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightbox ? "bg-white" : "bg-[#3a3a3c]"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <>
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Geri
      </Link>
      <R><span className="label">Projeler</span></R>
      <R cls="mt-10 mb-20">
        <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
          Tüm Çalışmalar<span className="text-[#3a3a3c]">.</span>
        </h1>
      </R>

      {projects.length === 0 ? null : (
        <div className="space-y-4">
          {projects.map((p) => (
            <R key={p.id}>
              <Link href={`/projeler?id=${p.id}`} className="block">
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
                    <div className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#3a3a3c] group-hover:text-[#f5f5f7] group-hover:border-[rgba(255,255,255,0.15)] transition-all shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </R>
          ))}
        </div>
      )}
    </>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProjects().then((p) => { setProjects(p); setLoaded(true); });
  }, []);

  if (!loaded) return null;

  const selected = projectId ? projects.find((p) => p.id === projectId) : null;

  return selected ? <ProjectDetail project={selected} /> : <ProjectsList projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />
      <main className="pt-32 pb-40 px-6">
        <div className="max-w-[1000px] mx-auto">
          <Suspense>
            <ProjectsContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
