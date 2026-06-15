import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const header = `-- =============================================================================
-- THE VAULT BY ENTER AEVUM — HOSTED SUPABASE SETUP
-- =============================================================================
--
-- WHERE TO RUN:
--   Supabase Dashboard → SQL Editor → New query → paste this entire file → Run
--
-- WHEN TO RUN:
--   ONLY after creating a hosted Supabase project at supabase.com/dashboard
--   Project must be Active before running.
--
-- DO NOT RUN:
--   - With local Supabase (supabase start)
--   - With Docker
--   - Against an already-migrated database (will error on duplicate objects)
--
-- ORDER (combined in this file):
--   1. 20250613000001_enums.sql
--   2. 20250613000002_users.sql
--   3. 20250613000003_commissions.sql
--   4. 20250613000004_commission_support.sql
--   5. 20250613000005_payments_design_production.sql
--   6. storage.sql
--   7. 20250614000001_grants_authenticated.sql
--
-- =============================================================================

`;

const files = [
  "supabase/migrations/20250613000001_enums.sql",
  "supabase/migrations/20250613000002_users.sql",
  "supabase/migrations/20250613000003_commissions.sql",
  "supabase/migrations/20250613000004_commission_support.sql",
  "supabase/migrations/20250613000005_payments_design_production.sql",
  "supabase/storage.sql",
  "supabase/migrations/20250614000001_grants_authenticated.sql",
];

let out = header;
for (const f of files) {
  out += `\n-- >>> BEGIN: ${f}\n`;
  out += fs.readFileSync(path.join(root, f), "utf8");
  out += `\n-- <<< END: ${f}\n`;
}

const outPath = path.join(root, "supabase/hosted-setup.sql");
fs.writeFileSync(outPath, out, "utf8");
console.log(`Wrote ${outPath} (${out.length} bytes)`);
