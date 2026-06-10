import type { Condition, Outcome } from "../types";
import { variantName } from "../variants";

// Basic, readable summaries shown on a collapsed rule card.
// Good enough to ship; candidates can make these read more naturally.

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(" or ");
  return String(value);
}

const OP_LABEL: Record<Condition["op"], string> = {
  in: "is",
  eq: "is",
  gte: "is at least",
};

export function summarizeConditions(conditions: Condition[]): string {
  if (conditions.length === 0) return "No conditions (matches everyone)";
  return conditions
    .map((c) => `${capitalize(c.attr)} ${OP_LABEL[c.op]} ${formatValue(c.value)}`)
    .join(", ");
}

export function summarizeOutcome(outcome: Outcome): string {
  if (outcome.type === "fixed") return variantName(outcome.variant);
  const [a, b] = outcome.variants;
  const [splitA, splitB] = outcome.split;
  return `${splitA}/${splitB}: ${variantName(a)} vs ${variantName(b)}`;
}
