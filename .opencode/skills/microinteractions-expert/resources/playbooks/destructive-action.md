# Playbook: Destructive Action Safety

## Scenario

User initiates irreversible action (delete, revoke, remove).

## Baseline behavior

1. Show explicit confirmation with object name and consequence.
2. Require deliberate confirmation action.
3. Show completion feedback and undo where available.

## Failure handling

- If commit fails, state remains unchanged.
- Present retry or support path.

## Recommended patterns

- `MI-DESTRUCTIVE-005`
- `MI-FEEDBACK-002`
- `MI-RECOVERY-004`
