import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Heart, LogOut } from "lucide-react";

const navItems = [
  { path: "/donors", label: "Donor List" },
  { path: "/register", label: "Register Donor" },
  { path: "/request", label: "Request Blood" },
  { path: "/map", label: "Map View" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, setUser } = useApp();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link to="/donors" className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" fill="currentColor" />
          <span className="font-bold text-lg">Blood<span className="text-primary">Bridge</span></span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={() => setUser(null)}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>

      {/* Mobile nav */}
      <div className="flex sm:hidden gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
              pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
