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

---

# Frontend Auth Flow (COMPLETE)

## Stack
- React + Vite + TypeScript
- React Router (routing)
- Zustand (session state)
- TanStack Query (user profile - optional)
- Axios (HTTP)

## Files
- `frontend/src/stores/auth.store.ts` - Zustand store for tokens
- `frontend/src/services/auth.service.ts` - Auth API methods
- `frontend/src/pages/LoginPage.tsx` - Login form
- `frontend/src/pages/RegisterPage.tsx` - Registration form
- `frontend/src/pages/DashboardPage.tsx` - Protected dashboard
- `frontend/src/components/auth/ProtectedRoute.tsx` - Route guard
- `frontend/src/services/api.ts` - Axios instance with interceptors

## Auth Flow
1. User registers at `/register` → POST `/api/auth/register`
2. User logs in at `/login` → POST `/api/auth/login`
3. Backend returns `{ access_token, token_type }` (NO refresh_token!)
4. Frontend stores token in localStorage + Zustand
5. Protected routes check localStorage for token
6. Each request adds `Authorization: Bearer {token}` via axios interceptor
7. Logout → POST `/api/auth/logout`, clear localStorage + redirect

## Key Configs

### .env (frontend)
```
VITE_API_URL=http://localhost:8001/api
```

### application.properties (backend)
```
server.port=8001
cors.allowed_origins=http://localhost:5173,http://localhost:3000
security.secret_key=your-secret-key
security.access_token_expire_minutes=30
database.url=sqlite:///database/finance_tracker.db
```

### Token Response (backend → frontend)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
NOTE: Backend does NOT return `refresh_token` - only access_token.

### User Response (/me endpoint)
```json
{
  "id": 12,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2026-01-01T00:00:00"
}
```

---

# Debugging Learnings

## Issue: "/me works but /logout returns 401"
### Root Cause
Frontend sends wrong/expired token for POST /logout even though GET /me works with same token.

### Debug Steps
1. Check browser console for [API] logs showing token presence
2. Verify logout endpoint exists in backend (`/auth/logout`)
3. Check if token being added to Authorization header correctly
4. Compare headers between working (/me) and failing (/logout) requests

### Solution
Fixed by:
1. Removing TanStack Query complexity - use Zustand directly
2. Ensuring localStorage is cleared on logout
3. Using `navigate('/login', { replace: true })` to prevent back-button issues

## Issue: "Token type mismatch"
### Root Cause
Frontend expected `refresh_token` in login response but backend only returns `access_token`.

### Solution
Update frontend interfaces to match backend:
```typescript
// auth.service.ts
interface AuthResponse {
  access_token: string;
  token_type: string;
  // NO refresh_token!
}
```

## Issue: "CORS errors"
### Root Cause
Backend not allowing frontend origin.

### Solution
In `application.properties`:
```
cors.allowed_origins=http://localhost:5173
```

## Issue: "Route mismatch"
### Root Cause
Backend uses `/api/auth/*` but frontend calls `/auth/*`.

### Solution
Set correct base URL in `.env`:
```
VITE_API_URL=http://localhost:8001/api
```

---

# Common Patterns

## Zustand Store (tokens)
```typescript
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuth: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  setAuth: (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    set({ isAuthenticated: true, accessToken });
  },
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ isAuthenticated: false, accessToken: null });
  },
}));
```

## Axios with Auth Interceptor
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Protected Route
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
```

## Logout Handler
```typescript
const handleLogout = () => {
  authService.logout().catch(() => {}); // Fire-and-forget
  clearAuth();
  navigate('/login', { replace: true });
};
```

---

# Git Commands
```
# Check status
git status

# Stage and commit
git add -A
git commit -m "Description"

