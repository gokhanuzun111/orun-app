import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type UserProfile, MOCK_USER, type MembershipLevel } from "@/constants/data";
import * as authService from "@/services/auth";
import { getStoredToken } from "@/services/api";

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
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;
  joinWaitlist: (clubId: string, email: string) => void;
  leaveWaitlist: (clubId: string) => void;
  isOnWaitlist: (clubId: string) => boolean;
  rsvpEvent: (eventId: string) => void;
  unrsvpEvent: (eventId: string) => void;
  isRsvped: (eventId: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const OLD_DATE = "2025-01-01T00:00:00.000Z";

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

  const refreshUser = useCallback(async () => {
    const apiUser = await authService.getMe();
    if (apiUser) {
      setUser(apiUserToProfile(apiUser));
      setIsOnboarded(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
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

  const loginAsAdmin = useCallback(async () => {
    const apiUser = await authService.login("admin@orun.app", process.env.EXPO_PUBLIC_ADMIN_PASSWORD ?? "orun-admin-2024");
    setUser(apiUserToProfile(apiUser));
    setIsOnboarded(true);
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const apiUser = await authService.login(email, password);
    setUser(apiUserToProfile(apiUser));
    setIsOnboarded(true);
  }, []);

  const registerWithEmail = useCallback(async (name: string, email: string, password: string) => {
    const apiUser = await authService.register(name, email, password);
    setUser(apiUserToProfile(apiUser));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(MOCK_USER);
    setIsOnboarded(false);
    setSelectedInterests([]);
    setWaitlist([]);
    setRsvpedEvents([]);
  }, []);

  const completeOnboarding = useCallback(async (handle: string, bio: string, interests: string[]) => {
    const apiUser = await authService.updateProfile({ handle, bio, interests });
    const profileUser: UserProfile = {
      ...apiUserToProfile(apiUser),
      membershipLevel: 1 as MembershipLevel,
      joinedClubs: ["master", ...interests.slice(0, 5)],
      clubJoinDates: {
        master: OLD_DATE,
        ...Object.fromEntries(interests.slice(0, 5).map(id => [id, new Date().toISOString()])),
      },
    };
    setUser(profileUser);
    setIsOnboarded(true);
  }, []);

  const joinClub = useCallback((clubId: string) => {
    setUser(prev => {
      if (prev.joinedClubs.includes(clubId)) return prev;
      return {
        ...prev,
        joinedClubs: [...prev.joinedClubs, clubId],
        clubJoinDates: { ...prev.clubJoinDates, [clubId]: new Date().toISOString() },
      };
    });
  }, []);

  const leaveClub = useCallback((clubId: string) => {
    setUser(prev => {
      const updatedDates = { ...prev.clubJoinDates };
      delete updatedDates[clubId];
      return {
        ...prev,
        joinedClubs: prev.joinedClubs.filter(id => id !== clubId),
        clubJoinDates: updatedDates,
      };
    });
  }, []);

  const joinWaitlist = useCallback((clubId: string, _email: string) => {
    setWaitlist(prev => {
      if (prev.some(e => e.clubId === clubId)) return prev;
      return [...prev, { clubId, roomId: clubId, joinedAt: new Date().toISOString() }];
    });
  }, []);

  const leaveWaitlist = useCallback((clubId: string) => {
    setWaitlist(prev => prev.filter(e => e.clubId !== clubId));
  }, []);

  const isOnWaitlist = useCallback(
    (clubId: string) => waitlist.some(e => e.clubId === clubId),
    [waitlist],
  );

  const rsvpEvent = useCallback((eventId: string) => {
    setRsvpedEvents(prev => prev.includes(eventId) ? prev : [...prev, eventId]);
  }, []);

  const unrsvpEvent = useCallback((eventId: string) => {
    setRsvpedEvents(prev => prev.filter(id => id !== eventId));
  }, []);

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
