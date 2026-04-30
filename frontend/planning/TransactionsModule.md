# Implementation Plan: Frontend TransactionsModule

> **Status: IMPLEMENTED** - April 30, 2026

## Progress Tracking
| Milestone | Status | Date Completed | Notes |
| :--- | :---: | :---: | :--- |
| Transactions Service Layer | COMPLETED | Apr 30, 2026 | Axios calls to backend port 8003 |
| Transaction Types & Interfaces | COMPLETED | Apr 30, 2026 | Match backend schema |
| useTransactions Hook | COMPLETED | Apr 30, 2026 | TanStack Query wrapper |
| Transaction List Component | COMPLETED | Apr 30, 2026 | Paginated table with filters |
| Transaction Form Component | COMPLETED | Apr 30, 2026 | Create/edit with Zod validation |
| Transaction Card Component | COMPLETED | Apr 30, 2026 | Individual row/card for list |
| Transaction Summary Component | COMPLETED | Apr 30, 2026 | Income/expense summary cards |
| Transactions Page | COMPLETED | Apr 30, 2026 | Full CRUD page |
| Route & Layout Integration | COMPLETED | Apr 30, 2026 | App.tsx route + sidebar link |

## Backend API Mapping (port 8003)
| Endpoint | Method | Purpose | Frontend Trigger |
| :--- | :--- | :--- | :--- |
| `/api/transactions` | `GET` | List with pagination, filtering, search, sort | Page load, filter/sort change, pagination |
| `/api/transactions` | `POST` | Create new transaction | Form submission |
| `/api/transactions/{id}` | `GET` | Get single transaction | Edit form prefill |
| `/api/transactions/{id}` | `PUT` | Update transaction | Form submission (edit) |
| `/api/transactions/{id}` | `DELETE` | Delete transaction | Delete button + confirmation |
| `/api/transactions/summary` | `GET` | Summary stats (income/expense totals) | Dashboard load, date range change |

### Backend Schemas

**TransactionResponse:**
```
{
  id: number
  user_id: number
  category_id: number | null
  type: "income" | "expense"
  amount: float (>0)
  description: string | null (max 500)
  date: datetime
  created_at: string
}
```

**TransactionQueryParams:**
```
user_id: int (required)
transaction_type: "income" | "expense" | null
category_id: int | null
start_date: datetime | null
end_date: datetime | null
search: string | null
sort_by: "date" | "amount" | "created_at" (default: "date")
sort_order: "asc" | "desc" (default: "desc")
page: int (default: 1)
page_size: int (default: 20, max: 100)
```

**PaginatedResponse:**
```
{
  items: TransactionResponse[]
  total: int
  page: int
  page_size: int
  total_pages: int
  has_next: bool
  has_previous: bool
}
```

**TransactionCreate:**
```
{
  type: "income" | "expense"
  amount: float (>0)
  description: string | null (max 500)
  date: datetime
  user_id: int
  category_id: int | null
}
```

**TransactionUpdate (all optional):**
```
{
  type?: "income" | "expense"
  amount?: float (>0)
  description?: string (max 500)
  date?: datetime
  category_id?: int | null
}
```

## File Structure (new files)
```
src/
├── services/
│   └── transactions.service.ts     # Axios CRUD calls to port 8003
├── types/
│   └── transaction.types.ts        # TypeScript interfaces
├── hooks/
│   └── useTransactions.ts          # TanStack Query hooks
├── components/
│   └── transactions/
│       ├── TransactionList.tsx      # Paginated table with filters
│       ├── TransactionForm.tsx      # Modal form (create/edit)
│       ├── TransactionCard.tsx      # Single transaction row
│       └── TransactionSummary.tsx   # Summary cards (income/expense/balance)
└── pages/
    └── TransactionsPage.tsx        # Full CRUD page
```

### Modified files
```
src/App.tsx                        # Add /transactions route + sidebar link
src/components/layout/SidebarNav.tsx # Add Transactions nav link
```

## 1. Service Layer (`src/services/transactions.service.ts`)

```typescript
const TRANSACTIONS_API_URL = import.meta.env.VITE_TRANSACTIONS_API_URL || 'http://localhost:8003';

const transactionsApi = axios.create({
  baseURL: TRANSACTIONS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
transactionsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface TransactionQueryParams {
  user_id: number;
  transaction_type?: "income" | "expense";
  category_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: "date" | "amount" | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const transactionsService = {
  list(params: TransactionQueryParams): Promise<PaginatedResponse<TransactionDTO>>,
  create(data: CreateTransactionData): Promise<TransactionDTO>,
  getById(id: number): Promise<TransactionDTO>,
  update(id: number, data: UpdateTransactionData): Promise<TransactionDTO>,
  delete(id: number): Promise<void>,
  getSummary(userId: number, startDate?: string, endDate?: string): Promise<{total_income: number; total_expense: number; net: number; count: number}>,
};
```

## 2. Types (`src/types/transaction.types.ts`)

```typescript
export interface TransactionDTO {
  id: number;
  user_id: number;
  category_id: number | null;
  type: "income" | "expense";
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}

export interface CreateTransactionData {
  type: "income" | "expense";
  amount: number;
  description?: string;
  date: string;
  user_id: number;
  category_id?: number;
}

export interface UpdateTransactionData {
  type?: "income" | "expense";
  amount?: number;
  description?: string;
  date?: string;
  category_id?: number;
}

export interface TransactionQueryParams {
  user_id: number;
  transaction_type?: "income" | "expense";
  category_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: "date" | "amount" | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface PaginatedTransactions {
  items: TransactionDTO[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net: number;
  count: number;
}
```

