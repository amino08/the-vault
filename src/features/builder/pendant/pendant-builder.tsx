import { Viewer3D } from "@/features/builder/viewer/viewer-3d";

export function PendantBuilder() {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-luxury text-vault-gold">Pendant Builder</p>
      <Viewer3D />
      <p className="text-sm text-vault-pearl/50">Full pendant parametric controls — Phase 4.</p>
    </div>
  );
}
