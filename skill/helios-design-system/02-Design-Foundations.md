# Helios Design System: Foundations

## Overview

The Helios Design System organizes its core design principles into eight key foundational areas that create a cohesive, accessible design language.

---

## 1. Typography

**Definition**: Typography relates to the style and appearance of textual information.

**Purpose**: Establishes consistent text styling across applications for readability and hierarchy.

**Key Aspects**:
- Font families
- Font sizes and scale
- Line heights
- Font weights
- Letter spacing
- Text alignment

---

## 2. Colors

**Definition**: Color and contrast are used to convey information, highlight content, and communicate intent.

**Purpose**: Strategic use of color for:
- Communicating meaning (success, warning, error, info)
- Creating visual hierarchy
- Maintaining brand consistency
- Ensuring accessibility through proper contrast

**Key Aspects**:
- Primary brand colors
- Semantic colors (success, warning, error, info)
- Neutral colors
- Background and surface colors
- Text colors
- Interactive states (hover, active, disabled)

---

## 3. Borders

**Definition**: Borders define and separate content visually.

**Purpose**: Provide visual separation and definition for UI elements.

**Key Aspects**:
- Border widths
- Border styles
- Border colors
- Border radius (corner rounding)
- Usage patterns for cards, inputs, containers

---

## 4. Elevation

**Definition**: Elevation can be used to offset and draw attention to content or indicate interactivity.

**Purpose**: Create depth and visual hierarchy in the interface.

**Key Aspects**:
- Shadow levels
- Depth perception
- Layering content
- Indicating interactivity (hover states)
- Drawing attention to important elements (modals, popovers)

---

## 5. Focus Rings

**Definition**: Focus rings are vital for communicating interactivity.

**Purpose**: Essential for accessibility and keyboard navigation.

**Key Aspects**:
- Visible focus indicators
- Consistent focus styling across components
- WCAG compliance for focus visibility
- Different focus states for different component types
- Never remove focus indicators without providing alternatives

**Importance**: Critical for users who navigate with keyboards or assistive technologies.

---

## 6. Breakpoints

**Definition**: Standardized breakpoints for different device widths.

**Purpose**: Support responsive design across devices.

**Key Aspects**:
- Mobile breakpoints
- Tablet breakpoints
- Desktop breakpoints
- Consistent responsive behavior
- Media query standards

---

## 7. Tokens

**Definition**: Design tokens are used to share and standardize foundation styles.

**Purpose**: Maintain consistency by centralizing design decisions into reusable variables.

**Key Aspects**:
- CSS custom properties (variables)
- Color tokens
- Spacing tokens
- Typography tokens
- Border tokens
- Shadow tokens
- Consistency across products

**Implementation**: Available via `@hashicorp/design-system-tokens` package.

---

## 8. Accessibility

**Principle**: Applications should be usable and accessible for all users of differing abilities.

**Purpose**: Ensure inclusive design that works for everyone.

**Key Aspects**:
- WCAG compliance
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast requirements
- Focus management
- Alternative text for images
- Form accessibility

**Commitment**: Accessibility is not a feature—it's a fundamental requirement.

---

## How Foundations Work Together

These foundations work in harmony to create:
- **Cohesive Design Language**: Consistent visual appearance
- **Accessible Experiences**: Usable by all users
- **Scalable Systems**: Easy to extend and maintain
- **Visual Hierarchy**: Clear information architecture
- **Brand Consistency**: Unified HashiCorp identity

---

## For Designers

When designing with Helios:
1. Use design tokens for all styling decisions
2. Follow accessibility guidelines from the start
3. Maintain consistent spacing using the spacing scale
4. Apply elevation purposefully
5. Ensure sufficient color contrast
6. Include focus states in all interactive designs

## For Engineers

When implementing with Helios:
1. Use design token CSS variables
2. Never remove focus rings
3. Apply semantic HTML
4. Test with keyboard navigation
5. Validate color contrast
6. Use responsive breakpoints consistently
