import { useState, useEffect } from "react";
import { MapPin, Navigation, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  donorName: string;
  donorCity: string;
}

// Simulated positions (percentage-based)
function randomPos(base: number) {
  return base + (Math.random() * 6 - 3);
}

export default function LiveTrackingMap({ donorName, donorCity }: Props) {
  const [donorPos, setDonorPos] = useState({ top: 35, left: 60 });
  const [recipientPos] = useState({ top: 65, left: 35 });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [status, setStatus] = useState("Donor on the way");

  const distance = Math.round(
    Math.sqrt(Math.pow(donorPos.top - recipientPos.top, 2) + Math.pow(donorPos.left - recipientPos.left, 2)) * 0.15
  );

  // Simulate live location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDonorPos((prev) => ({
        top: Math.max(20, Math.min(80, randomPos(prev.top + (recipientPos.top > prev.top ? 1.5 : -1.5)))),
        left: Math.max(10, Math.min(85, randomPos(prev.left + (recipientPos.left > prev.left ? 1.5 : -1.5)))),
      }));
      setLastUpdate(new Date());
      setStatus((prev) =>
        prev === "Donor on the way" ? "Location updated" : "Donor on the way"
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [recipientPos]);

  // SVG line coordinates
  const mapW = 100;
  const mapH = 100;

  return (
    <div className="space-y-3">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="flex items-center gap-1.5 text-primary border-primary/30">
          <RefreshCw className="h-3 w-3 animate-spin" />
          {status}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Updated: {lastUpdate.toLocaleTimeString()}
        </span>
      </div>

      {/* Map container */}
      <div className="relative w-full h-[350px] bg-card border border-border rounded-lg overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
          }}
        />

        {/* Roads */}
        <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-border opacity-40" />
        <div className="absolute top-0 bottom-0 left-[50%] w-[2px] bg-border opacity-40" />

        {/* Route line (SVG overlay) */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapW} ${mapH}`} preserveAspectRatio="none">
          <line
            x1={donorPos.left}
            y1={donorPos.top}
            x2={recipientPos.left}
            y2={recipientPos.top}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            opacity="0.6"
          />
          {/* Direction arrow midpoint */}
          <circle
            cx={(donorPos.left + recipientPos.left) / 2}
            cy={(donorPos.top + recipientPos.top) / 2}
            r="1.5"
            fill="hsl(var(--primary))"
            opacity="0.5"
          />
        </svg>

        {/* Donor marker (red) */}
        <div
          className="absolute z-10 transition-all duration-[2500ms] ease-in-out"
          style={{ top: `${donorPos.top}%`, left: `${donorPos.left}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md border-2 border-primary-foreground">
              <Navigation className="h-4 w-4" />
            </div>
            <span className="mt-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
              {donorName}
            </span>
          </div>
        </div>

        {/* Recipient marker (blue-ish using accent) */}
        <div
          className="absolute z-10"
          style={{ top: `${recipientPos.top}%`, left: `${recipientPos.left}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-md border-2 border-background">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="mt-1 text-[10px] font-medium bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap">
              You (Recipient)
            </span>
          </div>
        </div>

        {/* Distance label at midpoint */}
        <div
          className="absolute z-10"
          style={{
            top: `${(donorPos.top + recipientPos.top) / 2}%`,
            left: `${(donorPos.left + recipientPos.left) / 2}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="bg-card border border-border rounded px-2 py-1 text-xs font-medium shadow-sm">
            ~{distance} km
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-primary" /> Donor Location
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-foreground" /> Your Location
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-6 border-t-2 border-dashed border-primary" /> Route
        </span>
      </div>
    </div>
  );
}
