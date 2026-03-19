import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface SessionRecord {
  date: string;
  painType: "Acute" | "Chronic";
  placement: string;
  parameters: {
    frequency: number;
    pulseWidth: number;
    intensity: number;
    duration: number;
  };
  initialPain: number;
  finalPain: number;
  duration: number;
  painReductionPercentage: number;
  patientNotes: string;
}

export interface Profile {
  id: string;
  name: string;
  primaryCondition: string;
  medications: string[];
  sessionHistory: SessionRecord[];
}

interface AppData {
  profiles: Profile[];
  activeProfileId: string;
}

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  addProfile: (name: string, condition: string) => void;
  deleteProfile: (id: string) => void;
  addMedication: (med: string) => void;
  removeMedication: (med: string) => void;
  addSession: (session: SessionRecord) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const STORAGE_KEY = "tens-companion-data";

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { profiles: [], activeProfileId: "" };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const activeProfile = data.profiles.find((p) => p.id === data.activeProfileId) || null;

  const setActiveProfileId = useCallback((id: string) => {
    setData((d) => ({ ...d, activeProfileId: id }));
  }, []);

  const addProfile = useCallback((name: string, condition: string) => {
    const id = crypto.randomUUID();
    setData((d) => ({
      ...d,
      profiles: [...d.profiles, { id, name, primaryCondition: condition, medications: [], sessionHistory: [] }],
      activeProfileId: d.activeProfileId || id,
    }));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setData((d) => {
      const profiles = d.profiles.filter((p) => p.id !== id);
      return {
        profiles,
        activeProfileId: d.activeProfileId === id ? (profiles[0]?.id || "") : d.activeProfileId,
      };
    });
  }, []);

  const updateActive = useCallback((fn: (p: Profile) => Profile) => {
    setData((d) => ({
      ...d,
      profiles: d.profiles.map((p) => (p.id === d.activeProfileId ? fn(p) : p)),
    }));
  }, []);

  const addMedication = useCallback((med: string) => {
    updateActive((p) => ({ ...p, medications: [...p.medications, med] }));
  }, [updateActive]);

  const removeMedication = useCallback((med: string) => {
    updateActive((p) => ({ ...p, medications: p.medications.filter((m) => m !== med) }));
  }, [updateActive]);

  const addSession = useCallback((session: SessionRecord) => {
    updateActive((p) => ({ ...p, sessionHistory: [...p.sessionHistory, session] }));
  }, [updateActive]);

  return (
    <ProfileContext.Provider
      value={{
        profiles: data.profiles,
        activeProfile,
        activeProfileId: data.activeProfileId,
        setActiveProfileId,
        addProfile,
        deleteProfile,
        addMedication,
        removeMedication,
        addSession,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
