# Auth Module - Phase 6 v1.0: Test Suite Completion

## Overview
Resolve existing bugs in the unit test suite, fix database connectivity issues for API tests, and ensure high code coverage (>90%).

## Goals
- Fix 'no such table: users' error in API tests.
- Resolve async/sync mismatch in authentication dependencies.
- Eliminate redundant tests and fix pathing inconsistencies.
- Achieve and verify >90% code coverage.

## Implementation Steps

### 1. Fix Database Connectivity (Critical)
**Problem:** SQLite in-memory databases create new instances per connection, causing API tests to see empty databases.
**Fix:** Update `tests/conftest.py` to use `StaticPool`.
- Import `StaticPool` from `sqlalchemy.pool`.
- Add `poolclass=StaticPool` to the `create_engine` call for `test_engine`.

### 2. Resolve Async/Sync Mismatch
**Problem:** `get_current_user` is `async def` but uses synchronous DB calls, causing issues in tests and potential event loop blocking.
**Fix:** 
- In `app/core/deps.py`, change `async def get_current_user` to `def get_current_user`.
- In `tests/test_auth_deps.py`, remove `await` keywords when calling `get_current_user`.

### 3. Refactor Test Suite & Pathing
- **Pathing:** Update `tests/conftest.py` to explicitly add the `auth` module root to `sys.path` to avoid reliance on the current working directory.
- **Redundancy:** Remove `tests/test_auth.py` as it is covered by `tests/test_auth_api.py`.
- **Dependency Tests:** Update `TestGetDbSession` in `tests/test_auth_deps.py` to test the `get_db` dependency directly.

### 4. Final Verification & Coverage
- Run the full test suite: `uv run pytest tests/ -v`.
- Generate coverage report: `uv run pytest tests/ --cov=app --cov-report=term-missing`.
- Ensure all tests pass and coverage is >90%.

## Deliverables
- [ ] Fixed `tests/conftest.py` (StaticPool & Pathing)
- [ ] Fixed `app/core/deps.py` (Sync conversion)
- [ ] Fixed `tests/test_auth_deps.py` (Removed await & updated get_db test)
- [ ] Removed `tests/test_auth.py`
- [ ] All tests passing
- [ ] Coverage report showing >90% coverage

## Verification
- `uv run pytest tests/ -v` $\rightarrow$ All pass.
- `uv run pytest tests/ --cov=app --cov-report=html` $\rightarrow$ Coverage > 90%.
