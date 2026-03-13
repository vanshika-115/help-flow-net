import React, { createContext, useContext, useState, ReactNode } from "react";

export type Donor = {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  city: string;
  available: boolean;
};

export type BloodRequest = {
  id: string;
  bloodGroup: string;
  location: string;
  urgency: "low" | "medium" | "high" | "critical";
  requesterName: string;
  phone: string;
  createdAt: string;
  status: "active" | "fulfilled";
};

type User = {
  email: string;
  name: string;
  role: "donor" | "recipient";
};

type AppContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  donors: Donor[];
  addDonor: (d: Donor) => void;
  toggleDonorAvailability: (id: string) => void;
  requests: BloodRequest[];
  addRequest: (r: BloodRequest) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const sampleDonors: Donor[] = [
  { id: "1", name: "Rahul Sharma", age: 28, bloodGroup: "O+", phone: "+91 98765 43210", city: "Mumbai", available: true },
  { id: "2", name: "Priya Patel", age: 32, bloodGroup: "A+", phone: "+91 87654 32109", city: "Delhi", available: true },
  { id: "3", name: "Amit Kumar", age: 25, bloodGroup: "B+", phone: "+91 76543 21098", city: "Bangalore", available: false },
  { id: "4", name: "Sneha Reddy", age: 30, bloodGroup: "AB+", phone: "+91 65432 10987", city: "Hyderabad", available: true },
  { id: "5", name: "Vikram Singh", age: 35, bloodGroup: "O-", phone: "+91 54321 09876", city: "Chennai", available: true },
];

const sampleRequests: BloodRequest[] = [
  { id: "1", bloodGroup: "O+", location: "City Hospital, Mumbai", urgency: "critical", requesterName: "Anita Desai", phone: "+91 99887 76655", createdAt: new Date().toISOString(), status: "active" },
  { id: "2", bloodGroup: "A+", location: "Apollo Hospital, Delhi", urgency: "high", requesterName: "Ravi Verma", phone: "+91 88776 65544", createdAt: new Date().toISOString(), status: "active" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [donors, setDonors] = useState<Donor[]>(sampleDonors);
  const [requests, setRequests] = useState<BloodRequest[]>(sampleRequests);

  const addDonor = (d: Donor) => setDonors((prev) => [d, ...prev]);
  const toggleDonorAvailability = (id: string) =>
    setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d)));
  const addRequest = (r: BloodRequest) => setRequests((prev) => [r, ...prev]);

  return (
    <AppContext.Provider value={{ user, setUser, donors, addDonor, toggleDonorAvailability, requests, addRequest }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
