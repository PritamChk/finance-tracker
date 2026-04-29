# Implementation Plan: Frontend AuthModule

> **Status: IMPLEMENTATION COMPLETED** - Last Updated: April 30, 2026

## Progress Tracking
| Milestone | Status | Date Completed | Notes |
| :--- | :---: | :---: | :--- |
| Token Type Mismatch Fix | COMPLETED | Apr 30, 2026 | Backend returns `access_token` only, not `refresh_token` |
| AuthResponse Interface Update | COMPLETED | Apr 30, 2026 | Updated to match backend response structure |
| LoginPage Update | COMPLETED | Apr 30, 2026 | Pass empty string for refresh_token field |
| Backend Logout Endpoint | COMPLETED | Apr 30, 2026 | Added `/auth/logout` to backend |
| DashboardPage Logout Button | COMPLETED | Apr 30, 2026 | Added logout functionality |
| State Management Simplification | COMPLETED | Apr 30, 2026 | Removed TanStack Query, use Zustand only |
| React StrictMode Removal | COMPLETED | Apr 30, 2026 | Removed from main.tsx - caused double API calls |

## Implementation Summary
The authentication module has been fully implemented with:
- **Zustand Store** (`src/stores/auth.store.ts`) - Session state management
- **Auth Service** (`src/services/auth.service.ts`) - API methods matching backend
- **Login Page** (`src/pages/LoginPage.tsx`) - Login form with setAuth call
- **Dashboard Page** (`src/pages/DashboardPage.tsx`) - Protected page with logout button
- **Backend Auth Endpoints** (`backend/modules/auth/app/api/auth.py`) - All auth endpoints

### Key Technical Details
- Backend Login Response: `{ "access_token": "...", "token_type": "bearer" }` - NO refresh_token
- Backend /me Response: `{ id, email, full_name, is_active, created_at }`
- Backend Routes Prefix: All auth routes use `/api/auth/*`

---

This document provides a detailed implementation plan for the `AuthModule` of the FinanceTrackerApp, based on the overall frontend strategy, design system, and backend API specifications.

### Key Implementation Decisions

## 1. Overview
The `AuthModule` is responsible for handling user authentication, registration, session persistence, and access control. It will integrate with the Backend Auth API and manage the global authentication state using a combination of Zustand and TanStack Query.

### Backend API Mapping
| Endpoint | Method | Purpose | Frontend Trigger |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Create new user account | Registration Form submission |
| `/auth/login` | `POST` | Authenticate user & get tokens | Login Form submission |
| `/auth/refresh` | `POST` | Renew expired access token | Axios 401 Interceptor |
| `/auth/me` | `GET` | Fetch current user profile | App initialization / `useAuth` hook |

---

## 2. API Service Layer
The service layer will be built using Axios to provide a consistent interface for HTTP requests with built-in security and session management.

### Axios Configuration (`src/services/api.ts`)
- **Base Instance:** Configure `baseURL` from `import.meta.env.VITE_API_URL`.
- **Request Interceptor:** Automatically attach the JWT access token from `localStorage` to the `Authorization: Bearer <token>` header for all requests.
- **Response Interceptor (Refresh Logic):**
  - Intercept `401 Unauthorized` responses.
  - If a `refreshToken` exists, call `POST /auth/refresh` to obtain a new access token.
  - Retry the original request with the new token.
  - If refresh fails, clear the auth store and redirect the user to `/login`.

### Auth Service (`src/services/auth.service.ts`)
Implement specific methods for each endpoint:
- `register(data: RegisterRequest): Promise<AuthResponse>`
- `login(data: LoginRequest): Promise<AuthResponse>`
- `refresh(token: string): Promise<AuthResponse>`
- `getCurrentUser(): Promise<User>`

---

## 3. State Management
A hybrid approach will be used to separate volatile session state from server-synced user data.

### Global Client State (`src/stores/auth.store.ts`)
Use **Zustand** to track the immediate authentication status:
- **State:**
  - `isAuthenticated: boolean`
  - `accessToken: string | null`
  - `refreshToken: string | null`
- **Actions:**
  - `setAuth(tokens: AuthResponse)`: Save tokens to store and `localStorage`.
  - `clearAuth()`: Remove tokens from store and `localStorage`, set `isAuthenticated` to false.

