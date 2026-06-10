import type { Outcome, RuleSet } from "../types";
import { VARIANTS } from "../variants";

// The invalid states the prompt probes hardest:
//   - a split summing to != 100
//   - an outcome pointing at a deleted/unknown variant
//   - a rule with no conditions
//   - a rule shadowed by a broader rule above it
//
// This is a basic pass — candidates can refine the rules and the levels.

export type IssueLevel = "error" | "warning";

export type ValidationIssue = {
  level: IssueLevel;
  ruleId: string | "default";
  message: string;
};

const KNOWN_VARIANTS = new Set(VARIANTS.map((v) => v.id));

function label(ruleId: string | "default"): string {
  return ruleId === "default" ? "Default" : ruleId;
}

function checkOutcome(
  outcome: Outcome,
  ruleId: string | "default",
  issues: ValidationIssue[],
): void {
  if (outcome.type === "fixed") {
    if (!KNOWN_VARIANTS.has(outcome.variant)) {
      issues.push({
        level: "error",
        ruleId,
        message: `${label(ruleId)} points at unknown variant "${outcome.variant}"`,
      });
    }
    return;
  }

  for (const variant of outcome.variants) {
    if (!KNOWN_VARIANTS.has(variant)) {
      issues.push({
        level: "error",
        ruleId,
        message: `${label(ruleId)} points at unknown variant "${variant}"`,
      });
    }
  }

  const sum = outcome.split[0] + outcome.split[1];
  if (sum !== 100) {
    issues.push({
      level: "error",
      ruleId,
      message: `${label(ruleId)} split sums to ${sum}%, should be 100%`,
    });
  }
}

export function validateRuleSet(ruleSet: RuleSet): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  ruleSet.rules.forEach((rule) => {
    if (rule.enabled && rule.conditions.length === 0) {
      issues.push({
        level: "warning",
        ruleId: rule.id,
        message: `${rule.id} has no conditions — it matches everyone`,
      });
    }
    checkOutcome(rule.outcome, rule.id, issues);
  });

  // A catch-all enabled rule shadows every rule below it.
  const catchAll = ruleSet.rules.findIndex(
    (r) => r.enabled && r.conditions.length === 0,
  );
  if (catchAll >= 0) {
    ruleSet.rules.slice(catchAll + 1).forEach((shadowed) => {
      issues.push({
        level: "warning",
        ruleId: shadowed.id,
        message: `${shadowed.id} is unreachable — shadowed by ${ruleSet.rules[catchAll].id} above`,
      });
    });
  }

  checkOutcome(ruleSet.default, "default", issues);
  return issues;
}
