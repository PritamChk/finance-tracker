# FinanceTrackerApp

Personal finance tracking application with clean design system and modern UI components.

## Overview

Track income, expenses, budgets, and financial goals with an intuitive interface. Built with a comprehensive design system ensuring consistency across all components.

## Features

- **Transaction Tracking**: Log and categorize income and expenses
- **Budget Management**: Set and track spending limits
- **Visual Analytics**: Charts and progress indicators
- **Dark Mode**: Full theme support
- **Responsive Design**: Works on all screen sizes

## Design System

### Color Palette

| Category | Main Color | Usage |
|----------|-----------|-------|
| Primary | `#3b82f6` | Brand, actions |
| Success | `#22c55e` | Income, positive |
| Danger | `#ef4444` | Expenses, negative |
| Warning | `#f59e0b` | Alerts, pending |
| Info | `#3b82f6` | Information |

### Component Conventions

- **Components**: PascalCase (`TransactionCard.tsx`)
- **Hooks**: camelCase (`useAuth.ts`)
- **Styles**: kebab-case (`button.css`)
- **Classes**: kebab-case (`.transaction-card`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd tictactoe

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
├── color-scheme.md          # Design system documentation
├── component-showcase.html  # Live component demos
├── agent.md                 # Project context for AI
├── progress.md              # Development progress tracker
└── src/
    ├── components/          # React components
    ├── lib/                 # Utilities and helpers
    └── styles/              # Global styles
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Run linter
```

## Component Showcase

Open `component-showcase.html` in your browser to see all available components with live examples and dark mode toggle.

## Development Status

See [progress.md](./progress.md) for current development status and upcoming features.

## Contributing

1. Follow naming conventions defined in `color-scheme.md`
2. Use design system colors and spacing
3. Test in both light and dark modes
4. Ensure accessibility standards

## License

MIT
