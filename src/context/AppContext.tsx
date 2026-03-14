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
};

type User = { name: string } | null;

type AppContextType = {
  user: User;
  setUser: (u: User) => void;
  donors: Donor[];
  addDonor: (d: Donor) => void;
  bloodRequests: BloodRequest[];
  addBloodRequest: (r: BloodRequest) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleDonors: Donor[] = [
  { id: "1", name: "Rahul Sharma", bloodGroup: "O+", phone: "+91 98765 43210", city: "Mumbai", available: true },
  { id: "2", name: "Priya Patel", bloodGroup: "A+", phone: "+91 87654 32109", city: "Delhi", available: true },
  { id: "3", name: "Amit Kumar", bloodGroup: "B+", phone: "+91 76543 21098", city: "Bangalore", available: false },
  { id: "4", name: "Sneha Reddy", bloodGroup: "AB+", phone: "+91 65432 10987", city: "Hyderabad", available: true },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [donors, setDonors] = useState<Donor[]>(sampleDonors);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const addDonor = (d: Donor) => setDonors((prev) => [d, ...prev]);
  const addBloodRequest = (r: BloodRequest) => setBloodRequests((prev) => [r, ...prev]);

  return (
    <AppContext.Provider value={{ user, setUser, donors, addDonor, bloodRequests, addBloodRequest }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
