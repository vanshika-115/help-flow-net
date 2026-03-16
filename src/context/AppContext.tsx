import React, { createContext, useContext, useState, ReactNode } from "react";

export type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  city: string;
  available: boolean;
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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleDonors: Donor[] = [
  { id: "1", name: "Rahul Sharma", bloodGroup: "O+", phone: "+91 98765 43210", city: "Mumbai", available: true },
  { id: "2", name: "Priya Patel", bloodGroup: "A+", phone: "+91 87654 32109", city: "Delhi", available: true },
  { id: "3", name: "Amit Kumar", bloodGroup: "B+", phone: "+91 76543 21098", city: "Bangalore", available: true },
  { id: "4", name: "Sneha Reddy", bloodGroup: "AB+", phone: "+91 65432 10987", city: "Hyderabad", available: true },
  { id: "5", name: "Vikram Singh", bloodGroup: "O+", phone: "+91 54321 09876", city: "Chennai", available: true },
  { id: "6", name: "Neha Gupta", bloodGroup: "A+", phone: "+91 43210 98765", city: "Pune", available: true },
  { id: "7", name: "Ravi Verma", bloodGroup: "B+", phone: "+91 32109 87654", city: "Kolkata", available: true },
  { id: "8", name: "Anjali Nair", bloodGroup: "O-", phone: "+91 21098 76543", city: "Kochi", available: true },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [donors, setDonors] = useState<Donor[]>(sampleDonors);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);

  const addDonor = (d: Donor) => setDonors((prev) => [d, ...prev]);

  const updateDonorAvailability = (id: string, available: boolean) => {
    setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, available } : d)));
  };

  const addBloodRequest = (r: BloodRequest) => setBloodRequests((prev) => [r, ...prev]);

  const assignDonorToRequest = (requestId: string, donorId: string) => {
    const donor = donors.find((d) => d.id === donorId);
    if (!donor) return;
    setBloodRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, assignedDonor: donor.name } : r))
    );
    updateDonorAvailability(donorId, false);
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, donors, addDonor, updateDonorAvailability, bloodRequests, addBloodRequest, assignDonorToRequest }}
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
