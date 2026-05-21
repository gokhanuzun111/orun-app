import { apiFetch } from "./api";

export interface ClubMembership {
  clubId: string;
  joinedAt: string;
}

export interface ClubWaitlistEntry {
  clubId: string;
  joinedAt: string;
}

export interface ClubsMeResponse {
  memberships: ClubMembership[];
  waitlist: ClubWaitlistEntry[];
}

export async function getMyClubs(): Promise<ClubsMeResponse> {
  return apiFetch<ClubsMeResponse>("/clubs/me");
}

export async function joinClub(clubId: string): Promise<{ joined: boolean; joinedAt: string }> {
  return apiFetch(`/clubs/${encodeURIComponent(clubId)}/join`, { method: "POST" });
}

export async function leaveClub(clubId: string): Promise<void> {
  await apiFetch(`/clubs/${encodeURIComponent(clubId)}/join`, { method: "DELETE" });
}

export async function joinClubWaitlist(
  clubId: string,
): Promise<{ onWaitlist: boolean; joinedAt: string }> {
  return apiFetch(`/clubs/${encodeURIComponent(clubId)}/waitlist`, { method: "POST" });
}

export async function leaveClubWaitlist(clubId: string): Promise<void> {
  await apiFetch(`/clubs/${encodeURIComponent(clubId)}/waitlist`, { method: "DELETE" });
}
