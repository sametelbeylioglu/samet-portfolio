"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Award, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  getHero, getProfile, getServices, getProjects, getSkills,
  getExperience, getEducation, getCertificates, getContactInfo, getSectionVisibility,
  type HeroContent, type Profile, type Service, type Project, type Skill,
  type Experience, type Education, type Certificate, type ContactInfo, type SectionVisibility,
} from "@/lib/content-manager";

/* ════════════ HOOKS ════════════ */

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); }
    }, { threshold, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

function WordStagger({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!text) return;
    setReady(true);
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    const words = text.split(" ");
    el.innerHTML = "";
    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "word";
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;
      inner.style.transitionDelay = `${0.08 * i}s`;
      outer.appendChild(inner);
      el.appendChild(outer);
    });
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [text, ready]);

  return <div ref={ref} className={`word-stagger ${className ?? ""}`}>{text}</div>;
}

function useSpotlightCards() {
  useEffect(() => {
    const cards = document.querySelectorAll(".spotlight-card");
    const handler = (e: Event) => {
      const me = e as MouseEvent;
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        (card as HTMLElement).style.setProperty("--mouse-x", `${me.clientX - rect.left}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${me.clientY - rect.top}px`);
      });
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);
}

/* ════════════ COMPONENTS ════════════ */

function R({ children, cls, id, d }: { children: React.ReactNode; cls?: string; id?: string; d?: string }) {
  const ref = useReveal();
  return <div ref={ref} id={id} className={`fade-up ${d ?? ""} ${cls ?? ""}`}>{children}</div>;
}

