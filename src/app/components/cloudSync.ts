import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c1c566ee`;

async function apiCall(path: string, options: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || publicAnonKey}`,
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `API error: ${res.status}`);
  return json;
}

// ── Auth ────────────────────────────────────────────────────────────────────────
export async function signUpUser(email: string, password: string, name: string) {
  return apiCall("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

// ── Data Sync ───────────────────────────────────────────────────────────────────
export async function loadAllData(token: string) {
  return apiCall("/sync-all", {}, token);
}

export async function saveData(key: string, value: unknown, token: string) {
  return apiCall("/sync", {
    method: "POST",
    body: JSON.stringify({ key, value }),
  }, token);
}

// ── Time Tracking ────────────────────────────────────────────────────────────────
export async function logTimeSession(
  date: string,
  sessionMinutes: number,
  tabBreakdown: Record<string, number>,
  token: string
) {
  return apiCall("/time-log", {
    method: "POST",
    body: JSON.stringify({ date, sessionMinutes, tabBreakdown }),
  }, token);
}

export async function getTimeStats(token: string) {
  return apiCall("/time-stats", {}, token);
}

// ── Health / Apple Watch Sync ────────────────────────────────────────────────────
export async function getHealthSync(token: string) {
  return apiCall("/health-sync", {}, token);
}

export async function postHealthSync(data: Record<string, unknown>, token: string) {
  return apiCall("/health-sync", {
    method: "POST",
    body: JSON.stringify(data),
  }, token);
}
