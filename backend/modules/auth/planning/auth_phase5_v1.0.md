# Auth Module - Phase 5 v1.0

## Overview
Design comprehensive unit tests and implement Loguru logging for all endpoint activities.

## Goals
- Design unit test suite for all auth components
- Add Loguru logging for each endpoint
- Log format: `ERROR|TIMESTAMP|ERROR-MSG` or `INFO|TIMESTAMP|INFO-MSG`
- Log rotation: `log/auth_sysdate.[0..25].log`

## Prerequisites
- Phase 4 completed
- Fix SQLAlchemy import issue (models must be imported before Base.metadata.create_all)

## Implementation Steps

### 1. Fix SQLAlchemy Import Issue
**Problem:** `User` model not imported before `Base.metadata.create_all()` runs.

**Fix:** Add imports at top of `tests/test_auth.py`:
```python
# CRITICAL: Import Base and models BEFORE test engine setup
from shared.database import Base, get_db
from app.models.user import User
```

### 2. Loguru Logging Implementation (COMPLETED)

#### 2.1 Logger Configuration
File: `app/core/logger.py`
```python
from loguru import logger
from pathlib import Path
import sys

# Create log directory
log_dir = Path(__file__).parent.parent.parent / "log"
log_dir.mkdir(exist_ok=True)

# Custom format: LEVEL|TIMESTAMP|MESSAGE
log_format = "{level}|{time:YYYY-MM-DD HH:mm:ss.SSS}|{message}"

# Remove default handler
logger.remove()

# Console handler (dev)
logger.add(
    sys.stdout,
    format=log_format,
    level="INFO",
    colorize=True
)

# File handler with rotation
logger.add(
    log_dir / "auth_sysdate.{time:YYYYMMDD}.log",
    format=log_format,
    level="INFO",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)

# Separate error file
logger.add(
    log_dir / "auth_errors.{time:YYYYMMDD}.log",
    format=log_format,
    level="ERROR",
    rotation="00:00",
    retention="25 days",
    compression="zip",
    enqueue=True
)
```

#### 2.2 Logging Middleware
File: `app/middleware/logging.py`
```python
from fastapi import Request
from app.core.logger import logger
import time


async def log_requests(request: Request, call_next):
    """Log all incoming requests."""
    start_time = time.time()
    client_ip = request.client.host if request.client else "unknown"

    logger.info(
        f"REQUEST|method={request.method}|path={request.url.path}|ip={client_ip}"
    )

    response = await call_next(request)

    duration = time.time() - start_time
    logger.info(
        f"RESPONSE|status={response.status_code}|duration={duration:.3f}s|path={request.url.path}"
    )

    return response
```

#### 2.3 Logging Points (IMPLEMENTED)

| Endpoint | Event | Level | Message Format | Status |
|----------|-------|-------|----------------|--------|
| `/register` | Request received | INFO | `REGISTER|email={email}|ip={ip}` | ✅ |
| `/register` | Success | INFO | `REGISTER_SUCCESS|user_id={id}|email={email}` | ✅ |
| `/register` | Duplicate email | ERROR | `REGISTER_FAIL|email={email}|reason=duplicate` | ✅ |
| `/login` | Request received | INFO | `LOGIN|email={email}|ip={ip}` | ✅ |
| `/login` | Success | INFO | `LOGIN_SUCCESS|user_id={id}|email={email}` | ✅ |
| `/login` | Invalid credentials | ERROR | `LOGIN_FAIL|email={email}|reason=invalid_credentials` | ✅ |
| `/refresh` | Request received | INFO | `REFRESH|user_id={id}|ip={ip}` | ✅ |
| `/refresh` | Success | INFO | `REFRESH_SUCCESS|user_id={id}` | ✅ |
| `/me` | Request received | INFO | `GET_ME|user_id={id}|ip={ip}` | ✅ |
| `/me` | Success | INFO | `GET_ME_SUCCESS|user_id={id}` | ✅ |
| `/me` | Invalid token | ERROR | `GET_ME_FAIL|reason=invalid_token` | ✅ |
| `/me` | User not found | ERROR | `GET_ME_FAIL|reason=user_not_found` | ✅ |

**Note:** "Not authenticated" (missing Authorization header) not logged - raised by FastAPI's HTTPBearer before our dependency. Custom security scheme needed if logging required.

#### 2.4 Log File Examples

**Info Log (`log/auth_sysdate.20260429.log`):**
```
INFO|2026-04-29 02:39:15.784|REQUEST|method=POST|path=/api/auth/register|ip=127.0.0.1
INFO|2026-04-29 02:39:15.790|REGISTER|email=logtest@example.com|ip=127.0.0.1
INFO|2026-04-29 02:39:15.855|REGISTER_SUCCESS|user_id=10|email=logtest@example.com
INFO|2026-04-29 02:39:15.857|RESPONSE|status=201|duration=0.073s|path=/api/auth/register
INFO|2026-04-29 02:40:28.420|REQUEST|method=POST|path=/api/auth/login|ip=127.0.0.1
INFO|2026-04-29 02:40:28.422|LOGIN|email=logtest@example.com|ip=127.0.0.1
INFO|2026-04-29 02:40:28.484|LOGIN_SUCCESS|user_id=10|email=logtest@example.com
INFO|2026-04-29 02:40:28.484|RESPONSE|status=200|duration=0.065s|path=/api/auth/login
```

**Error Log (`log/auth_errors.20260429.log`):**
```
ERROR|2026-04-29 02:42:27.384|REGISTER_FAIL|email=logtest@example.com|reason=duplicate
ERROR|2026-04-29 02:43:27.022|LOGIN_FAIL|email=wrong@example.com|reason=invalid_credentials
ERROR|2026-04-29 02:50:34.883|GET_ME_FAIL|reason=invalid_token
```

