# FinanceTrackerApp

<!-- README-I18N:START -->

**English** | [বাংলা](./README.bn.md)

<!-- README-I18N:END -->

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.x-purple?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/SQLAlchemy-2.0-red?logo=sqlalchemy" alt="SQLAlchemy">
  <img src="https://img.shields.io/badge/SQLite-003545?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/Python-3.12-yellow?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Zustand-4.5-purple" alt="Zustand">
  <img src="https://img.shields.io/badge/TanStack-Query-5-orange" alt="TanStack Query">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

Personal finance tracking application with clean design system and modern UI components.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Frontend** | React | 18.3.x |
| | TypeScript | 5.x |
| | Vite | 5.x |
| | Zustand | 4.5.x |
| | TanStack Query | 5.x |
| | React Router DOM | 6.x |
| | React Hook Form | 7.x |
| | Zod | 3.x |
| | date-fns | 3.x |
| **Backend** | FastAPI | 0.115.x |
| | SQLAlchemy | 2.0.x |
| | Pydantic | 2.x |
| | Python-Jose | 3.x |
| | Loguru | 3.x |
| **Database** | SQLite | 3.x |
| **Tools** | Argon2 | 1.x |
| | Pytest | 8.x |

## Features

- **Transaction Tracking**: Log and categorize income and expenses
- **Budget Management**: Set and track spending limits
- **Visual Analytics**: Charts and progress indicators
- **Dark Mode**: Full theme support
- **Responsive Design**: Works on all screen sizes
- **Modular Backend**: Separate FastAPI services per domain

## Progress

### Overall Development

```
███████░░░░░░░░░░░░░░░░░░ 55% Complete
```

| Module | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Auth | ✅ Complete | ✅ Complete | Shipped |
| Categories | ✅ Complete | ✅ Complete | Shipped |
| Transactions | ✅ Complete | ✅ Complete | Shipped |
| Budgets | ❌ Pending | ❌ Pending | Planned |
| Analytics | ❌ Pending | ❌ Pending | Planned |

### Completed Features

- [x] Frontend design system (color palette, component showcase)
- [x] Auth module (user registration, login, JWT, Argon2)
- [x] Categories module (CRUD, sidebar layout, CORS)
- [x] Transactions module (CRUD, pagination, filtering, test suite)

### Upcoming

- [ ] Budget module
- [ ] Analytics dashboard
- [ ] Reports generation

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/PritamChk/finance-tracker.git
cd finance-tracker

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (per module)
cd backend/modules/auth
./start.ps1  # Windows
./start.sh   # Linux/Mac
```

## Project Structure

```
├── README.md                    # This file
├── agent.md                     # AI context & learnings
├── progress.md                  # Development tracker
├── frontend/                    # React + TypeScript
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── pages/               # Page components
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   └── package.json
├── backend/                     # FastAPI backend
│   ├── shared/                  # Shared utilities
│   ├── database/                # SQLite databases
│   └── modules/                 # Domain modules
│       ├── auth/                # Auth service (port 8001)
│       ├── categories/          # Categories service (port 8002)
│       └── transactions/         # Transactions service (port 8003)
└── planning/                    # Planning docs
```

## Available Scripts

### Frontend

```bash
cd frontend
npm run dev      # Start development server (port 5174)
npm run build    # Build for production
npm run lint     # Run linter
```

### Backend

```bash
# Start individual modules
cd backend/modules/auth && ./start.ps1      # Port 8001
cd backend/modules/categories && ./start.ps1 # Port 8002
cd backend/modules/transactions && ./start.ps1 # Port 8003
```

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
async def log_requests(request: Request, call_next):
    logger.info(f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}")
    response = await call_next(request)
    logger.info(f"RESPONSE|status={response.status_code}|duration={duration:.3f}s")
    return response
```
- Uses `loguru` for structured output with timestamps, levels, and module tags.
- Pipe-delimited format enables easy log parsing/aggregation.

### Key Patterns
- **sys.path resolution**: `app/main.py` programmatically injects `backend/` root to `sys.path` at startup
- **Lifespan context manager**: `init_db()` called in FastAPI `lifespan` to create tables on startup
- **CORS config**: Loaded from `application.properties` via `config.get_list("cors.allowed_origins")`
- **Port isolation**: Each module uses unique port (auth: 8001, categories: 8002, transactions: 8003)

## Contributing

1. Follow naming conventions defined in this README
2. Use design system colors and spacing
3. Test in both light and dark modes
4. Ensure accessibility standards

## License

MIT