## 3. State Management

### useTransactions Hook (`src/hooks/useTransactions.ts`)
- `useTransactions(params)` — Fetch paginated list, staleTime 5min, refetch on filter/page change
- `useTransaction(id)` — Fetch single transaction
- `useCreateTransaction()` — Mutation with list invalidation
- `useUpdateTransaction()` — Mutation with single + list invalidation
- `useDeleteTransaction()` — Mutation with list invalidation
- `useTransactionSummary(userId, startDate?, endDate?)` — Fetch summary stats

All mutations should use `queryKey: ['transactions', userId, params]` for proper cache invalidation.

## 4. UI Components

### TransactionCard
- Table row or card layout showing:
  - Type badge (Income: green pill / Expense: red pill) — reuse `.badge-income` / `.badge-expense` from color-scheme
  - Description text
  - Category name (if available, via category_id lookup)
  - Date (formatted with date-fns)
  - Amount (colored: green for income, red for expense, with +/- prefix)
  - Action buttons: Edit, Delete
- Responsive: table on desktop, card list on mobile

### TransactionList
- **Pagination:** Page controls (prev/next, page numbers) using `has_next`, `has_previous`, `total_pages`
- **Filters:**
  - Type toggle: All | Income | Expense (pill buttons, reuse `.category-filter-btn` pattern)
  - Category dropdown (populated from categories API)
  - Date range: start date + end date inputs
  - Search: debounced text input (300ms) filtering by description
- **Sort:** Clickable column headers (Date, Amount, Created At) with asc/desc indicator
- Empty state when no transactions match filters
- Loading skeleton rows during fetch

### TransactionForm
- Modal dialog with fields:
  - Type toggle: Income / Expense (reuse `.type-toggle` / `.type-btn` pattern)
  - Amount (number input, required, >0 validation)
  - Description (text input, optional, max 500 chars)
  - Date (date input, required, defaults to today)
  - Category (dropdown select, optional, populated from categories hook)
- Validation: Zod schema (type, amount, date required; description optional)
- Submit: Create or Update based on context
- Pre-fill fields when editing existing transaction

### TransactionSummary
- Three summary cards in a responsive grid:
  - Total Income (green, with currency formatting)
  - Total Expenses (red, with currency formatting)
  - Net Balance (primary color, positive = green, negative = red)
- Each card shows amount + transaction count
- Reuses `.card` styling from color-scheme

## 5. TransactionsPage

Layout:
- **Summary Section:** TransactionSummary cards at top
- **Header:** "Transactions" title + "Add Transaction" button
- **Filter Bar:** Type toggle, category dropdown, date range, search input (inline row)
- **Table:** TransactionList with pagination at bottom
- **Modal:** TransactionForm for create/edit
- **Delete Confirmation:** Dialog to prevent accidental deletion

## 6. Routing & Integration

```tsx
// App.tsx - add route
<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <MainLayout>
        <TransactionsPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

// SidebarNav.tsx - add nav link between Dashboard and Categories
{/* using lucide-react Wallet or ArrowLeftRight icon */}
<NavLink to="/transactions" className={sidebar link classes}>
  <Wallet size={18} />
  <span>Transactions</span>
</NavLink>
```

## 7. Styling Approach

Use existing CSS custom properties from `index.css` and patterns from `color-scheme.md`:
- Transaction type badges: `.badge-income` / `.badge-expense` (reuse)
- Amount colors: `--success-600` for income, `--danger-600` for expense
- Table: reuse `.table`, `.table-header`, `.table-row` patterns
- Summary cards: `.card` with colored amount text
- Filter buttons: `.category-filter-btn` style (reuse)
- Form: `.input`, `.label`, `.form-group` (reuse)

New styles needed in `index.css` or a dedicated `transactions.css`:
- `.transactions-page` — max-width container
- `.transactions-header` — title + add button row
- `.transactions-filters` — filter bar layout
- `.transaction-amount-income` / `.transaction-amount-expense` — amount coloring
- `.pagination` — page controls
- `.search-input` — with icon prefix

## 8. Error Handling

- Form validation: Zod + react-hook-form, inline error messages with `--danger-600`
- API errors: toast notifications (network errors, 500s)
- Delete confirmation: dialog to prevent accidental deletion
- Empty states: "No transactions found" message with CTA to add first
- Loading states: skeleton rows in table during fetch
- Pagination edge cases: handle empty pages gracefully

## Key Implementation Decisions

| Decision | Rationale |
| :--- | :--- |
| Separate API URL for transactions | Backend runs on port 8003 (auth=8001, categories=8002) |
| TanStack Query for transactions | Server-synced data, caching, pagination query keys |
| Paginated list from backend | Backend provides full pagination support, avoids over-fetching |
| Debounced search | 300ms debounce prevents excessive API calls |
| Summary fetched separately | Can be reused on DashboardPage, not tied to list component |
| Table layout over cards | Transactions are tabular data (date, desc, amount, actions) |
| Category dropdown in form | References categories API data for consistent category selection |

## Next Steps
1. Create `transaction.types.ts` with all TypeScript interfaces
2. Create `transactions.service.ts` with Axios CRUD + summary call
3. Create `useTransactions.ts` with TanStack Query hooks
4. Build TransactionCard component
5. Build TransactionForm with Zod validation
6. Build TransactionList with filters, sort, pagination
7. Build TransactionSummary cards
8. Build TransactionsPage composing all components
9. Update App.tsx routes + SidebarNav.tsx with Transactions link