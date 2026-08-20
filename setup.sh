#!/usr/bin/env bash
set -euo pipefail

cat << 'ART'

      /\_/\  ___
     ( o.o ) |  \~  Pocket Product Designer
      > ^ <  |__/   Transcripts in, design artifacts out.
     /|   |\
    (_|   |_)

ART

echo "Setting up Pocket Product Designer..."
echo ""

# 1. Install npm dependencies
echo "Installing npm dependencies..."
cd "$(dirname "$0")"
(cd storybook && npm install)
(cd showcase && npm install)
echo "✓ Dependencies installed"
echo ""

# 2. Install design skills for Claude Code
SKILL_SOURCE="skill/hashi-designer"
CLAUDE_SKILL_DIR="$HOME/.claude/skills/hashi-designer"
MICRO_SKILL_SOURCE="skill/microinteractions-expert"
CLAUDE_MICRO_SKILL_DIR="$HOME/.claude/skills/microinteractions-expert"
COMMIT_SKILL_SOURCE="skill/commit"
CLAUDE_COMMIT_SKILL_DIR="$HOME/.claude/skills/commit"

if [ -d "$HOME/.claude" ]; then
    echo "Installing hashi-designer skill for Claude Code..."
    rm -rf "$CLAUDE_SKILL_DIR"
    mkdir -p "$CLAUDE_SKILL_DIR"
    cp -r "$SKILL_SOURCE"/* "$CLAUDE_SKILL_DIR"/
    echo "✓ Skill installed to $CLAUDE_SKILL_DIR"

    echo "Installing microinteractions-expert skill for Claude Code..."
    rm -rf "$CLAUDE_MICRO_SKILL_DIR"
    mkdir -p "$CLAUDE_MICRO_SKILL_DIR"
    cp -r "$MICRO_SKILL_SOURCE"/* "$CLAUDE_MICRO_SKILL_DIR"/
    echo "✓ Skill installed to $CLAUDE_MICRO_SKILL_DIR"

    echo "Installing commit skill for Claude Code..."
    rm -rf "$CLAUDE_COMMIT_SKILL_DIR"
    mkdir -p "$CLAUDE_COMMIT_SKILL_DIR"
    cp -r "$COMMIT_SKILL_SOURCE"/* "$CLAUDE_COMMIT_SKILL_DIR"/
    echo "✓ Skill installed to $CLAUDE_COMMIT_SKILL_DIR"
else
    echo "⏭ Claude Code not detected, skipping skill install"
fi
echo ""

# 3. Install design skills for OpenCode
OPENCODE_SKILL_DIR=".opencode/skills/hashi-designer"
OPENCODE_MICRO_SKILL_DIR=".opencode/skills/microinteractions-expert"
OPENCODE_COMMIT_SKILL_DIR=".opencode/skills/commit"
OPENCODE_AGENT_DIR=".opencode/agents"

echo "Installing hashi-designer, microinteractions-expert, and commit skills for OpenCode..."
rm -rf "$OPENCODE_SKILL_DIR"
rm -rf "$OPENCODE_MICRO_SKILL_DIR"
rm -rf "$OPENCODE_COMMIT_SKILL_DIR"
mkdir -p "$OPENCODE_SKILL_DIR"
mkdir -p "$OPENCODE_MICRO_SKILL_DIR"
mkdir -p "$OPENCODE_COMMIT_SKILL_DIR"
mkdir -p "$OPENCODE_AGENT_DIR"
cp -r "$SKILL_SOURCE"/* "$OPENCODE_SKILL_DIR"/
cp -r "$MICRO_SKILL_SOURCE"/* "$OPENCODE_MICRO_SKILL_DIR"/
cp -r "$COMMIT_SKILL_SOURCE"/* "$OPENCODE_COMMIT_SKILL_DIR"/
cp "$SKILL_SOURCE/agent.md" "$OPENCODE_AGENT_DIR/hashi-designer.md"
cp "$MICRO_SKILL_SOURCE/agent.md" "$OPENCODE_AGENT_DIR/microinteractions-expert.md"
echo "✓ Skill installed to $OPENCODE_SKILL_DIR"
echo "✓ Skill installed to $OPENCODE_MICRO_SKILL_DIR"
echo "✓ Skill installed to $OPENCODE_COMMIT_SKILL_DIR"
echo "✓ Agent config installed to $OPENCODE_AGENT_DIR/hashi-designer.md"
echo "✓ Agent config installed to $OPENCODE_AGENT_DIR/microinteractions-expert.md"

# Keep default design agent wired to hashi-designer instructions
cp "$SKILL_SOURCE/agent.md" "$OPENCODE_AGENT_DIR/designer.md"
echo "✓ Agent config installed to $OPENCODE_AGENT_DIR/designer.md"
echo ""

# 4. Optional add-on: install external skill pack
echo "Optional add-on: pbakaus/impeccable"

if [ "${INSTALL_IMPECCABLE:-}" = "1" ]; then
    INSTALL_IMPECCABLE_CHOICE="y"
elif [ "${INSTALL_IMPECCABLE:-}" = "0" ]; then
    INSTALL_IMPECCABLE_CHOICE="n"
elif [ -t 0 ]; then
    read -r -p "Install optional skill pack with 'npx skills add pbakaus/impeccable'? [y/N] " INSTALL_IMPECCABLE_CHOICE
else
    INSTALL_IMPECCABLE_CHOICE="n"
fi

if [[ "${INSTALL_IMPECCABLE_CHOICE:-n}" =~ ^[Yy]$ ]]; then
    if command -v npx >/dev/null 2>&1; then
        if npx skills add pbakaus/impeccable; then
            echo "✓ Optional skill pack installed"
        else
            echo "⚠ Optional skill pack install failed"
            echo "  Run manually: npx skills add pbakaus/impeccable"
        fi
    else
        echo "⏭ npx not found, skipping optional skill pack install"
        echo "  Run after Node.js/npm install: npx skills add pbakaus/impeccable"
    fi
else
    echo "⏭ Skipping optional skill pack install"
    echo "  To install later, run: npx skills add pbakaus/impeccable"
fi
echo ""

# 5. Check Playwright browser-capture support (dev-browser skill)
echo "Checking Playwright browser-capture support..."
if [ -d "$HOME/.claude/skills/dev-browser" ] || [ -d "$HOME/.config/opencode/skills/dev-browser" ]; then
    echo "✓ dev-browser skill detected (available for 'help ui capture')"
else
    echo "⏭ dev-browser skill not detected"
    echo "  Install separately to enable Playwright capture workflows"
fi
echo ""

# 6. Install sound plugin for OpenCode (Glass on completion, Pop on subagent)
OPENCODE_CONFIG_DIR="$HOME/.config/opencode"
OPENCODE_PLUGINS_DIR="$OPENCODE_CONFIG_DIR/plugins"

echo "Installing OpenCode sound plugin..."
mkdir -p "$OPENCODE_PLUGINS_DIR"
cp .opencode/plugins/sound.js "$OPENCODE_PLUGINS_DIR/sound.js"

# Ensure @opencode-ai/plugin dependency is installed
if [ ! -f "$OPENCODE_CONFIG_DIR/package.json" ]; then
    echo '{ "dependencies": { "@opencode-ai/plugin": "1.2.15" } }' > "$OPENCODE_CONFIG_DIR/package.json"
fi
(cd "$OPENCODE_CONFIG_DIR" && npm install --silent 2>/dev/null || bun install --silent 2>/dev/null || true)
echo "✓ Sound plugin installed (Glass = main completion, Pop = subagent)"
echo ""

# 7. Sync local HCP Terraform UI reference docs
HCP_UI_REF_REPO="https://github.com/hashicorp/hcp-tf-ui-for-agents.git"
HCP_UI_REF_DIR="reference/hcp-tf-ui-for-agents"

echo "Syncing HCP Terraform UI reference docs..."
mkdir -p reference

if command -v git >/dev/null 2>&1; then
    if [ -d "$HCP_UI_REF_DIR/.git" ]; then
        if git -C "$HCP_UI_REF_DIR" pull --ff-only; then
            echo "✓ Updated $HCP_UI_REF_DIR"
        else
            echo "⚠ Could not update $HCP_UI_REF_DIR"
            echo "  Run manually: just hcp-ui-ref-sync"
        fi
    else
        if [ -d "$HCP_UI_REF_DIR" ] && [ -n "$(ls -A "$HCP_UI_REF_DIR" 2>/dev/null || true)" ]; then
            echo "⚠ $HCP_UI_REF_DIR exists and is not a git checkout"
            echo "  Move/remove it, then run: just hcp-ui-ref-sync"
        else
            rm -rf "$HCP_UI_REF_DIR"
            if git clone "$HCP_UI_REF_REPO" "$HCP_UI_REF_DIR"; then
                echo "✓ Cloned $HCP_UI_REF_DIR"
            else
                echo "⚠ Could not clone $HCP_UI_REF_REPO"
                echo "  Run manually: just hcp-ui-ref-sync"
            fi
        fi
    fi
else
    echo "⏭ git not found, skipping HCP Terraform UI reference sync"
    echo "  Install git and run: just hcp-ui-ref-sync"
fi
echo ""

# 8. Bootstrap optional QMD notes-search config
echo "Checking optional QMD notes-search bootstrap..."
if command -v qmd >/dev/null 2>&1; then
    if chmod +x scripts/qmd-bootstrap.sh && ./scripts/qmd-bootstrap.sh; then
        echo "✓ QMD profile bootstrapped for this checkout"
    else
        echo "⚠ QMD profile bootstrap failed"
        echo "  Run manually: just qmd-bootstrap"
    fi
else
    echo "⏭ qmd not found, skipping optional notes-search bootstrap"
    echo "  Install later: npm install -g @tobilu/qmd"
    echo "  Then run: just qmd-bootstrap"
fi
echo ""

# 9. Verify
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Open this folder in Claude Code or OpenCode"
echo "  2. The agent will read CLAUDE.md automatically"
echo "  3. Paste a meeting transcript to get started"
echo ""
echo "Try these commands:"
echo "  just setup            # Install deps + skills + HCP UI reference"
echo "  just storybook        # See the golden example wireframes (port 6007)"
echo "  just showcase-dev     # See the golden example showcase"
echo "  just showcase-build   # Build single-file HTML"
echo "  just micro-query \"loading error retry\""
echo "  just micro-lint-no-refs"
echo "  just hcp-ui-ref-sync  # Sync local HCP Terraform UI docs"
echo "  just qmd-bootstrap    # Generate repo-aware QMD config"
echo "  just qmd-refresh      # Reindex after adding or moving output artifacts"
echo "  npx skills add pbakaus/impeccable   # Optional external design skill pack"
echo ""
echo "Capture note:"
echo "  - Playwright capture uses dev-browser skill (install separately if missing)"
