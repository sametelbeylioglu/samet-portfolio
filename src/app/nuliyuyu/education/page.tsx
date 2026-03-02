"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getEducation, setEducation, type Education } from "@/lib/content-manager";

export default function AdminEducationPage() {
  const [items, setItemsState] = useState<Education[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getEducation().then(setItemsState);
  }, []);

  const add = () => {
    setItemsState((e) => [...e, {
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
    }]);
  };

  const remove = (id: string) => {
    setItemsState((e) => e.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Education>) => {
    setItemsState((e) => e.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    await setEducation(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Eğitim</h1>
        <div className="flex gap-3">
          <Link href="/#eğitim" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
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
              <input placeholder="Okul / Kurum" value={e.school} onChange={(ev) => update(e.id, { school: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="Diploma / Derece" value={e.degree} onChange={(ev) => update(e.id, { degree: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="Alan (opsiyonel)" value={e.field ?? ""} onChange={(ev) => update(e.id, { field: ev.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6e6e73] block mb-1.5">Başlangıç</label>
                  <input type="date" value={e.startDate} onChange={(ev) => update(e.id, { startDate: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-[#6e6e73] block mb-1.5">Bitiş</label>
                  <input type="date" value={e.endDate} onChange={(ev) => update(e.id, { endDate: ev.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
                </div>
              </div>
              <textarea placeholder="Açıklama (opsiyonel)" value={e.description ?? ""} onChange={(ev) => update(e.id, { description: ev.target.value || undefined })} rows={2} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors resize-none" />
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
