# Designer Skill

A comprehensive design assistant for product designers and UX research planning.

## Overview

This skill provides AI agents with design context, methodologies, and tools for product design work. It includes SPARK research planning, personas framework, JTBD/CUJ templates, wireframing, heuristic evaluation, OOUX methodology, and UX decision records.

## Who Should Use This

- Product designers
- UX researchers
- Anyone creating wireframes, user flows, or design documentation

## Quick Start

After loading the skill, start any design conversation and the agent will:

1. Display a greeting confirming the skill is active
2. Ask 1-2 clarifying questions (persona, JTBD, constraints)
3. Execute your request

Say `/help` to see all available commands.

## Capabilities

| Capability | Description | Command |
|------------|-------------|---------|
| **Personas** | User/Buyer/Champion framework | `what persona for [X]` |
| **JTBD** | Jobs to be Done statements | `write JTBD for [need]` |
| **CUJ** | Critical User Journeys | `write CUJ for [task]` |
| **Research Plans** | SPARK research plans tied to stage and decisions | `spark research plan for [topic]` |
| **Wireframes** | ASCII wireframes with zones | `wireframe [page]` |
| **User Flows** | Flow diagrams with decisions | `user flow for [task]` |
| **Heuristics** | Nielsen's 10 heuristics evaluation | `evaluate [design]` |
| **OOUX** | Object-Oriented UX (ORCA process) | `OOUX for [product]` |
| **UXDR** | UX Decision Records | `create UXDR` |
| **Microinteractions** | Interaction-level specs and critiques | `micro spec for [scenario]` |
| **Micro shorthand** | Loose micro invocation (defaults to spec) | `micro [request]` |

## Clarifying Questions

By default, the skill asks 1-2 clarifying questions before executing tasks. This is intentional - it helps catch assumptions early and keeps you thinking critically.

**Why this matters**: Designers working with AI assistants can fall into rapid execution without reflection. The questions surface hidden assumptions and reduce costly rework.

**To skip**: Say `skip questions` or `just do it`

## Add-ons

### Microinteractions Expert

Use this add-on for component-level behavior work such as state transitions, feedback timing, validation, and recovery.

```
micro spec for [scenario]
micro critique for [scenario]
micro copy for [scenario]
micro [request]
```

Routing behavior:

- Any request containing `micro`, `micro interaction`, `micro-interaction`, or `microinteraction` routes to `microinteractions-expert`.
- Output type inference:
  - critique/review/audit/evaluate -> `micro critique`
  - copy/text/message/wording -> `micro copy`
  - otherwise -> `micro spec`

Output is source-neutral.

### UI Capture (Browser Automation)

For capturing live website UIs as documentation:

```
help ui capture
```

**Note**: UI capture requires separate browser setup (dev-browser skill). It will NOT auto-start. This is intentional - browser automation should be explicitly requested.

`dev-browser` is Playwright-based.

### HCP Terraform UI Reference

This repo can keep a local clone of `hashicorp/hcp-tf-ui-for-agents` at:

`reference/hcp-tf-ui-for-agents/`

Use it for existing page structures, zone maps, navigation paths, and placement decisions.

Starter prompt:

```
help hcp ui reference
```

Sync command:

```bash
just hcp-ui-ref-sync
```

## Resources

This skill includes reference documentation in the `resources/` folder:

| File | Contents |
|------|----------|
| `personas-frameworks.md` | Personas, JTBD, CUJ formats and examples |
| `wireframing.md` | ASCII wireframe component library |
| `ui-capture-spec.md` | UI capture output format specification |
| `research-synthesis.md` | Research planning, empathy maps, journey maps, personas templates |
| `ooux-methodology.md` | Full ORCA process documentation |
| `interaction-patterns.md` | Navigation, forms, data display patterns |
| `design-systems.md` | Atomic design, tokens, documentation |
| `hcp-tf-ui-reference.md` | Local HCP Terraform UI reference integration |

## Starter Kit

