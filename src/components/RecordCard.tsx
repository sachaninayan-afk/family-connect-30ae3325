import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MapPin, School, User } from "lucide-react";
import type { FamilyRecord } from "@/lib/types";

interface Props {
  record: FamilyRecord;
  onEdit: (r: FamilyRecord) => void;
  onDelete: (r: FamilyRecord) => void;
}

export function RecordCard({ record, onEdit, onDelete }: Props) {
  const fullName = [record.child_name, record.surname].filter(Boolean).join(" ");
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base truncate">{fullName}</h3>
            <Badge variant={record.category === "Satsangi" ? "default" : "secondary"} className="text-[10px]">
              {record.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Family #{record.family_number} {record.standard ? `• Std ${record.standard}` : ""}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(record)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(record)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
        {(record.father_name || record.mother_name) && (
          <Info icon={<User className="h-3.5 w-3.5" />}>
            {[record.father_name, record.mother_name].filter(Boolean).join(" / ")}
          </Info>
        )}
        {record.school_name && (
          <Info icon={<School className="h-3.5 w-3.5" />}>{record.school_name}</Info>
        )}
        {(record.father_mobile || record.mother_mobile) && (
          <Info icon={<Phone className="h-3.5 w-3.5" />}>
            {[record.father_mobile, record.mother_mobile].filter(Boolean).join(", ")}
          </Info>
        )}
        {record.home_address && (
          <Info icon={<MapPin className="h-3.5 w-3.5" />}>{record.home_address}</Info>
        )}
      </div>

      <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Karyakar: <span className="font-medium text-foreground">{record.karyakar_name}</span></span>
        {record.date_of_birth && <span>DOB: {record.date_of_birth}</span>}
      </div>
    </div>
  );
}

function Info({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 text-muted-foreground min-w-0">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="truncate text-foreground/90">{children}</span>
    </div>
  );
}
