import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PIN = "karyakar";

interface Props {
  onAdded?: () => void;
}

export function AddKaryakarDialog({ onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"pin" | "name">("pin");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setStep("pin");
    setPin("");
    setName("");
    setBusy(false);
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) reset();
  };

  const verifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().toLowerCase() !== PIN) {
      toast.error("Wrong pin");
      setPin("");
      return;
    }
    setStep("name");
  };

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Enter a name");
    if (trimmed.length > 80) return toast.error("Name too long");
    setBusy(true);
    const { error } = await supabase.from("karyakars").insert({ name: trimmed });
    setBusy(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "This Karyakar already exists" : error.message
      );
      return;
    }
    toast.success(`Added ${trimmed}`);
    onAdded?.();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Add Karyakar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Karyakar</DialogTitle>
          <DialogDescription>
            {step === "pin"
              ? "Enter the Karyakar pin to continue."
              : "Enter the new Karyakar's name."}
          </DialogDescription>
        </DialogHeader>

        {step === "pin" ? (
          <form onSubmit={verifyPin} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pin</Label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                placeholder="Enter pin"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!pin}>Continue</Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={saveName} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Karyakar Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder="Full name"
                maxLength={80}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={busy || !name.trim()}>
                {busy ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
