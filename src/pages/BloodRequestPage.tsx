import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Low", "Medium", "High", "Critical"];

export default function BloodRequestPage() {
  const { user, bloodRequests, addBloodRequest } = useApp();
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !location.trim() || !urgency) {
      toast.error("Please fill in all fields");
      return;
    }
    addBloodRequest({
      id: Date.now().toString(),
      recipientName: user?.name || "Unknown",
      bloodGroup,
      location: location.trim(),
      urgency,
      date: new Date().toLocaleDateString(),
    });
    toast.success("Blood request submitted!");
    setBloodGroup("");
    setLocation("");
    setUrgency("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-xl font-bold">Request Blood</h1>

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

      {/* Request List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Request List</h2>
        {bloodRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.recipientName}</TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">{req.bloodGroup}</span>
                    </TableCell>
                    <TableCell>{req.location}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        req.urgency === "Critical" ? "bg-destructive/10 text-destructive" :
                        req.urgency === "High" ? "bg-orange-100 text-orange-700" :
                        req.urgency === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {req.urgency}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{req.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
