"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getSkills, setSkills, type Skill } from "@/lib/content-manager";

const CATEGORIES: Skill["category"][] = ["frontend", "backend", "tools", "other"];

export default function AdminSkillsPage() {
  const [skills, setSkillsState] = useState<Skill[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSkills().then(setSkillsState);
  }, []);

  const add = () => {
    setSkillsState((s) => [...s, { id: crypto.randomUUID(), name: "", category: "frontend" }]);
  };

  const remove = (id: string) => {
    setSkillsState((s) => s.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Skill>) => {
    setSkillsState((s) => s.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    await setSkills(skills.filter((s) => s.name.trim()));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Yetkinlikler</h1>
        <div className="flex gap-3">
          <Link href="/#yetkinlikler" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={add} className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center gap-1.5 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Ekle
          </button>
          <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-4 flex gap-4 items-center">
            <input placeholder="Beceri adı (örn: React, TypeScript)" value={s.name} onChange={(e) => update(s.id, { name: e.target.value })} className="flex-1 bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            <select value={s.category} onChange={(e) => update(s.id, { category: e.target.value as Skill["category"] })} className="bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "frontend" ? "Frontend" : c === "backend" ? "Backend" : c === "tools" ? "Araçlar" : "Diğer"}</option>
              ))}
            </select>
            <button onClick={() => remove(s.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
