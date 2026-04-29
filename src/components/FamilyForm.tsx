import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FamilyInput, FamilyRecord } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: FamilyRecord | null;
}

const empty: FamilyInput = {
  date_of_visit: new Date().toISOString().slice(0, 10),
  karyakar_name: "",
  family_number: "",
  child_name: "",
  father_name: "",
  mother_name: "",
  surname: "",
  standard: "",
  date_of_birth: "",
  school_name: "",
  home_address: "",
  father_mobile: "",
  mother_mobile: "",
  category: "Satsangi",
};

export function FamilyForm({ open, onOpenChange, editing }: Props) {
  const [form, setForm] = useState<FamilyInput>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const { id, created_at, updated_at, ...rest } = editing;
      setForm({
        ...rest,
        father_name: rest.father_name ?? "",
        mother_name: rest.mother_name ?? "",
        surname: rest.surname ?? "",
        standard: rest.standard ?? "",
        date_of_birth: rest.date_of_birth ?? "",
        school_name: rest.school_name ?? "",
        home_address: rest.home_address ?? "",
        father_mobile: rest.father_mobile ?? "",
        mother_mobile: rest.mother_mobile ?? "",
      });
    } else {
      setForm({ ...empty, date_of_visit: new Date().toISOString().slice(0, 10) });
    }
  }, [editing, open]);

  const set = <K extends keyof FamilyInput>(k: K, v: FamilyInput[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.karyakar_name || !form.family_number || !form.child_name || !form.date_of_visit) {
      toast.error("Please fill required fields");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      date_of_birth: form.date_of_birth || null,
      father_name: form.father_name || null,
      mother_name: form.mother_name || null,
      surname: form.surname || null,
      standard: form.standard || null,
      school_name: form.school_name || null,
      home_address: form.home_address || null,
      father_mobile: form.father_mobile || null,
      mother_mobile: form.mother_mobile || null,
    };
    const { error } = editing
      ? await supabase.from("families").update(payload).eq("id", editing.id)
      : await supabase.from("families").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Record updated" : "Record added");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Record" : "New Family Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Date of Visit *">
            <Input type="date" value={form.date_of_visit} onChange={(e) => set("date_of_visit", e.target.value)} required />
          </Field>
          <Field label="Karyakar Name *">
            <Input value={form.karyakar_name} onChange={(e) => set("karyakar_name", e.target.value)} required />
          </Field>
          <Field label="Family Number *">
            <Input value={form.family_number} onChange={(e) => set("family_number", e.target.value)} required />
          </Field>
          <Field label="Child Name *">
            <Input value={form.child_name} onChange={(e) => set("child_name", e.target.value)} required />
          </Field>
          <Field label="Father Name">
            <Input value={form.father_name ?? ""} onChange={(e) => set("father_name", e.target.value)} />
          </Field>
          <Field label="Mother Name">
            <Input value={form.mother_name ?? ""} onChange={(e) => set("mother_name", e.target.value)} />
          </Field>
          <Field label="Surname">
            <Input value={form.surname ?? ""} onChange={(e) => set("surname", e.target.value)} />
          </Field>
          <Field label="Standard">
            <Input value={form.standard ?? ""} onChange={(e) => set("standard", e.target.value)} />
          </Field>
          <Field label="Date of Birth">
            <Input type="date" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} />
          </Field>
          <Field label="School Name">
            <Input value={form.school_name ?? ""} onChange={(e) => set("school_name", e.target.value)} />
          </Field>
          <Field label="Father Mobile">
            <Input inputMode="tel" value={form.father_mobile ?? ""} onChange={(e) => set("father_mobile", e.target.value)} />
          </Field>
          <Field label="Mother Mobile">
            <Input inputMode="tel" value={form.mother_mobile ?? ""} onChange={(e) => set("mother_mobile", e.target.value)} />
          </Field>
          <Field label="Category" className="sm:col-span-1">
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Satsangi">Satsangi</SelectItem>
                <SelectItem value="Non-Satsangi">Non-Satsangi</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Home Address" className="sm:col-span-2">
            <Textarea rows={2} value={form.home_address ?? ""} onChange={(e) => set("home_address", e.target.value)} />
          </Field>

          <DialogFooter className="sm:col-span-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Save Record"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
