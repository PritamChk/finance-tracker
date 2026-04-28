# Backend Configuration

## Overview
Central configuration file for all backend modules. Each module reads its port and shared settings from this file.

## File: application.properties

```properties
# Database Configuration
database.path=../database/finance_tracker.db

# Module Port Assignments
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

## Usage

Each module's `main.py` reads its configuration using `shared/config_loader.py`:

```python
from shared.config_loader import load_config

config = load_config()
port = config.get_int('auth.port')  # or categories.port, etc.
db_path = config.get('database.path')
```

## Environment-Specific Configs

For different environments (dev, staging, prod), create separate files:
- `application-dev.properties`
- `application-staging.properties`
- `application-prod.properties`

Set environment variable `APP_ENV` to select which file to load.
