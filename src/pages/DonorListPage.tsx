import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Clock, History } from "lucide-react";
import ContactDonorDialog from "@/components/ContactDonorDialog";
import type { Donor } from "@/context/AppContext";

export default function DonorListPage() {
  const { donors } = useApp();
  const available = donors.filter((d) => d.available);
  const unavailable = donors.filter((d) => !d.available);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const formatCooldown = (cooldownUntil?: string) => {
    if (!cooldownUntil) return "Unavailable";
    const diff = new Date(cooldownUntil).getTime() - Date.now();
    if (diff <= 0) return "Cooldown ended";
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `Available in ${days} days`;
  };

  const handleContact = (donor: Donor) => {
    setSelectedDonor(donor);
    setContactOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-xl font-bold">Donor Directory</h1>

      {/* Available Donors */}
      <div>
        <h2 className="text-base font-semibold mb-3">Available Donors ({available.length})</h2>
        <div className="space-y-3">
          {available.map((donor) => (
            <div key={donor.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
              <div>
                <p className="font-semibold">{donor.name}</p>
                <p className="text-sm text-muted-foreground">{donor.bloodGroup} · {donor.city}</p>
                {donor.totalDonations > 0 && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <History className="h-3 w-3" />
                    {donor.totalDonations} donation{donor.totalDonations !== 1 ? "s" : ""}
                    {donor.lastDonationDate && ` · Last: ${donor.lastDonationDate}`}
                  </p>
                )}
              </div>
              <Button size="sm" onClick={() => handleContact(donor)}>
                Contact
              </Button>
            </div>
          ))}
          {available.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No available donors</p>
          )}
        </div>
      </div>

      {/* Unavailable / Cooldown Donors */}
      {unavailable.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3">Temporarily Unavailable ({unavailable.length})</h2>
          <div className="space-y-3">
            {unavailable.map((donor) => (
              <div key={donor.id} className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4 opacity-75">
                <div>
                  <p className="font-semibold">{donor.name}</p>
                  <p className="text-sm text-muted-foreground">{donor.bloodGroup} · {donor.city}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {formatCooldown(donor.cooldownUntil)}
                    {donor.totalDonations > 0 && ` · ${donor.totalDonations} total donations`}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground">
                  Temporarily Unavailable
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ContactDonorDialog donor={selectedDonor} open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
