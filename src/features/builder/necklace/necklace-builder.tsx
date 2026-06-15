import { Viewer3D } from "@/features/builder/viewer/viewer-3d";

export function NecklaceBuilder() {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-luxury text-vault-gold">Necklace Builder</p>
      <Viewer3D />
      <p className="text-sm text-vault-pearl/50">Chain type and pendant attachment — Phase 4.</p>
    </div>
  );
}
