---
name: commit
description: Stage and commit focused changes using small, conventional commits without AI branding.
metadata:
    harness: opencode
    skill_class: edit
    source: skills-src/commit
---

<!-- GENERATED FILE: do not edit directly. Source: skills-src/commit/ -->
<!-- Harness: opencode -->
<!-- SkillClass: edit -->

# Commit

Stage and commit focused changes using small, conventional commits without AI branding.

## Harness Notes

- Optimized for OpenCode harness execution and inline skill dispatch.

## Triggers

- User asks to commit current work
- User asks to stage and commit changes

## Intent

Stage and commit the current changes using small, focused conventional commits without AI branding. Groups related changes into logical units, stages selectively, and handles pre-commit hook failures.

## Workflow

### Assess changes

1. Run `git status` (never use `-uall`) and `git diff --stat` to understand what changed.
2. Group related changes into logical commits. Each commit should represent one coherent change - a single feature, a bug fix, a refactor, a test addition, a doc update. If the working tree contains unrelated changes, commit them separately.

### Stage selectively

- Stage specific files by name. Never use `git add -A` or `git add .`.
- Do not stage files that contain secrets (`.env`, credentials, tokens).
- Group source + tests for the same feature into one commit.
- Keep generated files (dist/, build artifacts) in their own commit if needed.

### Write the commit message

**Format:** `type(scope): short description`

**Types:**

| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `refactor` | Code restructuring, no behavior change |
| `chore` | Build, deps, config, tooling |
| `style` | Formatting, whitespace, linting fixes |
| `perf` | Performance improvement |

**Scope:** The project or area changed - `hmc-sim`, `iocp-sim`, `z-tf-expert`, `z-manuals-kb`, `devtools`, `web`, `demo-app`, `z-memory`, `zdnn-sim`. Use the repo root directory name. For cross-project changes, omit scope or use `repo`.

**Use HEREDOC for the message:**

```bash
git commit -m "$(cat <<'EOF'
type(scope): short description

Optional body explaining why, not what.
EOF
)"
```

### Handle pre-commit hook failures

When hooks fail:

1. Read the error output
2. Fix the issue (formatting, lint, etc.)
3. Re-stage the fixed files
4. Create a NEW commit - do NOT amend the previous commit (the failed commit never happened)

### Multiple logical changes

If the diff contains unrelated changes, make multiple commits in order:

1. Stage the first logical group, commit
2. Stage the next group, commit
3. Repeat until the working tree is clean

Prefer 2-3 small commits over 1 large commit. Each should pass pre-commit hooks independently.

## Constraints

- Subject line under 72 characters
- Imperative mood ("add", "fix", "update", not "added", "fixed", "updated")
- No period at the end of the subject line
- Body is optional - add one only if the "why" isn't obvious from the subject
- Do NOT include `Co-Authored-By`, AI branding, or attribution lines
- Do NOT use `--no-verify` to skip pre-commit hooks
- Do not stage files that contain secrets
- Keep unrelated changes in separate commits

## Examples

```
feat(hmc-sim): add NVMe storage group creation from IOCP
fix(iocp-sim): handle VCHID-based ISM functions in parser
test(web): add Playwright tests for CPC detail panel
docs(devtools): update coordination guide with ux-coord role
refactor(z-tf-expert): extract prompt builder into separate module
chore(repo): update pre-commit hook versions
style(demo-app): fix eslint warnings in topology components
```
