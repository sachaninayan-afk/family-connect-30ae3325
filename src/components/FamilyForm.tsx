import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import {
  
  CATEGORIES,
  type FamilyVisit,
  type FamilyVisitInput,
} from "@/lib/types";
import { useKaryakars } from "@/hooks/useKaryakars";

interface Props {
  editing?: FamilyVisit | null;
  onSaved: () => void;
  onCancel: () => void;
}

const empty: FamilyVisitInput = {
  karyakar_names: [],
  date_of_visit: VISIT_DATES[0],
  surname: "",
  family_head_name: "",
  total_males: 0,
  total_females: 0,
  total_kids: 0,
  kid1_name: "",
  kid1_std: "",
  kids_mother_mobile: "",
  kid2_name: "",
  kid2_std: "",
  kid3_name: "",
  kid3_std: "",
  family_head_mobile: "",
  category: "Satsangi",
  home_address: "",
};

const formatDate = (d: string) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString(undefined, { day: "numeric", month: "long" });
};

const isTenDigits = (v: string) => /^\d{10}$/.test(v.trim());

export function FamilyForm({ editing, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FamilyVisitInput>(empty);
  const karyakarList = useKaryakars();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const { id, created_at, updated_at, ...rest } = editing;
      setForm({
        ...empty,
        ...rest,
        karyakar_names: rest.karyakar_names ?? [],
        kid1_name: rest.kid1_name ?? "",
        kid1_std: rest.kid1_std ?? "",
        kids_mother_mobile: rest.kids_mother_mobile ?? "",
        kid2_name: rest.kid2_name ?? "",
        kid2_std: rest.kid2_std ?? "",
        kid3_name: rest.kid3_name ?? "",
        kid3_std: rest.kid3_std ?? "",
        home_address: rest.home_address ?? "",
      });
    } else {
      setForm({ ...empty });
    }
  }, [editing]);

  const set = <K extends keyof FamilyVisitInput>(k: K, v: FamilyVisitInput[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleKaryakar = (name: string) => {
    setForm((p) => {
      const has = p.karyakar_names.includes(name);
      return {
        ...p,
        karyakar_names: has
          ? p.karyakar_names.filter((n) => n !== name)
          : [...p.karyakar_names, name],
      };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.karyakar_names.length === 0) return toast.error("Select at least one Karyakar");
    if (!form.date_of_visit) return toast.error("Date of Visit is required");
    if (!form.surname.trim()) return toast.error("Surname is required");
    if (!form.family_head_name.trim()) return toast.error("Name of Family Head is required");
    if (form.total_males < 0 || form.total_females < 0 || form.total_kids < 0)
      return toast.error("Counts cannot be negative");
    if (!isTenDigits(form.family_head_mobile))
      return toast.error("Family head mobile must be 10 digits");

    if (form.total_kids >= 1) {
      if (!form.kid1_name?.trim()) return toast.error("Kid 1 name is required");
      if (!form.kid1_std?.trim()) return toast.error("Kid 1 std is required");
      if (!isTenDigits(form.kids_mother_mobile ?? ""))
        return toast.error("Kid's mother mobile must be 10 digits");
    }

    const payload: FamilyVisitInput = {
      ...form,
      kid1_name: form.total_kids >= 1 ? form.kid1_name : null,
      kid1_std: form.total_kids >= 1 ? form.kid1_std : null,
      kids_mother_mobile: form.total_kids >= 1 ? form.kids_mother_mobile : null,
      kid2_name: form.total_kids >= 2 ? form.kid2_name : null,
      kid2_std: form.total_kids >= 2 ? form.kid2_std : null,
      kid3_name: form.total_kids >= 3 ? form.kid3_name : null,
      kid3_std: form.total_kids >= 3 ? form.kid3_std : null,
    };

    setSaving(true);
    const { error } = editing
      ? await supabase.from("family_visits").update(payload).eq("id", editing.id)
      : await supabase.from("family_visits").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Record updated" : "Record added");
    onSaved();
  };

  const karyakarLabel =
    form.karyakar_names.length === 0
      ? "Select Karyakar(s)"
      : form.karyakar_names.length <= 2
      ? form.karyakar_names.join(", ")
      : `${form.karyakar_names.length} selected`;

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="1. Karyakar Name * (select 1 or more)" className="sm:col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            >
              <span className="truncate text-left">{karyakarLabel}</span>
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-72 overflow-auto" align="start">
            <div className="p-2 space-y-1">
              {karyakarList.map((name) => {
                const checked = form.karyakar_names.includes(name);
                return (
                  <label
                    key={name}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-sm"
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleKaryakar(name)} />
                    <span>{name}</span>
                  </label>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </Field>

      <Field label="2. Date of Visit *">
        <Select value={form.date_of_visit} onValueChange={(v) => set("date_of_visit", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {VISIT_DATES.map((d) => (
              <SelectItem key={d} value={d}>{formatDate(d)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="3. Surname *">
        <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} required />
      </Field>

      <Field label="4. Name of Family Head *">
        <Input
          value={form.family_head_name}
          onChange={(e) => set("family_head_name", e.target.value)}
          required
        />
      </Field>

      <Field label="5. Total number of Males *">
        <Input
          type="number"
          min={0}
          value={form.total_males}
          onChange={(e) => set("total_males", Number(e.target.value) || 0)}
          required
        />
      </Field>

      <Field label="6. Total number of Females *">
        <Input
          type="number"
          min={0}
          value={form.total_females}
          onChange={(e) => set("total_females", Number(e.target.value) || 0)}
          required
        />
      </Field>

      <Field label="7. Total number of Kids *">
        <Select
          value={String(form.total_kids)}
          onValueChange={(v) => set("total_kids", Number(v))}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {form.total_kids >= 1 && (
        <>
          <Field label="Kid 1 Name *">
            <Input value={form.kid1_name ?? ""} onChange={(e) => set("kid1_name", e.target.value)} required />
          </Field>
          <Field label="Kid 1 Std *">
            <Input value={form.kid1_std ?? ""} onChange={(e) => set("kid1_std", e.target.value)} required />
          </Field>
          <Field label="Kid's Mother Mobile Number * (10 digits)" className="sm:col-span-2">
            <Input
              inputMode="numeric"
              maxLength={10}
              value={form.kids_mother_mobile ?? ""}
              onChange={(e) =>
                set("kids_mother_mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
            />
          </Field>
        </>
      )}

      {form.total_kids >= 2 && (
        <>
          <Field label="Kid 2 Name">
            <Input value={form.kid2_name ?? ""} onChange={(e) => set("kid2_name", e.target.value)} />
          </Field>
          <Field label="Kid 2 Std">
            <Input value={form.kid2_std ?? ""} onChange={(e) => set("kid2_std", e.target.value)} />
          </Field>
        </>
      )}

      {form.total_kids >= 3 && (
        <>
          <Field label="Kid 3 Name">
            <Input value={form.kid3_name ?? ""} onChange={(e) => set("kid3_name", e.target.value)} />
          </Field>
          <Field label="Kid 3 Std">
            <Input value={form.kid3_std ?? ""} onChange={(e) => set("kid3_std", e.target.value)} />
          </Field>
        </>
      )}

      <Field label="8. Family Head Mobile Number * (10 digits)">
        <Input
          inputMode="numeric"
          maxLength={10}
          value={form.family_head_mobile}
          onChange={(e) =>
            set("family_head_mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          required
        />
      </Field>

      <Field label="9. Category *">
        <Select value={form.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="10. Home Address" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={form.home_address ?? ""}
          onChange={(e) => set("home_address", e.target.value)}
        />
      </Field>

      <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : editing ? "Update" : "Save Record"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
