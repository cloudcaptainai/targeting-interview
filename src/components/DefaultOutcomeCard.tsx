import { useState } from "react";
import type { Outcome } from "../types";
import { summarizeOutcome } from "../lib/summarize";
import { OutcomeEditor } from "./OutcomeEditor";

type Props = {
  outcome: Outcome;
  onChange: (next: Outcome) => void;
};

// Visually distinct, non-deletable, non-reorderable block at the bottom.
// "Everyone else sees ___" — same outcome choices as a rule.
export function DefaultOutcomeCard({ outcome, onChange }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <article className="rule-card default-card">
      <div className="rule-card__row">
        <span className="rule-card__pos">Default</span>
        <div className="rule-card__summary">
          <p className="rule-card__when">Everyone else sees</p>
          <p className="rule-card__then">{summarizeOutcome(outcome)}</p>
        </div>
        <div className="rule-card__actions">
          <button type="button" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="rule-editor">
          <OutcomeEditor outcome={outcome} onChange={onChange} />
        </div>
      )}
    </article>
  );
}
