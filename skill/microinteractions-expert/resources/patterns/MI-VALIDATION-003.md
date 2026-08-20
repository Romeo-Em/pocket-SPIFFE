---
id: MI-VALIDATION-003
family: validation
name: inline validation with corrective guidance
tags: [validation, forms, error, inline]
---

# MI-VALIDATION-003

## Use when

Input rules are known at entry time and correction can happen in place.

## Pattern

1. Validate on blur or submit, based on field risk.
2. Mark invalid field with text guidance.
3. Move focus to first invalid field on submit.

## Do

- Describe correction needed, not just that input is invalid.
- Keep message near the field.
- Clear error state as soon as input becomes valid.

## Do not

- Depend on color alone for invalid state.
- Show generic "invalid input" without action guidance.

## Example message

"Enter a valid email address, for example name@company.com"
