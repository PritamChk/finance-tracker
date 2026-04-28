# Project Context

## What This Is
FinanceTrackerApp - Full-stack finance tracker with modular backend architecture.

## Key Files
- `planning/color-scheme.md` - Design system (colors, spacing, components)
- `planning/component-showcase.html` - Live demo of all components
- `planning/progress.md` - Development progress tracker
- `backend/README.md` - Backend architecture overview
- `backend/config/application.properties` - Central config (ports, DB, security)
- `backend/shared/` - Shared utilities (config_loader, database, security)
- `backend/modules/{module}/planning/{module}_phase{N}_v1.0.md` - Phase plans

## Backend Architecture
- 6 modules: auth, categories, transactions, budgets, analytics, reports
- Each module = separate FastAPI app with own Swagger UI
- Single SQLite DB at `backend/database/finance_tracker.db`
- Ports: 8001-8006 (from application.properties)
- Tech: FastAPI, SQLAlchemy, Pydantic, JWT, bcrypt

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
