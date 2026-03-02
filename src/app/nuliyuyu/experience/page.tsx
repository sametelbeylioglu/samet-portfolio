"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getExperience, setExperience, type Experience } from "@/lib/content-manager";

export default function AdminExperiencePage() {
  const [items, setItemsState] = useState<Experience[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getExperience().then(setItemsState);
  }, []);

  const add = () => {
    setItemsState((e) => [...e, {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    }]);
  };

  const remove = (id: string) => {
    setItemsState((e) => e.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Experience>) => {
    setItemsState((e) => e.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    await setExperience(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Deneyim</h1>
        <div className="flex gap-3">
          <Link href="/#deneyim" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={add} className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center gap-1.5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Ekle
          </button>
          <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((e) => (
          <div key={e.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5 flex gap-4">
            <div className="flex-1 space-y-3">
              <input placeholder="Şirket / Kurum" value={e.company} onChange={(ev) => update(e.id, { company: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="Pozisyon" value={e.role} onChange={(ev) => update(e.id, { role: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6e6e73] block mb-1.5">Başlangıç</label>
                  <input type="date" value={e.startDate} onChange={(ev) => update(e.id, { startDate: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-[#6e6e73] block mb-1.5">Bitiş</label>
                  <input type="date" value={e.endDate} onChange={(ev) => update(e.id, { endDate: ev.target.value })} disabled={e.current} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors disabled:opacity-40" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#86868b]">
                <input type="checkbox" checked={e.current ?? false} onChange={(ev) => update(e.id, { current: ev.target.checked, endDate: ev.target.checked ? "" : e.endDate })} className="accent-[#f5f5f7]" />
                Halen devam ediyor
              </label>
              <textarea placeholder="Açıklama" value={e.description} onChange={(ev) => update(e.id, { description: ev.target.value })} rows={3} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
            </div>
            <button onClick={() => remove(e.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors h-fit">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
