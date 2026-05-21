import { apiFetch } from "./api";
import type { MembershipLevel } from "@/constants/data";

export interface ServerMessage {
  id: number;
  userId: number;
  handle: string;
  membershipLevel: MembershipLevel;
  content: string;
  createdAt: string;
}

export interface MessagesResponse {
  messages: ServerMessage[];
  nextCursor: number | null;
}

export async function getMessages(
  roomId: string,
  cursor?: number,
): Promise<MessagesResponse> {
  const params = new URLSearchParams({ limit: "50" });
  if (cursor !== undefined) params.set("cursor", String(cursor));
  return apiFetch<MessagesResponse>(`/rooms/${encodeURIComponent(roomId)}/messages?${params}`);
}

export async function sendMessage(
  roomId: string,
  content: string,
): Promise<ServerMessage> {
  return apiFetch<ServerMessage>(`/rooms/${encodeURIComponent(roomId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
