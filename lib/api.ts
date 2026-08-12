import { Platform } from "react-native";

const DEFAULT_HOST = Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_HOST;

async function handleResponse<T>(res: Response) {
  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch (e) {
    data = { error: text };
  }
  if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Request failed");
  return data as T;
}

async function safeFetch(input: string, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch (err: any) {
    throw new Error(
      (err && err.message) ||
        `Network request failed. Ensure backend is running and EXPO_PUBLIC_API_URL is set (tried ${API_URL}).`
    );
  }
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await safeFetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await safeFetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await safeFetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
