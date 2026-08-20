# Helios Design Patterns

## Overview

Helios provides **7 documented design patterns** that address recurring design challenges across products with standardized solutions and best practices.

---

## 1. Button Organization

**Purpose**: Guidelines for aligning, ordering, and grouping buttons.

**Key Topics**:
- Button alignment strategies
- Order of buttons (primary vs secondary)
- Spacing between buttons
- Button groups
- Form action buttons
- Multi-step flow buttons

**Best Practices**:
- Place primary action on the right (in LTR languages)
- Secondary/cancel actions on the left
- Maintain consistent spacing
- Use Button Set component for grouped actions
- Avoid too many buttons in one area (max 2-3)

---

## 2. Data Visualization

**Purpose**: Guidelines and best practices for data visualization.

**Key Topics**:
- Chart types and selection
- Color usage in visualizations
- Accessibility in charts
- Responsive data displays
- Interactive visualizations
- Data table alternatives

**Considerations**:
- Choose appropriate visualization for data type
- Ensure color-blind accessible palettes
- Provide alternative text descriptions
- Support keyboard navigation
- Consider mobile/responsive views

---

## 3. Description List

**Purpose**: Creating lists using Helios foundational elements.

**Use Cases**:
- Key-value pairs
- Metadata display
- Configuration details
- Resource properties
- Definition lists

**Structure**:
- Semantic HTML (dt/dd)
- Consistent formatting
- Proper spacing
- Responsive layouts

---

## 4. Show, Hide, and Disable

**Purpose**: Guidelines for displaying UI elements depending on user permissions and actions.

**Key Topics**:
- When to hide vs disable
- Permission-based visibility
- Progressive disclosure
- Conditional rendering
- State-based displays

**Best Practices**:
- Hide when feature is not relevant
- Disable when action is temporarily unavailable
- Provide explanatory text for disabled states
- Don't hide too much - transparency is key
- Consider tooltips for disabled elements

**Accessibility**: Always provide context for why something is disabled or hidden.

---

## 5. Filter Patterns

**Purpose**: Guidelines and best practices for filtering a data set using Helios components.

**Key Topics**:
- Filter UI placement
- Multiple filter types
- Active filter indicators
- Clear/reset filters
- Filter persistence
- Search + filter combinations

**Filter Types**:
- Single select (Radio, Select)
- Multi-select (Checkbox)
- Date range filters
- Text search filters
- Tag-based filters

**Best Practices**:
- Show active filters clearly
- Allow easy removal (clear all, clear individual)
- Maintain filter state appropriately
- Show result counts when applicable
- Provide instant feedback

---

## 6. Form Patterns

**Purpose**: Guidelines for delivering user-centric forms using Helios form components and primitives.

**Key Topics**:
- Form structure and layout
- Field organization
- Validation patterns
- Error handling
- Help text placement
- Required vs optional fields
- Multi-step forms
- Form submission states

**Best Practices**:
- Group related fields
- Label fields clearly
- Show validation inline when possible
- Provide helpful error messages
- Indicate required fields
- Use appropriate input types
- Consider progressive disclosure for complex forms
- Show loading state during submission
- Provide clear success confirmation

**Validation**:
- Validate on blur for better UX
- Show errors near the relevant field
- Use color + icons + text for errors (not color alone)
- Prevent submission when invalid
- Preserve user input on error

**Error Messages**:
- Be specific about what's wrong
- Suggest how to fix it
- Use plain language
- Don't blame the user

---

## 7. Table Multi-select

**Purpose**: Guidelines for selecting and transforming results in a Table.

**Key Topics**:
- Selection mechanisms (checkbox column)
- Select all functionality
- Bulk actions on selected items
- Selection persistence
- Selected item indicators
- Action bar for bulk operations

**Best Practices**:
- Clearly show selected count
- Provide select/deselect all
- Show bulk actions only when items selected
- Confirm destructive bulk actions
- Maintain selection state appropriately
- Handle pagination with selection
- Provide clear visual feedback for selected rows

**Interaction Patterns**:
- Checkbox in first column
- Row highlight for selected items
- Sticky action bar when items selected
- Keyboard shortcuts (shift-select for range)

---

## Pattern Request Process

The design system welcomes community contributions for new patterns. Teams can:
- Request new patterns for frequently-built solutions
- Work with the Design Systems Team for support
- Develop custom patterns locally with guidance
- Contribute patterns back to the system

---

## Using Patterns Effectively

### When to Follow Patterns

**Always**:
- For common UI problems (forms, filters, tables)
- When consistency across products matters
- For accessibility compliance
- To accelerate development

**Consider Customization**:
- Product-specific needs
- Unique use cases
- Advanced functionality
- Domain-specific requirements

### How to Apply Patterns

1. **Understand the problem** - Identify which pattern applies
2. **Review guidelines** - Read the complete pattern documentation
3. **Adapt to context** - Apply pattern principles to your specific case
4. **Test with users** - Validate the implementation
5. **Iterate** - Refine based on feedback

### Pattern + Component Integration

Patterns often combine multiple components:
- **Filter Pattern** = Select + Checkbox + Tag + Button
- **Form Pattern** = Text Input + Textarea + Button Set + Alert
- **Table Multi-select** = Table + Checkbox + Button + Badge Count

Understanding how to compose components using patterns is key to building cohesive interfaces.
