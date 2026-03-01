"use client";

import Link from "next/link";
import {
  User, Briefcase, FolderKanban, Code2, GraduationCap, Award,
  FileText, Newspaper, Phone, Settings
} from "lucide-react";

const cards = [
  { href: "/admin/profile", icon: User, label: "Profil", desc: "Kişisel bilgiler ve hakkında" },
  { href: "/admin/services", icon: Briefcase, label: "Hizmetler", desc: "Sunduğunuz hizmetler" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projeler", desc: "Portfolyo çalışmaları" },
  { href: "/admin/skills", icon: Code2, label: "Yetenekler", desc: "Teknik beceriler" },
  { href: "/admin/experience", icon: Briefcase, label: "Deneyim", desc: "İş geçmişi" },
  { href: "/admin/education", icon: GraduationCap, label: "Eğitim", desc: "Akademik geçmiş" },
  { href: "/admin/certificates", icon: Award, label: "Sertifikalar", desc: "Kazanılan belgeler" },
  { href: "/admin/blog", icon: FileText, label: "Blog", desc: "Yazılar ve içerikler" },
  { href: "/admin/news", icon: Newspaper, label: "Haberler", desc: "Güncel haberler" },
  { href: "/admin/contact", icon: Phone, label: "İletişim", desc: "İletişim bilgileri" },
  { href: "/admin/settings", icon: Settings, label: "Ayarlar", desc: "Site yapılandırması" },
];

export default function AdminDashboard() {
  return (
    <div>
      <p className="section-label mb-4">Dashboard</p>
      <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7] mb-2">Yönetim Paneli</h1>
      <p className="text-[#6e6e73] text-[15px] mb-12">İçeriklerinizi buradan yönetin.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group glass p-6 flex flex-col">
            <c.icon className="h-5 w-5 text-[#48484a] group-hover:text-[#86868b] transition-colors mb-4" />
            <p className="text-[#f5f5f7] font-medium text-[15px] mb-1">{c.label}</p>
            <p className="text-[#6e6e73] text-[13px]">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
