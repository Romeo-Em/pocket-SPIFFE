# Pocket Product Designer (PPD)

Pocket Product Designer is an agent-first workspace that turns meeting transcripts into design artifacts and a reviewable UI showcase.

Core flow:

Transcript -> Meeting Notes -> Strategy -> Journey Map -> PDR Chain -> Wireframe Stories -> Showcase HTML

## What this repo is for

Use this repo when you want to move from raw discussion to concrete product design output with traceability.

It is built for:
- Product designers
- PMs and design leads
- Platform or product teams that need reviewable design artifacts

It is not a generic starter app. It is a guided design-production pipeline.

## Agent-first usage model

This project is meant to be used through an AI coding and design agent.

High-level onboarding flow:
1. Install an agent environment that can read repository instructions.
2. Download this repository and open it as the active workspace.
3. Run the repository setup once.
4. Ask the agent to read the repo and onboard you to PPD.
5. Start with a transcript or an existing set of meeting notes.

If you are onboarding someone new, this single prompt is enough:

"Read this repo and onboard me to PPD."

## New setup guide: VS Code + OpenCode + GitHub Copilot

Use this if you are setting up from scratch.

1. Request GitHub Copilot access (auto-approved):
   - https://next.doormat.hashicorp.services/catalog/corporate-apps/access/github/access/github-copilot-users/new

2. Install Homebrew (if you do not already have it):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. Install OpenCode:

   ```bash
   brew install anomalyco/tap/opencode
   ```

4. Optional external design skill pack:

   ```bash
   npx skills add pbakaus/impeccable
   ```

   This is optional and is not vendored into this repo.

5. Start OpenCode in terminal:

   ```bash
   opencode
   ```

6. Connect OpenCode to GitHub Copilot:
   - Run `/connect`
   - Select `GitHub Copilot`
   - Follow the device auth flow (open the GitHub device page and enter the code shown in terminal)

7. Select a model:
   - Run `/models`
   - Pick a GitHub model

8. Start working in this repo:
    - Open this folder in terminal
    - Run `opencode`
    - Ask: `Read this repo and onboard me to PPD.`

9. Sync bundled reference docs (also done by `./setup.sh`):

    ```bash
    just hcp-ui-ref-sync
    ```

    This keeps a local checkout at `reference/hcp-tf-ui-for-agents/`.

10. Optional VS Code workflow:
   - Open this repo in VS Code
   - Use the integrated terminal to run `opencode` in the repo folder
   - Keep OpenCode running in that terminal while you edit files in VS Code

Notes:
- If terminal theming looks off in your default terminal, try Ghostty or the VS Code integrated terminal.
- Video walkthrough: https://youtu.be/e9j2iEwJru0?si=F1PhuljW_bqyRcZF
- The second half of the video goes deeper than required for first-time setup.

## How to work with the agent

Use natural-language requests that map to pipeline stages.

Typical prompts:
- "Here is a transcript from a meeting"
- "Synthesize these meetings"
- "Build a journey map for [CUJ]"
- "Write PDR-001 for [topic]"
- "Build stories for [wireframe]"
- "Build a showcase for [feature]"
- "help hcp ui reference"
- "help ui capture"

The agent should produce the next valid artifact and keep dependencies intact.

## Pipeline stages

### 1) Meeting Notes
Input: transcript

Output:
- TL;DR
- key discussion points
- decisions and action items
- open questions
- full raw transcript preserved

### 2) Strategy Synthesis
Input: two or more related meeting notes

Output:
- scope boundaries (in and out)
- personas grounded in real roles
- critical user journeys (CUJs)
- technical context
- downstream deliverables plan

### 3) Journey Map
Input: strategy document with CUJs

Output:
- full 10-stage journey
- persona actions by stage
- touchpoints, system calls, data in and out
- failure modes and durations

### 4) PDR Chain
Input: completed journey map

Output sequence:
- PDR-001 Architecture
- PDR-002 Scenario
- PDR-003 JourneyMap Data Contracts
- PDR-004 Wireframe Plan

Each PDR depends on the prior artifact. No circular dependencies.

### 5) Storybook Wireframes
Input: PDR-004

Output:
- wireframe story files
- fixture data files
- one story set per component and view in the plan

### 6) Showcase Build
Input: completed wireframe stories

Output:
- single-file HTML showcase suitable for review

