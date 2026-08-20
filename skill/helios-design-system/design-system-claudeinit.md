# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Helios Design System (HDS) provides the building blocks to design and implement consistent, accessible, and delightful product experiences across HashiCorp. This is a pnpm monorepo built with Ember.js and TypeScript.

## Technology Stack

- **Frontend Framework**: Ember.js (Octane edition), Glimmer
- **Languages**: TypeScript, JavaScript, SCSS, Handlebars
- **Testing**: QUnit, Ember Testing, Percy (visual regression)
- **Build**: Rollup, pnpm workspaces
- **Styling**: Sass, BEM methodology
- **Linting**: ESLint, Stylelint, Prettier, ember-template-lint
- **Type Checking**: Glint (TypeScript for Glimmer templates)

## Essential Commands

### Development

```bash
# Install dependencies
pnpm install

# Start showcase development server (builds components first)
cd showcase && pnpm start

# Build components package
pnpm -F @hashicorp/design-system-components build

# Watch mode for components (development)
pnpm -F @hashicorp/design-system-components start

# Format all code
pnpm format

# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Testing

```bash
# Run all tests from showcase (includes building components)
cd showcase && pnpm test

# Run Ember tests only
cd showcase && pnpm test:ember

# Run accessibility audit tests
cd showcase && pnpm test:a11y

# Run Percy visual regression tests
cd showcase && pnpm test:ember:percy

# Run specific component tests (from showcase root)
ember test --filter="<component-name>"
```

### Working with Packages

```bash
# Add dependency to a specific package
pnpm -F <workspace-npm-package> add --dev <npm-package>

# Example: Add to components package
pnpm -F @hashicorp/design-system-components add --dev ember-cli-flash

# Run ember install in monorepo
pnpm -F <workspace-npm-package> run ember install <npm-package>
```

### Changesets

Create a changeset for all user-facing changes:

```bash
pnpm changeset
```

Follow the prompts to select affected packages and describe changes. To skip a bump level in the CLI (e.g., skip major bump), press return. Press spacebar to select.

## Monorepo Structure

### Core Packages

- **`packages/components/`** - Main Ember component library (`@hashicorp/design-system-components`)
  - Components: `packages/components/src/components/hds/`
  - Styles: `packages/components/src/styles/components/`
  - Exports: `packages/components/src/components.ts`
  - Template registry: `packages/components/src/template-registry.ts`

- **`packages/tokens/`** - Design tokens (`@hashicorp/design-system-tokens`)
  - CSS variables: `packages/tokens/dist/products/css/tokens.css`

- **`packages/flight-icons/`** - Icon library (`@hashicorp/flight-icons`)

- **`packages/codemods/`** - Code transformation utilities

### Applications

- **`showcase/`** - Component playground and test environment
  - Components showcase: `showcase/app/components/page-components/`
  - Page templates: `showcase/app/templates/page-components/`
  - Tests: `showcase/tests/`
    - Acceptance: `showcase/tests/acceptance/components/hds/`
    - Integration: `showcase/tests/integration/components/hds/`
  - Percy config: `showcase/tests/acceptance/percy-test.js`

- **`website/`** - Documentation site (helios.hashicorp.design)

## Component Development

### File Structure

Each component requires:
- `index.ts` - Main component class export
- `index.hbs` - Handlebars template (or `.gts` for template-tag format)
- `types.ts` - TypeScript interfaces for args and blocks

Subcomponents follow the same pattern with their own files.

### Naming Conventions

**Class names** use BEM methodology with `hds-<component-name>` prefix:
- Block: `hds-button`
- Element: `hds-button__icon`
- Modifier: `hds-button--size-large`

**Arguments** use camelCase and optional syntax:
```typescript
interface Args {
  color?: string;
  isDisabled?: boolean;
}
```

### CSS and Design Tokens

- Use CSS variables from `@hashicorp/design-system-tokens`
- Reference tokens like `var(--token-color-foreground-primary)`
- Avoid hardcoded colors, typography, elevation, or border-radius values
- Styles go in `packages/components/src/styles/components/`

### Component Registration

After creating a component:

1. Export in `packages/components/src/components.ts`:
```typescript
export { default as HdsButton } from './components/hds/button/index.gts';
export * from './components/hds/button/types.ts';
```

2. Register in `packages/components/src/template-registry.ts`:
```typescript
import type HdsButtonComponent from './components/hds/button';

export default interface HdsComponentsRegistry {
  'Hds::Button': typeof HdsButtonComponent;
  'hds/button': typeof HdsButtonComponent;
}
```

## Testing Requirements

### Integration Tests

Location: `showcase/tests/integration/components/hds/<component-name>/index-test.js`

Must test:
- Component renders with correct CSS class
- All arguments with all possible values
- All blocks in the Blocks interface
- All functions and keyboard interactions

### Acceptance Tests

Location: `showcase/tests/acceptance/components/hds/<component-name>.js`

Must include:
- `allyAudit()` call for accessibility checks

### Percy Visual Regression

Add component snapshots to `showcase/tests/acceptance/percy-test.js`:
```javascript
percySnapshot('ComponentName');
```

## Showcase Pages

Location: `showcase/app/components/page-components/<component-name>/`

Structure:
- `index.gts` - Main showcase page component
- `sub-sections/<name>.gts` - Sections of the showcase
- `code-fragments/<name>.gts` - Reusable examples

Each showcase should demonstrate:
- All available argument values (e.g., boolean true/false, all enum values)
- All available blocks
- All interactive states (hover, focus, active, disabled)

Use arrow functions for event handlers, not `@action` decorator.

Template file location: `showcase/app/templates/page-components/<component-name>.gts`

Add route to `showcase/app/router.ts`:
```typescript
this.route('component-name');
```

## Changeset Format

Template for `.changeset/*.md` files:

```markdown
<!-- START components/path -->
`ComponentName` - Fixed/Added/Changed description here.
<!-- END -->
```

Terminology:
- **Bugfix**: "Fixed"
- **New feature**: "Added"
- **Update**: "Changed", "Refactored"
- **Removal**: "Removed"

Use backticks around component/token names. Write in past tense with complete sentences.

## Converting Components to GTS

Recent work has focused on converting components from `.hbs` + `.ts` to `.gts` (template-tag) format. When converting:

1. Combine template and class into single `.gts` file
2. Update imports in `components.ts` to reference `.gts` instead of `.ts`
3. Ensure all file imports include extensions (`.ts`, `.gts`)
4. Maintain all existing functionality and tests

## Key Constraints

- **Node version**: >= 24
- **pnpm version**: >= 10.0.0
- **Package manager**: pnpm only (enforced by packageManager field)
- **Ember edition**: Octane
- **License**: MPL-2.0

## Documentation

- Public docs: https://helios.hashicorp.design
- Release notes: https://helios.hashicorp.design/whats-new/release-notes
- Internal release process: https://hashicorp.atlassian.net/wiki/x/HIBT0Q
