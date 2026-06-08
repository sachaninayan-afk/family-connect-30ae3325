import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KARYAKAR_LIST } from "@/lib/types";

export function useKaryakars() {
  const [names, setNames] = useState<string[]>([...KARYAKAR_LIST]);

  const load = async () => {
    const { data } = await supabase.from("karyakars").select("name");
    const set = new Set<string>(KARYAKAR_LIST);
    (data ?? []).forEach((r: { name: string }) => set.add(r.name));
    setNames(Array.from(set).sort());
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("karyakars-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "karyakars" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return names;
}