## Repository map (human view)

- `example/` - complete reference project from notes to showcase
- `reference/hcp-tf-ui-for-agents/` - local HCP Terraform UI structure docs (synced from GitHub)
- `templates/` - source templates for each artifact type
- `skill/` - skills and reference methods
- `storybook/` - wireframe stories and tokens
- `showcase/` - assembled narrative showcase
- `output/` - generated artifacts and final HTML outputs

## HCP Terraform UI reference

This repo now integrates `hashicorp/hcp-tf-ui-for-agents` as a local reference.

- Local path: `reference/hcp-tf-ui-for-agents/`
- Sync command: `just hcp-ui-ref-sync`
- Setup behavior: `./setup.sh` clones or fast-forwards this reference

Use it when you need placement decisions grounded in existing HCP Terraform pages and navigation.

Suggested load order for agents:
1. `reference/hcp-tf-ui-for-agents/quick-reference.md`
2. `reference/hcp-tf-ui-for-agents/pages/_index.md`
3. relevant page docs in `reference/hcp-tf-ui-for-agents/pages/*.md`

## Optional QMD notes search

If `qmd` is installed, `./setup.sh` will bootstrap a repo-aware `ppd` index config automatically.

- Bootstrap or rewrite the config for the current checkout: `just qmd-bootstrap`
- Reindex after adding, moving, or reorganizing files in `output/`: `just qmd-refresh`

`just qmd-refresh` rewrites the QMD config before running `update` and `embed`, so it is safe to rerun after relocating the repo or rebucketing generated artifacts.

## Playwright-based UI capture with hashi-designer

Yes - Playwright-based capture should work through the `dev-browser` skill.

- Ask: `help ui capture`
- The capture workflow in `hashi-designer` uses `dev-browser`, which runs Playwright automation.
- Use this for live-page capture; use `reference/hcp-tf-ui-for-agents/` for static documented IA/layout grounding.

Setup note:
- `./setup.sh` checks whether `dev-browser` is installed and prints status.
- `dev-browser` is a separate skill and is not vendored in this repo.

## Skills included

- `hashi-designer` - SPARK research plans, personas, JTBD, CUJs, OOUX, journey and wireframe structure
- `microinteractions-expert` - trigger, feedback, timing, validation, and recovery behavior
- `commit` - focused conventional commit workflow
- `helios-design-system` - design system references for UI implementation and accessibility

## What you can do now with SPARK and QMD

### SPARK research planning through hashi-designer

Use `hashi-designer` when you need a short research plan tied to a product or design decision.

- `spark research plan for [topic]` - create a decision-oriented research plan
- `research plan for [topic]` - same workflow without the SPARK prefix
- Paste the SPARK fill-in prompt directly - the skill will treat it as a research-plan request

What the skill will do:

- ask only for missing inputs
- recommend methods and participant counts when they are missing
- align the plan to the research stage: discovery, solution evaluation, design evaluation, MVP testing, or beta
- produce a short plan with context, learning goals, participant description, method, decision criteria, and a 5-question discussion guide

Example prompts:

```text
spark research plan for alert routing setup
research plan for role-based access onboarding
fill out this SPARK research plan prompt from my inputs
```

### QMD search across generated artifacts

Use QMD when you want to search generated notes and design artifacts by keyword and meaning.

After `just qmd-bootstrap` and `just qmd-refresh`, you can:

- search meeting notes, strategy docs, PDRs, and wireframe notes from one index
- retrieve prior decisions, personas, JTBDs, CUJs, and open questions from `output/`
- rerun indexing safely after moving or renaming generated artifacts

Example commands:

```bash
qmd --index ppd status
qmd --index ppd query $'lex:persona JTBD CUJ\nvec:What did we decide for persona scope?' -c meetings -c strategy -c pdr -n 8 --json
```

## Core commands

- `just setup` - install dependencies, sync skills, sync HCP UI reference, bootstrap QMD when installed
- `just storybook` - run Storybook dev server
- `just showcase-dev` - run showcase dev server
- `just showcase-build` - build single-file HTML showcase
- `just micro-query "..."` - retrieve internal microinteraction patterns
- `just micro-lint-no-refs` - lint microinteraction corpus for source-reference policy
- `just hcp-ui-ref-sync` - clone/update local HCP Terraform UI reference docs
- `just qmd-bootstrap` - generate repo-aware QMD config for optional notes search
- `just qmd-refresh` - refresh the optional QMD index after adding or moving output artifacts

