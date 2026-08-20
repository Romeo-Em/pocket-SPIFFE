---
id: MI-TRIGGER-001
family: trigger
name: explicit trigger with immediate acknowledgment
tags: [trigger, acknowledgment, button, form]
---

# MI-TRIGGER-001

## Use when

User initiates a meaningful action and needs immediate acknowledgment.

## Pattern

1. Trigger fires on explicit user action.
2. UI acknowledges within 100ms.
3. Control enters pending state if completion exceeds 100ms.

## Do

- Change control label or visual state immediately.
- Prevent duplicate submissions while pending.
- Keep acknowledgment local to the trigger surface.

## Do not

- Leave control unchanged after activation.
- Hide pending state when operation is non-instant.

## Example skeleton

If user clicks **Save**,
then button state changes to **Saving...**,
then button becomes disabled until completion.
