"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getContactInfo, setContactInfo, type ContactInfo } from "@/lib/content-manager";

export default function AdminContactPage() {
  const [contact, setContactState] = useState<ContactInfo>({ email: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContactInfo().then((c) => c && setContactState(c));
  }, []);

  const save = async () => {
    await setContactInfo(contact);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">İletişim</h1>
        <div className="flex gap-3">
          <Link href="/iletisim" className="border border-[rgba(255,255,255,0.08)] text-[#86868b] hover:text-[#f5f5f7] hover:border-[rgba(255,255,255,0.15)] rounded-full text-[13px] px-5 h-9 flex items-center transition-colors">Önizle</Link>
          <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6 space-y-5">
        <div>
          <label className="text-xs text-[#6e6e73] block mb-1.5">E-posta *</label>
          <input type="email" value={contact.email} onChange={(e) => setContactState((c) => ({ ...c, email: e.target.value }))} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
        </div>
        <div>
          <label className="text-xs text-[#6e6e73] block mb-1.5">Telefon</label>
          <input value={contact.phone ?? ""} onChange={(e) => setContactState((c) => ({ ...c, phone: e.target.value || undefined }))} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
        </div>
        <div>
          <label className="text-xs text-[#6e6e73] block mb-1.5">Adres</label>
          <input value={contact.address ?? ""} onChange={(e) => setContactState((c) => ({ ...c, address: e.target.value || undefined }))} className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-[#6e6e73] block mb-1.5">LinkedIn</label>
            <input value={contact.linkedin ?? ""} onChange={(e) => setContactState((c) => ({ ...c, linkedin: e.target.value || undefined }))} placeholder="https://linkedin.com/in/..." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[#6e6e73] block mb-1.5">GitHub</label>
            <input value={contact.github ?? ""} onChange={(e) => setContactState((c) => ({ ...c, github: e.target.value || undefined }))} placeholder="https://github.com/..." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[#6e6e73] block mb-1.5">Twitter / X</label>
            <input value={contact.twitter ?? ""} onChange={(e) => setContactState((c) => ({ ...c, twitter: e.target.value || undefined }))} placeholder="https://twitter.com/..." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[#6e6e73] block mb-1.5">Instagram</label>
            <input value={contact.instagram ?? ""} onChange={(e) => setContactState((c) => ({ ...c, instagram: e.target.value || undefined }))} placeholder="https://instagram.com/..." className="w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#48484a] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
