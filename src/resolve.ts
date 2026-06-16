import type { Condition, Context, Outcome, Resolution, RuleSet } from "./types";

// Part 2 — the decision function at the heart of the system.
// Contract: runs on every app launch, so it must be fast, deterministic,
// and it must NEVER throw — the user always gets some variant back.

// Last-resort variant if everything else fails. resolve() stays
// dependency-free of the variant catalog on purpose; this is the one
// hard-coded fallback that guarantees we always hand back something.
const SAFE_FALLBACK_VARIANT = "paywall_control";

export function resolve(ruleSet: RuleSet, ctx: Context): Resolution {
  // For each enabled rule, in order: if every condition matches ctx,
  // apply that rule's outcome (first match wins). Otherwise, the default.
  try {
    for (const rule of ruleSet.rules) {
      if (!rule.enabled) continue;
      const matched = rule.conditions.every((c) => matchesCondition(c, ctx));
      if (matched) return applyOutcome(rule.outcome, ctx, rule.id);
    }
    return applyOutcome(ruleSet.default, ctx, "default");
  } catch {
    // Honor the "never throw" contract no matter how malformed the input is.
    return {
      variant: SAFE_FALLBACK_VARIANT,
      reason: "resolve fell back after an unexpected error",
    };
  }
}

export function matchesCondition(cond: Condition, ctx: Context): boolean {
  // Evaluate one condition against ctx:
  //   "eq"  → ctx[attr] equals value
  //   "in"  → ctx[attr] is one of values
  //   "gte" → ctx[attr] >= value
  const actual = ctx[cond.attr as keyof Context];

  // Decision: a missing attribute never matches (no-match, don't throw).
  if (actual === undefined) return false;

  switch (cond.op) {
    case "eq":
      return actual === cond.value;
    case "in":
      return Array.isArray(cond.value) && cond.value.includes(actual);
    case "gte":
      return gte(actual, cond.value);
    default:
      // Unknown operator → treat as no-match rather than throwing.
      return false;
  }
}

export function applyOutcome(
  outcome: Outcome,
  ctx: Context,
  ruleId: string,
): Resolution {
  const matched =
    ruleId === "default" ? "no rule matched, using default" : `${ruleId} matched`;

  if (outcome.type === "fixed") {
    return { variant: outcome.variant, reason: `${matched} → ${outcome.variant}` };
  }

  // Experiment: bucket the user deterministically from userId, in proportion
  // to the split. Works even if the split doesn't sum to 100 (we normalize),
  // so the user still gets a stable variant.
  const [variantA, variantB] = outcome.variants;
  const [weightA, weightB] = outcome.split;
  const total = weightA + weightB;
  const threshold = total > 0 ? weightA / total : 0.5;

  const bucket = hashToUnitInterval(ctx.userId);
  const picked = bucket < threshold ? variantA : variantB;
  const side = picked === variantA ? "A" : "B";

  return {
    variant: picked,
    reason: `${matched} → experiment bucket ${side}: ${picked}`,
  };
}

// --- helpers ---------------------------------------------------------------

// Stable string hash (djb2) mapped to [0, 1). Same userId → same bucket.
function hashToUnitInterval(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) + hash + input.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }
  return (hash >>> 0) / 0xffffffff;
}

// `>=` that understands numbers and dotted version strings ("5.10.0" >= "5.9.0").
function gte(actual: unknown, expected: unknown): boolean {
  if (typeof actual === "number" && typeof expected === "number") {
    return actual >= expected;
  }
  return compareVersions(String(actual), String(expected)) >= 0;
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".");
  const pb = b.split(".");
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = Number(pa[i] ?? 0);
    const nb = Number(pb[i] ?? 0);
    if (Number.isNaN(na) || Number.isNaN(nb)) {
      const cmp = (pa[i] ?? "").localeCompare(pb[i] ?? "");
      if (cmp !== 0) return cmp;
    } else if (na !== nb) {
      return na - nb;
    }
  }
  return 0;
}
