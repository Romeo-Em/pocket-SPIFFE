# Pocket Product Designer

A workspace that turns meeting transcripts into interactive wireframe showcases.

```
Transcript -> Meeting Notes -> Strategy -> Journey Map -> PDRs -> Storybook -> Showcase HTML
```

## First Run

```bash
./setup.sh
```

Installs npm dependencies, copies the `hashi-designer`, `microinteractions-expert`, and `commit` skills for Claude Code and OpenCode, configures agents/plugins, bootstraps repo-aware QMD config if `qmd` is installed, and offers optional install of `pbakaus/impeccable` via `npx skills add pbakaus/impeccable`. If setup hasn't been run yet, tell the user: "Run `./setup.sh` first."

After setup, run `just showcase-dev` to see the example showcase (an incident response dashboard). Browse `example/` to see the artifacts that produced it.

---

## Folder Structure

```
pocket-product-designer/
├── CLAUDE.md              <- this file (agent + human instructions)
├── setup.sh               <- run once to install everything
├── justfile               <- task runner (just storybook, just showcase-build, etc.)
│
├── example/               <- complete example project (incident response dashboard)
│   ├── 01.meetings/       <- structured meeting notes
│   ├── 02.strategy/       <- strategy doc + journey map
│   ├── 03.pdrs/           <- PDR chain (architecture -> scenario -> data contracts -> wireframe plan)
│   ├── 04.wireframes/     <- ASCII wireframe specs
│   └── 05.showcases/      <- built single-file HTML demos
│
├── templates/             <- stage templates (read-only, agent uses these)
│   ├── meeting-notes.template.md
│   ├── strategy.template.md
│   ├── journey-map.template.md
│   ├── pdr.template.md
│   └── showcase.template.html
│
├── skill/                 <- skills + reference docs
│   ├── hashi-designer/    <- JTBD, CUJ, personas, OOUX, ASCII wireframe library
│   ├── microinteractions-expert/ <- interaction-level specialist (micro specs + critiques)
│   ├── commit/            <- focused conventional commit workflow
│   └── helios-design-system/  <- HashiCorp design system (tokens, components, patterns)
│
├── storybook/             <- wireframe stories (Storybook 8 + React + Vite)
│   ├── stories/wireframes/    <- story files + fixture data go here
│   └── tokens/                <- design tokens (CSS custom properties)
│
├── showcase/              <- single-file HTML builder (Vite + vite-plugin-singlefile)
│   └── showcases/         <- showcase source files go here
├── reference/             <- synced external reference docs
│   └── hcp-tf-ui-for-agents/ <- HCP Terraform UI IA/layout reference
└── .opencode/             <- local OpenCode skill/agent copies created by setup
```

**Write zones**: `output/`, `storybook/stories/`, `showcase/showcases/`. Everything else is read-only.

`output/` doesn't exist until you produce work. It mirrors the `example/` structure. The agent creates it on first use.

All output files use the naming convention `{NNN}.{YY}.{MM}.{DD}.{Slug}.md` - sequence number, date, descriptive name.

---

## Skill: hashi-designer

Load the `hashi-designer` skill before any design work. It contains:

- **Research plans**: SPARK research plans for discovery, evaluation, MVP, and beta work
- **JTBD**: When [circumstance] / I want to [goal] / So that [motivation]
- **CUJ**: As a [persona] I want to [action] to achieve [goal]
- **Personas**: User / Buyer / Champion archetypes
- **OOUX/ORCA**: Objects, Relationships, CTAs, Attributes
- **ASCII wireframes**: Unicode box-drawing component library
- **Research synthesis**: Empathy maps, journey map templates

Source: `skill/hashi-designer/SKILL.md`. Use `@hashi-designer` or load the skill to activate.

### Skill: microinteractions-expert

Use `microinteractions-expert` for interaction-level behavior details:

- Triggers and state transitions
- Loading, success, warning, and error behavior
- Validation, retry, undo, and recovery behavior
- Timing and accessibility behavior at component level

Commands:

- `micro spec for [scenario]`
- `micro critique for [scenario]`

Source: `skill/microinteractions-expert/SKILL.md`.

### Helios Design System

Before any front-end work, consult `skill/helios-design-system/`. It contains HashiCorp's design system docs - component patterns, design tokens, accessibility requirements (WCAG 2.2 AA), and component APIs.

