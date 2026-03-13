import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MapPin, Droplets, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "low", label: "Low", color: "bg-success text-success-foreground" },
  { value: "medium", label: "Medium", color: "bg-warning text-warning-foreground" },
  { value: "high", label: "High", color: "bg-primary text-primary-foreground" },
  { value: "critical", label: "Critical", color: "bg-primary text-primary-foreground animate-pulse-emergency" },
] as const;

export default function BloodRequestPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [requesterName, setRequesterName] = useState("");
  const [phone, setPhone] = useState("");
  const { addRequest } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !location.trim() || !requesterName.trim() || !phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    addRequest({
      id: Date.now().toString(),
      bloodGroup,
      location: location.trim(),
      urgency,
      requesterName: requesterName.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
      status: "active",
    });
    toast.success("Blood request submitted!");
    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Send className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Request Blood</h1>
            <p className="text-muted-foreground text-sm">Submit an emergency blood request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="space-y-2">
            <Label htmlFor="requesterName">Your Name</Label>
            <Input id="requesterName" placeholder="Enter your name" value={requesterName} onChange={(e) => setRequesterName(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group Needed</Label>
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
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Hospital / Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="location" placeholder="Enter hospital or address" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {urgencyLevels.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setUrgency(u.value)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                    urgency === u.value
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {u.value === "critical" && <AlertTriangle className="h-3.5 w-3.5" />}
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
