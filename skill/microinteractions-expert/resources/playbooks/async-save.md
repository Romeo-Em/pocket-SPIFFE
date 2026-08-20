# Playbook: Async Save Feedback

## Scenario

User edits settings and clicks Save.

## Baseline behavior

1. Trigger acknowledged within 100ms.
2. Save button enters pending state.
3. Completion state appears in same region.

## Failure handling

- Keep edited values in place.
- Show error state with retry action.
- Keep focus on actionable control.

## Recommended patterns

- `MI-TRIGGER-001`
- `MI-FEEDBACK-002`
- `MI-RECOVERY-004`
