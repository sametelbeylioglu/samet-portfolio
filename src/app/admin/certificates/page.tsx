"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { getCertificates, setCertificates, type Certificate } from "@/lib/content-manager";

export default function AdminCertificatesPage() {
  const [certs, setCertsState] = useState<Certificate[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCertificates().then(setCertsState);
  }, []);

  const add = () => {
    setCertsState((c) => [...c, { id: crypto.randomUUID(), name: "", issuer: "", date: new Date().toISOString().slice(0, 10) }]);
  };

  const remove = (id: string) => {
    setCertsState((c) => c.filter((x) => x.id !== id));
  };

  const update = (id: string, updates: Partial<Certificate>) => {
    setCertsState((c) => c.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const save = async () => {
    await setCertificates(certs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Sertifikalar</h1>
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

      <div className="space-y-4">
        {certs.map((c) => (
          <div key={c.id} className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-5 flex gap-4">
            <div className="flex-1 grid gap-3 md:grid-cols-2">
              <input placeholder="Sertifika adı" value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="Kurum" value={c.issuer} onChange={(e) => update(c.id, { issuer: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input type="date" value={c.date} onChange={(e) => update(c.id, { date: e.target.value })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
              <input placeholder="URL (opsiyonel)" value={c.url ?? ""} onChange={(e) => update(c.id, { url: e.target.value || undefined })} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
            </div>
            <button onClick={() => remove(c.id)} className="text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] rounded-full p-2 transition-colors h-fit">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
