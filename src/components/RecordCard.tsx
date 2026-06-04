import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone, MapPin, Users } from "lucide-react";
import type { FamilyVisit } from "@/lib/types";

interface Props {
  record: FamilyVisit;
  onEdit: (r: FamilyVisit) => void;
  onDelete: (r: FamilyVisit) => void;
}

export function RecordCard({ record, onEdit, onDelete }: Props) {
  const kids = [
    record.kid1_name && `${record.kid1_name}${record.kid1_std ? ` (Std ${record.kid1_std})` : ""}`,
    record.kid2_name && `${record.kid2_name}${record.kid2_std ? ` (Std ${record.kid2_std})` : ""}`,
    record.kid3_name && `${record.kid3_name}${record.kid3_std ? ` (Std ${record.kid3_std})` : ""}`,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base truncate">
              {record.family_head_name} {record.surname}
            </h3>
            <Badge
              variant={record.category === "Satsangi" ? "default" : "secondary"}
              className="text-[10px]"
            >
              {record.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Males: {record.total_males} • Females: {record.total_females} • Kids: {record.total_kids}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(record)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(record)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        {kids.length > 0 && (
          <Info icon={<Users className="h-3.5 w-3.5" />}>{kids.join(", ")}</Info>
        )}
        <Info icon={<Phone className="h-3.5 w-3.5" />}>
          {record.family_head_mobile}
          {record.kids_mother_mobile ? ` • Mother: ${record.kids_mother_mobile}` : ""}
        </Info>
        {record.home_address && (
          <Info icon={<MapPin className="h-3.5 w-3.5" />}>{record.home_address}</Info>
        )}
      </div>

      <div className="mt-3 pt-2 border-t text-[11px] text-muted-foreground">
        Karyakar:{" "}
        <span className="font-medium text-foreground">
          {(record.karyakar_names ?? []).join(", ") || "—"}
        </span>
      </div>
    </div>
  );
}

function Info({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 text-muted-foreground min-w-0">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="text-foreground/90 break-words">{children}</span>
    </div>
  );
}
