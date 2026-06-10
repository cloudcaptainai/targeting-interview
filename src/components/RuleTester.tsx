import { useState } from "react";
import type { Context, RuleSet } from "../types";
import { resolve } from "../resolve";
import { variantName } from "../variants";
import { exampleUsers } from "../data/exampleUsers";

type Props = {
  ruleSet: RuleSet;
};

// A scratch panel to run an example user through the live rules.
// It calls resolve() directly, so it'll only get interesting once Part 2
// is implemented (right now resolve() returns the default).
export function RuleTester({ ruleSet }: Props) {
  const [ctx, setCtx] = useState<Context>(exampleUsers[0].ctx);

  const result = resolve(ruleSet, ctx);

  return (
    <section className="tester">
      <h2 className="editor-title">Test</h2>
      <p className="meta">
        Run an example user through the rules. Powered by{" "}
        <code>resolve()</code> — implement Part 2 to see real matches.
      </p>

      <div className="tester__presets">
        {exampleUsers.map((u) => (
          <button key={u.label} type="button" onClick={() => setCtx(u.ctx)}>
            {u.label}
          </button>
        ))}
      </div>

      <div className="tester__fields">
        <label>
          userId
          <input
            value={ctx.userId}
            onChange={(e) => setCtx((c) => ({ ...c, userId: e.target.value }))}
          />
        </label>
        <label>
          country
          <input
            value={ctx.country ?? ""}
            onChange={(e) =>
              setCtx((c) => ({ ...c, country: e.target.value || undefined }))
            }
          />
        </label>
        <label>
          plan
          <input
            value={ctx.plan ?? ""}
            onChange={(e) =>
              setCtx((c) => ({ ...c, plan: e.target.value || undefined }))
            }
          />
        </label>
        <label>
          appVersion
          <input
            value={ctx.appVersion ?? ""}
            onChange={(e) =>
              setCtx((c) => ({ ...c, appVersion: e.target.value || undefined }))
            }
          />
        </label>
      </div>

      <div className="tester__result">
        <p className="rule-card__when">{variantName(result.variant)}</p>
        <p className="rule-card__then">{result.reason}</p>
      </div>
    </section>
  );
}
