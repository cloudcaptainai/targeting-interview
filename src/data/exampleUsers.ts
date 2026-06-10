import type { Context } from "../types";

// Handy presets for the Test panel so a PM can sanity-check the rules
// without typing a full context every time.
export const exampleUsers: { label: string; ctx: Context }[] = [
  {
    label: "US free user",
    ctx: { userId: "u_1001", country: "US", plan: "free", appVersion: "5.2.0" },
  },
  {
    label: "CA paid user",
    ctx: { userId: "u_1002", country: "CA", plan: "paid", appVersion: "5.0.0" },
  },
  {
    label: "UK free, old app",
    ctx: { userId: "u_1003", country: "UK", plan: "free", appVersion: "4.1.0" },
  },
  {
    label: "Unknown country",
    ctx: { userId: "u_1004" },
  },
];
