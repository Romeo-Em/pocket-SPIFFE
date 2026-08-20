# Playbook: Inline Validation

## Scenario

User completes form fields with known constraints.

## Baseline behavior

1. Validate high-risk fields on blur.
2. Validate all fields on submit.
3. Move focus to first invalid field.

## Failure handling

- Keep user input in place.
- Show actionable guidance for correction.

## Recommended patterns

- `MI-VALIDATION-003`
- `MI-TRIGGER-001`
