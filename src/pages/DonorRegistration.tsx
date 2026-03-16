import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorRegistration() {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [available, setAvailable] = useState(true);
  const { addDonor } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bloodGroup || !phone.trim() || !city.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    addDonor({
      id: Date.now().toString(),
      name: name.trim(),
      bloodGroup,
      phone: phone.trim(),
      city: city.trim(),
      available,
      totalDonations: 0,
    });
    toast.success("Donor registered successfully!");
    navigate("/donors");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Donor Registration</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label>Blood Group</Label>
          <Select value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
            <SelectContent>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="flex items-center justify-between border border-border rounded-lg p-3">
          <Label>Available for Donation</Label>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </div>

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
}
