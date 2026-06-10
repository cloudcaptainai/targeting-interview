import { useState } from "react";
import type { Rule } from "../types";
import { RuleCard } from "./RuleCard";

type Props = {
  rules: Rule[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onUpdate: (id: string, next: Rule) => void;
};

// Ordered list of rule cards. Tracks which card is expanded for editing.
export function RuleList({ rules, onToggle, onDelete, onMove, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (rules.length === 0) {
    return <p className="empty">No rules yet. Add one to get started.</p>;
  }

  return (
    <ol className="rule-list">
      {rules.map((rule, index) => (
        <li key={rule.id}>
          <RuleCard
            rule={rule}
            index={index}
            total={rules.length}
            isEditing={editingId === rule.id}
            onEdit={() =>
              setEditingId((id) => (id === rule.id ? null : rule.id))
            }
            onToggle={() => onToggle(rule.id)}
            onDelete={() => onDelete(rule.id)}
            onMove={(direction) => onMove(rule.id, direction)}
            onUpdate={(next) => onUpdate(rule.id, next)}
          />
        </li>
      ))}
    </ol>
  );
}
