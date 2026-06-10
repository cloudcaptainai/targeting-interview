import type { Condition, Context, Outcome, Resolution, RuleSet } from "./types";

// Part 2 — the decision function at the heart of the system.
// Contract: runs on every app launch, so it must be fast, deterministic,
// and it must NEVER throw — the user always gets some variant back.

export function resolve(ruleSet: RuleSet, ctx: Context): Resolution {
  // For each enabled rule, in order:
  //   if every condition matches ctx → apply that rule's outcome. Done.
  // If no rule matched → apply ruleSet.default.
  // TODO(candidate): walk ruleSet.rules and short-circuit on first match.
  return applyOutcome(ruleSet.default, ctx, "default");
}

export function matchesCondition(cond: Condition, ctx: Context): boolean {
  // Evaluate one condition against ctx:
  //   "eq"  → ctx[attr] equals value
  //   "in"  → ctx[attr] is one of values
  //   "gte" → ctx[attr] >= value

  const actual = ctx[cond.attr as keyof Context];

  // TODO(candidate): handle each operator, plus the "attribute missing" case.
  void actual;
  return false;
}

export function applyOutcome(
  outcome: Outcome,
  ctx: Context,
  ruleId: string,
): Resolution {
  // fixed      → that variant.
  // experiment → pick one of the two variants deterministically from
  //              ctx.userId (e.g. hash it), so the same user gets the
  //              same variant on every call, and users land on each
  //              side in proportion to the split.

  if (outcome.type === "fixed") {
    return {
      variant: outcome.variant,
      reason: `${ruleId} → fixed ${outcome.variant}`,
    };
  }

  // TODO(candidate): deterministically bucket ctx.userId across outcome.split.
  return {
    variant: outcome.variants[0],
    reason: `${ruleId} → experiment bucket TODO (user ${ctx.userId})`,
  };
}
