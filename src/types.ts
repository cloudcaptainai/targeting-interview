// Domain types for the paywall targeting exercise.
// These come straight from the prompt — treat them as the contract.

export type Condition = {
  attr: string;
  op: "in" | "eq" | "gte";
  value: unknown;
};

export type Outcome =
  | { type: "fixed"; variant: string }
  | { type: "experiment"; variants: [string, string]; split: [number, number] };

export type Rule = {
  id: string;
  enabled: boolean;
  conditions: Condition[];
  outcome: Outcome;
};

export type RuleSet = {
  rules: Rule[];
  default: Outcome;
};

// Context that will be associated with a user request.
export type Context = {
  userId: string;
  country?: string;
  plan?: string;
  appVersion?: string;
};

// Returned by resolve() — see src/resolve.ts.
export type Resolution = {
  variant: string; // a variant id, e.g. "paywall_annual"
  reason: string; // human-readable, for a log line
};