The `starter-kit/` folder contains exercises to learn the skill by working through a design project. Bring your own PRD, RFC, or interview notes.

See `starter-kit/README.md` for details.

## Installation

### Manual Installation

Copy the `hashi-designer/` folder to your skills directory:
- Claude Code: `~/.claude/skills/hashi-designer/`
- OpenCode: `~/.config/opencode/skills/hashi-designer/`
- VS Code: `.github/skills/hashi-designer/`

Or reference it from a `skill/` directory in your project.

## Usage Examples

### Design a new feature

```
User: I need to design a workspace health dashboard

Agent: Before I start, a couple questions:
       - Which persona is this for? (Platform Engineer, App Developer, etc.)
       - What's the main job they're trying to accomplish?

User: Platform Engineer, they need to quickly see which workspaces need attention

Agent: [Creates wireframe with zones, applies design principles]
```

### Write a JTBD

```
User: write JTBD for secret rotation

Agent: 
When managing secrets across multiple environments,
I want to rotate credentials automatically on a schedule
so that I can maintain security compliance without manual intervention.
```

### Create a research plan

```
User: spark research plan for alert routing setup

Agent: Before I draft it, I need:
       - Which stage is this for? (discovery, solution evaluation, design evaluation, MVP testing, beta)
       - What decision should this research inform?

User: Design evaluation. We need to decide what to change before development.

Agent:
Research Plan: Alert Routing Setup

Context
- We need to evaluate whether operators can configure alert routing without external help before we build the setup flow.

Learning goals
1. Identify where the setup flow breaks down.
2. Learn which configuration concepts need clearer labels or defaults.

...
```

### Evaluate a design

```
User: evaluate this settings page design [provides wireframe or description]

Agent: 
# Evaluation: Settings Page

## Findings
| Finding | Severity | Heuristic | Recommendation |
|---------|----------|-----------|----------------|
| No confirmation on destructive action | Major | #5 Error Prevention | Add confirmation modal |
| 12 options visible at once | Minor | #8 Minimalist | Group into sections |
```

### Create a UXDR

```
User: create UXDR for our decision to hide agent names by default

Agent:
# UXDR-001: Hide Agent Names by Default

**Date**: 2025-01-20
**Status**: Proposed

## Context
The integration displays agent activity. Question: should we show 
which specific agent performed each action?

## Decision
Hide agent names by default. Available in expanded debug view.

## Consequences
- (+) Cleaner UI, users don't need to know implementation details
- (+) Consistent with progressive disclosure principle
- (-) Harder to debug which agent had issues (mitigated by debug view)
```

## Extending This Skill

### Add new reference materials

Add markdown files to the `resources/` folder. The skill will reference them.

### Customize for your team

Fork and modify:
- **Personas**: Add your team's specific personas to `personas-frameworks.md`
- **Design principles**: Add product-specific principles
- **Templates**: Add your team's document templates

### Split into separate skills

This skill contains multiple capabilities that could become separate skills:

| Potential Skill | Capability |
|-----------------|------------|
| `personas` | Personas, JTBD, CUJ only |
| `wireframes` | ASCII wireframing only |
| `uxdr` | Decision records only |
| `ooux` | Object-Oriented UX only |

To split: Extract relevant sections from SKILL.md into new skill folders.

## Design Philosophy

This skill embeds several design principles:

1. **Questions before execution** - Clarifying questions catch assumptions early
2. **Personas ground decisions** - Every design should identify its target user
3. **JTBD over features** - Focus on user goals, not product capabilities
4. **Objects before actions** - OOUX: design the nouns, then the verbs
5. **Document decisions** - UXDRs capture rationale for future reference

## Changelog

### 1.1.0
- Added SPARK research planning workflow
- Added research plan examples to the starter kit

### 1.0.0
- Initial release
- Personas, JTBD, CUJ framework
- ASCII wireframing with component library
- Heuristic evaluation
- OOUX methodology
- UXDR templates
- UI capture specification (optional)
