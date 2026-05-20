import { type Room, type UserProfile } from "@/constants/data";

export type RoomAccessStatus =
  | { allowed: true }
  | { allowed: false; reason: "not_member"; clubId: string }
  | { allowed: false; reason: "too_new"; daysLeft: number }
  | { allowed: false; reason: "room_full" };

export const WAITING_DAYS = 7;

function daysSince(isoDate: string): number {
  const joined = new Date(isoDate).getTime();
  return Math.floor((Date.now() - joined) / (1000 * 60 * 60 * 24));
}

export function checkRoomAccess(room: Room, user: UserProfile): RoomAccessStatus {
  if (room.memberCount >= room.maxCapacity) {
    return { allowed: false, reason: "room_full" };
  }

  if (room.isLanguageRoom || room.clubId === "master") {
    return { allowed: true };
  }

  const isMember = user.joinedClubs.includes(room.clubId);
  if (!isMember) {
    return { allowed: false, reason: "not_member", clubId: room.clubId };
  }

  const joinDateStr = user.clubJoinDates?.[room.clubId];
  if (!joinDateStr) {
    return { allowed: false, reason: "too_new", daysLeft: WAITING_DAYS };
  }

  const days = daysSince(joinDateStr);
  if (days < WAITING_DAYS) {
    return { allowed: false, reason: "too_new", daysLeft: WAITING_DAYS - days };
  }

  return { allowed: true };
}

export function useRoomAccessLabel(status: RoomAccessStatus): string {
  if (status.allowed) return "";
  if (status.reason === "not_member") return "Üye değil";
  if (status.reason === "room_full") return "Oda dolu";
  if (status.reason === "too_new") {
    return status.daysLeft === 1 ? "1 gün kaldı" : `${status.daysLeft} gün kaldı`;
  }
  return "";
}
