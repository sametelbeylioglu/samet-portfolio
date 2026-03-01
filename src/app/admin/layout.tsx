"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User, Briefcase, FolderKanban, Code2, GraduationCap, Award,
  Settings, FileText, Newspaper, Phone, LayoutDashboard, ArrowLeft, Eye
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Panel" },
  { href: "/admin/profile", icon: User, label: "Profil" },
  { href: "/admin/services", icon: Briefcase, label: "Hizmetler" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projeler" },
  { href: "/admin/skills", icon: Code2, label: "Yetenekler" },
  { href: "/admin/experience", icon: Briefcase, label: "Deneyim" },
  { href: "/admin/education", icon: GraduationCap, label: "Eğitim" },
  { href: "/admin/certificates", icon: Award, label: "Sertifikalar" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/news", icon: Newspaper, label: "Haberler" },
  { href: "/admin/contact", icon: Phone, label: "İletişim" },
  { href: "/admin/settings", icon: Settings, label: "Ayarlar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-black">
      <aside className="w-56 shrink-0 border-r border-[rgba(255,255,255,0.04)] p-4 flex flex-col">
        <div className="mb-6 px-2">
          <p className="text-[#f5f5f7] text-sm font-semibold tracking-[-0.02em]">samet.</p>
          <p className="text-[10px] text-[#48484a] font-mono mt-0.5">ADMIN</p>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  active ? "bg-[#1d1d1f] text-[#f5f5f7]" : "text-[#6e6e73] hover:text-[#86868b] hover:bg-[rgba(255,255,255,0.02)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.04)] space-y-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#6e6e73] hover:text-[#86868b] transition-colors">
            <Eye className="h-4 w-4" /> Siteyi Gör
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
