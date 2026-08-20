# Microinteraction Ontology

Decision map for selecting patterns and composing behavior.

## Core Axes

1. Trigger type
   - User action (click, type, submit)
   - System event (sync complete, timeout, permission change)
   - Scheduled/background event

2. Intent
   - Confirm action
   - Inform progress
   - Prevent error
   - Recover from error
   - Teach next step

3. Risk level
   - Low: reversible, no data loss
   - Medium: partial disruption
   - High: destructive, security, irreversible

4. Latency band
   - Instant: <= 100ms
   - Short wait: 100-1000ms
   - Long wait: > 1000ms

5. Accessibility impact
   - Focus-sensitive
   - Motion-sensitive
   - Screen-reader critical

## Pattern Selection Rules

### Rule 1: Latency-first feedback

If latency is > 100ms, show a visible progress state.

### Rule 2: Risk drives confirmation

If risk is high, require explicit confirmation and clear recovery instructions.

### Rule 3: Error states require recovery

If an error state exists, include at least one direct recovery action.

### Rule 4: Motion is optional, not required

All motion cues must have non-motion alternatives.

### Rule 5: Focus remains predictable

Do not move focus unless the next action target changes.

## Recommended Pattern Families

- Trigger clarity: `MI-TRIGGER-*`
- Feedback and progress: `MI-FEEDBACK-*`
- Validation and form response: `MI-VALIDATION-*`
- Recovery and retry: `MI-RECOVERY-*`
- Safe destructive actions: `MI-DESTRUCTIVE-*`

## Assembly Order

When writing a micro spec, assemble in this order:

1. Trigger and preconditions
2. Immediate response
3. Progress handling
4. Success state
5. Error state
6. Recovery path
7. Accessibility behavior
8. Telemetry signals
