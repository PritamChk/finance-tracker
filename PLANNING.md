# FinanceTrackerApp Backend Plan

## Context
Building backend for personal finance tracking application. Users need to track transactions, manage budgets, categorize spending, and view analytics. Using Python FastAPI with SQLite for simplicity and rapid development.

## Tech Stack
- **Framework:** FastAPI
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Auth:** JWT (email/password)
- **Package Manager:** uv
- **API:** REST

## Database Schema

### Users Table
```sql
- id: INTEGER PRIMARY KEY
- email: VARCHAR UNIQUE
- password_hash: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Categories Table
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK)
- name: VARCHAR
- type: ENUM (income/expense)
- color: VARCHAR (hex)
- created_at: TIMESTAMP
```

### Transactions Table
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK)
- category_id: INTEGER (FK)
- amount: DECIMAL
- type: ENUM (income/expense/transfer)
- description: VARCHAR
- date: DATE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Budgets Table
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (FK)
- category_id: INTEGER (FK)
- amount: DECIMAL
- period: ENUM (monthly/weekly/yearly)
- start_date: DATE
- end_date: DATE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Categories
- `GET /api/categories` - List user's categories
- `POST /api/categories` - Create category
- `GET /api/categories/{id}` - Get category details
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Transactions
- `GET /api/transactions` - List transactions (with filters: date range, category, type)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction details
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/{id}` - Get budget details
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget
- `GET /api/budgets/{id}/progress` - Get budget spending progress

### Analytics
- `GET /api/analytics/summary` - Overall summary (total income, expenses, balance)
- `GET /api/analytics/spending-by-category` - Spending breakdown by category
- `GET /api/analytics/monthly-trend` - Monthly income/expense trends
- `GET /api/analytics/budget-status` - All budgets with progress

## Project Structure
```
finance-tracker-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── transaction.py
│   │   └── budget.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── transaction.py
│   │   └── budget.py
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── categories.py
│   │   ├── transactions.py
│   │   ├── budgets.py
│   │   └── analytics.py
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── security.py         # JWT, password hashing
│   │   └── deps.py             # Dependencies (get_current_user)
│   └── crud/                   # Database operations
│       ├── __init__.py
│       ├── user.py
│       ├── category.py
│       ├── transaction.py
│       └── budget.py
├── alembic/                    # Database migrations
├── tests/                      # Tests
├── .env                        # Environment variables
├── pyproject.toml              # uv dependencies
└── README.md
```

## Implementation Steps

### Phase 1: Setup & Foundation
1. Initialize project with uv
2. Install dependencies: fastapi, uvicorn, sqlalchemy, pydantic, python-jose, passlib, python-multipart
3. Set up project structure
4. Configure SQLite database connection
5. Set up Alembic for migrations

### Phase 2: Authentication
1. Create User model and schema
2. Implement password hashing (bcrypt)
3. Create JWT token generation/validation
4. Build auth endpoints (register, login, refresh)
5. Create dependency for protected routes

### Phase 3: Core Models
1. Create Category model and schema
2. Create Transaction model and schema
3. Create Budget model and schema
4. Set up foreign key relationships
5. Create and run initial migrations

### Phase 4: CRUD Operations
1. Implement category CRUD
2. Implement transaction CRUD
3. Implement budget CRUD
4. Add filtering and pagination support

### Phase 5: Analytics
1. Build summary endpoint
2. Create spending-by-category query
3. Implement monthly trend calculation
4. Build budget progress tracking

### Phase 6: API Routes
1. Create auth router
2. Create categories router
3. Create transactions router
4. Create budgets router
5. Create analytics router
6. Register all routers in main app

### Phase 7: Testing
1. Write unit tests for CRUD operations
2. Test authentication flow
3. Test analytics calculations
4. Add integration tests

## Key Implementation Details

### Security
- Password hashing with bcrypt
- JWT tokens with expiration
- CORS configuration for frontend
- Input validation with Pydantic
- SQL injection prevention via SQLAlchemy

### Database
- SQLite for development (easy migration to PostgreSQL later)
- Alembic for schema migrations
- Index on user_id for all user-specific tables
- Index on date for transaction queries

### API Design
- RESTful conventions
- Consistent error responses
- Pagination for list endpoints
- Filtering via query parameters
- Proper HTTP status codes

## Verification

### Manual Testing
1. Start server: `uv run uvicorn app.main:app --reload`
2. Test auth flow (register → login → access protected endpoint)
3. Create categories and transactions
4. Set up budgets and check progress
5. Verify analytics endpoints return correct data

### Automated Testing
```bash
# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=app
```

### API Documentation
- FastAPI auto-generates docs at `/docs`
- Swagger UI at `/docs`
- ReDoc at `/redoc`

## Environment Variables
```
DATABASE_URL=sqlite:///./finance_tracker.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Next Steps After Backend
1. Frontend integration
2. Add bank API integration (Plaid/Yodlee)
3. Implement recurring transactions
4. Add notification system for budget alerts
5. Export data (CSV/PDF)
