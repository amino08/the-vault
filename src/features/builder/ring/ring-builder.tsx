import { Viewer3D } from "@/features/builder/viewer/viewer-3d";

export function RingBuilder() {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-luxury text-vault-gold">Ring Builder</p>
      <Viewer3D />
      <p className="text-sm text-vault-pearl/50">Band width, profile, and sizing — Phase 4.</p>
    </div>
  );
}
