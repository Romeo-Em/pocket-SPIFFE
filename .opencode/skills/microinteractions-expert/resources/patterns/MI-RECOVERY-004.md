---
id: MI-RECOVERY-004
family: recovery
name: bounded retry with explicit fallback
tags: [recovery, retry, error, fallback]
---

# MI-RECOVERY-004

## Use when

Temporary failures are expected and retry can succeed without new input.

## Pattern

1. Present failure reason in user language.
2. Offer retry action with bounded attempts.
3. Provide fallback path after retry limit.

## Do

- Preserve user work during retry.
- Expose next best action after retries fail.
- Log failure category for diagnostics.

## Do not

- Auto-retry indefinitely.
- Force users to restart entire flow after transient errors.

## Example flow

Try again (up to 2 retries) -> if still failing, offer "Save draft" or "Contact support".
