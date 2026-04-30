import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Plus, Search, Users, X, MoreVertical, DatabaseBackup, Upload } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { RecordCard } from "@/components/RecordCard";
import { LockButton } from "@/components/PasscodeGate";
import type { FamilyRecord } from "@/lib/types";

const Index = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<FamilyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FamilyRecord | null>(null);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterKaryakar, setFilterKaryakar] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const load = async () => {
    const { data, error } = await supabase
      .from("families")
      .select("*")
      .order("date_of_visit", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRecords((data ?? []) as FamilyRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("families-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "families" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const karyakars = useMemo(
    () => Array.from(new Set(records.map((r) => r.karyakar_name).filter(Boolean))).sort(),
    [records]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (filterDate && r.date_of_visit !== filterDate) return false;
      if (filterKaryakar !== "all" && r.karyakar_name !== filterKaryakar) return false;
      if (filterCategory !== "all" && r.category !== filterCategory) return false;
      if (!q) return true;
      return [r.child_name, r.surname, r.father_name, r.mother_name, r.family_number, r.school_name, r.karyakar_name]
        .filter(Boolean)
        .some((v) => v!.toString().toLowerCase().includes(q));
    });
  }, [records, search, filterDate, filterKaryakar, filterCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, FamilyRecord[]>();
    for (const r of filtered) {
      const key = r.date_of_visit;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const handleEdit = (r: FamilyRecord) => navigate(`/edit/${r.id}`);
  const handleAdd = () => navigate("/new");

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("families").delete().eq("id", deleteTarget.id);
    if (error) toast.error(error.message);
    else toast.success("Record deleted");
    setDeleteTarget(null);
  };

  const clearFilters = () => { setSearch(""); setFilterDate(""); setFilterKaryakar("all"); setFilterCategory("all"); };
  const hasFilters = search || filterDate || filterKaryakar !== "all" || filterCategory !== "all";

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No records to export");
      return;
    }
    // Sort ascending by date then created_at for sequential numbering
    const sorted = [...filtered].sort((a, b) => {
      if (a.date_of_visit !== b.date_of_visit) return a.date_of_visit.localeCompare(b.date_of_visit);
      return a.created_at.localeCompare(b.created_at);
    });
    const rows = sorted.map((r, i) => ({
      "Family No.": i + 1,
      "Date of Visit": r.date_of_visit,
      "Karyakar Name": r.karyakar_name,
      "Original Family Number": r.family_number,
      "Child Name": r.child_name,
      "Surname": r.surname ?? "",
      "Father Name": r.father_name ?? "",
      "Mother Name": r.mother_name ?? "",
      "Standard": r.standard ?? "",
      "Date of Birth": r.date_of_birth ?? "",
      "School Name": r.school_name ?? "",
      "Home Address": r.home_address ?? "",
      "Father Mobile": r.father_mobile ?? "",
      "Mother Mobile": r.mother_mobile ?? "",
      "Category": r.category,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Object.keys(rows[0]).map((k) => ({
      wch: Math.max(k.length, ...rows.map((r) => String((r as any)[k] ?? "").length)) + 2,
    }));
    const wb = XLSX.utils.book_new();
    const sheetName = filterKaryakar !== "all" ? filterKaryakar.slice(0, 28) : "All Karyakars";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const today = new Date().toISOString().slice(0, 10);
    const scope = filterKaryakar !== "all" ? filterKaryakar.replace(/[^a-z0-9]/gi, "_") : "all";
    const fileName = `family-data_${scope}_${today}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Exported ${rows.length} record${rows.length === 1 ? "" : "s"}`);
  };

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground grid place-items-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-base sm:text-lg leading-tight truncate">MISSION - 600</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {records.length} total {records.length === 1 ? "record" : "records"}
                {hasFilters && ` • ${filtered.length} shown`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={handleExport} size="sm" variant="outline" disabled={filtered.length === 0}>
              <Download className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Export{filterKaryakar !== "all" ? ` (${filterKaryakar})` : ""}</span>
            </Button>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, family no, school..."
              className="pl-9 h-10"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="h-9" />
            <Select value={filterKaryakar} onValueChange={setFilterKaryakar}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Karyakar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Karyakars</SelectItem>
                {karyakars.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Satsangi">Satsangi</SelectItem>
                <SelectItem value="Gunbhavi">Gunbhavi</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearFilters} disabled={!hasFilters} className="h-9">
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4 pb-24">
        {loading ? (
          <div className="text-center text-muted-foreground py-16">Loading records...</div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="font-medium">No records found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasFilters ? "Try clearing filters" : "Tap Add to create the first record"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([date, items]) => (
              <section key={date}>
                <div className="sticky top-[136px] sm:top-[140px] z-10 -mx-4 px-4 py-1.5 bg-muted/30 backdrop-blur flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {formatDate(date)}
                  </h2>
                  <span className="text-[11px] text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {items.map((r) => (
                    <RecordCard key={r.id} record={r} onEdit={handleEdit} onDelete={setDeleteTarget} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the record for <b>{deleteTarget?.child_name}</b>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
