import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await authService.signIn(email, password);
      toast({ title: "Welcome back!" });
      nav("/learn/var-vs-let");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      toast({ title: "Sign-in failed", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Helmet><title>Log in — Vanilla Ninja</title></Helmet>
      <main className="min-h-screen grid place-items-center p-6 bg-background">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <Link to="/" className="inline-block text-2xl font-black bg-gradient-primary bg-clip-text text-transparent">Vanilla Ninja</Link>
            <h1 className="text-xl font-semibold mt-3">Log in to track your progress</h1>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Log in"}</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </p>
        </Card>
      </main>
    </>
  );
}