# Push
git push
```

---

# Backend Module Creation Pattern

## Structure
Each module follows this pattern (e.g., categories):
```
backend/modules/{module}/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry
│   ├── database.py         # SQLAlchemy setup
│   ├── api/
│   │   ├── __init__.py
│   │   └── {module}.py     # Endpoints
│   ├── crud/
│   │   ├── __init__.py
│   │   └── {module}.py    # CRUD operations
│   ├── models/
│   │   ├── __init__.py
│   │   └── {module}.py    # SQLAlchemy model
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── {module}.py    # Pydantic schemas
│   ├── core/
│   │   ├── __init__.py
│   │   └── logger.py      # Loguru config
│   └── middleware/
│       ├── __init__.py
│       └── logging.py      # Request/response logging
├── tests/
│   ├── __init__.py
│   └── test_{module}.py
├── planning/               # Phase plans
├── pyproject.toml         # Dependencies
├── start.ps1            # Windows start script
├── start.sh             # Unix start script
└── application.properties  # Config (port, CORS)
```

## Dependencies (pyproject.toml)
```toml
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "sqlalchemy",
    "pydantic",
    "pytest",
    "pytest-asyncio",
    "httpx",
    "loguru",  # For logging
]
```

## Database Setup
```python
# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///path/to/db.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
```

## FastAPI App Setup
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # Initialize tables
    yield

app = FastAPI(title="Module API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[...], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
```

---

# Logging Pattern (Loguru)

## Logger Configuration
```python
# app/core/logger.py
from loguru import logger
from pathlib import Path
import sys

log_dir = Path(__file__).parent.parent.parent / "log"
log_dir.mkdir(exist_ok=True)

log_format = "{level}|{time:YYYY-MM-DD HH:mm:ss.SSS}|{message}"

logger.remove()

# Console handler
logger.add(sys.stdout, format=log_format, level="INFO", colorize=True)

# Daily rotating log
logger.add(
    log_dir / "module_sysdate.{time:YYYYMMDD}.log",
    format=log_format, level="INFO",
    rotation="00:00", retention="25 days",
    compression="zip", enqueue=True
)

# Error log
logger.add(
    log_dir / "module_errors.{time:YYYYMMDD}.log",
    format=log_format, level="ERROR",
    rotation="00:00", retention="25 days",
    compression="zip", enqueue=True
)
```

## Logging Middleware
```python
# app/middleware/logging.py
from fastapi import Request
from app.core.logger import logger
import time

async def log_requests(request: Request, call_next):
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}")
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"RESPONSE|status={response.status_code}|duration={duration:.3f}s|path={request.url.path}")
    return response
```

## Endpoint Logging Pattern
```python
# app/api/module.py
from app.core.logger import logger

@router.get("")
async def list_items(request: Request, ...):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"LIST_ITEMS|user_id={user_id}|ip={client_ip}")
    items = get_items(db, user_id)
    logger.info(f"LIST_ITEMS_SUCCESS|count={len(items)}|user_id={user_id}")
    return items

@router.post("")
async def create_item(request: Request, item: ItemCreate, db):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"CREATE_ITEM|name={item.name}|user_id={item.user_id}|ip={client_ip}")
    created = create_item(db, item)
    logger.info(f"CREATE_ITEM_SUCCESS|id={created.id}|name={created.name}")
    return created

@router.get("/{item_id}")
async def get_item(request: Request, item_id: int, db):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"GET_ITEM|id={item_id}|ip={client_ip}")
    item = get_item(db, item_id)
    if not item:
        logger.error(f"GET_ITEM_FAIL|id={item_id}|reason=not_found")
        raise HTTPException(status_code=404, detail="Not found")
    logger.info(f"GET_ITEM_SUCCESS|id={item_id}")
    return item
```

## Register Middleware in main.py
```python
from app.middleware.logging import log_requests
app.middleware("http")(log_requests)
```

## Log Format Examples
```
INFO|2026-04-29 02:39:15.784|REQUEST|method=POST|path=/api/categories|ip=127.0.0.1
INFO|2026-04-29 02:39:15.790|CREATE_CATEGORY|name=Food|type=expense|user_id=1|ip=127.0.0.1
INFO|2026-04-29 02:39:15.855|CREATE_CATEGORY_SUCCESS|id=1|name=Food
INFO|2026-04-29 02:39:15.857|RESPONSE|status=201|duration=0.073s|path=/api/categories
ERROR|2026-04-29 02:42:27.384|GET_CATEGORY_FAIL|id=999|reason=not_found
```

---

# CORS Update Rule (MANDATORY for New Modules)

## Whenever developing a new module API
ALWAYS update `application.properties` for that module's CORS config to include the frontend dev server:
```
cors.allowed_origins=http://localhost:5173,http://localhost:3000
```
- Vite dev server default port is 5173
- If `application.properties` already has origins, append (comma-separated)
- After changing CORS, restart the backend server (config loaded at startup, not hot-reloaded)
- Symptoms of missing CORS: repeated OPTIONS requests returning 400 Bad Request in backend logs
- Check frontend dev server port with `npm run dev` output and match it in CORS config

