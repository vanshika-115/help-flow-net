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

const sampleDonors: Donor[] = [
  { id: "1", name: "Rahul Sharma", bloodGroup: "O+", phone: "+91 98765 43210", city: "Mumbai", available: true, totalDonations: 3, lastDonationDate: "2025-11-10" },
  { id: "2", name: "Priya Patel", bloodGroup: "A+", phone: "+91 87654 32109", city: "Delhi", available: true, totalDonations: 1, lastDonationDate: "2025-12-20" },
  { id: "3", name: "Amit Kumar", bloodGroup: "B+", phone: "+91 76543 21098", city: "Bangalore", available: true, totalDonations: 5, lastDonationDate: "2025-09-15" },
  { id: "4", name: "Sneha Reddy", bloodGroup: "AB+", phone: "+91 65432 10987", city: "Hyderabad", available: true, totalDonations: 2, lastDonationDate: "2026-01-05" },
  { id: "5", name: "Vikram Singh", bloodGroup: "O+", phone: "+91 54321 09876", city: "Chennai", available: true, totalDonations: 4, lastDonationDate: "2025-10-01" },
  { id: "6", name: "Neha Gupta", bloodGroup: "A+", phone: "+91 43210 98765", city: "Pune", available: true, totalDonations: 0 },
  { id: "7", name: "Ravi Verma", bloodGroup: "B+", phone: "+91 32109 87654", city: "Kolkata", available: true, totalDonations: 2, lastDonationDate: "2025-08-20" },
  { id: "8", name: "Anjali Nair", bloodGroup: "O-", phone: "+91 21098 76543", city: "Kochi", available: true, totalDonations: 1, lastDonationDate: "2026-02-01" },
];

const COOLDOWN_DAYS = 56; // ~8 weeks

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [donors, setDonors] = useState<Donor[]>(sampleDonors);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [expandedSearch, setExpandedSearch] = useState(false);

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
