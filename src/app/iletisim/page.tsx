"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Linkedin, Twitter, MapPin, Phone, Send } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { getContactInfo, type ContactInfo } from "@/lib/content-manager";

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

function R({ children, cls, d }: { children: React.ReactNode; cls?: string; d?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`fade-up ${d ?? ""} ${cls ?? ""}`}>{children}</div>;
}

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  useEffect(() => { getContactInfo().then(setContact); }, []);

  const socials = contact ? [
    contact.github && { icon: Github, href: contact.github, label: "GitHub" },
    contact.linkedin && { icon: Linkedin, href: contact.linkedin, label: "LinkedIn" },
    contact.twitter && { icon: Twitter, href: contact.twitter, label: "Twitter" },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[] : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="grain" />
      <Navbar />
      <main className="pt-32 pb-40 px-6 relative overflow-hidden">
        <div className="mesh-gradient mesh-1" style={{ top: "5%", right: "0%" }} />
        <div className="mesh-gradient mesh-2" style={{ bottom: "10%", left: "0%" }} />

        <div className="max-w-[1000px] mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Geri
          </Link>
          <R><span className="label">İletişim</span></R>
          <R cls="mt-10 mb-20">
            <h1 className="text-[clamp(40px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-[#f5f5f7]">
              Merhaba <span className="text-rainbow">deyin.</span>
            </h1>
          </R>

          <div className="grid md:grid-cols-[1fr_1.3fr] gap-16">
            <div className="space-y-7">
              {contact?.email && (
                <R d="d1">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.04)] flex items-center justify-center group-hover:border-[rgba(255,255,255,0.08)] transition-all">
                      <Mail className="w-4 h-4 text-[#48484a]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-0.5">EMAIL</p>
                      <p className="text-[#f5f5f7] text-[14px]">{contact.email}</p>
                    </div>
                  </a>
                </R>
              )}
              {contact?.phone && (
                <R d="d2">
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.04)] flex items-center justify-center group-hover:border-[rgba(255,255,255,0.08)] transition-all">
                      <Phone className="w-4 h-4 text-[#48484a]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-0.5">TELEFON</p>
                      <p className="text-[#f5f5f7] text-[14px]">{contact.phone}</p>
                    </div>
                  </a>
                </R>
              )}
              {contact?.address && (
                <R d="d3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#111] border border-[rgba(255,255,255,0.04)] flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#48484a]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-0.5">KONUM</p>
                      <p className="text-[#f5f5f7] text-[14px]">{contact.address}</p>
                    </div>
                  </div>
                </R>
              )}
              {socials.length > 0 && (
                <R d="d4">
                  <div className="pt-6 border-t border-[rgba(255,255,255,0.03)]">
                    <p className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-4">SOSYAL</p>
                    <div className="flex gap-2">
                      {socials.map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#111] border border-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#48484a] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.08)] transition-all" aria-label={s.label}>
                          <s.icon className="w-3.5 h-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </R>
              )}
            </div>

            <R d="d2">
              <div className="spotlight-card p-8 md:p-10">
                <form onSubmit={e => e.preventDefault()} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">İSİM</label>
                      <Input placeholder="Adınız" />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">E-POSTA</label>
                      <Input type="email" placeholder="ornek@mail.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">KONU</label>
                    <Input placeholder="Proje hakkında" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#3a3a3c] font-mono tracking-[0.2em] mb-2 block">MESAJ</label>
                    <textarea rows={5} placeholder="Mesajınızı yazın…" className="flex w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1d1d1f] px-4 py-3 text-[14px] text-[#f5f5f7] placeholder:text-[#3a3a3c] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(255,255,255,0.15)] resize-none transition-all" />
                  </div>
                  <button className="btn-primary w-full justify-center"><Send className="w-4 h-4" /> Gönder</button>
                </form>
              </div>
            </R>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
