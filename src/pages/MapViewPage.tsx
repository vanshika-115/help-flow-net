import { MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function MapViewPage() {
  const { donors } = useApp();

  const positions = donors.map((d, i) => ({
    ...d,
    top: 15 + ((i * 37 + 13) % 65),
    left: 10 + ((i * 43 + 17) % 75),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Map View</h1>

      <div className="relative w-full h-[450px] bg-card border border-border rounded-lg overflow-hidden">
        {/* Grid to simulate map background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-3 left-3 bg-card border border-border rounded px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Map layout placeholder — connect Google Maps API here
        </div>

        {positions.map((d) => (
          <div
            key={d.id}
            className="absolute group cursor-pointer"
            style={{ top: `${d.top}%`, left: `${d.left}%` }}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              d.available
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {d.bloodGroup}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap">
              {d.name} · {d.city}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
