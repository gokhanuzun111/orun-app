import { type Room, type UserProfile } from "@/constants/data";
import { getRoomAccess, joinRoom, joinWaitlist, leaveWaitlist } from "@/services/membership";
import { useCallback, useEffect, useState } from "react";

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

export interface RoomAccessState {
  hasAccess: boolean;
  onWaitlist: boolean;
  isLoading: boolean;
  joinedAt?: string;
  waitlistJoinedAt?: string;
}

export function useRoomAccess(roomId: string, clubId: string) {
  const [state, setState] = useState<RoomAccessState>({
    hasAccess: false,
    onWaitlist: false,
    isLoading: true,
  });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await getRoomAccess(roomId);
      setState({
        hasAccess: result.hasAccess,
        onWaitlist: result.onWaitlist,
        isLoading: false,
        joinedAt: result.joinedAt,
        waitlistJoinedAt: result.waitlistJoinedAt,
      });
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [roomId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const join = useCallback(async () => {
    const result = await joinRoom(roomId, clubId);
    setState(prev => ({ ...prev, hasAccess: result.joined, joinedAt: result.joinedAt }));
    return result;
  }, [roomId, clubId]);

  const addToWaitlist = useCallback(async () => {
    const result = await joinWaitlist(roomId, clubId);
    setState(prev => ({ ...prev, onWaitlist: result.onWaitlist, waitlistJoinedAt: result.joinedAt }));
    return result;
  }, [roomId, clubId]);

  const removeFromWaitlist = useCallback(async () => {
    await leaveWaitlist(roomId);
    setState(prev => ({ ...prev, onWaitlist: false, waitlistJoinedAt: undefined }));
  }, [roomId]);

  return { ...state, join, addToWaitlist, removeFromWaitlist, refresh };
}
