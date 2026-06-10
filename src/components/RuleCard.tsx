import type { Rule } from "../types";
import { summarizeConditions, summarizeOutcome } from "../lib/summarize";
import { RuleEditor } from "./RuleEditor";

type Props = {
  rule: Rule;
  index: number;
  total: number;
  isEditing: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  onUpdate: (next: Rule) => void;
};

// Collapsed view shows everything at a glance; expanding reveals the editor.
// TODO(candidate): make the summary and "shadowed / no conditions" cues clear.
export function RuleCard({
  rule,
  index,
  total,
  isEditing,
  onEdit,
  onToggle,
  onDelete,
  onMove,
  onUpdate,
}: Props) {
  return (
    <article className="rule-card" data-enabled={rule.enabled}>
      <div className="rule-card__row">
        <span className="rule-card__pos">#{index + 1}</span>
        <div className="rule-card__summary">
          <p className="rule-card__when">{summarizeConditions(rule.conditions)}</p>
          <p className="rule-card__then">{summarizeOutcome(rule.outcome)}</p>
        </div>

        <div className="rule-card__actions">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0}>
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
          >
            ↓
          </button>
          <button type="button" onClick={onToggle}>
            {rule.enabled ? "Enabled" : "Disabled"}
          </button>
          <button type="button" onClick={onEdit}>
            {isEditing ? "Done" : "Edit"}
          </button>
          <button type="button" className="danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      {isEditing && <RuleEditor rule={rule} onChange={onUpdate} />}
    </article>
  );
}
