/** Shared clock-position labels — no Three.js, safe for server UI. */

export function formatClockPosition(angleDeg: number): string {
  const angle = ((angleDeg % 360) + 360) % 360;
  if (angle >= 315 || angle < 45) return "12 o'clock";
  if (angle < 135) return "3 o'clock";
  if (angle < 225) return "6 o'clock";
  return "9 o'clock";
}
