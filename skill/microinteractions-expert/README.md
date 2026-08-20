# microinteractions-expert

Interaction-level design skill.

Creates implementation-ready micro specs and targeted critiques for triggers, feedback, timing, transitions, recovery, and accessibility behavior.

## Quick Start

1. Use one of:
   - `micro spec for [scenario]`
   - `micro critique for [scenario]`
   - `micro copy for [scenario]`
   - `micro [request]` (shorthand; defaults to spec)
2. Provide:
   - surface/component
   - user goal
   - trigger
   - constraints
   - accessibility expectations
3. Review assumptions, then apply the output to your design artifact.

Loose invocation is supported. Any request that starts with `micro` or includes `micro interaction`, `micro-interaction`, or `microinteraction` will be handled.

Output type inference:
- critique/review/audit/evaluate -> `micro critique`
- copy/text/message/wording -> `micro copy`
- otherwise -> `micro spec`

## Command Examples

### Create a spec

```
micro spec for async save on settings form
```

### Critique an existing behavior

```
micro critique for destructive action confirmation in team settings
```

### Draft state copy

```
micro copy for permission-denied on invite flow
```

### Use shorthand

```
micro chat UI agent does long-running work include states transitions and ascii
```

### Retrieve relevant patterns

```
micro query loading progress + retry
```

## Corpus Model

The skill uses a local microinteraction corpus:

- `resources/patterns/` for reusable pattern cards
- `resources/playbooks/` for common scenarios
- `resources/ontology.md` for decision mapping
- `resources/index.json` for retrieval

Outputs are source-neutral. They do not include external names or references.

## Development Commands

From repository root:

```bash
just micro-query "inline validation error recovery"
just micro-lint-no-refs
```
