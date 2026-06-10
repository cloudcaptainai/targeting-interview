import { useMemo, useState } from "react";
import type { Outcome, Rule, RuleSet } from "./types";
import { sampleRuleSet } from "./data/sampleRuleSet";
import { validateRuleSet } from "./lib/validation";
import { RuleList } from "./components/RuleList";
import { DefaultOutcomeCard } from "./components/DefaultOutcomeCard";
import { RuleTester } from "./components/RuleTester";

function newRule(): Rule {
  return {
    id: `rule_${Math.random().toString(36).slice(2, 7)}`,
    enabled: true,
    conditions: [],
    outcome: { type: "fixed", variant: "paywall_control" },
  };
}

// App owns the RuleSet state and the plumbing the editor needs.
// The interesting UI (condition/outcome forms, summaries, validation)
// lives in the stub components below and is left to the candidate.
export function App() {
  const [ruleSet, setRuleSet] = useState<RuleSet>(sampleRuleSet);

  const issues = useMemo(() => validateRuleSet(ruleSet), [ruleSet]);

  function updateRule(id: string, next: Rule) {
    setRuleSet((rs) => ({
      ...rs,
      rules: rs.rules.map((r) => (r.id === id ? next : r)),
    }));
  }

  function toggleRule(id: string) {
    setRuleSet((rs) => ({
      ...rs,
      rules: rs.rules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      ),
    }));
  }

  function deleteRule(id: string) {
    setRuleSet((rs) => ({ ...rs, rules: rs.rules.filter((r) => r.id !== id) }));
  }

  function moveRule(id: string, direction: -1 | 1) {
    setRuleSet((rs) => {
      const i = rs.rules.findIndex((r) => r.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= rs.rules.length) return rs;
      const rules = [...rs.rules];
      [rules[i], rules[j]] = [rules[j], rules[i]];
      return { ...rs, rules };
    });
  }

  function addRule() {
    setRuleSet((rs) => ({ ...rs, rules: [...rs.rules, newRule()] }));
  }

  function updateDefault(outcome: Outcome) {
    setRuleSet((rs) => ({ ...rs, default: outcome }));
  }

  return (
    <>
      <header className="site-header">
        <span className="brand">Paywall Targeting</span>
        <nav aria-label="Primary navigation">
          <a href="#rules">Rules</a>
          <a href="#default">Default</a>
          <a href="#test">Test</a>
        </nav>
      </header>

      <main className="article-shell editor">
        <p className="eyebrow">Experiments &amp; targeting</p>
        <h1 className="editor-title">Rules</h1>
        <p className="meta">
          Evaluated top to bottom — first match wins. Everyone else falls
          through to the default.
        </p>

        {/* TODO(candidate): surface validation issues prominently. */}
        {issues.length > 0 && (
          <ul className="issues">
            {issues.map((issue, i) => (
              <li key={i} data-level={issue.level}>
                {issue.message}
              </li>
            ))}
          </ul>
        )}

        <div id="rules">
          <RuleList
            rules={ruleSet.rules}
            onToggle={toggleRule}
            onDelete={deleteRule}
            onMove={moveRule}
            onUpdate={updateRule}
          />
        </div>

        <button type="button" className="add-rule" onClick={addRule}>
          + Add rule
        </button>

        <div id="default">
          <DefaultOutcomeCard
            outcome={ruleSet.default}
            onChange={updateDefault}
          />
        </div>

        <div id="test">
          <RuleTester ruleSet={ruleSet} />
        </div>
      </main>
    </>
  );
}
