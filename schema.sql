-- Part 1 — Schema
--
-- Design the tables that store the RuleSet (see src/types.ts) so it can be:
--   1. Read path : fetch the live rule set, rules IN ORDER, ready to evaluate.
--   2. Audit path: which variant was user X assigned, by which rule, and when?
--
-- Pseudo-SQL is fine — columns and keys matter more than exact types.
-- Be ready to discuss: rows-vs-JSON line, reorder cost of `position`,
-- and what's indexed for the read path.

-- Given to you as the level of detail we mean:
CREATE TABLE variants (
  id          text PRIMARY KEY,   -- "paywall_control"
  name        text NOT NULL,      -- "Control"
  archived_at timestamp           -- null = active
);

-- TODO(candidate): rule_sets — a versioned/live container for an ordered list of rules.
-- CREATE TABLE rule_sets ( ... );

-- TODO(candidate): rules — ordered, enabled flag, FK to its rule_set, an outcome.
-- Think about how you store evaluation order and what that costs on reorder.
-- CREATE TABLE rules ( ... );

-- TODO(candidate): conditions — the ANDed predicates for a rule (attr, op, value).
-- Rows vs JSON column is a deliberate choice — be ready to defend it.
-- CREATE TABLE conditions ( ... );

-- TODO(candidate): assignments — the audit trail for the audit-path query.
-- CREATE TABLE assignments ( ... );
