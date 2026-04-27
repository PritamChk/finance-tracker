# Project Context

## What This Is
FinanceTrackerApp design system showcase. HTML component library based on color-scheme.md.

## Key Files
- `planning/color-scheme.md` - Full design system (colors, spacing, components, conventions)
- `planning/component-showcase.html` - Live demo of all components
- `planning/progress.md` - Development progress tracker
- `README.md` - Project overview and setup

## Design System Specs
- Primary: Blue (#3b82f6)
- Success: Green (#22c55e) for income
- Danger: Red (#ef4444) for expenses
- Warning: Amber (#f59e0b)
- Gray scale: 50-900
- Chart colors: 10 category colors
- Dark mode: Supported via data-theme="dark"

## Components Available
- Buttons (6 variants, 3 sizes)
- Badges (4 types)
- Cards (with hover)
- Progress bars (4 states)
- Tables (styled)
- Form inputs (3 sizes + error)
- Modal (with overlay)
- Border radius (5 sizes)
- Typography (9 sizes)

## Naming Conventions
- Components: PascalCase (TransactionCard.tsx)
- Utilities/hooks: camelCase (useAuth.ts)
- Styles/assets: kebab-case (button.css)
- CSS classes: kebab-case (.transaction-card)

## Quick Start
Open `planning/component-showcase.html` in browser. Toggle dark mode with button in top-right.
