import type { RuleSet } from "../types";

// Seed data so the editor renders something on first load.
// Candidates can edit/extend this freely — it stands in for the
// "live rule set" that Part 1's schema would persist.
export const sampleRuleSet: RuleSet = {
  rules: [
    {
      id: "rule_1",
      enabled: true,
      conditions: [{ attr: "country", op: "in", value: ["US", "CA"] }],
      outcome: {
        type: "experiment",
        variants: ["paywall_control", "paywall_annual"],
        split: [50, 50],
      },
    },
    {
      id: "rule_2",
      enabled: true,
      conditions: [
        { attr: "plan", op: "eq", value: "free" },
        { attr: "appVersion", op: "gte", value: "5.0.0" },
      ],
      outcome: { type: "fixed", variant: "paywall_hard_sell" },
    },
    {
      id: "rule_3",
      enabled: false,
      conditions: [],
      outcome: { type: "fixed", variant: "paywall_annual" },
    },
  ],
  default: { type: "fixed", variant: "paywall_control" },
};
