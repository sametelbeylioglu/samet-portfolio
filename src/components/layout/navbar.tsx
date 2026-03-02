"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#projeler", label: "Projeler" },
  { href: "/#deneyim", label: "Deneyim" },
  { href: "/blog", label: "Blog" },
  { href: "/#iletisim", label: "İletişim" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl" : ""}`} style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <nav className="max-w-[1000px] mx-auto flex h-12 items-center justify-between px-6 pt-0">
        <Link href="/" className="text-[#f5f5f7] text-[13px] font-semibold tracking-[-0.02em] hover:opacity-60 transition-opacity" onClick={() => setOpen(false)}>
          samet<span className="text-[#3a3a3c]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[12px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden text-[#6e6e73] hover:text-white transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl px-6 py-8 border-t border-[rgba(255,255,255,0.03)]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-3 text-xl font-semibold text-[#6e6e73] hover:text-[#f5f5f7] transition-colors tracking-[-0.02em]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
