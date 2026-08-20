# Design Bootstrap Pipeline — Task Runner

# First-time setup: install deps, install skill, configure agent
setup:
    chmod +x setup.sh && ./setup.sh

# Install dependencies for all buildable packages
install:
    cd storybook && npm install
    cd showcase && npm install

# Run wireframe Storybook (port 6007)
storybook:
    cd storybook && npm run storybook

# Build Storybook static site
storybook-build:
    cd storybook && npm run build-storybook

# Run showcase dev server
showcase-dev:
    cd showcase && npm run dev

# Build showcase to single-file HTML and copy to output archive
showcase-build:
    cd showcase && npm run build
    mkdir -p output/05.showcases
    cp showcase/dist/*.html output/05.showcases/

# Preview built showcase
showcase-preview:
    cd showcase && npm run preview

# Build everything
build: storybook-build showcase-build

# Clean build artifacts
clean:
    rm -rf storybook/storybook-static showcase/dist

# Reset output — remove all pipeline artifacts and wireframe stories (keeps WireframeChrome.tsx)
reset:
    rm -rf output
    find storybook/stories/wireframes -type f ! -name 'WireframeChrome.tsx' -delete 2>/dev/null || true
    @echo "Output cleared."

# Query internal microinteraction patterns
micro-query terms:
    python3 skill/microinteractions-expert/scripts/query.py --q "{{terms}}" --k 5 --format prompt

# Enforce no external references in microinteraction assets
micro-lint-no-refs:
    python3 skill/microinteractions-expert/scripts/lint_no_refs.py

# Clone or update local HCP Terraform UI reference docs
hcp-ui-ref-sync:
	@if [ ! -d reference ]; then mkdir -p reference; fi
	@if [ ! -d reference/hcp-tf-ui-for-agents/.git ]; then \
		git clone https://github.com/hashicorp/hcp-tf-ui-for-agents.git reference/hcp-tf-ui-for-agents; \
	else \
		git -C reference/hcp-tf-ui-for-agents pull --ff-only; \
	fi

# Generate repo-aware QMD config for optional notes search
qmd-bootstrap:
    chmod +x scripts/qmd-bootstrap.sh && ./scripts/qmd-bootstrap.sh

# Refresh QMD index + embeddings after adding, moving, or reorganizing output artifacts
qmd-refresh:
    chmod +x scripts/qmd-refresh.sh && ./scripts/qmd-refresh.sh