When building UI: check for existing HDS components first, use HDS tokens instead of hardcoded values, follow HDS accessibility patterns. Custom components should match HDS visual language.

### HCP Terraform UI Reference

Use `reference/hcp-tf-ui-for-agents/` for HCP Terraform information architecture, page zones, and navigation grounding.

Sync command:

```bash
just hcp-ui-ref-sync
```

Setup also syncs this reference automatically.

For live capture workflows, use `help ui capture`. The `dev-browser` skill uses Playwright-based browser automation and requires explicit startup.

Setup checks whether `dev-browser` is installed and reports status. `dev-browser` is a separate skill and is not vendored in this repo.

### Optional QMD Notes Search

If `qmd` is installed, bootstrap or rewrite the repo-aware config with:

```bash
just qmd-bootstrap
```

Refresh the optional notes index after adding, moving, or reorganizing generated artifacts:

```bash
just qmd-refresh
```

`just qmd-refresh` rewrites the `ppd` QMD config before running `update` and `embed`, so it is the default repair step after moving the repo or rebucketing files under `output/`.

---

## Pipeline

### Stage 1-2: Meeting Notes

**Trigger**: Designer pastes a transcript.

1. Load `templates/meeting-notes.template.md`
2. Extract: TL;DR, Key Points, Decisions, Open Questions
3. Preserve the raw transcript verbatim under `## Raw Transcript`
4. Quality gate: every decision in the transcript appears in `## Decisions`
5. Save to `output/01.meetings/{NNN}.{YY}.{MM}.{DD}.{Slug}.md`

### Stage 3: Strategy Synthesis

**Trigger**: Designer says "synthesize" or "strategy", or has 2+ meeting notes on the same topic.

1. Load `templates/strategy.template.md` and hashi-designer skill
2. Synthesize across meetings: scope, personas, CUJ inventory, deliverables
3. Every CUJ must trace to a specific meeting decision
4. Personas must reference real roles from transcripts
5. Quality gate: explicit scope boundaries (what's in, what's out)
6. Save to `output/02.strategy/{NNN}.{YY}.{MM}.{DD}.{Slug}-Strategy.md`

### Stage 4: Journey Map

**Trigger**: Designer says "journey map" or a strategy doc exists with CUJs.

1. Load `templates/journey-map.template.md` and hashi-designer skill
2. Build 10-stage structure: trigger through outcome
3. One row per persona with action, tool, emotional state per stage
4. Technical grounding: real API calls, data objects, system interactions
5. Quality gate: no TBD cells, technical grounding references real APIs
6. Save to `output/02.strategy/{NNN}.{YY}.{MM}.{DD}.{Slug}-JourneyMap.md`

### Stage 5: PDR Chain

**Trigger**: Designer says "PDR" or "design record", or a journey map is complete.

1. Load `templates/pdr.template.md`
2. Follow the PDR type sequence:
   - PDR-001: Architecture (depends on journey map)
   - PDR-002: Scenario (depends on Architecture PDR)
   - PDR-003: JourneyMap data contracts (depends on Scenario PDR)
   - PDR-004: WireframePlan (depends on JourneyMap PDR)
3. Every PDR declares `Depends on:` with links to upstream artifacts. No circular dependencies.
4. Save to `output/03.pdrs/{NNN}.{YY}.{MM}.{DD}.PDR-{Type}-{Subject}.md`

### Stage 6: Storybook Stories

**Trigger**: Designer says "stories" or a WireframePlan PDR exists.

1. Generate `.stories.tsx` from PDR-004 specs and fixture data
2. Stories go in `storybook/stories/wireframes/`, fixture data in co-located `_*-fixtures.ts` files
3. CSF3 format, one story file per component or view
4. Quality gate: every story in PDR-004 has a `.stories.tsx`; stories render without errors

```bash
just storybook    # preview at http://localhost:6007
```

### Stage 7: Showcase Build

**Trigger**: Designer says "showcase" or Storybook stories are complete.

1. Build showcase as a Vite app in `showcase/` using `vite-plugin-singlefile`
2. Dev server for iteration, production build for single-file HTML
3. Quality gate: built HTML opens in a browser with no network requests; all interactions work

```bash
just showcase-dev       # dev server
just showcase-build     # production single-file HTML -> output/05.showcases/
```

