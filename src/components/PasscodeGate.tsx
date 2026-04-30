import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LogOut } from "lucide-react";
import { toast } from "sonner";

const KEY = "m600_unlocked_v1";

export function isUnlocked() {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
}
export function lock() {
  try { sessionStorage.removeItem(KEY); } catch {}
  window.location.reload();
}

export function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlocked());
    setChecking(false);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("verify-passcode", {
      body: { passcode: pass },
    });
    setBusy(false);
    if (error || !data?.ok) {
      toast.error(data?.error ?? error?.message ?? "Wrong passcode");
      setPass("");
      return;
    }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    setUnlocked(true);
  };

  if (checking) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <form onSubmit={submit} className="w-full max-w-sm bg-card border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-semibold">MISSION - 600</h1>
            <p className="text-xs text-muted-foreground">Enter the Karyakar passcode to continue</p>
          </div>
          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Passcode"
            autoFocus
            inputMode="text"
            maxLength={200}
          />
          <Button type="submit" className="w-full" disabled={busy || !pass}>
            {busy ? "Checking..." : "Unlock"}
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export function LockButton() {
  return (
    <Button size="icon" variant="ghost" className="h-9 w-9" title="Lock" onClick={lock}>
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
