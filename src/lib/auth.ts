"use client";

const SALT = "_portfolio_salt_2026";
const AUTH_VERSION = "v1";
const DEFAULT_USERNAME = "admin";
const DEFAULT_HASH = "4457f261723dad14484b49e78b1fc9a8c915e7d2c14695086f8916d68f4976e7";

const KEYS = {
  IS_AUTH: "portfolio_isAuthenticated",
  USERNAME: "portfolio_username",
  PASSWORD_HASH: "portfolio_passwordHash",
  AUTH_VERSION: "portfolio_authVersion",
};

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  return sha256(password + SALT);
}

function ensureDefaults() {
  if (typeof window === "undefined") return;

  const ver = localStorage.getItem(KEYS.AUTH_VERSION);
  if (ver !== AUTH_VERSION) {
    localStorage.removeItem(KEYS.IS_AUTH);
    localStorage.removeItem(KEYS.USERNAME);
    localStorage.removeItem(KEYS.PASSWORD_HASH);
    localStorage.setItem(KEYS.AUTH_VERSION, AUTH_VERSION);
  }

  if (!localStorage.getItem(KEYS.USERNAME)) {
    localStorage.setItem(KEYS.USERNAME, DEFAULT_USERNAME);
  }
  if (!localStorage.getItem(KEYS.PASSWORD_HASH)) {
    localStorage.setItem(KEYS.PASSWORD_HASH, DEFAULT_HASH);
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  ensureDefaults();

  const storedUsername = localStorage.getItem(KEYS.USERNAME) ?? DEFAULT_USERNAME;
  const storedHash = localStorage.getItem(KEYS.PASSWORD_HASH) ?? DEFAULT_HASH;
  const inputHash = await hashPassword(password);

  if (username === storedUsername && inputHash === storedHash) {
    localStorage.setItem(KEYS.IS_AUTH, "true");
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.IS_AUTH);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  ensureDefaults();
  return localStorage.getItem(KEYS.IS_AUTH) === "true";
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  ensureDefaults();

  const storedHash = localStorage.getItem(KEYS.PASSWORD_HASH) ?? DEFAULT_HASH;
  const currentHash = await hashPassword(currentPassword);

  if (currentHash !== storedHash) return false;
  if (newPassword.length < 6) return false;

  const newHash = await hashPassword(newPassword);
  localStorage.setItem(KEYS.PASSWORD_HASH, newHash);
  return true;
}

export async function changeUsername(newUsername: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!newUsername || newUsername.length < 3) return false;
  localStorage.setItem(KEYS.USERNAME, newUsername);
  return true;
}

export function getUsername(): string {
  if (typeof window === "undefined") return "";
  ensureDefaults();
  return localStorage.getItem(KEYS.USERNAME) ?? DEFAULT_USERNAME;
}
