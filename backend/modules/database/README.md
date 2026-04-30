# Database Module

SQLite database storage for the Finance Tracker application.

## Overview

Centralized database directory containing SQLite database files for each backend module.

## Database Files

| File | Module | Description |
|------|--------|-------------|
| `auth.db` | Auth (port 8001) | User accounts, tokens |
| `categories.db` | Categories (port 8002) | Transaction categories |
| `transactions.db` | Transactions (port 8003) | Transaction records |
| `budgets.db` | Budgets (port 8004) | Budget definitions |
| `analytics.db` | Analytics (port 8005) | Aggregated data |
| `reports.db` | Reports (port 8006) | Report cache |

## Schema Information

### Auth Database

- **users** table: User accounts with argon2 hashed passwords

### Categories Database

- **categories** table: User-defined transaction categories

### Transactions Database

- **transactions** table: Income/expense records

## Backup & Restore

### Backup
```bash
cp backend/modules/database/<dbname>.db backup/<dbname>-$(date +%Y%m%d).db
```

### Restore
```bash
cp backup/<dbname>-<date>.db backend/modules/database/<dbname>.db
```

## Development

Databases are created automatically by each module on first run via SQLAlchemy's `Base.metadata.create_all()` in the lifespan context manager.

For manual schema inspection:
```bash
sqlite3 backend/modules/database/transactions.db ".schema"
```

## License

MIT