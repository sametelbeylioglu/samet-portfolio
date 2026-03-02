"use client";

import { getSupabase } from "./supabase";

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "Supabase baglantisi bulunamadi." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function logout(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function getUsername(): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return "";
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.email ?? "";
}

export async function changePassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "Supabase baglantisi yok." };
  if (newPassword.length < 6) return { ok: false, error: "Sifre en az 6 karakter olmali." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function changeEmail(newEmail: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "Supabase baglantisi yok." };

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
