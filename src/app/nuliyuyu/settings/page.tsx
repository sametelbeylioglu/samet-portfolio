"use client";

import { useEffect, useState } from "react";
import { getSectionVisibility, setSectionVisibility, getSiteTitle, setSiteTitle, getFavicon, setFavicon, type SectionVisibility } from "@/lib/content-manager";
import { changePassword, changeEmail, getUsername } from "@/lib/auth";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const [visibility, setVisibilityState] = useState<SectionVisibility>({
    hero: true, about: true, services: true, projects: true, skills: true,
    experience: true, education: true, certificates: true, blog: true, news: true, contact: true,
  });
  const [siteTitle, setSiteTitleState] = useState("");
  const [saved, setSaved] = useState(false);

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getSectionVisibility().then(setVisibilityState);
    getSiteTitle().then(setSiteTitleState);
    getUsername().then(setCurrentEmail);
  }, []);

  const save = async () => {
    await setSectionVisibility(visibility);
    await setSiteTitle(siteTitle);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: keyof SectionVisibility) => {
    setVisibilityState((v) => ({ ...v, [key]: !v[key] }));
  };

  const handleFavicon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFavicon(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!newPw) { setPwMsg({ ok: false, text: "Yeni sifre girin." }); return; }
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "Yeni sifre en az 6 karakter olmali." }); return; }
    if (newPw !== newPw2) { setPwMsg({ ok: false, text: "Sifreler eslesmyor." }); return; }

    const result = await changePassword(newPw);
    if (result.ok) {
      setPwMsg({ ok: true, text: "Sifre basariyla degistirildi." });
      setNewPw(""); setNewPw2("");
    } else {
      setPwMsg({ ok: false, text: result.error ?? "Hata olustu." });
    }
  };

  const handleChangeEmail = async () => {
    setEmailMsg(null);
    if (!newEmail || !newEmail.includes("@")) { setEmailMsg({ ok: false, text: "Gecerli bir e-posta girin." }); return; }

    const result = await changeEmail(newEmail);
    if (result.ok) {
      setEmailMsg({ ok: true, text: "E-posta degistirme istegi gonderildi. Yeni adresinizi dogrulayin." });
      setCurrentEmail(newEmail);
      setNewEmail("");
    } else {
      setEmailMsg({ ok: false, text: result.error ?? "Hata olustu." });
    }
  };

  const sections: { key: keyof SectionVisibility; label: string }[] = [
    { key: "hero", label: "Hero" }, { key: "about", label: "Hakkimda" },
    { key: "services", label: "Hizmetler" }, { key: "projects", label: "Projeler" },
    { key: "skills", label: "Yetkinlikler" }, { key: "certificates", label: "Sertifikalar" },
    { key: "experience", label: "Deneyim" }, { key: "education", label: "Egitim" },
    { key: "blog", label: "Blog" }, { key: "news", label: "Haberler" },
    { key: "contact", label: "Iletisim" },
  ];

  const inputCls = "w-full bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] text-[#f5f5f7] placeholder:text-[#3a3a3c] rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(255,255,255,0.15)] transition-colors";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#f5f5f7]">Ayarlar</h1>
        <button onClick={save} className={`rounded-full text-[14px] px-6 h-11 font-medium transition-all ${saved ? "bg-[rgba(48,209,88,0.15)] text-[#30d158]" : "bg-[#f5f5f7] text-black hover:bg-white"}`}>
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="flex items-center gap-2 text-[#f5f5f7] font-semibold mb-6"><Shield className="w-4 h-4 text-[#48484a]" /> Guvenlik</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] text-[#3a3a3c] font-mono tracking-[0.15em] mb-4">E-POSTA</p>
              <p className="text-[13px] text-[#6e6e73] mb-3">Mevcut: <span className="text-[#f5f5f7] font-mono">{currentEmail}</span></p>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Yeni e-posta adresi" type="email" className={inputCls} />
              <button onClick={handleChangeEmail} className="mt-3 rounded-full text-[13px] px-5 h-9 bg-[rgba(255,255,255,0.04)] text-[#86868b] hover:text-[#f5f5f7] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">Degistir</button>
              {emailMsg && <p className={`text-[12px] mt-2 ${emailMsg.ok ? "text-[#30d158]" : "text-[#ff453a]"}`}>{emailMsg.text}</p>}
            </div>

            <div>
              <p className="text-[11px] text-[#3a3a3c] font-mono tracking-[0.15em] mb-4">SIFRE DEGISTIR</p>
              <div className="space-y-3">
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Yeni sifre (min 6)" className={inputCls + " pr-10"} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3a3c] hover:text-[#6e6e73]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input type={showPw ? "text" : "password"} value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="Yeni sifre tekrar" className={inputCls} />
              </div>
              <button onClick={handleChangePassword} className="mt-3 rounded-full text-[13px] px-5 h-9 bg-[rgba(255,255,255,0.04)] text-[#86868b] hover:text-[#f5f5f7] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all">Sifreyi Degistir</button>
              {pwMsg && <p className={`text-[12px] mt-2 ${pwMsg.ok ? "text-[#30d158]" : "text-[#ff453a]"}`}>{pwMsg.text}</p>}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="text-[#f5f5f7] font-semibold mb-6">Genel</h2>
          <div className="space-y-5">
            <div>
              <label className="text-[11px] text-[#3a3a3c] font-mono tracking-[0.15em] block mb-2">SITE BASLIGI</label>
              <input value={siteTitle} onChange={(e) => setSiteTitleState(e.target.value)} placeholder="Samet Elbeylioglu | Portfolyo" className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] text-[#3a3a3c] font-mono tracking-[0.15em] block mb-2">FAVICON</label>
              <input type="file" accept="image/*" onChange={handleFavicon} className="text-sm text-[#6e6e73]" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-[rgba(255,255,255,0.04)] p-6">
          <h2 className="text-[#f5f5f7] font-semibold mb-2">Bolum Gorunurlugu</h2>
          <p className="text-[13px] text-[#48484a] mb-6">Ana sayfada hangi bolumlerin gorunecegini secin.</p>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map((s) => (
              <label key={s.key} className="flex items-center gap-3 cursor-pointer text-[13px] text-[#6e6e73] hover:text-[#f5f5f7] transition-colors py-1">
                <input type="checkbox" checked={visibility[s.key]} onChange={() => toggle(s.key)} className="accent-[#f5f5f7] w-4 h-4" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
