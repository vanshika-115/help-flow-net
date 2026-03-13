import { useState } from "react";
import { Phone, MapPin, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorListPage() {
  const { donors, toggleDonorAvailability } = useApp();
  const [search, setSearch] = useState("");
  const [filterBG, setFilterBG] = useState("All");

  const filtered = donors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
    const matchBG = filterBG === "All" || d.bloodGroup === filterBG;
    return matchSearch && matchBG;
  });

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold">Available Donors</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} donors found</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or city" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterBG} onValueChange={setFilterBG}>
            <SelectTrigger className="w-28">
              <Filter className="h-4 w-4 text-muted-foreground mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((donor) => (
          <div key={donor.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{donor.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {donor.city}
                </div>
              </div>
              <span className="emergency-badge bg-accent text-accent-foreground text-lg font-bold">
                {donor.bloodGroup}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Age: {donor.age}</span>
              <div className="flex items-center gap-2">
                <span className={donor.available ? "text-success" : "text-muted-foreground"}>
                  {donor.available ? "Available" : "Unavailable"}
                </span>
                <Switch
                  checked={donor.available}
                  onCheckedChange={() => toggleDonorAvailability(donor.id)}
                  className="scale-75"
                />
              </div>
            </div>

            <Button
              className="w-full"
              variant={donor.available ? "default" : "secondary"}
              disabled={!donor.available}
              onClick={() => {
                toast.success(`Contacting ${donor.name} at ${donor.phone}`);
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              {donor.available ? "Contact Donor" : "Not Available"}
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No donors found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
