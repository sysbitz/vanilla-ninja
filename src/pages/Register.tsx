import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      await authService.signUp(email, password, displayName.trim() || email.split("@")[0]);
      toast({
        title: "Check your inbox",
        description: "Click the confirmation link, then come back and log in.",
      });
      nav("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-up failed";
      toast({ title: "Sign-up failed", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet><title>Create account — Vanilla Ninja</title></Helmet>
      <main className="min-h-screen grid place-items-center p-6 bg-background">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <Link to="/" className="inline-block text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">Vanilla Ninja</Link>
            <h1 className="text-xl font-semibold mt-3">Unlock your superpower</h1>
            <p className="text-sm text-muted-foreground">We'll save your stars, XP and level forever.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            <Button type="submit" disabled={busy} className="w-full">{busy ? "Creating…" : "Create account"}</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Already have one? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </Card>
      </main>
    </>
  );
}
