import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, Phone, MapPin, Droplets } from "lucide-react";
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
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [available, setAvailable] = useState(true);
  const { addDonor } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !bloodGroup || !phone.trim() || !city.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const ageNum = parseInt(age);
    if (ageNum < 18 || ageNum > 65) {
      toast.error("Donor age must be between 18 and 65");
      return;
    }

    addDonor({
      id: Date.now().toString(),
      name: name.trim(),
      age: ageNum,
      bloodGroup,
      phone: phone.trim(),
      city: city.trim(),
      available,
    });
    toast.success("Donor registered successfully!");
    navigate("/donors");
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Heart className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Donor Registration</h1>
            <p className="text-muted-foreground text-sm">Register as a blood donor and save lives</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="18-65" min={18} max={65} value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <Droplets className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="city" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-sm">Available for Donation</p>
              <p className="text-muted-foreground text-xs">Toggle your availability status</p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Register as Donor
          </Button>
        </form>
      </div>
    </div>
  );
}
