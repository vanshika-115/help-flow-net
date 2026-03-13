import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"donor" | "recipient">("donor");
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isSignup && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setUser({ email, name: name || email.split("@")[0], role });
    toast.success(isSignup ? "Account created!" : "Welcome back!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
              <Heart className="h-10 w-10 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold text-primary-foreground mb-4">
            Blood Bridge
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Connecting blood donors and recipients during emergencies. Every drop counts, every second matters.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-heading text-2xl font-bold">
              Blood<span className="text-primary">Bridge</span>
            </span>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignup ? "Join the life-saving network" : "Sign in to continue"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["donor", "recipient"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                        role === r
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {r === "donor" ? "🩸 Donate Blood" : "🏥 Request Blood"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
