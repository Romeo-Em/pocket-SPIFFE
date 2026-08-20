# Helios Design System: Overview and Getting Started

## What is Helios?

Helios is HashiCorp's design system that provides a cohesive, accessible design language across HashiCorp's product ecosystem. It offers reusable components, design tokens, foundational styles, and patterns to ensure consistency and usability.

## Purpose and Goals

- Create a consistent user experience across all HashiCorp products
- Provide accessible, WCAG-compliant components
- Accelerate development with pre-built, tested components
- Maintain design and code quality standards
- Enable teams to focus on product-specific features

## Core Principles

The design system prioritizes:
- **Accessibility**: Applications should be usable for all users of differing abilities
- **Consistency**: Standardized patterns across products
- **Clarity**: Clear visual hierarchy and communication
- **Flexibility**: Adaptable to different product needs

---

## For Engineers: Getting Started

### Installation

Install the main components package via pnpm (or npm/yarn):

```bash
pnpm add @hashicorp/design-system-components
```

### Additional Packages

**Icons Package:**
```bash
pnpm add @hashicorp/flight-icons
```

**Tokens Package:**
```bash
pnpm add @hashicorp/design-system-tokens
```

### Framework Support

**Ember (Primary)**:
- Components are provided as an Ember addon
- Includes Sass and CSS styling options
- Requires global box-sizing reset for proper rendering

**React**:
- Icons available through `@hashicorp/flight-icons`
- Supports both inline SVG imports and React/SVG components
- Full component library primarily targets Ember

### Setup Steps

1. **Install the package** via pnpm/npm
2. **Configure styles**: Choose between Sass or CSS import paths
3. **Apply design tokens**: Configure in build files
4. **Import components**: Use individual imports for single-file components (.gts/.gjs)
5. **Install dependencies**: Add `ember-intl` for internationalization support
6. **Configure engines** (if applicable): Set up `LinkToExternal` in app.js

### Sass Configuration

Configure `ember-cli-build.js` with:
- Precision settings
- Include paths to tokens and components directories

### CSS Import

For CSS-only setup, directly import the compiled stylesheet.

### Browser Support

Supports the last two versions of:
- Chrome
- Safari
- Firefox
- Edge

---

## Package Structure

The design system maintains a monorepo with separate packages:

| Package | Purpose |
|---------|---------|
| `@hashicorp/design-system-components` | Main component library |
| `@hashicorp/flight-icons` | Icon library (framework-agnostic) |
| `@hashicorp/design-system-tokens` | CSS variables and design tokens |

---

## Resources

- **Documentation**: https://helios.hashicorp.design/
- **Engineering Guide**: https://helios.hashicorp.design/getting-started/for-engineers
- **Components**: https://helios.hashicorp.design/components
- **Patterns**: https://helios.hashicorp.design/patterns
- **Foundations**: https://helios.hashicorp.design/foundations

---

## Contributing

The design system welcomes contributions and pattern requests. Teams can work with the Design Systems Team for support when developing custom patterns locally.
