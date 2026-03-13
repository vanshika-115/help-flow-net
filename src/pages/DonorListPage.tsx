import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function DonorListPage() {
  const { donors } = useApp();
  const available = donors.filter((d) => d.available);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Available Donors</h1>

      <div className="space-y-3">
        {available.map((donor) => (
          <div key={donor.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
            <div>
              <p className="font-semibold">{donor.name}</p>
              <p className="text-sm text-muted-foreground">{donor.bloodGroup} · {donor.city}</p>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success(`Contacting ${donor.name} at ${donor.phone}`)}
            >
              Contact
            </Button>
          </div>
        ))}

        {available.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No available donors found</p>
        )}
      </div>
    </div>
  );
}
