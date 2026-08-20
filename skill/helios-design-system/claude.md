# Helios Design System Reference

Helios is HashiCorp's design system, providing design tokens, icons, and components maintained in a monorepo and published to npm.

Official documentation: https://helios.hashicorp.design

---

## Quick Reference

### Packages

- **@hashicorp/design-system-components** - Ember components with Sass/CSS styles
- **@hashicorp/design-system-tokens** - Design tokens (colors, typography, elevation, spacing)
- **@hashicorp/flight-icons** - Icon library (can be used independently)

### Installation

```bash
# Components (includes tokens and CSS helpers)
pnpm add @hashicorp/design-system-components

# Tokens only
pnpm add @hashicorp/design-system-tokens

# Icons only (for React or standalone use)
pnpm add @hashicorp/flight-icons
```

---

## Ember Setup

### 1. Install Components

```bash
pnpm add @hashicorp/design-system-components
```

### 2. Choose Style Import Method

**Option A: Sass (recommended)**

Install Sass preprocessor:
```bash
ember install ember-cli-sass
```

Rename `app/styles/app.css` to `app/styles/app.scss`

Add to `ember-cli-build.js`:
```js
sassOptions: {
  precision: 4,
  includePaths: [
    './node_modules/@hashicorp/design-system-tokens/dist/products/css',
    './node_modules/@hashicorp/design-system-components/dist/styles',
  ],
},
minifyCSS: {
  options: {
    advanced: false,
  },
},
```

Add to `app.scss`:
```scss
@use "@hashicorp/design-system-components";
```

**Option B: CSS**

Add to `ember-cli-build.js`:
```js
app.import('node_modules/@hashicorp/design-system-components/dist/styles/@hashicorp/design-system-components.css');
```

### 3. Add Box-Sizing Reset

Required for components to render properly:
```css
*, *::before, *::after { box-sizing: border-box; }
```

### 4. Use Components

**Traditional templates (.hbs):**
```hbs
<Hds::Button @text="Save" @color="primary" />
<Hds::Icon @name="info" />
```

**Single file components (.gts/.gjs):**
```typescript
import { HdsButton, HdsFormTextInputField } from '@hashicorp/design-system-components/components';
import type { HdsButtonSignature } from '@hashicorp/design-system-components/components/hds/button/index';

<template>
  <HdsButton @text="Save" @color="primary" />
</template>
```

---

## Icons

### Ember Applications

**Using Hds::Icon component:**
```hbs
<Hds::Icon @name="info" />
<Hds::Icon @name="arrow-right" @size="24" />
```

**Deferred sprite loading:**
Add to `config/environment.js`:
```js
flightIconsSpriteLazyEmbed: true
```

### React Applications

**Install package:**
```bash
pnpm add @hashicorp/flight-icons
```

**Import as inline SVG:**
```jsx
import iconArrowRight from '@hashicorp/flight-icons/svg/arrow-right-24.svg?include';
<InlineSvg src={iconArrowRight} />
```

**Import as React component:**
```jsx
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24';
<IconArrowRight24 />
```

**Animated icons:**
```scss
@use "~@hashicorp/flight-icons/svg-react/animation.css";
```
```jsx
import { IconLoading16 } from '@hashicorp/flight-icons/svg-react/loading-16';
<IconLoading16 />
```

---

## Design Tokens

### Import Token CSS Variables

Add to `app.scss`:
```scss
// Product applications (Ember)
@use "@hashicorp/design-system-tokens/dist/products/css/tokens.css";

// Cloud UI email
@use "@hashicorp/design-system-tokens/dist/cloud-email/tokens.css";

// Developer platform
@use "~@hashicorp/design-system-tokens/dist/devdot/css/tokens.css";

// Marketing websites
@use '@hashicorp/design-system-tokens/dist/marketing/css/tokens.css';
```

### Import CSS Helper Classes

```scss
// Product applications
@use "@hashicorp/design-system-tokens/dist/products/css/helpers/colors.css";
@use "@hashicorp/design-system-tokens/dist/products/css/helpers/elevation.css";
@use "@hashicorp/design-system-tokens/dist/products/css/helpers/typography.css";
@use "@hashicorp/design-system-tokens/dist/products/css/helpers/focus-ring.css";
```

### Usage Examples

**CSS variables:**
```css
.my-element {
  color: var(--token-color-foreground-primary);
  background: var(--token-color-surface-primary);
  border-radius: var(--token-border-radius-medium);
  padding: var(--token-spacing-16);
}
```

**Helper classes:**
```html
<div class="hds-typography-display-500 hds-foreground-strong">
  Heading text
</div>
```

---

## Internationalization

### Default Behavior
Components display in English when `ember-intl` is not installed.

### Enable i18n

**Install ember-intl:**
```bash
pnpm add ember-intl
```

**Supported locales:**
- `en-us` (English - United States)

### Custom Translations

Override HDS translations by matching key paths:
```yaml
# translations/fr-fr.yaml
hds:
  components:
    common:
      error: Erreur
```

---

## Ember Engines

Add to `app.js`:
```js
import LinkToExternal from 'ember-engines/components/link-to-external';
import { setLinkToExternal } from '@hashicorp/design-system-components/utils/hds-link-to-external';

setLinkToExternal(LinkToExternal);
```

---

## Browser Support

- Chrome: last 2 versions
- Safari: last 2 versions
- Firefox: last 2 versions
- Microsoft Edge: last 2 versions

---

## Editor Setup

### VSCode Extensions

1. **Ember Language Server** - Autocomplete, goto definition, diagnostics
2. **Glint** - TypeScript support for Ember templates with improved autocomplete

---

## Reference Architecture

This design system reference integrates with the pocket-product-designer-bootstrap pipeline:

- **Stage 4-5 (PDRs)** - Reference Helios components when specifying interface elements
- **Stage 6 (Storybook)** - Import Helios components in stories for prototyping
- **Stage 7 (Showcase)** - Use Helios tokens and components in showcase builds

When writing PDRs that specify UI, prefer Helios components over custom implementations:
- Use `Hds::Button` instead of generic buttons
- Use `Hds::Form` components for inputs
- Reference Helios tokens for colors, spacing, typography
- Link to component docs: https://helios.hashicorp.design/components/

---

## Common Patterns

### Button with Icon
```hbs
<Hds::Button @text="Save" @icon="save" @color="primary" />
```

### Form Input
```hbs
<Hds::Form::TextInput::Field as |F|>
  <F.Label>Username</F.Label>
  <F.HelperText>Your unique identifier</F.HelperText>
  <F.Error>This field is required</F.Error>
</Hds::Form::TextInput::Field>
```

### Alert
```hbs
<Hds::Alert @type="inline" @color="success">
  Changes saved successfully
</Hds::Alert>
```

### Modal
```hbs
<Hds::Modal @onClose={{this.closeModal}} as |M|>
  <M.Header>Confirm Action</M.Header>
  <M.Body>Are you sure you want to proceed?</M.Body>
  <M.Footer>
    <Hds::Button @text="Cancel" @color="secondary" {{on "click" this.closeModal}} />
    <Hds::Button @text="Confirm" @color="primary" {{on "click" this.confirm}} />
  </M.Footer>
</Hds::Modal>
```

---

## Quick Links

- **Component docs**: https://helios.hashicorp.design/components/
- **Design tokens**: https://helios.hashicorp.design/foundations/tokens
- **Icons catalog**: https://helios.hashicorp.design/icons/library
- **Figma library**: https://helios.hashicorp.design/getting-started/for-designers
- **GitHub**: https://github.com/hashicorp/design-system
