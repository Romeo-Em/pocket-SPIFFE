# Helios Design System Reference

This folder contains organized reference documentation for the Helios Design System, HashiCorp's design system for building consistent, accessible applications.

## Official Resources

- **Website**: https://helios.hashicorp.design/
- **Components**: https://helios.hashicorp.design/components
- **Patterns**: https://helios.hashicorp.design/patterns
- **Foundations**: https://helios.hashicorp.design/foundations
- **For Engineers**: https://helios.hashicorp.design/getting-started/for-engineers

## Contents

### 1. [Overview and Getting Started](./01-Overview-and-Getting-Started.md)
- What Helios is and its purpose
- Core principles
- Installation instructions (`pnpm add @hashicorp/design-system-components`)
- Framework support (Ember primary, React icons)
- Setup steps and configuration
- Package structure

### 2. [Design Foundations](./02-Design-Foundations.md)
Eight foundational areas:
- **Typography** - Text styling and hierarchy
- **Colors** - Semantic colors and contrast
- **Borders** - Visual separation
- **Elevation** - Depth and shadows
- **Focus Rings** - Accessibility and interactivity
- **Breakpoints** - Responsive design
- **Tokens** - Design variables
- **Accessibility** - WCAG compliance and inclusive design

### 3. [Components Catalog](./03-Components-Catalog.md)
Complete component reference organized by category:
- **Navigation & Layout**: Accordion, Breadcrumb, App Header, App Side Nav, Pagination
- **Feedback & Status**: Alert, Toast, Badge, Badge Count, Application State
- **Interaction & Input**: Button (detailed), Button Set, Dropdown, Modal, Tooltip
- **Form Components**: Text Input, Textarea, Checkbox, Radio, Toggle, Select, Super Select, File Input, Masked Input, Key Value Inputs, Radio Card
- **Content Display**: Card, Table, Advanced Table, Tabs, Code Block, Code Editor, Text, Icon, Tag
- **Layout**: AppFrame, Flex, Grid
- **Primitives**: DialogPrimitive, PopoverPrimitive, DisclosurePrimitive

### 4. [Design Patterns](./04-Design-Patterns.md)
Seven documented patterns:
1. **Button Organization** - Alignment and grouping
2. **Data Visualization** - Chart guidelines
3. **Description List** - Key-value displays
4. **Show, Hide, and Disable** - Conditional UI
5. **Filter Patterns** - Data filtering
6. **Form Patterns** - Form design and validation
7. **Table Multi-select** - Bulk operations

---

## Quick Reference

### Installation
```bash
# Main components
pnpm add @hashicorp/design-system-components

# Icons (framework-agnostic)
pnpm add @hashicorp/flight-icons

# Design tokens
pnpm add @hashicorp/design-system-tokens
```

### Button Quick Reference

**Variants**: Primary, Secondary, Tertiary, Critical
**Sizes**: Small, Medium, Large
**Icon Positions**: Leading (recommended), Trailing, Icon-only

**Rule**: Use Button for actions, Link for navigation.

### AppFrame Quick Reference

Top-level layout with optional containers:
- `<Frame.Header>` - Top navigation
- `<Frame.Sidebar>` - Side navigation
- `<Frame.Main>` - Primary content
- `<Frame.Footer>` - Footer
- `<Frame.Modals>` - Overlay content

### Form Component Selection

| Input Type | Component | Use When |
|------------|-----------|----------|
| Short text | Text Input | Names, emails, search |
| Long text | Textarea | Comments, descriptions |
| Single choice | Radio, Select | Mutually exclusive options |
| Multiple choices | Checkbox | Multiple selections |
| Binary toggle | Toggle | Enable/disable features |
| File upload | File Input | Document uploads |
| Key-value pairs | Key Value Inputs | Environment variables |

---

## For Pair Design Sessions

### Preparation Checklist
- [ ] Review component catalog for available components
- [ ] Check relevant design patterns
- [ ] Review design foundations (spacing, colors, typography)
- [ ] Have Figma/Helios site open for reference
- [ ] Note any product-specific customizations needed

### Common Discussion Topics
1. **Component Selection**: Which component fits the use case?
2. **Pattern Application**: Does a pattern exist for this problem?
3. **Accessibility**: Focus states, keyboard navigation, ARIA labels
4. **Responsive Behavior**: How does it adapt to different screen sizes?
5. **States**: Default, hover, active, focus, disabled, loading, error
6. **Edge Cases**: Empty states, long text, many items, errors

### Key Questions to Ask
- What action is the user trying to accomplish?
- Is this navigation (Link) or an action (Button)?
- What's the hierarchy of importance? (Primary vs Secondary)
- Who needs to access this? (Accessibility considerations)
- How does this scale? (Responsive, many items, long text)
- What are the error states?
- How do we provide feedback?

---

## Design System Principles

### 1. Accessibility First
- WCAG compliance is mandatory, not optional
- Test with keyboard navigation
- Never remove focus rings without alternatives
- Ensure sufficient color contrast
- Provide alternative text and ARIA labels

### 2. Consistency
- Use established patterns before creating new ones
- Maintain visual hierarchy
- Apply spacing systematically
- Use design tokens for all styling

### 3. Clarity
- Prioritize clear communication
- Use familiar patterns
- Provide helpful feedback
- Make actions obvious

### 4. Flexibility
- Components adapt to different contexts
- Patterns guide but don't constrain
- Support product-specific needs
- Enable customization when necessary

---

## Browser Support

Last two versions of:
- Chrome
- Safari
- Firefox
- Edge

---

## Contributing

The Helios Design System welcomes:
- Pattern requests for frequently-built solutions
- Feedback on existing components
- Accessibility improvements
- Bug reports and enhancement suggestions

Work with the Design Systems Team for support when developing custom patterns.

---

## Common Workflows

### Starting a New Feature
1. Review design patterns for similar problems
2. Select appropriate components
3. Apply design foundations (spacing, colors, typography)
4. Consider all states (empty, loading, error, success)
5. Test accessibility
6. Validate responsive behavior

### Reviewing a Design
1. Check component usage against Helios catalog
2. Verify pattern adherence
3. Validate accessibility (focus, contrast, labels)
4. Check spacing and typography consistency
5. Review all interactive states
6. Consider edge cases

### Implementing a Design
1. Install required packages
2. Import components
3. Apply design tokens for styling
4. Implement accessibility features
5. Handle all states
6. Test keyboard navigation
7. Validate responsive behavior

---

**Last Updated**: February 2026

This is a reference summary. Always refer to the official Helios documentation for the most current information and detailed implementation guidelines.