---

# Git Commit Preference

## Signature
Use the default git config. Do NOT override author/signature unless explicitly told to.

## Commit Style
- One commit per logical change (e.g., "Add logging to categories module")
- If multiple independent features: separate commits
- Commit message format: Brief description (1-2 sentences)
- Focus on "why" not "what"

---

# Build & Test
```
# Frontend
cd frontend && npm run dev    # Dev server at localhost:5173
cd frontend && npm run build  # Production build

# Backend
cd backend && uvicorn app.main:app --reload --port 8001
```---

# Session Learnings: Categories Module + CORS Fix

## CORS Configuration
- The categories backend (port 8002) had `cors.allowed_origins=http://localhost:3000` in `application.properties`, but the Vite dev server runs on port 5173 by default.
- This caused all OPTIONS preflight requests to return 400 Bad Request.
- Fix: Add `http://localhost:5173` to the comma-separated list: `cors.allowed_origins=http://localhost:3000,http://localhost:5173`
- Backend must be restarted after changing `application.properties` -- config is loaded at startup, not hot-reloaded.

## Backend Architecture (Categories Module, port 8002)
- Located at `backend/modules/categories/app/`
- Entry point: `app/main.py` -- FastAPI app with lifespan for DB init, CORS middleware, and logging middleware
- Config loaded via `application.properties` using ConfigParser (INI format, prepends `[default]` section if missing)
- Database: SQLite via SQLAlchemy, path relative: `../../database/categories.db`
- API routes: `app/api/categories.py` with prefix `/api/categories`
- CRUD: `app/crud/category.py`, Models: `app/models/category.py`, Schemas: `app/schemas/category.py`
- Custom logging middleware: `app/middleware/logging.py` using Loguru

## Frontend Architecture (React + TypeScript)
- Categories service at `frontend/src/services/categories.service.ts` uses separate axios instance for port 8002
- Env var: `VITE_CATEGORIES_API_URL` (falls back to `http://localhost:8002`)
- TanStack Query hooks: `frontend/src/hooks/useCategories.ts`
- UI components: `frontend/src/components/categories/` (CategoryBadge, CategoryCard, CategoryForm, CategoryList)
- Layout: `SidebarNav` + `MainLayout` wrapping protected routes
- `#root` in CSS must NOT have `display:flex; justify-content:center; align-items:center;` -- that centered the whole app. Changed to `width:100%; min-height:100vh;`
- Auth container needs `min-height:100vh; display:flex; justify-content:center; align-items:center;` to center login/register cards

## Key Pattern: CORS + Port Mismatch Debugging
- When seeing repeated OPTIONS 400 errors on a new module, always check:
  1. CORS allowed_origins matches the actual frontend dev server port
  2. Backend server was restarted after config changes
  3. Vite default port is 5173, not 3000

## Git Considerations
- `application.properties` contains config but no secrets -- safe to commit
- `.env` files should be gitignored
- Database `.db` files should be gitignored

---

# Session Learnings: Transactions Module

## Backend (Transactions, port 8003)
- Located at `backend/modules/transactions/app/`
- Uses separate SQLite DB: `backend/database/transactions.db`
- API endpoints:
  - `GET /api/transactions` - List with pagination & filtering (query params: user_id, type, category_id, start_date, end_date, search, sort_by, sort_order, page, page_size)
  - `POST /api/transactions` - Create transaction
  - `GET /api/transactions/{id}` - Get single
  - `PUT /api/transactions/{id}` - Update
  - `DELETE /api/transactions/{id}` - Delete
  - `GET /api/transactions/summary` - Get income/expense summary
- Paginated response: `{ items[], total, page, page_size, total_pages, has_next, has_previous }`
- Schema validation error fix: `created_at` field must be `datetime` type, not `str`

## Frontend Architecture (Transactions)
- Service: `frontend/src/services/transactions.service.ts` uses separate axios instance for port 8003
- TanStack Query hooks: `frontend/src/hooks/useTransactions.ts`
  - `useTransactions(queryParams)` - List with pagination
  - `useTransaction(id)` - Single item
  - `useCreateTransaction(userId)` - Create mutation
  - `useUpdateTransaction(userId)` - Update mutation
  - `useDeleteTransaction(userId)` - Delete mutation
  - `useTransactionSummary(userId)` - Summary stats
