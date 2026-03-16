import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { CheckCircle, UserCheck, MapPin, Search, Hospital } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["Normal", "Urgent", "Critical"];

const urgencyOrder: Record<string, number> = { Critical: 0, Urgent: 1, Normal: 2 };

// Simulated distance based on city match
function simulateDistance(donorCity: string, addressParts: string[]): number {
  const cityMatch = addressParts.some(
    (part) => donorCity.toLowerCase().includes(part) || part.includes(donorCity.toLowerCase())
  );
  if (cityMatch) return Math.floor(Math.random() * 8) + 1; // 1–8 km
  return Math.floor(Math.random() * 40) + 15; // 15–55 km
}

const nearbyBloodBanks = [
  { name: "Red Cross Blood Bank", address: "MG Road, Central Area", phone: "+91 11 2345 6789" },
  { name: "Central Blood Bank", address: "Station Road, Near Railway Station", phone: "+91 11 9876 5432" },
  { name: "City Hospital Blood Bank", address: "Civil Lines, Main Street", phone: "+91 11 5678 1234" },
];

export default function BloodRequestPage() {
  const { user, donors, bloodRequests, addBloodRequest, assignDonorToRequest, expandedSearch, setExpandedSearch } = useApp();
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [lastSubmittedGroup, setLastSubmittedGroup] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);
  const [lastSubmittedLocation, setLastSubmittedLocation] = useState("");

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
    setLastSubmittedLocation(location.trim());
    setLastRequestId(id);
    setExpandedSearch(false);
    toast.success("Request Sent Successfully");
    setBloodGroup("");
    setLocation("");
    setUrgency("");
  };

  const extractCity = (address: string) =>
    address.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

  const addressParts = extractCity(lastSubmittedLocation);

  const matchedDonors = lastSubmittedGroup
    ? donors
        .filter((d) => {
          if (d.bloodGroup !== lastSubmittedGroup || !d.available) return false;
          if (!lastSubmittedLocation) return true;
          return addressParts.some(
            (part) => d.city.toLowerCase().includes(part) || part.includes(d.city.toLowerCase())
          );
        })
        .map((d) => ({ ...d, distance: simulateDistance(d.city, addressParts) }))
        .sort((a, b) => a.distance - b.distance)
    : [];

  const allGroupDonors = lastSubmittedGroup
    ? donors
        .filter((d) => d.bloodGroup === lastSubmittedGroup && d.available)
        .map((d) => ({ ...d, distance: simulateDistance(d.city, addressParts) }))
        .sort((a, b) => a.distance - b.distance)
    : [];

  const displayDonors = expandedSearch ? allGroupDonors : matchedDonors;
  const noLocalDonors = matchedDonors.length === 0 && lastSubmittedGroup;

  const currentRequest = bloodRequests.find((r) => r.id === lastRequestId);
  const isRequestAssigned = currentRequest?.assignedDonor;

  const handleAcceptDonor = (donorId: string, donorName: string) => {
    if (!lastRequestId) return;
    assignDonorToRequest(lastRequestId, donorId);
    toast.success(`Donor Accepted Request — ${donorName} assigned`);
  };

  // Sort requests: Critical first
  const sortedRequests = [...bloodRequests].sort(
    (a, b) => (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3)
  );

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
          <Label>Priority Level</Label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
            <SelectContent>
              {urgencyLevels.map((u) => (
                <SelectItem key={u} value={u}>
                  {u === "Critical" ? "🔴 Critical" : u === "Urgent" ? "🟡 Urgent" : "🟢 Normal"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">Submit Request</Button>
      </form>

      {/* Matched Donors Section */}
      {lastSubmittedGroup && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Matching Donors — {lastSubmittedGroup}
          </h2>

          {isRequestAssigned ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Donor Assigned: {currentRequest?.assignedDonor}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {noLocalDonors && !expandedSearch && (
                <Alert variant="destructive">
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    No Nearby Donors Found. Try expanding search area.
                  </AlertDescription>
                </Alert>
              )}

              {displayDonors.length > 0 ? (
                <div className="space-y-2">
                  {expandedSearch && (
                    <p className="text-xs text-muted-foreground">Showing donors from all cities for {lastSubmittedGroup}:</p>
                  )}
                  {displayDonors.map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {donor.bloodGroup} · {donor.city}
                          <span className="ml-2 text-xs">~{donor.distance} km away</span>
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleAcceptDonor(donor.id, donor.name)}>
                        <UserCheck className="h-4 w-4 mr-1" /> Accept
                      </Button>
                    </div>
                  ))}
                </div>
              ) : expandedSearch ? (
                <p className="text-sm text-muted-foreground">No available donors found for {lastSubmittedGroup}.</p>
              ) : null}

              {/* Expand Search Button */}
              {noLocalDonors && !expandedSearch && allGroupDonors.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setExpandedSearch(true);
                    toast.info("Searching in nearby cities...");
                  }}
                >
                  <Search className="h-4 w-4 mr-2" /> Search in Nearby Cities
                </Button>
              )}

              {/* Blood Bank Backup */}
              {noLocalDonors && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Hospital className="h-4 w-4 text-primary" /> Nearby Blood Banks
                  </h3>
                  <p className="text-xs text-muted-foreground">While waiting for donors, you can contact these blood banks:</p>
                  {nearbyBloodBanks.map((bb, i) => (
                    <div key={i} className="border border-border rounded p-2 text-sm">
                      <p className="font-medium">{bb.name}</p>
                      <p className="text-xs text-muted-foreground">{bb.address} · {bb.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Request List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Request List</h2>
        {sortedRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRequests.map((req) => (
                  <TableRow key={req.id} className={req.urgency === "Critical" ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">{req.recipientName}</TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">{req.bloodGroup}</span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{req.location}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        req.urgency === "Critical" ? "bg-destructive/10 text-destructive" :
                        req.urgency === "Urgent" ? "bg-accent text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {req.urgency === "Critical" ? "🔴" : req.urgency === "Urgent" ? "🟡" : "🟢"} {req.urgency}
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
