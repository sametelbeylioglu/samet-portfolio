"use client";

import { getSupabase } from "./supabase";

const STORAGE_PREFIX = "portfolio_";

async function getStorageItem<T>(key: string): Promise<T | null> {
  if (typeof window === "undefined") return null;
  try {
    const supabase = getSupabase();
    if (supabase) {
      const res = await supabase.from("site_data").select("value").eq("key", key).single();
      const row = res.data as { value: T } | null;
      if (row?.value) return row.value;
    }
  } catch (_) {}
  const local = localStorage.getItem(STORAGE_PREFIX + key);
  return local ? JSON.parse(local) : null;
}

async function setStorageItem<T>(key: string, value: T): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const supabase = getSupabase();
    if (supabase) {
      const table = supabase.from("site_data") as unknown as { upsert: (row: { key: string; value: unknown; updated_at: string }) => Promise<unknown> };
      await table.upsert({ key, value, updated_at: new Date().toISOString() });
    }
  } catch (_) {}
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new Error("STORAGE_FULL");
    }
    throw e;
  }
}

// Types
export interface Profile {
  name: string;
  title: string;
  bio: string;
  image?: string;
  resumeUrl?: string;
  availableForWork?: boolean;
}

export interface HeroContent {
  greeting: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  demoUrl?: string;
  github?: string;
  githubUrl?: string;
  tags: string[];
  featured?: boolean;
  order: number;
  createdAt: string;
  category?: string;
  year?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  level?: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  image?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  image?: string;
  coverImage?: string;
  author?: string;
  status?: "published" | "draft";
  published: boolean;
  publishedAt?: string;
  readTime?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  source?: string;
  url?: string;
  date: string;
  image?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
}

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  projects: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  certificates: boolean;
  blog: boolean;
  news: boolean;
  contact: boolean;
}

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  about: true,
  services: true,
  projects: true,
  skills: true,
  experience: true,
  education: true,
  certificates: true,
  blog: true,
  news: true,
  contact: true,
};

// Storage keys
const KEYS = {
  PROFILE: "profile",
  HERO: "hero",
  SERVICES: "services",
  PROJECTS: "projects",
  SKILLS: "skills",
  CERTIFICATES: "certificates",
  EDUCATION: "education",
  EXPERIENCE: "experience",
  BLOG_POSTS: "blog_posts",
  NEWS: "news",
  CONTACT: "contact",
  SECTION_VISIBILITY: "section_visibility",
  SITE_TITLE: "site_title",
  FAVICON: "favicon",
};

// API
export async function getProfile(): Promise<Profile | null> {
  return getStorageItem<Profile>(KEYS.PROFILE);
}

export async function setProfile(data: Profile): Promise<void> {
  await setStorageItem(KEYS.PROFILE, data);
}

export async function getHero(): Promise<HeroContent | null> {
  return getStorageItem<HeroContent>(KEYS.HERO);
}

export async function setHero(data: HeroContent): Promise<void> {
  await setStorageItem(KEYS.HERO, data);
}

export async function getServices(): Promise<Service[]> {
  const data = await getStorageItem<Service[]>(KEYS.SERVICES);
  return data ?? [];
}

export async function setServices(data: Service[]): Promise<void> {
  await setStorageItem(KEYS.SERVICES, data);
}

export async function getProjects(): Promise<Project[]> {
  const data = await getStorageItem<Project[]>(KEYS.PROJECTS);
  return (data ?? []).sort((a, b) => a.order - b.order);
}

export async function setProjects(data: Project[]): Promise<void> {
  await setStorageItem(KEYS.PROJECTS, data);
}

export async function getSkills(): Promise<Skill[]> {
  const data = await getStorageItem<Skill[]>(KEYS.SKILLS);
  return data ?? [];
}

export async function setSkills(data: Skill[]): Promise<void> {
  await setStorageItem(KEYS.SKILLS, data);
}

export async function getCertificates(): Promise<Certificate[]> {
  const data = await getStorageItem<Certificate[]>(KEYS.CERTIFICATES);
  return (data ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function setCertificates(data: Certificate[]): Promise<void> {
  await setStorageItem(KEYS.CERTIFICATES, data);
}

export async function getEducation(): Promise<Education[]> {
  const data = await getStorageItem<Education[]>(KEYS.EDUCATION);
  return (data ?? []).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
}

export async function setEducation(data: Education[]): Promise<void> {
  await setStorageItem(KEYS.EDUCATION, data);
}

export async function getExperience(): Promise<Experience[]> {
  const data = await getStorageItem<Experience[]>(KEYS.EXPERIENCE);
  return (data ?? []).sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });
}

export async function setExperience(data: Experience[]): Promise<void> {
  await setStorageItem(KEYS.EXPERIENCE, data);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await getStorageItem<BlogPost[]>(KEYS.BLOG_POSTS);
  return (data ?? []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function setBlogPosts(data: BlogPost[]): Promise<void> {
  await setStorageItem(KEYS.BLOG_POSTS, data);
}

export async function getNews(): Promise<NewsItem[]> {
  const data = await getStorageItem<NewsItem[]>(KEYS.NEWS);
  return (data ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function setNews(data: NewsItem[]): Promise<void> {
  await setStorageItem(KEYS.NEWS, data);
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  return getStorageItem<ContactInfo>(KEYS.CONTACT);
}

export async function setContactInfo(data: ContactInfo): Promise<void> {
  await setStorageItem(KEYS.CONTACT, data);
}

export async function getSectionVisibility(): Promise<SectionVisibility> {
  const data = await getStorageItem<SectionVisibility>(KEYS.SECTION_VISIBILITY);
  return data ?? DEFAULT_VISIBILITY;
}

export async function setSectionVisibility(data: SectionVisibility): Promise<void> {
  await setStorageItem(KEYS.SECTION_VISIBILITY, data);
}

export async function getSiteTitle(): Promise<string> {
  const data = await getStorageItem<string>(KEYS.SITE_TITLE);
  return data ?? "Samet Elbeylioğlu | Portfolyo";
}

export async function setSiteTitle(title: string): Promise<void> {
  await setStorageItem(KEYS.SITE_TITLE, title);
}

export async function getFavicon(): Promise<string | null> {
  return getStorageItem<string>(KEYS.FAVICON);
}

export async function setFavicon(dataUrl: string | null): Promise<void> {
  await setStorageItem(KEYS.FAVICON, dataUrl);
}
