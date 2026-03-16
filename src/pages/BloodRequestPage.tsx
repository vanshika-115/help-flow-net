import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { CheckCircle, UserCheck } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Low", "Medium", "High", "Critical"];

export default function BloodRequestPage() {
  const { user, donors, bloodRequests, addBloodRequest, assignDonorToRequest } = useApp();
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [lastSubmittedGroup, setLastSubmittedGroup] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !location.trim() || !urgency) {
      toast.error("Please fill in all fields");
      return;
    }
    const id = Date.now().toString();
    addBloodRequest({
      id,
      recipientName: user?.name || "Unknown",
      bloodGroup,
      location: location.trim(),
      urgency,
      date: new Date().toLocaleDateString(),
    });
    setLastSubmittedGroup(bloodGroup);
    setLastRequestId(id);
    toast.success("Blood request submitted! Matching donors shown below.");
    setBloodGroup("");
    setLocation("");
    setUrgency("");
  };

  const matchedDonors = lastSubmittedGroup
    ? donors.filter((d) => d.bloodGroup === lastSubmittedGroup && d.available)
    : [];

  const currentRequest = bloodRequests.find((r) => r.id === lastRequestId);
  const isRequestAssigned = currentRequest?.assignedDonor;

  const handleAcceptDonor = (donorId: string, donorName: string) => {
    if (!lastRequestId) return;
    assignDonorToRequest(lastRequestId, donorId);
    toast.success(`${donorName} has been assigned to this request.`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-xl font-bold">Request Blood</h1>

      {/* Request Form */}
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
          <Label htmlFor="location">Full Address</Label>
          <Input
            id="location"
            placeholder="Hospital name, Street, Area, City, Pin Code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Enter complete address including hospital, street, area, city, and pin code</p>
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

      {/* Matched Donors Section */}
      {lastSubmittedGroup && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">
            Matching Donors — {lastSubmittedGroup}
          </h2>
          {isRequestAssigned ? (
            <div className="flex items-center gap-2 mt-3 p-3 bg-accent rounded-lg border border-border">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">Donor Assigned: {currentRequest?.assignedDonor}</span>
            </div>
          ) : matchedDonors.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">No available donors found for {lastSubmittedGroup}.</p>
          ) : (
            <div className="space-y-2 mt-3">
              {matchedDonors.map((donor) => (
                <div key={donor.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    <p className="text-sm text-muted-foreground">{donor.bloodGroup} · {donor.city}</p>
                  </div>
                  <Button size="sm" onClick={() => handleAcceptDonor(donor.id, donor.name)}>
                    <UserCheck className="h-4 w-4 mr-1" /> Accept
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  <TableHead>Status</TableHead>
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
                    <TableCell className="max-w-[200px] truncate">{req.location}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        req.urgency === "Critical" ? "bg-destructive/10 text-destructive" :
                        req.urgency === "High" ? "bg-destructive/5 text-destructive" :
                        req.urgency === "Medium" ? "bg-accent text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {req.urgency}
                      </span>
                    </TableCell>
                    <TableCell>
                      {req.assignedDonor ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" /> {req.assignedDonor}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
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
