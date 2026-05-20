import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type UserProfile, MOCK_USER, ADMIN_USER, type MembershipLevel } from "@/constants/data";

export interface WaitlistEntry {
  clubId: string;
  email: string;
  joinedAt: string;
}

interface AppContextValue {
  user: UserProfile;
  isOnboarded: boolean;
  isLoading: boolean;
  selectedInterests: string[];
  waitlist: WaitlistEntry[];
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
}

const AppContext = createContext<AppContextValue | null>(null);

const OLD_DATE = "2025-01-01T00:00:00.000Z";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem("@orun:user");
        const onboarded = await AsyncStorage.getItem("@orun:onboarded");
        const storedWaitlist = await AsyncStorage.getItem("@orun:waitlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.clubJoinDates) parsed.clubJoinDates = {};
          if (!parsed.joinedClubs.includes("master")) {
            parsed.joinedClubs = ["master", ...parsed.joinedClubs];
            parsed.clubJoinDates["master"] = OLD_DATE;
          }
          setUser(parsed);
        }
        if (onboarded === "true") setIsOnboarded(true);
        if (storedWaitlist) setWaitlist(JSON.parse(storedWaitlist));
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  const loginAsAdmin = useCallback(async () => {
    setUser(ADMIN_USER);
    setIsOnboarded(true);
    await AsyncStorage.setItem("@orun:user", JSON.stringify(ADMIN_USER));
    await AsyncStorage.setItem("@orun:onboarded", "true");
  }, []);

  const loginWithEmail = useCallback(async (email: string, _password: string) => {
    const stored = await AsyncStorage.getItem("@orun:accounts");
    const accounts: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
    const found = Object.values(accounts).find(a => (a as any).email === email.toLowerCase());
    if (!found) throw new Error("Bu e-posta ile kayıtlı hesap bulunamadı.");
    setUser(found);
    setIsOnboarded(true);
    await AsyncStorage.setItem("@orun:user", JSON.stringify(found));
    await AsyncStorage.setItem("@orun:onboarded", "true");
  }, []);

  const registerWithEmail = useCallback(async (name: string, email: string, _password: string) => {
    const stored = await AsyncStorage.getItem("@orun:accounts");
    const accounts: Record<string, any> = stored ? JSON.parse(stored) : {};
    const exists = Object.values(accounts).some(a => (a as any).email === email.toLowerCase());
    if (exists) throw new Error("Bu e-posta zaten kayıtlı.");
    const id = `usr_${Date.now()}`;
    const handle = `@${name.toLowerCase().replace(/\s+/g, "").slice(0, 16)}`;
    const newUser: UserProfile & { email: string } = {
      id,
      handle,
      bio: "",
      membershipLevel: 0 as MembershipLevel,
      joinedClubs: ["master"],
      clubJoinDates: { master: OLD_DATE },
      reputation: 0,
      interests: [],
      memberSince: new Date().getFullYear().toString(),
      email: email.toLowerCase(),
    };
    accounts[id] = newUser;
    await AsyncStorage.setItem("@orun:accounts", JSON.stringify(accounts));
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(["@orun:user", "@orun:onboarded"]);
    setUser(MOCK_USER);
    setIsOnboarded(false);
    setSelectedInterests([]);
    setWaitlist([]);
  }, []);

  const completeOnboarding = useCallback(async (handle: string, bio: string, interests: string[]) => {
    const now = new Date().toISOString();
    const initialClubs = interests.slice(0, 5);
    const clubJoinDates: Record<string, string> = { master: OLD_DATE };
    for (const clubId of initialClubs) {
      clubJoinDates[clubId] = now;
    }
    const updatedUser: UserProfile = {
      ...user,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      bio,
      membershipLevel: 1 as MembershipLevel,
      joinedClubs: ["master", ...initialClubs],
      clubJoinDates,
      reputation: 0,
      interests,
      memberSince: new Date().getFullYear().toString(),
    };
    setUser(updatedUser);
    setIsOnboarded(true);
    await AsyncStorage.setItem("@orun:user", JSON.stringify(updatedUser));
    await AsyncStorage.setItem("@orun:onboarded", "true");
    const stored = await AsyncStorage.getItem("@orun:accounts");
    const accounts: Record<string, any> = stored ? JSON.parse(stored) : {};
    accounts[updatedUser.id] = updatedUser;
    await AsyncStorage.setItem("@orun:accounts", JSON.stringify(accounts));
  }, [user]);

  const joinClub = useCallback((clubId: string) => {
    setUser(prev => {
      if (prev.joinedClubs.includes(clubId)) return prev;
      const updated: UserProfile = {
        ...prev,
        joinedClubs: [...prev.joinedClubs, clubId],
        clubJoinDates: {
          ...prev.clubJoinDates,
          [clubId]: new Date().toISOString(),
        },
      };
      AsyncStorage.setItem("@orun:user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const leaveClub = useCallback((clubId: string) => {
    setUser(prev => {
      const updatedDates = { ...prev.clubJoinDates };
      delete updatedDates[clubId];
      const updated: UserProfile = {
        ...prev,
        joinedClubs: prev.joinedClubs.filter(id => id !== clubId),
        clubJoinDates: updatedDates,
      };
      AsyncStorage.setItem("@orun:user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const joinWaitlist = useCallback((clubId: string, email: string) => {
    setWaitlist(prev => {
      if (prev.some(e => e.clubId === clubId)) return prev;
      const updated = [
        ...prev,
        { clubId, email, joinedAt: new Date().toISOString() },
      ];
      AsyncStorage.setItem("@orun:waitlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const leaveWaitlist = useCallback((clubId: string) => {
    setWaitlist(prev => {
      const updated = prev.filter(e => e.clubId !== clubId);
      AsyncStorage.setItem("@orun:waitlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isOnWaitlist = useCallback(
    (clubId: string) => waitlist.some(e => e.clubId === clubId),
    [waitlist],
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