## Optional setup: vector notes search and Gantry delegation

This setup is optional. The default PPD pipeline works without it.

Use this when you want:
- semantic search across generated notes/artifacts
- optional technical cross-checking via Metro (`metro-plus` mode)
- delegated multi-agent coordination via Gantry

### Option A - Vector search for generated PPD artifacts (recommended first)

Use this when your notes are already in `output/` and you want retrieval by meaning.

1. Install QMD (one time):

   ```bash
   npm install -g @tobilu/qmd
   ```

2. Bootstrap the repo-aware QMD config:

   ```bash
   just qmd-bootstrap
   ```

   This writes `~/.config/qmd/ppd.yml` using the current checkout path and ensures the indexed `output/` folders exist.

3. Refresh index and embeddings:

   ```bash
   just qmd-refresh
   ```

   Run `just qmd-refresh` again after moving or renaming files inside `output/`, or after relocating this repo on disk.

4. Run a hybrid query (keyword + semantic):

   ```bash
   qmd --index ppd query $'lex:persona JTBD CUJ\nvec:What did we decide for persona scope?' -c meetings -c strategy -c pdr -n 8 --json
   ```

### Option B - Raw transcript promotion + vector search (advanced)

Use this when you want to drop raw transcripts and auto-promote them into canonical notes before indexing.

High-level steps:
1. Reuse `notesctl` from the Z tooling (`z/devtools/scripts/notesctl.py`).
2. Create a `notesctl` profile that points to this PPD repo as `workspace_root`.
3. Configure raw inputs + canonical output policy in that profile.
4. Run `notesctl run --profile <your-profile>` to promote + index + embed.
5. If you only reorganized canonical notes or PDR folders, run `notesctl index --profile <your-profile>` instead of rerunning promotion.

Reference profile structure:
- `z/devtools/config/notesctl.profiles.json`

### Option C - Gantry delegation runbook (MCP + prompts)

Use this when you want agents to coordinate work by role and task.

1. Install/start Gantry and NATS from the `z/gantry` workspace.
2. Add Gantry MCP to your agent config using command: `gantry mcp`.
3. Optional: add Metro MCP endpoint `https://localhost:8400/mcp` for `metro-plus` cross-checking.
4. In agent chat, use orchestration prompts such as:
   - `Start a Gantry session as ops for PPD pipeline orchestration.`
   - `Create pipeline tasks for design role: meeting notes -> strategy -> journey -> PDR -> stories -> showcase.`
   - `Claim the next pending design task, complete it, and report output paths.`

### Prompt routing phrases (for teams)

- `Use notes mode` - QMD evidence from notes/artifacts only.
- `Use metro-plus mode` - notes/artifacts + Metro/manual technical validation.

## Where new work should be written

Write zones:
- `output/`
- `storybook/stories/`
- `showcase/showcases/`

Everything else should be treated as source or reference material.

## Quality gates (what done means)

An artifact is done only when its gate passes:

- Meeting Notes: decisions fully captured, attendees complete, transcript preserved.
- Strategy: CUJs are specific and grounded, scope is explicit.
- Journey Map: all stages complete, technically grounded, no placeholder cells.
- PDR-001: architecture and rollback model are explicit.
- PDR-002: stage script includes concrete operator action and agent response.
- PDR-003: data contracts, state machine, service map, and timing budget are complete.
- PDR-004: file manifest, fixtures, story specs, and QA checklist are complete.
- Stories: all planned stories render cleanly.
- Showcase: final HTML works as a standalone artifact.

## Naming convention for generated docs

Generated artifact filenames follow this pattern:

`{NNN}.{YY}.{MM}.{DD}.{Slug}`

This keeps chronology and dependencies readable.

## Suggested onboarding path for a new teammate

1. Ask the agent to onboard you to the repo.
2. Read the `example/` artifacts in pipeline order.
3. Ask the agent to explain how each artifact depends on the previous one.
4. Give the agent one short transcript and ask it to generate Stage 1 output.
5. Continue through Stage 4 (PDR-001) before creating stories.
6. Build one end-to-end mini showcase.

Outcome target: produce one complete artifact chain from transcript to standalone HTML without breaking dependency order.
