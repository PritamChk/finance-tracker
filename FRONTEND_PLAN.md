# FinanceTrackerApp Frontend Plan

## Context
Building frontend for personal finance tracking application. Backend provides REST API with JWT authentication. Users need to track transactions, manage budgets, categorize spending, and view analytics through a responsive web interface.

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query) for server state, Zustand for client state
- **UI Library:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Icons:** Lucide React

## Project Structure
```
finance-tracker-frontend/
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component with router
│   ├── index.css                # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── auth/                # Auth-related components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── transactions/        # Transaction components
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionCard.tsx
│   │   ├── categories/          # Category components
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   └── CategoryBadge.tsx
│   │   ├── budgets/             # Budget components
│   │   │   ├── BudgetList.tsx
│   │   │   ├── BudgetForm.tsx
│   │   │   └── BudgetProgress.tsx
│   │   ├── analytics/           # Analytics components
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── SpendingChart.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── BudgetStatus.tsx
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── pages/                   # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── BudgetsPage.tsx
│   │   └── AnalyticsPage.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useCategories.ts
│   │   ├── useBudgets.ts
│   │   └── useAnalytics.ts
│   ├── services/                # API service layer
│   │   ├── api.ts               # Axios instance setup
│   │   ├── auth.service.ts
│   │   ├── categories.service.ts
│   │   ├── transactions.service.ts
│   │   ├── budgets.service.ts
│   │   └── analytics.service.ts
│   ├── stores/                  # Zustand stores
│   │   └── auth.store.ts
│   ├── types/                   # TypeScript types
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── category.types.ts
│   │   ├── transaction.types.ts
│   │   └── budget.types.ts
│   ├── lib/                     # Utility functions
│   │   ├── utils.ts
│   │   └── formatters.ts
│   └── config/                  # Configuration
│       └── api.config.ts
├── public/                      # Static assets
├── .env                         # Environment variables
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Key Features & Pages

### 1. Authentication Flow
- **Login Page:** Email/password form with validation
- **Register Page:** Registration form with password confirmation
- **Protected Routes:** Wrapper component to check auth state
- **Token Management:** Auto-refresh tokens, handle expiry

### 2. Dashboard (Home)
- Summary cards: Total income, expenses, balance
- Recent transactions list (last 5-10)
- Quick budget status overview
- Quick action buttons (add transaction, add category)

### 3. Transactions Management
- **List View:** Paginated table with filters (date range, category, type)
- **Create/Edit Form:** Modal or drawer with form validation
- **Delete Confirmation:** Dialog with confirmation
- **Search:** Real-time search by description
- **Sort:** Sort by date, amount, category

### 4. Categories Management
- **List View:** Grid or list of categories with color badges
- **Create/Edit Form:** Name, type (income/expense), color picker
- **Delete:** Check if category has transactions before delete
- **Default Categories:** Pre-populate common categories on registration

### 5. Budgets Management
- **List View:** Cards showing budget name, amount, period, progress bar
- **Create/Edit Form:** Category selection, amount, period, date range
- **Progress Tracking:** Visual progress bar with percentage and remaining
- **Alerts:** Visual warning when over budget

### 6. Analytics Dashboard
- **Summary Cards:** Total income, expenses, net balance for selected period
- **Spending by Category:** Pie/donut chart
- **Monthly Trends:** Line/bar chart showing income vs expenses over time
- **Budget Status:** All budgets with progress indicators
- **Date Range Picker:** Filter analytics by time period

## Implementation Steps

### Phase 1: Project Setup
1. Initialize Vite + React + TypeScript project
2. Install dependencies: react-router-dom, @tanstack/react-query, axios, zustand, recharts, react-hook-form, zod, date-fns, lucide-react
3. Set up Tailwind CSS
4. Initialize shadcn/ui
5. Configure Vite proxy for API calls
6. Set up ESLint and Prettier

### Phase 2: Foundation & Configuration
1. Create TypeScript types matching backend schemas
2. Set up Axios instance with interceptors (auth token, error handling)
3. Create API service layer for all endpoints
4. Set up React Query client and provider
5. Create Zustand auth store
6. Configure React Router routes

### Phase 3: Authentication
1. Build login form with validation
2. Build registration form with validation
3. Implement auth hooks (useAuth)
4. Create ProtectedRoute component
5. Handle token storage (localStorage/httpOnly cookie)
6. Implement auto-logout on token expiry

### Phase 4: Layout & Navigation
1. Create MainLayout with header and sidebar
2. Build responsive navigation
3. Add user menu with logout
4. Implement mobile drawer/sidebar
5. Add loading states and error boundaries

### Phase 5: Transactions
1. Build TransactionList component with pagination
2. Create TransactionForm with validation
3. Implement filters (date range, category, type)
4. Add search functionality
5. Create TransactionCard for list items
6. Implement optimistic updates with React Query

### Phase 6: Categories
1. Build CategoryList component
2. Create CategoryForm with color picker
3. Implement CategoryBadge for display
4. Add delete confirmation with dependency check
5. Create default categories on user registration

### Phase 7: Budgets
1. Build BudgetList component
2. Create BudgetForm with date range picker
3. Implement BudgetProgress component with visual bar
4. Add budget alerts (over budget warning)
5. Show remaining amount calculation

### Phase 8: Analytics
1. Build SummaryCards component
2. Create SpendingChart (pie/donut) using Recharts
3. Create TrendChart (line/bar) using Recharts
4. Build BudgetStatus overview
5. Implement date range filter
6. Add loading states for charts

### Phase 9: Polish & UX
1. Add loading skeletons
2. Implement error toasts/notifications
3. Add empty states for all pages
4. Implement form validation feedback
5. Add keyboard shortcuts
6. Optimize for mobile responsiveness
7. Add dark mode support

### Phase 10: Testing
1. Write unit tests for utility functions
2. Test React Query hooks
3. Test form validation
4. Add E2E tests with Playwright
5. Test responsive layouts

## API Integration Details

### Base Configuration
```typescript
// config/api.config.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### Auth Interceptor
- Attach JWT token to all requests
- Handle 401 responses (refresh token or logout)
- Show error notifications on API failures

