import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FamilyInput, FamilyRecord } from "@/lib/types";

interface Props {
  editing?: FamilyRecord | null;
  onSaved: () => void;
  onCancel: () => void;
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

export function FamilyForm({ editing, onSaved, onCancel }: Props) {
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
  }, [editing]);

  const set = <K extends keyof FamilyInput>(k: K, v: FamilyInput[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: Array<[keyof typeof form, string]> = [
      ["date_of_visit", "Date of Visit"],
      ["karyakar_name", "Karyakar Name"],
      ["family_number", "Family Number"],
      ["child_name", "Child Name"],
      ["father_name", "Father Name"],
      ["mother_name", "Mother Name"],
      ["surname", "Surname"],
      ["standard", "Standard"],
      ["date_of_birth", "Date of Birth"],
      ["school_name", "School Name"],
      ["home_address", "Home Address"],
      ["father_mobile", "Father Mobile"],
      ["mother_mobile", "Mother Mobile"],
      ["category", "Category"],
    ];
    for (const [k, label] of required) {
      if (!String(form[k] ?? "").trim()) {
        toast.error(`${label} is required`);
        return;
      }
    }
    const isTenDigits = (v: string) => /^\d{10}$/.test(v.trim());
    if (!isTenDigits(form.father_mobile ?? "")) {
      toast.error("Father Mobile must be exactly 10 digits");
      return;
    }
    if (!isTenDigits(form.mother_mobile ?? "")) {
      toast.error("Mother Mobile must be exactly 10 digits");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    const { error } = editing
      ? await supabase.from("families").update(payload).eq("id", editing.id)
      : await supabase.from("families").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Record updated" : "Record added");
    onSaved();
  };

  return (
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
      <Field label="Father Name *">
        <Input value={form.father_name ?? ""} onChange={(e) => set("father_name", e.target.value)} required />
      </Field>
      <Field label="Mother Name *">
        <Input value={form.mother_name ?? ""} onChange={(e) => set("mother_name", e.target.value)} required />
      </Field>
      <Field label="Surname *">
        <Input value={form.surname ?? ""} onChange={(e) => set("surname", e.target.value)} required />
      </Field>
      <Field label="Standard *">
        <Input value={form.standard ?? ""} onChange={(e) => set("standard", e.target.value)} required />
      </Field>
      <Field label="Date of Birth *">
        <Input type="date" value={form.date_of_birth ?? ""} onChange={(e) => set("date_of_birth", e.target.value)} required />
      </Field>
      <Field label="School Name *">
        <Input value={form.school_name ?? ""} onChange={(e) => set("school_name", e.target.value)} required />
      </Field>
      <Field label="Father Mobile * (10 digits)">
        <Input
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          value={form.father_mobile ?? ""}
          onChange={(e) => set("father_mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
      </Field>
      <Field label="Mother Mobile * (10 digits)">
        <Input
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          value={form.mother_mobile ?? ""}
          onChange={(e) => set("mother_mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
      </Field>
      <Field label="Category *">
        <Select value={form.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Satsangi">Satsangi</SelectItem>
            <SelectItem value="Gunbhavi">Gunbhavi</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Home Address *" className="sm:col-span-2">
        <Textarea rows={2} value={form.home_address ?? ""} onChange={(e) => set("home_address", e.target.value)} required />
      </Field>

      <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Save Record"}</Button>
      </div>
    </form>
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
