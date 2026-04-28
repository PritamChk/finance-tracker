# Finance Tracker Backend

Modular backend architecture for finance tracking application. Each module runs as a separate FastAPI service with its own Swagger documentation.

## Architecture

```
backend/
├── config/                    # Shared configuration
│   ├── application.properties # Central config file
│   └── README.md
├── database/                  # Shared database
│   ├── finance_tracker.db     # SQLite database
│   └── migrations/            # Alembic migrations
├── modules/                   # Module implementations
│   ├── auth/                  # Authentication (port 8001)
│   ├── categories/            # Categories (port 8002)
│   ├── transactions/          # Transactions (port 8003)
│   ├── budgets/               # Budgets (port 8004)
│   ├── analytics/             # Analytics (port 8005)
│   └── reports/               # Reports (port 8006)
└── shared/                    # Shared utilities
    ├── config_loader.py       # Properties file reader
    ├── database.py            # DB connection helper
    └── security.py            # JWT, password hashing
```

## Modules

| Module | Port | Description | Phases |
|--------|------|-------------|--------|
| Auth | 8001 | User registration, login, JWT tokens | 4 |
| Categories | 8002 | Category CRUD operations | 3 |
| Transactions | 8003 | Transaction CRUD with filtering | 4 |
| Budgets | 8004 | Budget management and progress | 3 |
| Analytics | 8005 | Summary, trends, spending breakdown | 3 |
| Reports | 8006 | Export data, generate reports | 3 |

## Configuration

All modules read from `config/application.properties`:

```properties
# Database
database.path=../database/finance_tracker.db

# Module Ports
auth.port=8001
categories.port=8002
transactions.port=8003
budgets.port=8004
analytics.port=8005
reports.port=8006

# Security
security.secret_key=your-secret-key-here
security.algorithm=HS256
security.access_token_expire_minutes=30

# CORS
cors.allowed_origins=http://localhost:3000
```

## Shared Utilities

### config_loader.py
Reads properties file with methods:
- `get(key, default=None)` - Get string value
- `get_int(key, default=0)` - Get integer value
- `get_bool(key, default=False)` - Get boolean value
- `get_list(key, separator=",")` - Get list value

### database.py
Database connection utilities:
- `get_db()` - Get database session
- `init_db()` - Initialize database tables
- `drop_db()` - Drop all tables

### security.py
Security utilities:
- `verify_password(plain, hashed)` - Verify password
- `get_password_hash(password)` - Hash password
- `create_access_token(data, expires_delta)` - Create JWT
- `decode_access_token(token)` - Decode JWT

## Running Modules

Each module has its own run script:

```bash
# Auth module
cd backend/modules/auth
./run.sh

# Categories module
cd backend/modules/categories
./run.sh

# Transactions module
cd backend/modules/transactions
./run.sh

# Budgets module
cd backend/modules/budgets
./run.sh

# Analytics module
cd backend/modules/analytics
./run.sh

# Reports module
cd backend/modules/reports
./run.sh
```

## API Documentation

Each module provides Swagger UI at:
- Auth: http://localhost:8001/docs
- Categories: http://localhost:8002/docs
- Transactions: http://localhost:8003/docs
- Budgets: http://localhost:8004/docs
- Analytics: http://localhost:8005/docs
- Reports: http://localhost:8006/docs

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Auth:** JWT (python-jose)
- **Password Hashing:** bcrypt (passlib)
- **Package Manager:** uv

## Development

### Prerequisites
- Python 3.11+
- uv package manager

### Setup
```bash
# Install uv
pip install uv

# Initialize each module
cd backend/modules/{module}
uv init
uv add fastapi uvicorn[standard] sqlalchemy pydantic
uv add --dev pytest pytest-asyncio httpx
```

### Testing
```bash
cd backend/modules/{module}
uv run pytest tests/ -v
```

## Phase Planning

Each module has detailed phase planning in `planning/` folder:
- `{module}_phase1_v1.0.md` - Setup & Configuration
- `{module}_phase2_v1.0.md` - Models, Schemas & CRUD
- `{module}_phase3_v1.0.md` - API Endpoints & Testing
- `{module}_phase4_v1.0.md` - Advanced features (where applicable)

## Database Schema

### Users
- id, email, hashed_password, full_name, created_at, updated_at

### Categories
- id, user_id, name, type, color, created_at, updated_at

### Transactions
- id, user_id, category_id, type, amount, description, date, created_at, updated_at

### Budgets
- id, user_id, category_id, name, amount, period, start_date, end_date, created_at, updated_at
