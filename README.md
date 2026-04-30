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

## Progress

- [x] Frontend design system (color palette, component showcase)
- [x] Auth module (user registration, login, JWT, Argon2)
- [x] Categories module (CRUD, sidebar layout, CORS)
- [x] Transactions module (CRUD, pagination, filtering, test suite)
- [ ] Budget module (planned)
- [ ] Analytics dashboard (planned)

## Backend Architecture & Learnings

### Module Structure
```
backend/modules/<module_name>/
├── app/
│   ├── api/            # Route definitions
│   ├── core/           # Logger and config
│   ├── crud/           # Database operations
│   ├── middleware/     # Request/response middleware
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   └── main.py         # FastAPI app entry point
├── tests/
│   ├── conftest.py     # Pytest fixtures and test DB
│   └── test_*.py       # Test files
├── application.properties  # Module config (Java-style)
├── pyproject.toml      # Dependencies
├── start.ps1 / start.sh    # Cross-platform start scripts
├── stop.ps1 / stop.sh      # Cross-platform stop scripts
└── README.md
```

### Shared Module (`backend/shared/`)
Reusable utilities consumed by all backend modules:
- `config_loader.py` — Parses `.properties` files via `ConfigParser`. Supports `get()`, `get_int()`, `get_bool()`, `get_list()`. Auto-prepends `[default]` section header. Env-aware via `APP_ENV`.
- `database.py` — Centralized SQLAlchemy engine, `SessionLocal`, `Base`, `init_db()`. Reads DB URL from module-specific config via `TRANSACTIONS_CONFIG` env var.
- `security.py` — Argon2 password hashing, JWT creation/decode using `python-jose`. Reads `secret_key`, `algorithm`, `expire` from shared config.

### Logging Technique
Each module defines its own middleware (`app/middleware/logging.py`) wrapping `app/core/logger.py`:
```python
# middleware/logging.py — FastAPI middleware
async def log_requests(request: Request, call_next):
    logger.info(f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}")
    response = await call_next(request)
    logger.info(f"RESPONSE|status={response.status_code}|duration={duration:.3f}s")
    return response
```
- Uses `loguru` for structured output with timestamps, levels, and module tags.
- Central `logger` instance in `app/core/logger.py` configured once, imported everywhere.
- Pipe-delimited format enables easy log parsing/aggregation.

### Start/Stop Scripts Pattern
Cross-platform scripts in each module root (`start.ps1`, `start.sh`, `stop.ps1`, `stop.sh`):

**Start scripts:**
1. `cd` to script directory (`$PSScriptRoot` / `dirname "$0"`)
2. Prepend `backend/` root to `PYTHONPATH` for `shared.*` imports
3. Run `uv run uvicorn app.main:app --host 0.0.0.0 --port <PORT> --reload`
4. Each module uses unique port (auth: 8001, categories: 8002, transactions: 8003)

**Stop scripts:**
- Windows: `Get-Process | Where-Object { ... uvicorn ... } | Stop-Process -Force`
- Linux/Mac: `pkill -f "uvicorn app.main:app"`

### Key Patterns
- **sys.path resolution**: `app/main.py` programmatically injects `backend/` root to `sys.path` at startup, ensuring `from shared.*` works regardless of cwd.
- **Lifespan context manager**: `init_db()` called in FastAPI `lifespan` to create tables on startup.
- **CORS config**: Loaded from `application.properties` via `config.get_list("cors.allowed_origins")`.
- **Config isolation**: Each module has its own `application.properties` — no global config file required.

## License

MIT
