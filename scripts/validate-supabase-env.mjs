/**
 * Validates Supabase env + client init. Prints pass/fail only — no secrets.
 * Usage: node scripts/validate-supabase-env.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VAULT_ADMIN_EMAILS",
];

loadEnvLocal();

const missing = required.filter((k) => !process.env[k]?.trim());
if (missing.length) {
  console.log("VALIDATION: FAILED");
  console.log("REASON: missing env keys:", missing.join(", "));
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

try {
  const client = createClient(url, anon);
  const { error } = await client.from("users").select("id").limit(1);
  if (error) {
    // PGRST205 = table not found (schema not migrated yet) — client still OK
    if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
      console.log("VALIDATION: PASSED");
      console.log("NOTE: Supabase connected; database schema not yet applied.");
      process.exit(0);
    }
    console.log("VALIDATION: FAILED");
    console.log("REASON: Supabase query error:", error.code ?? error.message);
    process.exit(1);
  }
  console.log("VALIDATION: PASSED");
  console.log("NOTE: Supabase connected and users table reachable.");
} catch (e) {
  console.log("VALIDATION: FAILED");
  console.log("REASON:", e instanceof Error ? e.message : "unknown error");
  process.exit(1);
}
