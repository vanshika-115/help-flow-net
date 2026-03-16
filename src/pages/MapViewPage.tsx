import { MapPin, Hospital, Building2, Droplets } from "lucide-react";
import { useApp } from "@/context/AppContext";

const hospitals = [
  { name: "City General Hospital", top: 20, left: 25 },
  { name: "Apollo Hospital", top: 55, left: 60 },
  { name: "Fortis Medical Centre", top: 70, left: 30 },
];

const bloodBanks = [
  { name: "Red Cross Blood Bank", top: 35, left: 45 },
  { name: "Central Blood Bank", top: 60, left: 15 },
];

const places = [
  { name: "Railway Station", top: 45, left: 75 },
  { name: "Bus Terminal", top: 80, left: 55 },
];

export default function MapViewPage() {
  const { donors } = useApp();

  const donorPositions = donors.map((d, i) => ({
    ...d,
    top: 12 + ((i * 37 + 13) % 65),
    left: 8 + ((i * 43 + 17) % 75),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Map View</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-primary" /> Available Donor
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-muted-foreground" /> Unavailable Donor
        </span>
        <span className="flex items-center gap-1.5">
          <Hospital className="h-3.5 w-3.5 text-primary" /> Hospital
        </span>
        <span className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-destructive" /> Blood Bank
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Landmark
        </span>
      </div>

      <div className="relative w-full h-[500px] bg-card border border-border rounded-lg overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Roads simulation */}
        <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-border opacity-40" />
        <div className="absolute top-0 bottom-0 left-[50%] w-[2px] bg-border opacity-40" />
        <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-border opacity-20" />
        <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-border opacity-20" />
        <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-border opacity-20" />
        <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-border opacity-20" />

        <div className="absolute top-3 left-3 bg-card border border-border rounded px-3 py-2 text-sm text-muted-foreground flex items-center gap-2 z-10">
          <MapPin className="h-4 w-4 text-primary" />
          Map Layout — UI Placeholder
        </div>

        {/* Hospitals */}
        {hospitals.map((h, i) => (
          <div key={`h-${i}`} className="absolute group cursor-pointer" style={{ top: `${h.top}%`, left: `${h.left}%` }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <Hospital className="h-4 w-4 text-primary" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-20">
              🏥 {h.name}
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
              Hospital
            </span>
          </div>
        ))}

        {/* Blood Banks */}
        {bloodBanks.map((b, i) => (
          <div key={`b-${i}`} className="absolute group cursor-pointer" style={{ top: `${b.top}%`, left: `${b.left}%` }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15 border border-destructive/30">
              <Droplets className="h-4 w-4 text-destructive" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-20">
              🩸 {b.name}
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
              Blood Bank
            </span>
          </div>
        ))}

        {/* Landmarks */}
        {places.map((p, i) => (
          <div key={`p-${i}`} className="absolute group cursor-pointer" style={{ top: `${p.top}%`, left: `${p.left}%` }}>
            <div className="flex h-7 w-7 items-center justify-center rounded bg-muted border border-border">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-20">
              📍 {p.name}
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
              {p.name}
            </span>
          </div>
        ))}

        {/* Donor Markers */}
        {donorPositions.map((d) => (
          <div key={d.id} className="absolute group cursor-pointer" style={{ top: `${d.top}%`, left: `${d.left}%` }}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 ${
                d.available
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {d.bloodGroup}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-20">
              {d.name} · {d.city} {d.available ? "✅" : "❌"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
