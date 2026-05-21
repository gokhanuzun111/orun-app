import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { type UserProfile, MOCK_USER, type MembershipLevel } from "@/constants/data";
import * as authService from "@/services/auth";
import * as clubsService from "@/services/clubs";
import * as eventsService from "@/services/events";
import { getStoredToken } from "@/services/api";
import {
  addCustomerInfoListener,
  entitlementsToLevel,
  identifyRevenueCat,
  initRevenueCat,
  isRevenueCatSupported,
  logoutRevenueCat,
} from "@/services/revenuecat";

export interface WaitlistEntry {
  clubId: string;
  roomId: string;
  joinedAt: string;
}

interface AppContextValue {
  user: UserProfile;
  isOnboarded: boolean;
  isLoading: boolean;
  selectedInterests: string[];
  waitlist: WaitlistEntry[];
  rsvpedEvents: string[];
  setSelectedInterests: (interests: string[]) => void;
  completeOnboarding: (handle: string, bio: string, interests: string[]) => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  joinClub: (clubId: string) => Promise<void>;
  leaveClub: (clubId: string) => Promise<void>;
  joinWaitlist: (clubId: string, email?: string) => Promise<void>;
  leaveWaitlist: (clubId: string) => Promise<void>;
  isOnWaitlist: (clubId: string) => boolean;
  rsvpEvent: (eventId: string) => Promise<void>;
  unrsvpEvent: (eventId: string) => Promise<void>;
  isRsvped: (eventId: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const OLD_DATE = "2025-01-01T00:00:00.000Z";

function rsvpStorageKey(userId: string) {
  return `@orun:rsvps:${userId}`;
}

async function loadRsvpsCache(userId: string): Promise<string[]> {
  try {
    const key = rsvpStorageKey(userId);
    let raw: string | null = null;
    if (Platform.OS === "web") {
      raw = localStorage.getItem(key);
    } else {
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      raw = await AsyncStorage.getItem(key);
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveRsvpsCache(userId: string, eventIds: string[]): Promise<void> {
  try {
    const key = rsvpStorageKey(userId);
    const raw = JSON.stringify(eventIds);
    if (Platform.OS === "web") {
      localStorage.setItem(key, raw);
    } else {
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      await AsyncStorage.setItem(key, raw);
    }
  } catch {
  }
}

async function clearRsvpsCache(userId: string): Promise<void> {
  try {
    const key = rsvpStorageKey(userId);
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
      await AsyncStorage.removeItem(key);
    }
  } catch {
  }
}

function apiUserToProfile(apiUser: authService.ApiUser): UserProfile {
  return {
    id: String(apiUser.id),
    handle: apiUser.handle,
    bio: apiUser.bio,
    membershipLevel: apiUser.membershipLevel as MembershipLevel,
    joinedClubs: apiUser.joinedClubs.length > 0 ? apiUser.joinedClubs : ["master"],
    clubJoinDates: Object.keys(apiUser.clubJoinDates).length > 0
      ? apiUser.clubJoinDates
      : { master: OLD_DATE },
    reputation: apiUser.reputation,
    interests: apiUser.interests,
    memberSince: apiUser.memberSince,
    isAdmin: apiUser.isAdmin,
  } as UserProfile;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [rsvpedEvents, setRsvpedEvents] = useState<string[]>([]);

  const currentUserIdRef = useRef<string | null>(null);

  const hydrateServerStateFor = useCallback(async (profile: UserProfile) => {
    currentUserIdRef.current = profile.id;

    // 1) Paint instantly from cache
    const cached = await loadRsvpsCache(profile.id);
    setRsvpedEvents(cached);

    // 2) Fetch authoritative state from server
    try {
      const [clubsRes, rsvpsRes] = await Promise.all([
        clubsService.getMyClubs(),
        eventsService.getMyRsvps(),
      ]);

      const serverClubIds = clubsRes.memberships.map((m) => m.clubId);
      const serverClubDates: Record<string, string> = {};
      for (const m of clubsRes.memberships) serverClubDates[m.clubId] = m.joinedAt;

      setUser((prev) =>
        prev.id === profile.id
          ? {
              ...prev,
              joinedClubs: serverClubIds.length > 0 ? serverClubIds : ["master"],
              clubJoinDates: serverClubIds.length > 0 ? serverClubDates : { master: OLD_DATE },
            }
          : prev,
      );

      setWaitlist(
        clubsRes.waitlist.map((w) => ({
          clubId: w.clubId,
          roomId: w.clubId,
          joinedAt: w.joinedAt,
        })),
      );

      const serverEventIds = rsvpsRes.rsvps.map((r) => r.eventId);
      setRsvpedEvents(serverEventIds);
      await saveRsvpsCache(profile.id, serverEventIds);
    } catch (err: any) {
      if (__DEV__) console.warn("hydrateServerState failed:", err?.message);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const apiUser = await authService.getMe();
    if (apiUser) {
      const profile = apiUserToProfile(apiUser);
      setUser(profile);
      setIsOnboarded(true);
      await hydrateServerStateFor(profile);
      if (isRevenueCatSupported()) {
        try {
          const info = await identifyRevenueCat(profile.id);
          const rcLevel = entitlementsToLevel(info);
          setUser(prev => ({
            ...prev,
            membershipLevel: Math.max(profile.membershipLevel, rcLevel) as MembershipLevel,
          }));
        } catch (err: any) {
          if (__DEV__) console.warn("RC identify failed:", err?.message);
        }
      }
    }
  }, [hydrateServerStateFor]);

  useEffect(() => {
    const init = async () => {
      try {
        if (isRevenueCatSupported()) {
          try { await initRevenueCat(); } catch {}
        }
        const token = await getStoredToken();
        if (token) {
          await refreshUser();
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshUser]);

  useEffect(() => {
    if (!isRevenueCatSupported()) return;
    const unsub = addCustomerInfoListener(info => {
      const rcLevel = entitlementsToLevel(info);
      setUser(prev => {
        if (prev.id === MOCK_USER.id) return prev;
        return { ...prev, membershipLevel: rcLevel as MembershipLevel };
      });
    });
    return unsub;
  }, []);

  const loginAsAdmin = useCallback(async () => {
    const apiUser = await authService.login("admin@orun.app", process.env.EXPO_PUBLIC_ADMIN_PASSWORD ?? "orun-admin-2024");
    const profile = apiUserToProfile(apiUser);
    setUser(profile);
    setIsOnboarded(true);
    await hydrateServerStateFor(profile);
  }, [hydrateServerStateFor]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const apiUser = await authService.login(email, password);
    const profile = apiUserToProfile(apiUser);
    setUser(profile);
    setIsOnboarded(true);
    await hydrateServerStateFor(profile);
  }, [hydrateServerStateFor]);

  const registerWithEmail = useCallback(async (name: string, email: string, password: string) => {
    const apiUser = await authService.register(name, email, password);
    const profile = apiUserToProfile(apiUser);
    setUser(profile);
    await hydrateServerStateFor(profile);
  }, [hydrateServerStateFor]);

  const logout = useCallback(async () => {
    const userId = currentUserIdRef.current;
    await authService.logout();
    await logoutRevenueCat();
    if (userId) await clearRsvpsCache(userId);
    currentUserIdRef.current = null;
    setUser(MOCK_USER);
    setIsOnboarded(false);
    setSelectedInterests([]);
    setWaitlist([]);
    setRsvpedEvents([]);
  }, []);

  const deleteAccount = useCallback(async () => {
    const userId = currentUserIdRef.current;
    await authService.deleteAccount();
    if (userId) await clearRsvpsCache(userId);
    currentUserIdRef.current = null;
    setUser(MOCK_USER);
    setIsOnboarded(false);
    setSelectedInterests([]);
    setWaitlist([]);
    setRsvpedEvents([]);
  }, []);

  const completeOnboarding = useCallback(async (handle: string, bio: string, interests: string[]) => {
    const apiUser = await authService.updateProfile({ handle, bio, interests });
    const profile: UserProfile = {
      ...apiUserToProfile(apiUser),
      membershipLevel: 1 as MembershipLevel,
    };
    setUser(profile);
    setIsOnboarded(true);

    // Persist interest-based club memberships to the server (max 5).
    const seedClubs = interests.slice(0, 5);
    await Promise.allSettled(
      seedClubs.map((clubId) => clubsService.joinClub(clubId).catch(() => undefined)),
    );

    await hydrateServerStateFor(profile);
  }, [hydrateServerStateFor]);

  const joinClub = useCallback(async (clubId: string) => {
    const prevUser = user;
    setUser((u) => {
      if (u.joinedClubs.includes(clubId)) return u;
      return {
        ...u,
        joinedClubs: [...u.joinedClubs, clubId],
        clubJoinDates: { ...u.clubJoinDates, [clubId]: new Date().toISOString() },
      };
    });
    try {
      const res = await clubsService.joinClub(clubId);
      setUser((u) => ({
        ...u,
        clubJoinDates: { ...u.clubJoinDates, [clubId]: res.joinedAt },
      }));
    } catch (err) {
      setUser(prevUser);
      throw err;
    }
  }, [user]);

  const leaveClub = useCallback(async (clubId: string) => {
    const prevUser = user;
    setUser((u) => {
      const updatedDates = { ...u.clubJoinDates };
      delete updatedDates[clubId];
      return {
        ...u,
        joinedClubs: u.joinedClubs.filter((id) => id !== clubId),
        clubJoinDates: updatedDates,
      };
    });
    try {
      await clubsService.leaveClub(clubId);
    } catch (err) {
      setUser(prevUser);
      throw err;
    }
  }, [user]);

  const joinWaitlist = useCallback(async (clubId: string, _email?: string) => {
    const prev = waitlist;
    setWaitlist((w) =>
      w.some((e) => e.clubId === clubId)
        ? w
        : [...w, { clubId, roomId: clubId, joinedAt: new Date().toISOString() }],
    );
    try {
      const res = await clubsService.joinClubWaitlist(clubId);
      setWaitlist((w) =>
        w.map((e) => (e.clubId === clubId ? { ...e, joinedAt: res.joinedAt } : e)),
      );
    } catch (err) {
      setWaitlist(prev);
      throw err;
    }
  }, [waitlist]);

  const leaveWaitlist = useCallback(async (clubId: string) => {
    const prev = waitlist;
    setWaitlist((w) => w.filter((e) => e.clubId !== clubId));
    try {
      await clubsService.leaveClubWaitlist(clubId);
    } catch (err) {
      setWaitlist(prev);
      throw err;
    }
  }, [waitlist]);

  const isOnWaitlist = useCallback(
    (clubId: string) => waitlist.some((e) => e.clubId === clubId),
    [waitlist],
  );

  const rsvpEvent = useCallback(async (eventId: string) => {
    const userId = currentUserIdRef.current;
    const prev = rsvpedEvents;
    const next = prev.includes(eventId) ? prev : [...prev, eventId];
    setRsvpedEvents(next);
    try {
      await eventsService.rsvpEvent(eventId);
      if (userId) await saveRsvpsCache(userId, next);
    } catch (err) {
      setRsvpedEvents(prev);
      throw err;
    }
  }, [rsvpedEvents]);

  const unrsvpEvent = useCallback(async (eventId: string) => {
    const userId = currentUserIdRef.current;
    const prev = rsvpedEvents;
    const next = prev.filter((id) => id !== eventId);
    setRsvpedEvents(next);
    try {
      await eventsService.unrsvpEvent(eventId);
      if (userId) await saveRsvpsCache(userId, next);
    } catch (err) {
      setRsvpedEvents(prev);
      throw err;
    }
  }, [rsvpedEvents]);

  const isRsvped = useCallback(
    (eventId: string) => rsvpedEvents.includes(eventId),
    [rsvpedEvents],
  );

  return (
    <AppContext.Provider
      value={{
        user,
        isOnboarded,
        isLoading,
        selectedInterests,
        waitlist,
        setSelectedInterests,
        completeOnboarding,
        loginAsAdmin,
        loginWithEmail,
        registerWithEmail,
        logout,
        deleteAccount,
        joinClub,
        leaveClub,
        joinWaitlist,
        leaveWaitlist,
        isOnWaitlist,
        rsvpedEvents,
        rsvpEvent,
        unrsvpEvent,
        isRsvped,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
