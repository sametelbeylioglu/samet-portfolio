"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getServices, setServices, type Service } from "@/lib/content-manager";
import { cn } from "@/lib/utils";

const ICONS = ["💼", "🖥️", "📱", "🎨", "⚙️", "🚀", "🔧", "📊"];

export default function AdminServicesPage() {
  const [services, setServicesState] = useState<Service[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getServices().then(setServicesState);
  }, []);

  const add = () => {
    setServicesState((s) => [...s, { id: crypto.randomUUID(), icon: "💼", title: "", description: "" }]);
  };

  const remove = (id: string) => {
    setServicesState((s) => s.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Service>) => {
    setServicesState((s) => s.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    await setServices(services.filter((s) => s.title.trim()));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Hizmetler</h1>
        <div className="flex gap-3">
          <Link href="/#hizmetler" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={add} className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center gap-1.5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Ekle
          </button>
          <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5 flex gap-4 items-start">
            <div className="flex gap-1 flex-wrap">
              {ICONS.map((i) => (
                <button key={i} type="button" onClick={() => update(s.id, { icon: i })} className={cn("text-xl p-1.5 rounded-lg transition-colors", s.icon === i ? "bg-[rgba(255,255,255,0.08)]" : "hover:bg-[rgba(255,255,255,0.04)]")}>{i}</button>
              ))}
            </div>
            <div className="flex-1 grid gap-3">
              <input placeholder="Başlık" value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <textarea placeholder="Açıklama" value={s.description} onChange={(e) => update(s.id, { description: e.target.value })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
            <button onClick={() => remove(s.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
