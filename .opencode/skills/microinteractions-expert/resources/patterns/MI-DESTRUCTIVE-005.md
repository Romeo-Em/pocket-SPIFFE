---
id: MI-DESTRUCTIVE-005
family: destructive
name: two-step confirmation with safe off-ramp
tags: [destructive, confirmation, undo, risk]
---

# MI-DESTRUCTIVE-005

## Use when

Action can delete, revoke, or irreversibly mutate important data.

## Pattern

1. Require explicit confirmation with clear action naming.
2. Delay commit until confirmation is complete.
3. Provide undo window when technically possible.

## Do

- Name object and consequence in confirmation text.
- Default focus to cancel or safest option.
- Use high-contrast, non-ambiguous action labels.

## Do not

- Use vague labels like "Continue" for destructive actions.
- Hide destructive action among low-risk controls.

## Example labels

- Primary: "Delete workspace"
- Secondary: "Cancel"
