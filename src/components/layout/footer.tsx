"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { getContactInfo } from "@/lib/content-manager";

export function Footer() {
  const [c, setC] = useState<{ email?: string; linkedin?: string; github?: string; twitter?: string } | null>(null);
  useEffect(() => { getContactInfo().then(setC); }, []);

  const socials = [
    { icon: Github, href: c?.github, label: "GitHub" },
    { icon: Linkedin, href: c?.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: c?.twitter, label: "Twitter" },
    { icon: Mail, href: c?.email ? `mailto:${c.email}` : undefined, label: "Email" },
  ].filter(s => s.href);

  return (
    <footer className="bg-black py-4 px-6">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-5 text-[11px] text-[#3a3a3c]">
          <span>© {new Date().getFullYear()} Samet Elbeylioğlu</span>
          <Link href="/blog" className="hover:text-[#6e6e73] transition-colors">Blog</Link>
          <Link href="/haberler" className="hover:text-[#6e6e73] transition-colors">Haberler</Link>
          <Link href="/admin" className="hover:text-[#6e6e73] transition-colors font-mono">/admin</Link>
        </div>
        {socials.length > 0 && (
          <div className="flex gap-3">
            {socials.map(s => (
              <Link key={s.label} href={s.href!} target={s.label !== "Email" ? "_blank" : undefined} rel={s.label !== "Email" ? "noopener noreferrer" : undefined} className="text-[#2d2d2f] hover:text-[#6e6e73] transition-colors" aria-label={s.label}>
                <s.icon className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
