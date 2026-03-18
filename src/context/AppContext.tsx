import React, { createContext, useContext, useState, ReactNode } from "react";

export type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  city: string;
  available: boolean;
  lastDonationDate?: string;
  totalDonations: number;
  cooldownUntil?: string;
};

export type BloodRequest = {
  id: string;
  recipientName: string;
  bloodGroup: string;
  location: string;
  urgency: string;
  date: string;
  assignedDonor?: string;
};

type User = { name: string } | null;

type AppContextType = {
  user: User;
  setUser: (u: User) => void;
  donors: Donor[];
  addDonor: (d: Donor) => void;
  updateDonorAvailability: (id: string, available: boolean) => void;
  bloodRequests: BloodRequest[];
  addBloodRequest: (r: BloodRequest) => void;
  assignDonorToRequest: (requestId: string, donorId: string) => void;
  expandedSearch: boolean;
  setExpandedSearch: (v: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleDonors: Donor[] = [];

const COOLDOWN_DAYS = 56; // ~8 weeks

const STORAGE_VERSION = "v2";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (localStorage.getItem("bb_version") !== STORAGE_VERSION) {
      localStorage.removeItem("bb_donors");
      localStorage.removeItem("bb_requests");
      localStorage.setItem("bb_version", STORAGE_VERSION);
      return fallback;
    }
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => loadFromStorage("bb_user", null));
  const [donors, setDonors] = useState<Donor[]>(() => loadFromStorage("bb_donors", sampleDonors));
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => loadFromStorage("bb_requests", []));
  const [expandedSearch, setExpandedSearch] = useState(false);

  // Persist to localStorage on changes
  React.useEffect(() => { localStorage.setItem("bb_donors", JSON.stringify(donors)); }, [donors]);
  React.useEffect(() => { localStorage.setItem("bb_requests", JSON.stringify(bloodRequests)); }, [bloodRequests]);
  React.useEffect(() => { localStorage.setItem("bb_user", JSON.stringify(user)); }, [user]);

  const addDonor = (d: Donor) => setDonors((prev) => [d, ...prev]);

  const updateDonorAvailability = (id: string, available: boolean) => {
    setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, available } : d)));
  };

  const addBloodRequest = (r: BloodRequest) => setBloodRequests((prev) => [r, ...prev]);

  const assignDonorToRequest = (requestId: string, donorId: string) => {
    const donor = donors.find((d) => d.id === donorId);
    if (!donor) return;

    const now = new Date();
    const cooldownUntil = new Date(now.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setBloodRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, assignedDonor: donor.name } : r))
    );
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? {
              ...d,
              available: false,
              lastDonationDate: now.toISOString().split("T")[0],
              totalDonations: d.totalDonations + 1,
              cooldownUntil,
            }
          : d
      )
    );
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, donors, addDonor, updateDonorAvailability, bloodRequests, addBloodRequest, assignDonorToRequest, expandedSearch, setExpandedSearch }}
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
