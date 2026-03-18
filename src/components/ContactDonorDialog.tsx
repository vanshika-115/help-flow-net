import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import type { Donor } from "@/context/AppContext";

interface ContactDonorDialogProps {
  donor: Donor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactDonorDialog({ donor, open, onOpenChange }: ContactDonorDialogProps) {
  const isMobile = useIsMobile();

  if (!donor) return null;

  const handleCall = () => {
    const tel = donor.phone.replace(/\s/g, "");
    window.open(`tel:${tel}`, "_self");
    toast.success(`Calling ${donor.name}...`);
  };

  const handleMessage = () => {
    const tel = donor.phone.replace(/\s/g, "");
    window.open(`sms:${tel}`, "_self");
    toast.success(`Opening message for ${donor.name}`);
  };

  if (showMap) {
    return (
      <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setShowMap(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-primary" /> Live Tracking — {donor.name}
            </DialogTitle>
            <DialogDescription>Showing donor and your location with route</DialogDescription>
          </DialogHeader>
          <LiveTrackingMap donorName={donor.name} donorCity={donor.city} />
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: directly open dialer
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Contact {donor.name}</DialogTitle>
            <DialogDescription>{donor.bloodGroup} · {donor.city}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Button className="w-full" onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" /> Call {donor.phone}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleMessage}>
              <MessageSquare className="h-4 w-4 mr-2" /> Send Message
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setShowMap(true)}>
              <MapPin className="h-4 w-4 mr-2" /> View Live Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop: show options
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Contact {donor.name}</DialogTitle>
          <DialogDescription>{donor.bloodGroup} · {donor.city} · {donor.phone}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button onClick={handleCall}>
            <Phone className="h-4 w-4 mr-2" /> Call
          </Button>
          <Button variant="outline" onClick={handleMessage}>
            <MessageSquare className="h-4 w-4 mr-2" /> Message
          </Button>
        </div>
        <Button variant="secondary" className="w-full" onClick={() => setShowMap(true)}>
          <MapPin className="h-4 w-4 mr-2" /> View Live Location
        </Button>
      </DialogContent>
    </Dialog>
  );
}
