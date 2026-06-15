export const COMMISSION_STATUSES = [
  "inquiry",
  "intake",
  "design_review",
  "concept_creation",
  "cad_development",
  "render_approval",
  "production",
  "quality_control",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  inquiry: "Inquiry",
  intake: "Intake",
  design_review: "Design Review",
  concept_creation: "Concept Creation",
  cad_development: "CAD Development",
  render_approval: "Render Approval",
  production: "Production",
  quality_control: "Quality Control",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const COMMISSION_STATUS_ORDER: CommissionStatus[] = [
  "inquiry",
  "intake",
  "design_review",
  "concept_creation",
  "cad_development",
  "render_approval",
  "production",
  "quality_control",
  "shipped",
  "completed",
];

export function getStatusIndex(status: CommissionStatus): number {
  return COMMISSION_STATUS_ORDER.indexOf(status);
}

export function isTerminalStatus(status: CommissionStatus): boolean {
  return status === "completed" || status === "cancelled";
}

export function canClientEdit(status: CommissionStatus): boolean {
  return status === "inquiry" || status === "intake";
}

export const STORY_TYPES = [
  "transformation",
  "achievement",
  "legacy",
  "relationship",
  "milestone",
  "symbolic",
  "other",
] as const;

export type StoryType = (typeof STORY_TYPES)[number];

export const STORY_TYPE_LABELS: Record<StoryType, string> = {
  transformation: "Transformation",
  achievement: "Achievement",
  legacy: "Legacy",
  relationship: "Relationship",
  milestone: "Milestone",
  symbolic: "Symbolic Creation",
  other: "Other",
};

export const PIECE_TYPES = ["pendant", "ring", "bracelet", "necklace", "custom"] as const;
export type PieceType = (typeof PIECE_TYPES)[number];

export const PIECE_TYPE_LABELS: Record<PieceType, string> = {
  pendant: "Pendant",
  ring: "Ring",
  bracelet: "Bracelet",
  necklace: "Necklace",
  custom: "Custom Piece",
};