function RS({ children, cls, d }: { children: React.ReactNode; cls?: string; d?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`fade-up-slow ${d ?? ""} ${cls ?? ""}`}>{children}</div>;
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap py-8">
      <div className="marquee-track gap-12">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-[13px] text-[#3a3a3c] font-mono shrink-0 select-none">
            <span className="w-1 h-1 rounded-full bg-[#2d2d2f]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════ DEFAULTS ════════════ */

const D_HERO: HeroContent = {
  greeting: "",
  headline: "Samet Elbeylioğlu",
  subheadline: "Dijital deneyimler tasarlıyor ve geliştiriyorum.",
  ctaText: "Çalışmalarımı İncele",
  ctaLink: "/#projeler",
};

const D_PROFILE: Profile = {
  name: "Samet Elbeylioğlu",
  title: "Yazılım Geliştirici & Grafik Tasarımcı",
  bio: "Kod ve tasarımın kesişiminde çalışıyorum. Piksel hassasiyetinde arayüzler ve temiz, sürdürülebilir kod yazıyorum. Her projeye mükemmeliyetçi bir yaklaşımla yaklaşıyorum.",
};

/* ════════════ PAGE ════════════ */

export default function HomePage() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [vis, setVis] = useState<SectionVisibility | null>(null);

  useSpotlightCards();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getHero(), getProfile(), getServices(), getProjects(), getSkills(),
      getExperience(), getEducation(), getCertificates(), getContactInfo(), getSectionVisibility(),
    ]).then(([h, p, srv, prj, sk, exp, edu, cert, cnt, v]) => {
      setHero(h); setProfile(p);
      setServices(srv); setProjects(prj); setSkills(sk);
      setExperience(exp); setEducation(edu); setCertificates(cert);
      setContact(cnt); setVis(v ?? ({} as SectionVisibility));
      setLoaded(true);
    });
  }, []);

  const pr: Profile = {
    name: profile?.name || D_PROFILE.name,
    title: profile?.title || D_PROFILE.title,
    bio: profile?.bio || D_PROFILE.bio,
    image: profile?.image,
    resumeUrl: profile?.resumeUrl,
  };
  const h: HeroContent = {
    greeting: hero?.greeting ?? "",
    headline: pr.name,
    subheadline: pr.bio,
    ctaText: hero?.ctaText || D_HERO.ctaText,
    ctaLink: hero?.ctaLink || D_HERO.ctaLink,
    image: hero?.image,
  };
  const show = (k: keyof SectionVisibility) => vis?.[k] !== false;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="grain" />
        <div className="loading-bar" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      {show("hero") && (
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-[2]" />
          <div className="mesh-gradient mesh-1" style={{ top: "20%", left: "5%" }} />
          <div className="mesh-gradient mesh-2" style={{ top: "50%", right: "0%" }} />
          <div className="mesh-gradient mesh-3" style={{ bottom: "5%", left: "35%" }} />

          <div className="relative z-10 text-center max-w-[900px]">
            <R d="d1">
              <div className="inline-flex items-center gap-2.5 mb-10">
                <span className="dot-pulse" />
                <span className="text-[11px] text-[#6e6e73] font-mono tracking-[0.2em] uppercase">Available for work</span>
              </div>
            </R>

            {pr.image && (
              <R d="d1">
                <div className="mb-8">
                  <img src={pr.image} alt={pr.name} className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover mx-auto border-2 border-[rgba(255,255,255,0.06)]" />
                </div>
              </R>
            )}

            {h.greeting && (
              <R d="d2">
                <p className="text-[clamp(14px,1.5vw,18px)] text-[#6e6e73] mb-4 tracking-[-0.01em]">{h.greeting}</p>
              </R>
            )}

            {loaded && (
              <WordStagger
                text={pr.name}
                className="text-[clamp(48px,10vw,110px)] font-extrabold tracking-[-0.05em] leading-[0.9] mb-6 text-[#f5f5f7]"
              />
            )}

            {pr.title && (
              <R d="d3">
                <p className="text-[clamp(14px,1.8vw,20px)] text-[#5856d6] font-medium mb-4 tracking-[-0.01em]">{pr.title}</p>
              </R>
            )}

            {pr.bio && (
              <R d="d3">
                <p className="text-[clamp(16px,2vw,20px)] text-[#6e6e73] max-w-[480px] mx-auto leading-[1.6] mb-8">
                  {pr.bio}
                </p>
              </R>
            )}

            <R d="d5">
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href={h.ctaLink} className="btn-primary">{h.ctaText} <ArrowRight className="w-4 h-4" /></Link>
                <Link href="/#iletisim" className="btn-secondary">İletişim <ArrowUpRight className="w-4 h-4" /></Link>
              </div>
            </R>
          </div>

          <R cls="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" d="d6">
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-[9px] text-[#3a3a3c] font-mono tracking-[0.3em]">SCROLL</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#3a3a3c] to-transparent" />
            </div>
          </R>

          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-[1]" />
        </section>
      )}

      {/* ══════════════════════════════════════════════
          MARQUEE - Yetenekler
          ══════════════════════════════════════════════ */}
      {show("skills") && (
        <div className="sep" />
      )}
      {show("skills") && (
        <Marquee
          items={skills.length > 0
            ? skills.map(s => s.name)
            : ["React", "Next.js", "TypeScript", "Node.js", "Figma", "Photoshop", "Illustrator", "Tailwind CSS", "PostgreSQL", "Supabase", "UI/UX Design", "Web Design", "Branding"]}
        />
      )}
      {show("skills") && (
        <div className="sep" />
      )}

      {/* ══════════════════════════════════════════════
          ABOUT - Büyük manifesto metni
          ══════════════════════════════════════════════ */}
      {show("about") && (
        <section id="hakkımda" className="py-40 md:py-56 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label">Hakkımda</span></R>
            <RS cls="mt-10">
              <h2 className="text-[clamp(28px,4.5vw,56px)] font-bold tracking-[-0.035em] leading-[1.15] text-[#f5f5f7]">
                Yazılım mühendisliği ve görsel tasarımı bir araya getiriyorum.{" "}
                <span className="text-[#48484a]">
                  Fikri koda, kodu deneyime dönüştürüyorum. Her piksel ve her satır bilinçli bir kararın ürünü.
                </span>
              </h2>
            </RS>

            <div className="grid md:grid-cols-3 gap-px mt-24 bg-[rgba(255,255,255,0.04)] rounded-2xl overflow-hidden">
              {[
                { num: "01", title: "Yazılım", desc: "Modern web teknolojileri ile ölçeklenebilir uygulamalar geliştiriyorum." },
                { num: "02", title: "Tasarım", desc: "Marka kimliği, UI/UX ve kullanıcı odaklı arayüz tasarımı yapıyorum." },
                { num: "03", title: "Strateji", desc: "İş hedeflerini anlayarak teknolojiyi doğru yönde kullanıyorum." },
              ].map((item, i) => (
                <R key={item.num} d={`d${i + 1}` as "d1" | "d2" | "d3"}>
                  <div className="bg-[#0a0a0a] p-8 md:p-10 h-full">
                    <span className="text-[11px] text-[#3a3a3c] font-mono">{item.num}</span>
                    <h3 className="text-[#f5f5f7] text-lg font-semibold mt-4 mb-3 tracking-[-0.02em]">{item.title}</h3>
                    <p className="text-[#6e6e73] text-[14px] leading-[1.7]">{item.desc}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SERVICES
          ══════════════════════════════════════════════ */}
      {show("services") && services.length > 0 && (
        <section id="hizmetler" className="py-40 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label">Hizmetler</span></R>
            <R cls="mt-10 mb-20">
              <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] text-[#f5f5f7]">
                Neler yapıyorum<span className="text-[#3a3a3c]">.</span>
              </h2>
            </R>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <R key={s.id} d={i < 4 ? `d${(i % 2) + 1}` as "d1" | "d2" : undefined}>
                  <div className="spotlight-card p-8 md:p-10 h-full">
                    <h3 className="text-[#f5f5f7] font-semibold text-[17px] mb-3 tracking-[-0.01em]">{s.title}</h3>
                    <p className="text-[#6e6e73] text-[14px] leading-[1.7]">{s.description}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          PROJECTS - Full-width case studies
          ══════════════════════════════════════════════ */}
      {show("projects") && (
        <section id="projeler" className="py-40 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label">Seçili Çalışmalar</span></R>
            <R cls="mt-10 mb-20">
              <div className="flex justify-between items-end">
                <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] text-[#f5f5f7]">
                  Projeler<span className="text-[#3a3a3c]">.</span>
                </h2>
                {projects.length > 4 && (
                  <Link href="/projeler" className="text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors hidden md:flex items-center gap-1.5">
                    Tümünü gör <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </R>

            <div className="space-y-4">
              {(projects.length > 0 ? projects.slice(0, 4) : [
                { id: "ph1", title: "Proje Adı", description: "Admin panelinden projelerinizi ekleyerek portfolyonuzu oluşturun.", tags: ["Next.js", "React"], order: 0, createdAt: "", year: "2026" },
              ]).map((p, i) => (
                <RS key={p.id}>
                  <div className="spotlight-card group">
                    {p.image && (
                      <div className="img-zoom">
                        <img src={p.image} alt={p.title} className="w-full aspect-[2.2/1] object-cover" style={{ borderRadius: "16px 16px 0 0" }} />
                      </div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          {p.year && <span className="font-mono text-[11px] text-[#3a3a3c]">{p.year}</span>}
                          {p.category && <span className="tag">{p.category}</span>}
                        </div>
                        <h3 className="text-[#f5f5f7] text-2xl md:text-[28px] font-bold tracking-[-0.03em] mb-3">{p.title}</h3>
                        <p className="text-[#6e6e73] text-[15px] leading-[1.6] max-w-xl">{p.description}</p>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-5">
                            {p.tags.slice(0, 5).map((t) => <span key={t} className="tag">{t}</span>)}
                          </div>
                        )}
                      </div>
                      {(p.demoUrl || p.githubUrl || p.url || p.github) && (
                        <a
                          href={p.demoUrl || p.url || p.githubUrl || p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#3a3a3c] group-hover:text-[#f5f5f7] group-hover:border-[rgba(255,255,255,0.15)] transition-all shrink-0"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </RS>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          EXPERIENCE
          ══════════════════════════════════════════════ */}
      {show("experience") && (
        <section id="deneyim" className="py-40 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label">Deneyim</span></R>
            <R cls="mt-10 mb-20">
              <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] text-[#f5f5f7]">
                Kariyer<span className="text-[#3a3a3c]">.</span>
              </h2>
            </R>

            {experience.length > 0 ? experience.map((e) => (
              <R key={e.id}>
                <div className="group flex gap-8 md:gap-12 py-10 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                  <div className="hidden md:flex flex-col items-center pt-2.5 shrink-0">
                    <div className={e.current ? "dot-pulse" : "w-1.5 h-1.5 rounded-full bg-[#2d2d2f]"} />
                    <div className="w-px flex-1 bg-[rgba(255,255,255,0.03)] mt-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-3">
                      <h3 className="text-[#f5f5f7] text-[18px] font-semibold tracking-[-0.02em] group-hover:text-white transition-colors">{e.role}</h3>
                      <span className="font-mono text-[11px] text-[#3a3a3c] shrink-0">{e.startDate} — {e.current ? "Devam" : e.endDate}</span>
                    </div>
                    <p className="text-[#6e6e73] text-[14px] font-medium mb-3">{e.company}</p>
                    <p className="text-[#48484a] text-[14px] leading-[1.7]">{e.description}</p>
                  </div>
                </div>
              </R>
            )) : (
              <R><p className="text-[#3a3a3c] text-sm">Henüz deneyim eklenmedi.</p></R>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          EDUCATION
          ══════════════════════════════════════════════ */}
      {show("education") && (
        <section id="eğitim" className="py-40 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label">Eğitim</span></R>
            <R cls="mt-10 mb-20">
              <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1.1] text-[#f5f5f7]">
                Akademik<span className="text-[#3a3a3c]">.</span>
              </h2>
            </R>

            {education.length > 0 ? education.map((e) => (
              <R key={e.id}>
                <div className="flex gap-8 md:gap-12 py-10 border-b border-[rgba(255,255,255,0.03)] last:border-0">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-3">
                      <h3 className="text-[#f5f5f7] text-[18px] font-semibold tracking-[-0.02em]">{e.degree}</h3>
                      <span className="font-mono text-[11px] text-[#3a3a3c] shrink-0">{e.startDate} — {e.endDate}</span>
                    </div>
                    {e.field && <p className="text-[#6e6e73] text-[14px] mb-1">{e.field}</p>}
                    <p className="text-[#48484a] text-[14px]">{e.school}</p>
                    {e.description && <p className="text-[#48484a] text-[14px] leading-[1.7] mt-3">{e.description}</p>}
                  </div>
                </div>
              </R>
            )) : (
              <R><p className="text-[#3a3a3c] text-sm">Henüz eğitim eklenmedi.</p></R>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          CERTIFICATES
          ══════════════════════════════════════════════ */}
      {show("skills") && certificates.length > 0 && (
        <section className="pb-40 px-6">
          <div className="max-w-[1000px] mx-auto">
            <R><span className="label flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Sertifikalar</span></R>
            <div className="mt-10">
              {certificates.slice(0, 6).map((c) => (
                <R key={c.id}>
                  <div className="flex justify-between items-center py-5 border-b border-[rgba(255,255,255,0.03)] last:border-0 group">
                    <div>
                      <p className="text-[#f5f5f7] text-[14px] group-hover:text-white transition-colors">{c.name}</p>
                      <p className="text-[11px] text-[#3a3a3c] font-mono mt-0.5">{c.date}</p>
                    </div>
                    <span className="text-[12px] text-[#3a3a3c] font-mono">{c.issuer}</span>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          BLOG + NEWS
          ══════════════════════════════════════════════ */}
      {(show("blog") || show("news")) && (
        <section className="py-40 px-6">
          <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-4">
            {show("blog") && (
              <R d="d1">
                <Link href="/blog" className="block h-full">
                  <div className="spotlight-card p-10 h-full group">
                    <span className="label">Blog</span>
                    <h3 className="text-[28px] font-bold text-[#f5f5f7] tracking-[-0.03em] mt-6 mb-3">Yazılar</h3>
                    <p className="text-[#48484a] text-[14px] leading-[1.7] mb-8">Yazılım ve tasarım üzerine düşünceler.</p>
                    <span className="text-[13px] text-[#5856d6] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Oku <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </R>
            )}
            {show("news") && (
              <R d="d2">
                <Link href="/haberler" className="block h-full">
                  <div className="spotlight-card p-10 h-full group">
                    <span className="label">Haberler</span>
                    <h3 className="text-[28px] font-bold text-[#f5f5f7] tracking-[-0.03em] mt-6 mb-3">Güncel</h3>
                    <p className="text-[#48484a] text-[14px] leading-[1.7] mb-8">Teknoloji dünyasından gelişmeler.</p>
                    <span className="text-[13px] text-[#5856d6] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Keşfet <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </R>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          CONTACT CTA
          ══════════════════════════════════════════════ */}
      {show("contact") && (
        <section id="iletisim" className="py-48 md:py-56 px-6 relative overflow-hidden">
          <div className="mesh-gradient mesh-1" style={{ top: "10%", right: "10%" }} />
          <div className="mesh-gradient mesh-2" style={{ bottom: "10%", left: "15%" }} />
          <div className="relative z-10 max-w-[1000px] mx-auto text-center">
            <R><span className="label">İletişim</span></R>
            <RS cls="mt-10">
              <h2 className="text-[clamp(36px,8vw,80px)] font-bold tracking-[-0.04em] leading-[0.95] text-[#f5f5f7]">
                Bir sonraki projeniz<br />
                <span className="text-rainbow">burada başlıyor.</span>
              </h2>
            </RS>
            <R cls="mt-8 mb-12" d="d2">
              <p className="text-[#48484a] text-[17px] max-w-md mx-auto leading-[1.6]">
                Bir fikriniz mi var? Birlikte hayata geçirelim.
              </p>
            </R>
            <R d="d3">
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/iletisim" className="btn-primary"><Mail className="w-4 h-4" /> İletişime Geç</Link>
                {contact?.email && (
                  <a href={`mailto:${contact.email}`} className="btn-secondary">{contact.email}</a>
                )}
              </div>
            </R>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