### 3. Unit Test Design (PENDING)

#### 3.1 Test Structure
```
tests/
├── conftest.py              # Shared fixtures
├── test_auth_api.py         # API endpoint tests
├── test_auth_crud.py        # CRUD operation tests
├── test_auth_security.py    # Security/encryption tests
├── test_auth_schemas.py     # Schema validation tests
└── test_auth_deps.py        # Dependency tests
```

#### 3.2 Test Fixtures (conftest.py)
```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# CRITICAL: Import models BEFORE setup
from shared.database import Base, get_db
from app.models.user import User
from app.main import app

# In-memory test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)


@pytest.fixture(scope="function")
def db_session():
    """Create fresh database for each test."""
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create test client with database override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Standard test user data."""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
```

#### 3.3 API Endpoint Tests (test_auth_api.py)

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `test_register_success` | Valid registration | 201, user created |
| `test_register_duplicate_email` | Same email twice | 400, error message |
| `test_register_invalid_email` | Bad email format | 422, validation error |
| `test_register_weak_password` | Password too short | 422, validation error |
| `test_login_success` | Valid credentials | 200, token returned |
| `test_login_wrong_password` | Wrong password | 401, unauthorized |
| `test_login_nonexistent_user` | User doesn't exist | 401, unauthorized |
| `test_login_missing_fields` | Incomplete request | 422, validation error |
| `test_refresh_success` | Valid token | 200, new token |
| `test_refresh_invalid_token` | Bad/expired token | 403, forbidden |
| `test_get_me_success` | Valid Bearer token | 200, user data |
| `test_get_me_no_token` | Missing Authorization | 403, forbidden |
| `test_get_me_invalid_token` | Bad Bearer token | 403, forbidden |
| `test_get_me_expired_token` | Expired token | 403, forbidden |

#### 3.4 CRUD Tests (test_auth_crud.py)

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `test_create_user` | Create valid user | User object returned |
| `test_create_user_duplicate` | Create duplicate email | None/exception |
| `test_get_user_by_email` | Find by email | User object |
| `test_get_user_by_id` | Find by ID | User object |
| `test_authenticate_user_success` | Valid credentials | User object |
| `test_authenticate_user_fail` | Invalid credentials | None |
| `test_authenticate_user_wrong_password` | Wrong password | None |
| `test_update_user_password` | Change password | Success |
| `test_delete_user` | Remove user | User deleted |

#### 3.5 Security Tests (test_auth_security.py)

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `test_password_hashing` | Password not stored plain | Hash != password |
| `test_password_verify` | Hash matches original | Verify returns True |
| `test_password_verify_fail` | Wrong password | Verify returns False |
| `test_token_creation` | Generate JWT token | Valid token string |
| `test_token_decode` | Decode valid token | Original payload |
| `test_token_expiry` | Token expires correctly | Expired token invalid |
| `test_token_invalid_signature` | Tampered token | Decode fails |
| `test_bcrypt_rounds` | Correct cost factor | Hash uses configured rounds |

#### 3.6 Schema Tests (test_auth_schemas.py)

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `test_user_create_valid` | Valid UserCreate | Passes validation |
| `test_user_create_missing_email` | No email | Validation error |
| `test_user_create_invalid_email` | Bad email format | Validation error |
| `test_user_create_missing_password` | No password | Validation error |
| `test_user_login_valid` | Valid UserLogin | Passes validation |
| `test_user_login_missing_fields` | Incomplete data | Validation error |
| `test_token_response` | Token schema structure | Has access_token field |
| `test_user_response` | User response structure | Has id, email fields |

#### 3.7 Dependency Tests (test_auth_deps.py)

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| `test_get_current_user_valid` | Valid token | Returns user |
| `test_get_current_user_invalid` | Invalid token | Raises HTTPException |
| `test_get_current_user_expired` | Expired token | Raises HTTPException |
| `test_get_current_user_missing` | No token | Raises HTTPException |
| `test_get_db_session` | Database session | Returns Session |

### 4. Test Execution

#### 4.1 Run All Tests
```bash
uv run pytest tests/ -v --cov=app --cov-report=html
```

#### 4.2 Run Specific Test File
```bash
uv run pytest tests/test_auth_api.py -v
```

#### 4.3 Run Specific Test
```bash
uv run pytest tests/test_auth_api.py::test_register_success -v
```

#### 4.4 Run with Coverage
```bash
uv run pytest tests/ --cov=app --cov-report=term-missing
```

## Deliverables
- [x] Logger configuration created
- [x] Logging middleware implemented
- [x] All endpoints instrumented with logging
- [ ] Test fixtures configured (with model imports)
- [ ] API endpoint tests written
- [ ] CRUD tests written
- [ ] Security tests written
- [ ] Schema tests written
- [ ] Dependency tests written
- [ ] All tests passing
- [ ] Coverage report generated
- [x] Log rotation verified

## Verification

### Manual Testing
1. Start server: `./start.sh`
2. Make API calls
3. Check `log/` directory for log files
4. Verify log format matches specification
5. Verify log rotation after 25 days

### Test Coverage
Target: >90% code coverage

### Log Verification
```bash
# Check log files exist
ls -la log/

# View recent logs
tail -f log/auth_sysdate.$(date +%Y%m%d).log

# Check error logs
cat log/auth_errors.$(date +%Y%m%d).log
```

## Module Complete
Auth module now has comprehensive logging. Unit tests pending.
