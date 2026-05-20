import { apiFetch, setStoredToken, clearStoredToken } from "./api";
import type { MembershipLevel } from "@/constants/data";

export interface ApiUser {
  id: number;
  email: string;
  handle: string;
  bio: string;
  membershipLevel: MembershipLevel;
  interests: string[];
  joinedClubs: string[];
  clubJoinDates: Record<string, string>;
  reputation: number;
  isAdmin: boolean;
  isBanned: boolean;
  memberSince: string;
  createdAt: string;
}

export async function register(name: string, email: string, password: string): Promise<ApiUser> {
  const { token, user } = await apiFetch<{ token: string; user: ApiUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  await setStoredToken(token);
  return user;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const { token, user } = await apiFetch<{ token: string; user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  await setStoredToken(token);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {}
  await clearStoredToken();
}

export async function getMe(): Promise<ApiUser | null> {
  try {
    const { user } = await apiFetch<{ user: ApiUser }>("/auth/me");
    return user;
  } catch {
    return null;
  }
}

export async function updateProfile(data: {
  bio?: string;
  interests?: string[];
  handle?: string;
}): Promise<ApiUser> {
  const { user } = await apiFetch<{ user: ApiUser }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return user;
}
