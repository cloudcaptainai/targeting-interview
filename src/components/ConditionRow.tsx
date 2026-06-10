import type { Condition } from "../types";

type Props = {
  condition: Condition;
  onChange: (next: Condition) => void;
  onRemove: () => void;
};

const OPS: Condition["op"][] = ["in", "eq", "gte"];

// One predicate row: attribute, operator, value.
// TODO(candidate): value editing differs per operator ("in" is a list) — handle it.
export function ConditionRow({ condition, onChange, onRemove }: Props) {
  return (
    <div className="condition-row">
      <input
        aria-label="attribute"
        value={condition.attr}
        onChange={(e) => onChange({ ...condition, attr: e.target.value })}
      />
      <select
        aria-label="operator"
        value={condition.op}
        onChange={(e) =>
          onChange({ ...condition, op: e.target.value as Condition["op"] })
        }
      >
        {OPS.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      {/* TODO(candidate): real value input(s). Stubbed as JSON for now. */}
      <input
        aria-label="value"
        value={JSON.stringify(condition.value)}
        readOnly
      />
      <button type="button" className="danger" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
