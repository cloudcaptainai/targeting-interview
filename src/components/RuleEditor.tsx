import type { Condition, Outcome, Rule } from "../types";
import { ConditionRow } from "./ConditionRow";
import { OutcomeEditor } from "./OutcomeEditor";

type Props = {
  rule: Rule;
  onChange: (next: Rule) => void;
};

// Expanded editing surface for a single rule:
//   - add/remove condition rows
//   - pick the outcome (fixed variant, or experiment w/ split)
// TODO(candidate): flesh out the add/remove flows and validation.
export function RuleEditor({ rule, onChange }: Props) {
  function setConditions(conditions: Condition[]) {
    onChange({ ...rule, conditions });
  }

  function setOutcome(outcome: Outcome) {
    onChange({ ...rule, outcome });
  }

  return (
    <div className="rule-editor">
      <section>
        <h3>Audience (all must match)</h3>
        {rule.conditions.map((condition, i) => (
          <ConditionRow
            key={i}
            condition={condition}
            onChange={(next) =>
              setConditions(
                rule.conditions.map((c, j) => (j === i ? next : c)),
              )
            }
            onRemove={() =>
              setConditions(rule.conditions.filter((_, j) => j !== i))
            }
          />
        ))}
        <button
          type="button"
          onClick={() =>
            setConditions([
              ...rule.conditions,
              { attr: "country", op: "in", value: [] },
            ])
          }
        >
          + Add condition
        </button>
      </section>

      <section>
        <h3>Outcome</h3>
        <OutcomeEditor outcome={rule.outcome} onChange={setOutcome} />
      </section>
    </div>
  );
}
