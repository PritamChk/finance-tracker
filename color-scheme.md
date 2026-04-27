# FinanceTrackerApp - Color Scheme & Component Conventions

## Color Scheme

### Primary Colors (Brand)
```css
--primary-50:  #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6  /* Main brand color */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

### Semantic Colors

#### Income (Success - Green)
```css
--success-50:  #f0fdf4
--success-100: #dcfce7
--success-200: #bbf7d0
--success-300: #86efac
--success-400: #4ade80
--success-500: #22c55e  /* Main success color */
--success-600: #16a34a
--success-700: #15803d
--success-800: #166534
--success-900: #14532d
```

#### Expense (Danger - Red)
```css
--danger-50:  #fef2f2
--danger-100: #fee2e2
--danger-200: #fecaca
--danger-300: #fca5a5
--danger-400: #f87171
--danger-500: #ef4444  /* Main danger color */
--danger-600: #dc2626
--danger-700: #b91c1c
--danger-800: #991b1b
--danger-900: #7f1d1d
```

#### Warning (Amber)
```css
--warning-50:  #fffbeb
--warning-100: #fef3c7
--warning-200: #fde68a
--warning-300: #fcd34d
--warning-400: #fbbf24
--warning-500: #f59e0b  /* Main warning color */
--warning-600: #d97706
--warning-700: #b45309
--warning-800: #92400e
--warning-900: #78350f
```

#### Info (Blue)
```css
--info-50:  #eff6ff
--info-100: #dbeafe
--info-200: #bfdbfe
--info-300: #93c5fd
--info-400: #60a5fa
--info-500: #3b82f6
--info-600: #2563eb
--info-700: #1d4ed8
--info-800: #1e40af
--info-900: #1e3a8a
```

### Neutral Colors (Gray Scale)
```css
--gray-50:  #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### Chart Colors (Category Colors)
```css
--chart-1:  #3b82f6  /* Blue */
--chart-2:  #22c55e  /* Green */
--chart-3:  #f59e0b  /* Amber */
--chart-4:  #ef4444  /* Red */
--chart-5:  #8b5cf6  /* Purple */
--chart-6:  #ec4899  /* Pink */
--chart-7:  #06b6d4  /* Cyan */
--chart-8:  #84cc16  /* Lime */
--chart-9:  #f97316  /* Orange */
--chart-10: #6366f1  /* Indigo */
```

### Dark Mode Colors
```css
/* Backgrounds */
--dark-bg-primary:   #0f172a
--dark-bg-secondary: #1e293b
--dark-bg-tertiary:  #334155

/* Text */
--dark-text-primary:   #f8fafc
--dark-text-secondary: #cbd5e1
--dark-text-tertiary:  #94a3b8
```

## Component Conventions

### Naming Convention

#### File Naming
```
PascalCase for components:
- LoginForm.tsx
- TransactionCard.tsx
- BudgetProgress.tsx

camelCase for utilities/hooks:
- useAuth.ts
- formatDate.ts
- apiClient.ts

kebab-case for styles/assets:
- button.css
- logo.svg
```

#### Component Naming
```
- Use descriptive names: TransactionList (not List)
- Prefix with feature: TransactionCard, BudgetForm
- Suffix with type: Button, Input, Modal, Dialog
- Layout components: MainLayout, Sidebar, Header
```

#### Variable Naming
```
- camelCase for variables: userId, transactionAmount
- PascalCase for components: const TransactionCard = ...
- UPPER_SNAKE_CASE for constants: API_BASE_URL, MAX_ITEMS
- kebab-case for CSS classes: .transaction-card, .budget-progress
```

### Shape & Size Conventions

#### Border Radius
```css
--radius-sm:  4px   /* Small elements: badges, tags */
--radius-md:  8px   /* Default: buttons, inputs, cards */
--radius-lg:  12px  /* Large elements: modals, panels */
--radius-xl:  16px  /* Extra large: hero sections */
--radius-full: 9999px /* Pill shapes: badges, avatars */
```

#### Spacing Scale
```css
--space-0:  0
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

#### Font Sizes
```css
--text-xs:   0.75rem   /* 12px - captions, labels */
--text-sm:   0.875rem  /* 14px - secondary text */
--text-base: 1rem      /* 16px - body text */
--text-lg:   1.125rem  /* 18px - emphasis */
--text-xl:   1.25rem   /* 20px - headings */
--text-2xl:  1.5rem    /* 24px - section titles */
--text-3xl:  1.875rem  /* 30px - page titles */
--text-4xl:  2.25rem   /* 36px - hero text */
```

#### Component Sizes
```css
/* Buttons */
--btn-sm:  h-8 px-3 text-sm
--btn-md:  h-10 px-4 text-base
--btn-lg:  h-12 px-6 text-lg

