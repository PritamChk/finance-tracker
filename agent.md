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

# Build & Test
```
# Frontend
cd frontend && npm run dev    # Dev server at localhost:5173
cd frontend && npm run build  # Production build

# Backend
cd backend && uvicorn app.main:app --reload --port 8001
```