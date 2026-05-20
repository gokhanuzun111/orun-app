import { apiFetch } from "./api";

export interface MembershipInfo {
  membershipLevel: number;
  tokensUsed: number;
  tokensAllowed: number;
  tokensRemaining: number;
  monthKey: string;
}

export interface RoomAccessInfo {
  hasAccess: boolean;
  onWaitlist: boolean;
  joinedAt?: string;
  waitlistJoinedAt?: string;
}

export async function getMembership(): Promise<MembershipInfo> {
  return apiFetch<MembershipInfo>("/membership");
}

export async function useTokens(amount: number): Promise<{ tokensUsed: number; tokensAllowed: number }> {
  return apiFetch("/tokens/use", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function getRoomAccess(roomId: string): Promise<RoomAccessInfo> {
  return apiFetch<RoomAccessInfo>(`/rooms/${roomId}/access`);
}

export async function joinRoom(roomId: string, clubId: string): Promise<{ joined: boolean; joinedAt: string }> {
  return apiFetch(`/rooms/${roomId}/join`, {
    method: "POST",
    body: JSON.stringify({ clubId }),
  });
}

export async function joinWaitlist(roomId: string, clubId: string): Promise<{ onWaitlist: boolean; joinedAt: string }> {
  return apiFetch(`/rooms/${roomId}/waitlist`, {
    method: "POST",
    body: JSON.stringify({ clubId }),
  });
}

export async function leaveWaitlist(roomId: string): Promise<void> {
  await apiFetch(`/rooms/${roomId}/waitlist`, { method: "DELETE" });
}
