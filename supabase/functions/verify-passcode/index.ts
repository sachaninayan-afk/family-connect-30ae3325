import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { passcode } = await req.json().catch(() => ({ passcode: "" }));
    if (typeof passcode !== "string" || passcode.length === 0 || passcode.length > 200) {
      return json({ ok: false, error: "Invalid input" }, 400);
    }
    const expected = Deno.env.get("MISSION_600_PASSCODE") ?? "";
    if (!expected) {
      return json({ ok: false, error: "Passcode not configured" }, 500);
    }
    // constant-time-ish compare
    const a = new TextEncoder().encode(passcode);
    const b = new TextEncoder().encode(expected);
    let diff = a.length ^ b.length;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
    if (diff !== 0) {
      // small delay to slow brute force
      await new Promise((r) => setTimeout(r, 400));
      return json({ ok: false, error: "Wrong passcode" }, 401);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
