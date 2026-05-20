import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

const TOKEN_KEY = "@orun:jwt";

let _token: string | null = null;

export async function getStoredToken(): Promise<string | null> {
  if (_token) return _token;
  if (Platform.OS === "web") {
    _token = localStorage.getItem(TOKEN_KEY);
  } else {
    _token = await SecureStore.getItemAsync(TOKEN_KEY);
  }
  return _token;
}

export async function setStoredToken(token: string): Promise<void> {
  _token = token;
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function clearStoredToken(): Promise<void> {
  _token = null;
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? "Bilinmeyen hata");
  }
  return res.json() as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
