import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Low", "Medium", "High", "Critical"];

export default function BloodRequestPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !location.trim() || !urgency) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Blood request submitted!");
    navigate("/donors");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Request Blood</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6">
        <div className="space-y-1">
          <Label>Required Blood Group</Label>
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
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Enter hospital or address" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label>Urgency Level</Label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">Submit Request</Button>
      </form>
    </div>
  );
}
