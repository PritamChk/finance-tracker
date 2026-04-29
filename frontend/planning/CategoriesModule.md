# Implementation Plan: Frontend CategoriesModule

> **Status: PLANNED** - April 30, 2026

## Progress Tracking
| Milestone | Status | Date Completed | Notes |
| :--- | :---: | :---: | :--- |
| Categories Service Layer | PENDING | - | Axios calls to backend port 8002 |
| Category Types & Interfaces | PENDING | - | Match backend schema |
| useCategories Hook | PENDING | - | TanStack Query wrapper |
| Sidebar Navigation | PENDING | - | Persistent sidebar for protected routes |
| Category Badge Component | PENDING | - | Reusable colored badge |
| Category Card Component | PENDING | - | Individual category display |
| Category Form Component | PENDING | - | Create/edit with Zod validation |
| Category List Component | PENDING | - | Grid view with type filter |
| Categories Page | PENDING | - | Full CRUD page |
| Route & Layout Integration | PENDING | - | App.tsx + MainLayout |

## Backend API Mapping (port 8002)
| Endpoint | Method | Purpose | Frontend Trigger |
| :--- | :--- | :--- | :--- |
| `/api/categories?user_id={id}` | `GET` | List categories (optional `category_type` filter) | Page load, filter change |
| `/api/categories` | `POST` | Create new category | Form submission |
| `/api/categories/{id}` | `GET` | Get single category | Edit form prefill |
| `/api/categories/{id}` | `PUT` | Update category | Form submission (edit) |
| `/api/categories/{id}` | `DELETE` | Delete category | Delete button + confirmation |

### Backend Schema
```
Category: {
  id: number
  name: string (1-100 chars)
  type: "income" | "expense"
  color: string (hex, e.g. "#3b82f6")
  user_id: number
  created_at: datetime
}
```

## Architecture Decision: Sidebar Navigation

### Rationale
The app is growing beyond a single dashboard. A persistent sidebar provides:
- Easy navigation between modules (Dashboard, Categories, future pages)
- Mobile-responsive collapsible navigation
- Consistent layout across all protected routes

### Layout Structure
All protected routes will be wrapped in `MainLayout` which contains:
- `SidebarNav` — Left sidebar with nav links, active state highlighting, collapse toggle
- Content area — Renders the actual page content

### File Structure (new files)
```
src/
├── services/
│   └── categories.service.ts       # Axios CRUD calls to port 8002
├── types/
│   └── category.types.ts           # TypeScript interfaces
├── hooks/
│   ├── useCategories.ts            # TanStack Query hook
│   └── useSidebar.ts               # Zustand store for sidebar state
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx      # Existing
│   ├── categories/
│   │   ├── CategoryList.tsx        # Grid/list with filter tabs
│   │   ├── CategoryForm.tsx        # Modal form (create/edit)
│   │   ├── CategoryCard.tsx        # Single category card
│   │   └── CategoryBadge.tsx       # Colored pill badge
│   └── layout/
│       ├── SidebarNav.tsx          # Sidebar with nav links
│       └── MainLayout.tsx          # Layout wrapper
└── pages/
    ├── DashboardPage.tsx           # Modified: content-only
    └── CategoriesPage.tsx          # Full CRUD page
```

### Modified files
```
src/App.tsx          # Add /categories route, wrap protected routes in MainLayout
```

## 1. Service Layer (`src/services/categories.service.ts`)

```typescript
// API base: import.meta.env.VITE_CATEGORIES_API_URL (default: http://localhost:8002)

interface CategoryDTO {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
  user_id: number;
  created_at: string;
}

const categoriesService = {
  list(userId: number, type?: "income" | "expense"): Promise<CategoryDTO[]>,
  create(data: { name: string; type: string; color: string; user_id: number }): Promise<CategoryDTO>,
  getById(id: number): Promise<CategoryDTO>,
  update(id: number, data: { name?: string; type?: string; color?: string }): Promise<CategoryDTO>,
  delete(id: number): Promise<void>,
};
```

## 2. State Management

### useCategories Hook (TanStack Query)
- `useCategories(userId)` — Fetch all categories, staleTime 5min
- `useCategory(id)` — Fetch single category
- `useCreateCategory()` — Mutation with optimistic update
- `useUpdateCategory()` — Mutation with optimistic update
- `useDeleteCategory()` — Mutation with invalidation

### useSidebar Store (Zustand)
- `isOpen: boolean` — Sidebar open/collapsed state
- `toggle()` — Toggle sidebar
- `close()` — Close sidebar (mobile)

## 3. UI Components

### CategoryBadge
- Pill-shaped badge with background color from category.color
- Text: category name
- Income type: green border/accent (fallback)
- Expense type: red border/accent (fallback)

### CategoryCard
- Card layout with color indicator bar/strip
- Category name (bold)
- Type label ("Income" / "Expense")
- Action buttons: Edit, Delete (with confirmation)

### CategoryForm
- Modal or inline form with fields:
  - Name (required, max 100 chars)
  - Type selector (radio/toggle: Income / Expense)
  - Color picker (preset palette + custom hex input)
- Validation: Zod schema
- Submit: Create or Update based on context

### CategoryList
- Filter tabs: All | Income | Expense
- Grid layout (responsive: 1 col mobile, 2-3 col desktop)
- Empty state message when no categories
- Loading skeleton during fetch

### SidebarNav
- Fixed left sidebar
- Nav items: Dashboard, Categories (expandable)
- Active link highlighted with primary color
- Collapse toggle button
- Mobile: overlay mode (slides in from left)

### MainLayout
- Flex container: sidebar + main content
- Sidebar width: 250px expanded, 60px collapsed
- Content area: full remaining width

## 4. CategoriesPage

Layout:
- Header: "Manage Categories" title + "Add Category" button
- Filter tabs (All / Income / Expense)
- Grid of CategoryCard components
- Modal for CategoryForm (create/edit)
- Delete confirmation dialog

## 5. Routing & Integration

```tsx
// App.tsx
<Route path="/" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
<Route path="/categories" element={<ProtectedRoute><MainLayout><CategoriesPage /></MainLayout></ProtectedRoute>} />
```

## 6. Styling Approach

Use existing CSS custom properties from `index.css`:
- Colors: `--primary-500`, `--success-500`, `--danger-500`, `--gray-*`
- Components: `.card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Sidebar: new styles following same design token patterns
- Responsive: mobile-first, sidebar collapses at `<768px`

## 7. Error Handling

- Form validation: Zod + react-hook-form, inline error messages with `--danger-600`
- API errors: toast notifications (network errors, 500s)
- Delete confirmation: dialog to prevent accidental deletion
- Empty states: friendly message + CTA to create first category

## Key Implementation Decisions

| Decision | Rationale |
| :--- | :--- |
| Separate API URL for categories | Backend runs on port 8002, auth on 8001 |
| TanStack Query for categories | Server-synced data, caching, optimistic updates |
| Zustand for sidebar state | Simple UI toggle state |
| Sidebar layout for all protected routes | Consistent navigation as app grows |
| Category color from backend | User picks color, stored in DB, used for badge |
| Grid layout over table | Categories are visual/colorful, grid better suits |

## Next Steps
1. Create `categories.service.ts` + `category.types.ts`
2. Create `useCategories.ts` hook
3. Create sidebar layout components
4. Build category UI components (Badge → Card → Form → List)
5. Build CategoriesPage
6. Update App.tsx routes
7. Update DashboardPage for new layout
