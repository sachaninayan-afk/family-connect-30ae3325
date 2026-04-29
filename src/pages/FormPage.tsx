import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FamilyForm } from "@/components/FamilyForm";
import type { FamilyRecord } from "@/lib/types";

const FormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editing, setEditing] = useState<FamilyRecord | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("families").select("*").eq("id", id).maybeSingle();
      if (error) toast.error(error.message);
      else setEditing(data as FamilyRecord | null);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-base sm:text-lg">
            {id ? "Edit Record" : "New Family Record"}
          </h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-4 pb-24">
        {loading ? (
          <div className="text-center text-muted-foreground py-16">Loading...</div>
        ) : (
          <FamilyForm
            editing={editing}
            onSaved={() => navigate("/")}
            onCancel={() => navigate(-1)}
          />
        )}
      </main>
    </div>
  );
};

export default FormPage;