---

## PDR System

PDRs form a dependency chain. Each declares what it depends on and what it produces.

**Naming**: `{NNN}.{YY}.{MM}.{DD}.PDR-{Type}-{Subject}.md`

| Type | Purpose | Depends on |
|------|---------|------------|
| Architecture | Design pattern, agent responsibilities, rollback | Journey map |
| Scenario | Concrete interaction script with real payloads | Architecture PDR |
| JourneyMap | Data contracts (TypeScript types), state machine, service map | Scenario PDR |
| WireframePlan | File manifest, fixture data, story specs, QA checklist | JourneyMap PDR |

**Front-matter** (every PDR):
```markdown
# PDR-{NNN}: {Title}
**Status**: Proposed | Active | Implemented | Superseded
**Date**: YYYY-MM-DD
**Author**: {Name}
**Depends on**: [{filename}](relative-link)
```

---

## Quality Gates

Nothing advances without passing its gate.

**Meeting Notes -> Strategy**: Every decision captured, attendee list complete, no unlinked meeting references.

**Strategy -> Journey Map**: CUJs are specific and measurable, personas map to real roles from meetings, scope boundaries explicit.

**Journey Map -> PDR-001**: All 10 stages populated, technical grounding references real APIs, every persona has actions per stage.

**PDR-001 -> PDR-002**: Problem uses JTBD format, design pattern named, agent responsibilities explicit per stage, rollback defined for mutations.

**PDR-002 -> PDR-003**: Environment table specifies exact context, every stage has operator action + agent response, payloads are concrete.

**PDR-003 -> PDR-004**: TypeScript-style type definitions, state machine covers happy path + 2 error paths, service dependencies listed, timing budget complete.

**PDR-004 -> Stories**: File manifest lists every component, fixture data is valid JSON matching contracts, `just storybook` runs clean.

**Stories -> Showcase**: All stories render without errors, `just showcase-build` completes, built HTML works offline.

---

## Build Commands

| Command | What it does |
|---------|-------------|
| `just setup` | First-time setup (runs setup.sh) |
| `just install` | Install npm dependencies |
| `just storybook` | Storybook dev server (port 6007) |
| `just storybook-build` | Static Storybook build |
| `just showcase-dev` | Showcase dev server |
| `just showcase-build` | Production single-file HTML -> output/05.showcases/ |
| `just showcase-preview` | Preview production build |
| `just build` | Build everything |
| `just clean` | Remove build artifacts |
| `just reset` | Clear all output, keep structure |
| `just micro-query "..."` | Retrieve matching microinteraction pattern cards |
| `just micro-lint-no-refs` | Lint microinteraction assets for source-reference policy |
| `just hcp-ui-ref-sync` | Clone/update local HCP Terraform UI reference docs |
| `just qmd-bootstrap` | Generate repo-aware QMD config for optional notes search |
| `just qmd-refresh` | Refresh QMD index after adding or moving output artifacts |

---

## Writing Rules

Apply to every artifact.

- No significance narration ("That mental model matters")
- No setup-then-payoff ("The shortest way to explain it: X. That's not just a convenient analogy.")
- No motivational sign-offs. End with next steps or open questions.
- No dramatic restatement. One clear sentence beats two where the second performs conviction.
- No superlatives that sell. Describe the constraint, don't rank it.
- Avoid unicode em-dash. Use a regular hyphen.

**The test**: does this sentence change what someone would do after reading? If not, cut it.

---

## Quick Start

Tell me one of:
- "I just downloaded this repo" - I'll walk you through setup and first-run checks
- "Here's a transcript from a meeting" - I'll structure it into meeting notes
- "spark research plan for [topic]" - I'll turn partial inputs or a pasted SPARK prompt into a research plan
- "Synthesize these meetings" - I'll build a strategy doc
- "Build a journey map for [CUJ]" - I'll create the 10-stage map
- "Write PDR-001 for [topic]" - I'll start the design record chain
- "Build stories for [wireframe]" - I'll generate Storybook stories
- "Build a showcase for [feature]" - I'll build a single-file HTML showcase
- "micro spec for [scenario]" - I'll generate interaction-level behavior for a component state change
- "help hcp ui reference" - I'll load and use local HCP Terraform UI docs
- "help ui capture" - I'll use Playwright-based browser capture workflow

What are you working on?
