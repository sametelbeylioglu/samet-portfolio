"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User, Briefcase, FolderKanban, Code2, GraduationCap, Award,
  FileText, Newspaper, Phone, Settings, RefreshCw, CheckCircle2, AlertCircle, Upload
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const STORAGE_PREFIX = "portfolio_";
const ALL_KEYS = [
  "profile", "hero", "about", "services", "projects", "skills",
  "certificates", "education", "experience", "blog_posts", "news",
  "contact", "section_visibility", "site_title", "favicon",
];

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
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const syncToSupabase = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSyncResult({ ok: false, msg: "Supabase baglantisi bulunamadi. .env.local kontrol edin." });
      return;
    }

    setSyncing(true);
    setSyncResult(null);

    let synced = 0;
    let failed = 0;

    for (const key of ALL_KEYS) {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) continue;

      try {
        const value = JSON.parse(raw);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase
          .from("site_data")
          .upsert({ key, value, updated_at: new Date().toISOString() } as any);

        if (error) {
          console.error(`Sync failed for ${key}:`, error.message);
          failed++;
        } else {
          synced++;
        }
      } catch (e) {
        console.error(`Parse/sync error for ${key}:`, e);
        failed++;
      }
    }

    setSyncing(false);
    if (failed === 0) {
      setSyncResult({ ok: true, msg: `${synced} bolum basariyla Supabase'e gonderildi.` });
    } else {
      setSyncResult({ ok: false, msg: `${synced} basarili, ${failed} basarisiz. Konsolu kontrol edin.` });
    }
  };

  return (
    <div>
      <p className="section-label mb-4">Dashboard</p>
      <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7] mb-2">Yönetim Paneli</h1>
      <p className="text-[#6e6e73] text-[15px] mb-8">İçeriklerinizi buradan yönetin.</p>

      <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-[#5856d6]" />
              <h2 className="text-[#f5f5f7] font-semibold text-[15px]">Supabase Senkronizasyon</h2>
            </div>
            <p className="text-[#6e6e73] text-[13px]">Lokaldeki tum verileri Supabase veritabanina gonder.</p>
          </div>
          <button
            onClick={syncToSupabase}
            disabled={syncing}
            className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all flex items-center gap-2 ${
              syncing
                ? "bg-[#1d1d1f] text-[#48484a] cursor-wait"
                : "bg-[#5856d6] text-white hover:bg-[#6e6cd8]"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Gonderiliyor..." : "Senkronize Et"}
          </button>
        </div>
        {syncResult && (
          <div className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
            syncResult.ok
              ? "bg-[rgba(48,209,88,0.1)] border border-[rgba(48,209,88,0.2)] text-[#30d158]"
              : "bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.2)] text-[#ff453a]"
          }`}>
            {syncResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {syncResult.msg}
          </div>
        )}
      </div>

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
