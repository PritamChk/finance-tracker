# Analytics Module Plan

## Backend API (Port 8005)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/analytics/summary` | Total income, expenses, net, count |
| `GET /api/analytics/spending-by-category` | Category-wise spending breakdown |
| `GET /api/analytics/monthly-trend` | Monthly income/expense trends |
| `GET /api/analytics/income-vs-expense` | Income vs expense comparison |

## Chart Library: Nivo

**Why Nivo** — superior visuals, React-native, built-in animations, responsive, TypeScript support. Maps well to existing design system.

```bash
npm install @nivo/core @nivo/pie @nivo/line @nivo/bar
```

**Bundle impact:** ~200KB gzipped (acceptable for analytics dashboard)

---

## New Files

```
frontend/src/
├── types/analytics.types.ts          # DTOs
├── services/analytics.service.ts     # API layer
├── hooks/useAnalytics.ts             # TanStack Query hooks
├── components/analytics/
│   ├── SummaryCards.tsx              # 3 stat cards (income/expense/net)
│   ├── SpendingChart.tsx             # Pie chart (Nivo)
│   ├── TrendChart.tsx                # Line chart (Nivo)
│   ├── IncomeExpenseChart.tsx        # Bar chart (Nivo)
│   └── DateRangeFilter.tsx           # Date presets + custom range
└── pages/AnalyticsPage.tsx           # Page composition
```

---

## Types (`analytics.types.ts`)

```typescript
export interface AnalyticsSummaryDTO {
  total_income: number; total_expense: number;
  net: number; count: number;
  start_date?: string; end_date?: string;
}

export interface CategorySpendingDTO {
  category_id: number; category_name: string;
  category_color: string; amount: number; percentage: number;
}

export interface MonthlyTrendPointDTO {
  month: string; income: number; expense: number;
}
export interface MonthlyTrendDTO {
  months: MonthlyTrendPointDTO[]; start_month: string; end_month: string;
}

export interface IncomeVsExpenseDTO {
  labels: string[]; income: number[]; expense: number[];
  months: string[];
}
```

---

## Service (`analytics.service.ts`)

Follows `transactions.service.ts` pattern:
- Axios instance with `VITE_ANALYTICS_API_URL` (fallback: `http://localhost:8005`)
- Auth interceptor (Bearer token from localStorage)
- 4 methods: `getSummary`, `getSpendingByCategory`, `getMonthlyTrend`, `getIncomeVsExpense`

---

## Hooks (`useAnalytics.ts`)

Follows `useTransactions.ts` pattern:
- Query keys: `['analytics', ...]`
- Stale time: `5 * 60 * 1000` (5 min)
- `enabled: !!userId` guard on all queries

---

## Components

### SummaryCards.tsx
- 3 cards: Income (green), Expenses (red), Net (blue/adaptive)
- Reuse `.summary-card` CSS pattern from `TransactionSummary.tsx`
- INR formatting: `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`

### SpendingChart.tsx — `ResponsivePie` (Nivo)
- Map `category_color` from backend → chart colors
- Fallback to `--chart-1` through `--chart-10` CSS variables
- Dark mode: pass `theme` prop checking `.dark` class

### TrendChart.tsx — `ResponsiveLine` (Nivo)
- Green line (`--success-500`) for income, Red (`--danger-500`) for expense
- Area fill with opacity under each line
- X-axis: formatted months

### IncomeExpenseChart.tsx — `ResponsiveBar` (Nivo)
- Grouped bars: green (income) + red (expense) per month
- Values displayed on top of bars

### DateRangeFilter.tsx
- Presets: "Last 30 Days", "Last 3 Months", "Last 6 Months", "This Year"
- Custom start/end date inputs
- Follow `TransactionList.tsx` filter pattern

---

## AnalyticsPage.tsx Composition

```
[SummaryCards]       ← 3 cols desktop / 1 col mobile
[DateRangeFilter]    ← full width
[SpendingChart]      ← 1/2 width desktop, full mobile
[TrendChart]         ← full width
[IncomeExpenseChart] ← full width
```

- Loading: skeleton cards (`.skeleton-card` pattern)
- Dark mode: automatic via `.dark` class + CSS variable overrides
- Responsive: mobile-first with `sm/md/lg` breakpoints

---

## Integration Steps

1. **SidebarNav.tsx** — Add nav item: `Analytics` → `/analytics`
2. **App.tsx** — Add route: `/analytics` → `ProtectedRoute` + `AnalyticsPage`
3. **.env** — Add `VITE_ANALYTICS_API_URL=http://localhost:8005`

---

## Color Mapping (Nivo ↔ Design System)

| Element | Color |
|---------|-------|
| Income (line/bar) | `--success-500` `#22c55e` |
| Expense (line/bar) | `--danger-500` `#ef4444` |
| Category slices | `--chart-1` through `--chart-10` |
| Text (light) | `--gray-900` |
| Text (dark) | `--dark-text-primary` |
| Tooltip BG | `--gray-50` / `--dark-bg-secondary` |

---

## Implementation Order

1. `npm install @nivo/core @nivo/pie @nivo/line @nivo/bar`
2. Create `analytics.types.ts`
3. Create `analytics.service.ts`
4. Create `useAnalytics.ts`
5. Create chart components (test with mock data)
6. Create `SummaryCards.tsx` + `DateRangeFilter.tsx`
7. Create `AnalyticsPage.tsx`
8. Update `SidebarNav.tsx` → add nav item
9. Update `App.tsx` → add route
10. Add env var + test all charts
11. Verify dark mode + responsive
