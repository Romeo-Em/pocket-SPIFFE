# {NNN}. User Journey Map -- {CUJ_NAME}

**Date**: {YYYY-MM-DD}
**Author**: {AUTHOR}
**Status**: Draft | Active | Superseded by {NNN}
**Depends on**: [{Strategy Doc}]
**Grounded in**: [{Reference Manual 1}], [{Reference Manual 2}], [{Meeting Notes}]

**Scope**: <!-- One sentence: what this journey map covers. -->

---

## Personas

| Persona | Role | Category | Mental Model |
|---------|------|----------|--------------|
| {Name} | {Role} | User / Admin / Reviewer | {How they think about the system} |

### {Persona 1}

**Category**: User
**Quote**: "{A real quote or representative statement from meetings.}"

**Context**:
- **Role**: <!-- What they own and what they hand off -->
- **Environment**: <!-- Tools, consoles, workflows they use today -->
- **Frequency**: <!-- How often they do this -->

**Goals**:
- <!-- What they want to achieve -->

**Pain Points**:
- <!-- What breaks or frustrates them today -->

**Design Implications**:
- <!-- What the UI/agent must do to serve this persona -->

---

## Jobs To Be Done

When {circumstance},
I want to {goal},
So that {motivation}.

- **Functional**: {what they need to accomplish}
- **Emotional**: {how they want to feel}
- **Social**: {how they want to be perceived}

---

## Critical User Journeys

**Primary**: As a {persona}, I want to {action} to achieve {goal}
**Supporting 1**: As a {persona}, I want to {action} to achieve {goal}

---

## Journey Stages

<!--
ASCII table format. One row per persona. One column per stage.
Recommended: 120-char column width for terminal readability.
-->

| Stage | 1. {Trigger} | 2. {Discovery} | 3. {Planning} | ... | N. {Outcome} |
|-------|-------------|----------------|---------------|-----|--------------|
| **{Persona 1}** Action | | | | | |
| **{Persona 1}** Tool | | | | | |
| **{Persona 1}** Pain | | | | | |
| **{Persona 2}** Action | | | | | |
| **{Persona 2}** Tool | | | | | |
| **{Persona 2}** Pain | | | | | |

---

## Per-Stage Detail

### Stage 1: {Name}
**User Action**: <!-- What the user does -->
**Agent Action**: <!-- What the system/agent does -->
**Touchpoint**: <!-- UI surface or interface -->
**System Calls**: <!-- APIs or services invoked -->
**Data In**: <!-- What data enters this stage -->
**Data Out**: <!-- What data this stage produces -->
**Validation**: <!-- Checks performed -->
**Failure Mode**: <!-- What can go wrong and how to recover -->
**Duration**: <!-- Expected time -->

<!-- Repeat for each stage -->

---

## Data Flow
<!-- ASCII diagram showing data movement between stages -->

```
{Stage 1} --{data}--> {Stage 2} --{data}--> {Stage 3}
```

---

## Technical Grounding
<!-- Cross-reference claims against reference documentation -->

| Claim | Source | Reference |
|-------|--------|-----------|
| {Technical claim made in a stage} | {Document title} | {Section or page} |

---

## Open Questions
- {Question} -- {context or who can answer}
