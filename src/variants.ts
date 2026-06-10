// The set of paywall variants a rule/outcome can point at.
// Kept intentionally small for the exercise.

export type Variant = { id: string; name: string };

export const VARIANTS: Variant[] = [
  { id: "paywall_control", name: "Control" },
  { id: "paywall_annual", name: "Annual-first" },
  { id: "paywall_hard_sell", name: "Hard sell" },
];

export function variantName(id: string): string {
  return VARIANTS.find((v) => v.id === id)?.name ?? id;
}
