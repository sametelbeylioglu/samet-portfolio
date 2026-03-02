"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User, Briefcase, FolderKanban, Code2, GraduationCap, Award,
  Settings, FileText, Newspaper, Phone, LayoutDashboard, Eye, LogOut, Menu, X, Info
} from "lucide-react";
import { isAuthenticated, logout, getUsername } from "@/lib/auth";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Panel" },
  { href: "/admin/profile", icon: User, label: "Profil" },
  { href: "/admin/about", icon: Info, label: "Hakkımda" },
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
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      setAuthed(false);
      return;
    }
    const ok = isAuthenticated();
    if (!ok) {
      router.replace("/admin/login");
    } else {
      setAuthed(true);
    }
    setChecked(true);
  }, [pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked || !authed) {
    return <div className="min-h-screen bg-black" />;
  }

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-black/80 backdrop-blur-xl flex items-center justify-between px-5 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e73] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <Menu className="w-[18px] h-[18px]" />
          </button>
          <p className="text-[#f5f5f7] text-[13px] font-semibold tracking-[-0.02em]">samet<span className="text-[#3a3a3c]">.</span> <span className="text-[10px] text-[#3a3a3c] font-mono ml-1">ADMIN</span></p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[11px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Siteyi Gör
          </Link>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - slides from left */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[70] w-64 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.04)] p-5 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#f5f5f7] text-sm font-semibold tracking-[-0.02em]">samet<span className="text-[#3a3a3c]">.</span></p>
            <p className="text-[10px] text-[#3a3a3c] font-mono mt-0.5">ADMIN · {getUsername()}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e73] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                  active ? "bg-[#1d1d1f] text-[#f5f5f7]" : "text-[#6e6e73] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.04)] space-y-0.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.03)] transition-all">
            <Eye className="h-4 w-4" /> Siteyi Gör
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#ff453a] hover:bg-[rgba(255,69,58,0.06)] transition-all w-full">
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-12 min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