### React Query Configuration
- Stale time: 5 minutes for most data
- Cache time: 10 minutes
- Retry on failure: 3 times
- Optimistic updates for mutations

## Key Implementation Details

### State Management Strategy
- **Server State:** TanStack Query (caching, refetching, optimistic updates)
- **Client State:** Zustand (auth state, UI preferences)
- **Form State:** React Hook Form (validation, submission)

### Error Handling
- Global error boundary
- API error interceptor with toast notifications
- Form-level validation errors
- 404/401/403 handling

### Performance
- Code splitting with React Router lazy loading
- Image optimization
- Debounced search inputs
- Virtual scrolling for large lists
- Memoized components where needed

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile
- Touch-friendly targets (44px minimum)

## Environment Variables
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=FinanceTracker
```

## Verification

### Manual Testing
1. Start dev server: `npm run dev`
2. Test auth flow (register → login → access protected pages)
3. Create categories and verify they appear in forms
4. Add transactions and check they appear in list and dashboard
5. Create budgets and verify progress tracking
6. Check analytics charts render correctly
7. Test responsive design on different screen sizes
8. Verify error handling (network errors, validation errors)

### Automated Testing
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

## Critical Files to Create
- `src/services/api.ts` - Axios instance with interceptors
- `src/stores/auth.store.ts` - Auth state management
- `src/hooks/useAuth.ts` - Auth hook
- `src/components/auth/ProtectedRoute.tsx` - Route protection
- `src/pages/DashboardPage.tsx` - Main dashboard
- `src/components/analytics/SpendingChart.tsx` - Analytics visualization

## Next Steps After Frontend
1. Add PWA support for offline access
2. Implement data export (CSV/PDF)
3. Add recurring transactions feature
4. Integrate bank APIs (Plaid/Yodlee)
5. Add notification system for budget alerts
6. Implement multi-currency support
