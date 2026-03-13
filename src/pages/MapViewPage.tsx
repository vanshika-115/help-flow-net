import { MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function MapViewPage() {
  const { donors } = useApp();

  // Simulated positions for demo - in production, use Google Maps API
  const positions = donors.map((d, i) => ({
    ...d,
    top: 15 + ((i * 37 + 13) % 70),
    left: 10 + ((i * 43 + 17) % 75),
  }));

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold">Donor Map</h1>
        <p className="text-muted-foreground text-sm">Visual overview of donor locations</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {/* Map placeholder */}
        <div className="relative w-full h-[500px] sm:h-[600px] bg-muted/50">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Info banner */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground">Map View</strong> — Connect Google Maps API for live locations. Currently showing simulated positions.
              </span>
            </div>
          </div>

          {/* Donor pins */}
          {positions.map((d) => (
            <div
              key={d.id}
              className="absolute group cursor-pointer"
              style={{ top: `${d.top}%`, left: `${d.left}%` }}
            >
              <div className={`relative flex items-center justify-center ${d.available ? "" : "opacity-40"}`}>
                <div className={`absolute w-8 h-8 rounded-full ${d.available ? "bg-primary/20 animate-ping" : ""}`} />
                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  d.available
                    ? "bg-primary border-primary-foreground/30"
                    : "bg-muted border-border"
                }`}>
                  <span className={`text-xs font-bold ${d.available ? "text-primary-foreground" : "text-muted-foreground"}`}>
                    {d.bloodGroup}
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-card rounded-lg border border-border shadow-elevated p-3 whitespace-nowrap">
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-muted-foreground text-xs">{d.city} • {d.bloodGroup}</p>
                  <p className={`text-xs mt-1 font-medium ${d.available ? "text-success" : "text-muted-foreground"}`}>
                    {d.available ? "● Available" : "○ Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">Legend</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Available
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                Unavailable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
