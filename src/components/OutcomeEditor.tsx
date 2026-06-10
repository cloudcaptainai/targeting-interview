import type { Outcome } from "../types";
import { VARIANTS } from "../variants";

type Props = {
  outcome: Outcome;
  onChange: (next: Outcome) => void;
};

// Shared by rule cards and the default block.
// Lets the user pick a fixed variant OR an experiment (two variants + split).
// TODO(candidate): build the variant dropdowns and your chosen split control.
export function OutcomeEditor({ outcome, onChange }: Props) {
  function setType(type: Outcome["type"]) {
    if (type === outcome.type) return;
    if (type === "fixed") {
      onChange({ type: "fixed", variant: VARIANTS[0].id });
    } else {
      onChange({
        type: "experiment",
        variants: [VARIANTS[0].id, VARIANTS[1].id],
        split: [50, 50],
      });
    }
  }

  return (
    <div className="outcome-editor">
      <div className="outcome-editor__type">
        <label>
          <input
            type="radio"
            name="outcome-type"
            checked={outcome.type === "fixed"}
            onChange={() => setType("fixed")}
          />
          Fixed variant
        </label>
        <label>
          <input
            type="radio"
            name="outcome-type"
            checked={outcome.type === "experiment"}
            onChange={() => setType("experiment")}
          />
          Experiment
        </label>
      </div>

      {/* TODO(candidate):
          - fixed: a single variant <select>
          - experiment: two variant <select>s + a split control (slider / inputs / presets)
            and your decision on what to do when split != 100. */}
      <p className="stub-note">Outcome controls go here.</p>
    </div>
  );
}
