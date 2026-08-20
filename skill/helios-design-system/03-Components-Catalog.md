# Helios Components Catalog

## Navigation & Layout Components

### Accordion
**Purpose**: A list of toggles that reveal or hide associated content.
**Use Cases**: FAQ sections, grouped information, progressive disclosure.

### Breadcrumb
**Purpose**: A secondary navigation that shows the user's current location.
**Use Cases**: Site hierarchy, navigation trails, deep page structures.

### App Header
**Purpose**: Used as a global and utility navigation within an application.
**Use Cases**: Top-level navigation, global actions, user menus, product switcher.

### App Side Nav
**Purpose**: A side navigation menu that provides access to subpages.
**Use Cases**: Primary navigation, section navigation, hierarchical menus.

### Pagination
**Purpose**: Used to let users navigate through content broken down into pages.
**Use Cases**: Data tables, search results, long lists.

---

## Feedback & Status Components

### Alert
**Purpose**: Displays a brief message without interrupting a user's task.
**Use Cases**: Inline notifications, contextual warnings, success confirmations.

### Toast
**Purpose**: Used to display messages that are the result of a user's actions.
**Use Cases**: Action confirmations, brief notifications, auto-dismissing messages.

### Badge
**Purpose**: Concise, non-interactive labels that represent metadata.
**Use Cases**: Status indicators, labels, tags, counts.

### Badge Count
**Purpose**: A non-interactive numeric label.
**Use Cases**: Notification counts, item counts, numerical indicators.

### Application State
**Purpose**: An informational element that displays the current state.
**Use Cases**: Loading states, empty states, error states, status indicators.

---

## Interaction & Input Components

### Button
**Purpose**: An interactive element that initiates an action.

**Variants**:
- **Primary**: Most important action on the page
- **Secondary**: Less critical actions
- **Tertiary**: Low-priority actions (requires icons for accessibility)
- **Critical**: Potentially dangerous actions (deletions, destructive operations)

**Sizes**: Small, Medium (default), Large

**Icon Positioning**: Leading (recommended), trailing, icon-only (with aria-label)

**States**: Default, hover, active, focus, disabled, loading

**Best Practices**:
- Text should be short (~25 characters)
- Avoid multiple Primary buttons per page
- Use links for navigation, buttons for actions
- Keep button width consistent during loading states
- Don't disable buttons during loading for keyboard accessibility

### Button Set
**Purpose**: Provides consistent layout and spacing for a set of buttons.
**Use Cases**: Form actions, grouped controls, multi-step flows.

### Dropdown
**Purpose**: Hide/show a list of actions or options with a toggle button.
**Use Cases**: Action menus, option lists, contextual actions.

### Modal
**Purpose**: A pop-up window used to request information or provide context.
**Use Cases**: Confirmations, forms, complex decisions, focused tasks.

### Tooltip
**Purpose**: Provides additional information or context for a UI element.
**Use Cases**: Help text, definitions, clarifications, icon labels.

---

## Form Components

### Text Input
**Purpose**: Single-line text entry field.
**Use Cases**: Names, emails, search, short text.

### Textarea
**Purpose**: Multi-line text entry field.
**Use Cases**: Comments, descriptions, long-form text.

### Checkbox
**Purpose**: Binary selection (on/off, true/false).
**Use Cases**: Agreements, feature toggles, multiple selections.

### Radio
**Purpose**: Single selection from a set of options.
**Use Cases**: Mutually exclusive choices, setting selection.

### Toggle
**Purpose**: Switch-style binary control.
**Use Cases**: Enable/disable features, instant state changes.

### Select
**Purpose**: Dropdown selection from a list of options.
**Use Cases**: Single-choice selection, standard dropdowns.

### Super Select
**Purpose**: Enhanced select with advanced features.
**Use Cases**: Searchable dropdowns, multi-select, complex selections.

### File Input
**Purpose**: File upload control.
**Use Cases**: Document uploads, image selection, file attachments.

### Masked Input
**Purpose**: Text input with formatting masks.
**Use Cases**: Phone numbers, dates, credit cards, formatted data.

### Key Value Inputs
**Purpose**: Input pairs for key-value data.
**Use Cases**: Environment variables, metadata, configuration.

### Radio Card
**Purpose**: Radio selection styled as cards.
**Use Cases**: Visual choice selection, plan selection, feature comparison.

---

## Content Display Components

### Card
**Purpose**: Container for grouping related content.
**Use Cases**: Content grouping, dashboard widgets, preview cards.

### Table
**Purpose**: Display structured data in rows and columns.
**Use Cases**: Data lists, comparisons, structured information.

### Advanced Table
**Purpose**: Enhanced table with sorting, filtering, and pagination.
**Use Cases**: Complex data sets, admin interfaces, data management.

### Tabs
**Purpose**: Organize content into separate views.
**Use Cases**: Settings pages, categorized content, view switching.

### Code Block
**Purpose**: Display formatted code with syntax.
**Use Cases**: Documentation, code examples, command displays.

### Code Editor
**Purpose**: Editable code input with syntax highlighting.
**Use Cases**: Configuration editing, code input, scripting interfaces.

### Text
**Purpose**: Styled text component with typography variants.
**Use Cases**: Body text, headings, labels, captions.

### Icon
**Purpose**: Visual symbols from the Flight icon library.
**Use Cases**: Actions, status, navigation, decoration.

### Tag
**Purpose**: Removable labels or filters.
**Use Cases**: Filter tags, selected items, categorization.

---

## Layout Components

### AppFrame
**Purpose**: Top-level structural frame for applications.

**Containers**:
- **Header** (`<header>`) - Top navigation
- **Sidebar** (`<aside>`) - Side navigation
- **Main** (`<main>`) - Primary content (with skip link support)
- **Footer** (`<footer>`) - Application footer
- **Modals** (`<div>`) - Overlay content

**Benefits**:
- Semantic HTML structure
- Built-in accessibility (skip links)
- Flexible, optional containers
- Consistent application layouts

### Flex
**Purpose**: Flexbox layout utilities.
**Use Cases**: Flexible layouts, responsive arrangements, alignment control.

### Grid
**Purpose**: CSS Grid layout utilities.
**Use Cases**: Complex layouts, responsive grids, structured arrangements.

---

## Primitive Components

### DialogPrimitive
**Purpose**: Low-level dialog functionality.
**Use Cases**: Building custom dialogs and modals.

### PopoverPrimitive
**Purpose**: Low-level popover functionality.
**Use Cases**: Building custom popovers and tooltips.

### DisclosurePrimitive
**Purpose**: Low-level disclosure functionality.
**Use Cases**: Building custom expandable sections and accordions.

---

## Component Selection Guide

**For Navigation**:
- App-level: AppHeader, AppSideNav
- Page-level: Breadcrumb, Tabs
- Content-level: Accordion, Pagination

**For User Feedback**:
- Inline: Alert
- Temporary: Toast
- Modal: Modal (for blocking)
- Status: Badge, Application State

**For Actions**:
- Primary action: Button (Primary variant)
- Secondary action: Button (Secondary variant)
- Destructive: Button (Critical variant)
- Multiple actions: Dropdown, Button Set

**For Forms**:
- Short text: Text Input
- Long text: Textarea
- Single choice: Radio, Select
- Multiple choices: Checkbox
- Binary: Toggle, Checkbox
- Files: File Input

**For Content**:
- Structured data: Table, Advanced Table
- Grouped content: Card
- Code: Code Block, Code Editor
- Icons: Icon (from Flight Icons)
