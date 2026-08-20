---
id: MI-FEEDBACK-002
family: feedback
name: progressive feedback for async actions
tags: [feedback, loading, success, error, async]
---

# MI-FEEDBACK-002

## Use when

Action duration can exceed 300ms or completion time is variable.

## Pattern

1. Show immediate local acknowledgment.
2. Show progress state if operation continues.
3. End with success or error state tied to the trigger context.

## Do

- Keep progress near the initiating control.
- Use concise state copy.
- Preserve user input on failure where possible.

## Do not

- Use global toast as the only feedback channel.
- Clear form state before success is confirmed.

## Example state copy

- Loading: "Saving changes..."
- Success: "Changes saved"
- Error: "Save failed. Try again."