### Server State (`src/hooks/useAuth.ts`)
Use **TanStack Query** to manage the user profile:
- **Query:** `useQuery(['user'], authService.getCurrentUser)`
- **Purpose:** Ensures the user profile is cached and synchronized across the application.
- **Logic:** If the query fails with a 401, trigger `clearAuth()` in the Zustand store.

---

## 4. UI Implementation
The UI will strictly follow the `component-showcase.html` and `color-scheme.md` guidelines.

### Shared UI Components
- **Container:** `Card` component (`.card`) to wrap forms, centered on the page.
- **Inputs:** `.input` with `.label` for field descriptions. Use `.input-error` for validation failures.
- **Buttons:** `.btn.btn-primary.btn-md` for submissions.

### Login View (`src/pages/LoginPage.tsx`)
- **Layout:** A centered card containing the `LoginForm`.
- **Form Fields:**
  - Email (Type: email, Required)
  - Password (Type: password, Required)
- **Styling:** 
  - Primary Button: `--primary-500` background, white text.
  - Typography: Page title using `--text-3xl` and `--gray-900`.
- **Interaction:** On success $\rightarrow$ Redirect to `/dashboard`.

### Registration View (`src/pages/RegisterPage.tsx`)
- **Layout:** A centered card containing the `RegisterForm`.
- **Form Fields:**
  - Full Name (Required)
  - Email (Required)
  - Password (Required)
  - Confirm Password (Must match Password)
- **Styling:** Consistent with Login View.
- **Interaction:** On success $\rightarrow$ Redirect to `/login` with a success toast.

---

## 5. Routing & Security
Access control will be implemented via a wrapper component to prevent unauthorized access to the application.

### Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- **Logic:**
  - Check `authStore.isAuthenticated`.
  - If `false` and no tokens are in `localStorage`, redirect to `/login`.
  - If `true`, render the children components.
- **Usage:** Wrap all private pages (Dashboard, Transactions, etc.) in `App.tsx`.

### Navigation Flow
- **Unauthenticated $\rightarrow$ Protected Page:** Redirect to `/login`.
- **Authenticated $\rightarrow$ `/login` or `/register`:** Redirect to `/dashboard`.
- **Logout $\rightarrow$ Any Page:** Call `clearAuth()` and redirect to `/login`.

---

## 6. Error Handling
Consistent feedback is critical for a professional user experience.

### Form Validation
- **Library:** `React Hook Form` + `Zod`.
- **Client-side checks:** 
  - Email format validation.
  - Password strength (e.g., min 8 characters).
  - Password confirmation match.
- **Feedback:** Display errors below inputs using `--danger-600` text and `--text-xs` font size.

### API Error Feedback
- **Global Toast:** Use a toast notification system (via shadcn/ui) to display generic API errors (e.g., "Network Error", "Server Unavailable").
- **Auth-Specific Errors:** Map backend error codes to user-friendly messages:
  - `409 Conflict` $\rightarrow$ "Email already registered."
  - `401 Unauthorized` $\rightarrow$ "Invalid email or password."
  - `400 Bad Request` $\rightarrow$ "Please check your input and try again."
## 7. Key Implementation Decisions
### Deviations from Original Plan
| Decision | Original Plan | Actual Implementation | Reason |
| :--- | :--- | :--- | :--- |
| State Management | Zustand + TanStack Query hybrid | Zustand only | Simplicity - TanStack Query added unnecessary complexity |
| Token Storage | Both access + refresh tokens | Access token only | Backend only returns `access_token`, no `refresh_token` |
| Logout | Not specified | `navigate('/login', { replace: true })` | Prevent back-button issues after logout |
### Resolved Issues
1. **Token Type Mismatch**: Backend returns `access_token` only, but frontend expected `refresh_token`. Fixed by updating `AuthResponse` interface to match backend.
2. **Logout Returns 401**: Even though `/me` worked, `/logout` returned 401. Fixed by simplifying to Zustand-only approach.
3. **React StrictMode Double Calls**: Caused duplicate API calls in development. Fixed by removing StrictMode from `main.tsx`.
### Navigation Strategy
- Logout: `navigate('/login', { replace: true })` prevents back-button returning to protected pages
