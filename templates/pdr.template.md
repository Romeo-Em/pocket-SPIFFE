# PDR-{NNN}: {Title}

**Status**: Proposed
**Date**: {YYYY-MM-DD}
**Author**: {Name}
**Depends on**: [{upstream PDR or Journey Map}]

## Problem Statement
<!-- Use JTBD format. Who has the problem, what triggers it, what's broken today. -->

---
<!-- Include sections based on PDR type. Delete unused sections. -->

<!-- ========================================== -->
<!-- === ARCHITECTURE TYPE                  === -->
<!-- ========================================== -->

## Design Pattern
<!-- High-level architectural approach. What pattern does this follow and why? -->

## Journey Flow
<!-- How the user moves through the system. Reference journey map stages. -->

## Editability Model
<!-- What the user can change, when, and how changes propagate. -->

## Agent Responsibilities vs. User Decisions
<!-- What the agent does automatically vs. what requires explicit user choice. -->

## Rollback Model
<!-- How to undo. What's reversible, what isn't, and what the user sees. -->

## Specialist Review Hooks
<!-- Where async review can be injected. What reviewers see. -->

## Scope
<!-- What this PDR covers and explicitly does not cover. -->

<!-- ========================================== -->
<!-- === SCENARIO TYPE                      === -->
<!-- ========================================== -->

## Environment
<!-- System state, running services, preconditions. -->

## Stage-by-Stage Script
<!-- For each stage: operator action, agent response, data payloads. -->

### Stage {N}: {Name}
**Operator**: <!-- What the operator does or says -->
**Agent**: <!-- What the agent does in response -->
**Data**: <!-- Payloads, API calls, state changes -->

<!-- ========================================== -->
<!-- === JOURNEYMAP TYPE                    === -->
<!-- ========================================== -->

## Journey Overview
<!-- Summary of the end-to-end journey this PDR specifies. -->

## Full Journey Map (Data Contracts)
<!-- Per-stage data: inputs, outputs, services, validations. -->

## State Machine
<!-- Plan/object states and allowed transitions. -->

## Service Dependency Map
<!-- Which services are called at each stage. -->

## Timing Budget
<!-- Expected duration per stage and end-to-end. -->

## Bridging Data Contract
<!-- Values that must be consistent across system boundaries. -->

<!-- ========================================== -->
<!-- === WIREFRAMEPLAN TYPE                 === -->
<!-- ========================================== -->

## Design Constraints
<!-- Layout rules, accessibility, responsive behavior. -->

## File Manifest
<!-- List of files this PDR produces. -->

## Shared Fixtures
<!-- Test data, mock states, shared constants. -->

## Story Specifications
<!-- Per-story requirements for implementation. -->

## Storybook Conventions
<!-- Naming, organization, interaction patterns. -->

## QA Checklist
<!-- What to verify before shipping. -->

---

## Open Questions
<!-- Unresolved items. Tag who can answer. -->
- {Question} -- {owner}

## Related Documents
<!-- Links to upstream and downstream artifacts. -->
- [{Document title}]({path})