/* Inputs */
--input-sm:  h-8 px-3 text-sm
--input-md:  h-10 px-4 text-base
--input-lg:  h-12 px-6 text-lg

/* Icons */
--icon-sm:  16px
--icon-md:  20px
--icon-lg:  24px
--icon-xl:  32px
```

## Component-Specific Conventions

### Buttons
```css
/* Variants */
.btn-primary    --primary-500 bg, white text
.btn-secondary  --gray-200 bg, --gray-900 text
.btn-success    --success-500 bg, white text
.btn-danger     --danger-500 bg, white text
.btn-ghost      transparent bg, --primary-500 text
.btn-outline    transparent bg, --primary-500 border

/* States */
.btn-hover:     opacity-0.9
.btn-active:    scale-0.98
.btn-disabled:  opacity-0.5, cursor-not-allowed
```

### Cards
```css
.card {
  background: white;
  border-radius: --radius-lg;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: --space-6;
}

.card-hover:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Badges
```css
.badge {
  border-radius: --radius-full;
  padding: --space-1 --space-3;
  font-size: --text-xs;
  font-weight: 600;
}

.badge-income  --success-100 bg, --success-700 text
.badge-expense --danger-100 bg, --danger-700 text
```

### Progress Bars
```css
.progress-bar {
  height: 8px;
  border-radius: --radius-full;
  background: --gray-200;
}

.progress-fill {
  border-radius: --radius-full;
  transition: width 0.3s ease;
}

.progress-success --success-500
.progress-warning --warning-500
.progress-danger  --danger-500
```

### Tables
```css
.table {
  border-collapse: collapse;
  width: 100%;
}

.table-header {
  background: --gray-50;
  border-bottom: 1px solid --gray-200;
  font-weight: 600;
  text-align: left;
}

.table-row {
  border-bottom: 1px solid --gray-100;
}

.table-row:hover {
  background: --gray-50;
}
```

### Modals/Dialogs
```css
.modal-overlay {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: --radius-xl;
  box-shadow: 0 20px 25px rgba(0,0,0,0.1);
  max-width: 500px;
}
```

### Form Elements
```css
.input {
  border: 1px solid --gray-300;
  border-radius: --radius-md;
  padding: --space-3 --space-4;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: --primary-500;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.input-error {
  border-color: --danger-500;
}

.label {
  font-weight: 500;
  color: --gray-700;
  margin-bottom: --space-2;
}
```

## Accessibility Standards

### Color Contrast
- Text on background: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### Focus States
```css
.focus-ring {
  outline: 2px solid --primary-500;
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum 44x44px for touch-friendly elements
- Minimum 24px spacing between interactive elements

## Dark Mode Implementation

### Toggle Pattern
```css
[data-theme="dark"] {
  --bg-primary: --dark-bg-primary;
  --bg-secondary: --dark-bg-secondary;
  --text-primary: --dark-text-primary;
  --text-secondary: --dark-text-secondary;
}
```

### Component Adaptations
- Cards: --dark-bg-secondary background
- Inputs: --dark-bg-tertiary background
- Borders: --gray-700 instead of --gray-200
- Text: --dark-text-primary instead of --gray-900

## File Structure for Colors

```
src/
├── styles/
│   ├── colors.css          # CSS custom properties
│   ├── components.css      # Component-specific styles
│   └── utilities.css       # Utility classes
├── lib/
│   └── colors.ts           # TypeScript color exports
└── tailwind.config.js      # Tailwind color config
```

## Usage Examples

### Using Colors in Components
```tsx
// TypeScript
import { colors } from '@/lib/colors';

const TransactionCard = ({ type, amount }) => (
  <div className="card">
    <span className={type === 'income' ? 'badge-income' : 'badge-expense'}>
      {type}
    </span>
    <span style={{ color: type === 'income' ? colors.success[500] : colors.danger[500] }}>
      ${amount}
    </span>
  </div>
);
```

### Using Tailwind Classes
```tsx
// Tailwind
<button className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-4 py-2">
  Submit
</button>

<div className="bg-success-100 text-success-700 rounded-full px-3 py-1 text-xs font-semibold">
  Income
</div>
```

## Verification Checklist

- [ ] Check contrast ratios using WebAIM Contrast Checker
- [ ] Test in light and dark modes
- [ ] Verify color blindness accessibility
- [ ] Test on different screen types
- [ ] Verify naming conventions
- [ ] Check consistent spacing and sizing
- [ ] Test responsive behavior
- [ ] Validate focus states
- [ ] Test touch target sizes