- Types: `frontend/src/types/transaction.types.ts` (TransactionDTO, CreateTransactionData, QueryParams, etc.)
- Components: `frontend/src/components/transactions/`
  - TransactionCard.tsx - Individual transaction display
  - TransactionForm.tsx - Modal form with Zod validation, type toggle, category dropdown
  - TransactionList.tsx - Paginated table with filters (type, category, date range, search), sorting, pagination
  - TransactionSummary.tsx - Income/expense/net summary cards
- Page: `frontend/src/pages/TransactionsPage.tsx` - Composes all components with CRUD + modals

## Fix: ResponseValidationError
- Error: `Input should be a valid string` for `created_at` field
- Root cause: Pydantic schema expected `str` but SQLAlchemy model returned `datetime`
- Fix: Change `created_at: str` to `created_at: datetime` in `app/schemas/transaction.py`

## Fix: CORS Port Mismatch (5174)
- Frontend running on port 5174 (not 5173)
- Backend CORS only allowed 5173
- Fix: Add `http://localhost:5174` to all module CORS configs:
  - `backend/modules/auth/application.properties`
  - `backend/modules/categories/application.properties`
  - `backend/modules/transactions/application.properties`
- Restart backend after changing CORS

## UI Styling: Add Button
- Old: Full-width button using `.btn.btn-primary` class
- New: Compact button with gradient, icon box, hover lift effect
- CSS class: `.btn-add-transaction` in `frontend/src/index.css`
- Pattern: Follow existing component patterns (e.g., CategoryForm modal)

---

# Session Learnings: Transactions Fixes + Dark Mode

## Transactions Page Sticky Footer
- Added sticky footer with income (green) and expense (red) totals
- Backend API accepts string dates (YYYY-MM-DD), not datetime objects
- All currency displays use INR (₹) by default

## Backend Fix: 422 Error on /summary
- Root cause: Route ordering — FastAPI matched `/{transaction_id}` before `/summary`
- Fix: Moved `/summary` endpoint before `/{transaction_id}` in `app/api/transactions.py`

## Backend Fix: NaN in Summary
- Root cause: Backend returned `balance`/`transaction_count`, frontend expected `net`/`count`
- Fix: Changed backend to return `net`/`count`, added `|| 0` guards in frontend components

## Currency Unification
- Some components used USD (`en-US`), others hardcoded ₹
- Fix: Changed all to INR via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`

## Dark Mode Implementation
- Uses CSS variable overrides with `.dark` class on `document.documentElement`
- Toggle button in SidebarNav with ☀️/🌙 icons
- Theme persists in localStorage, respects system color scheme preference
- Theme store: `frontend/src/stores/theme.store.ts` with Zustand
- Initialization: `ThemeInit` component in `main.tsx` applies dark class on initial render
- CSS overrides in `frontend/src/index.css` using `.dark` selector

## Build Fixes
- TransactionForm.tsx: Zod amount validation invalid — replaced invalid `invalid_type_error` with `z.number().min(0.01)`
- TransactionList.tsx: Unused TransactionCard import removed

## Commit History
- 6bbdb84: Transactions fixes (sticky footer, route ordering, currency, NaN)
- 199fb05: Dark mode toggle with persistence
- 648c688: Build fixes (zod schema, unused import)

## Backend Running Config
- Backend: Port 8003 (PID 23752)
- Summary response: `{"total_income":0.0,"total_expense":0.0,"net":0.0,"count":0}`

## Files Modified
- `frontend/src/pages/TransactionsPage.tsx` - Sticky footer, INR formatting
- `frontend/src/index.css` - Sticky footer styles, dark mode CSS overrides
- `backend/modules/transactions/app/api/transactions.py` - Route ordering fix
- `backend/modules/transactions/app/crud/transaction.py` - Returns net/count, date type fix
- `frontend/src/components/transactions/TransactionSummary.tsx` - INR formatting, || 0 guard
- `frontend/src/components/transactions/TransactionCard.tsx` - ₹ formatting, || 0 guard
- `frontend/src/components/transactions/TransactionList.tsx` - ₹ formatting, || 0 guard, unused import removed
- `frontend/src/stores/theme.store.ts` - Theme state management, localStorage persistence
- `frontend/src/main.tsx` - Theme initialization on mount
- `frontend/src/components/layout/SidebarNav.tsx` - Dark mode toggle button
- `frontend/src/components/transactions/TransactionForm.tsx` - Fixed zod amount validation
