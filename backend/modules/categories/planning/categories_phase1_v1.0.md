# Categories Module - Phase 1 v1.0

## Overview
Setup and configuration for the Categories module. Initialize project structure, install dependencies, and configure FastAPI application.

## Goals
- Initialize FastAPI project structure
- Install required dependencies
- Configure application to read from properties file
- Set up basic FastAPI app with Swagger documentation
- Configure CORS

## Tech Stack
- **Framework:** FastAPI
- **Package Manager:** uv
- **Config:** application.properties (via shared/config_loader.py)
- **Port:** 8002 (from config)

## Prerequisites
- Python 3.11+
- uv package manager installed
- Shared utilities available (config_loader.py, database.py, security.py)
- Auth module completed (for user authentication)

## Implementation Steps

### 1. Initialize Project
```bash
cd backend/modules/categories
uv init
```

### 2. Install Dependencies
```bash
uv add fastapi uvicorn[standard] sqlalchemy pydantic
uv add --dev pytest pytest-asyncio httpx
```

### 3. Create Project Structure
```
categories/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── models/
│   │   └── __init__.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── categories.py    # Categories endpoints
│   └── crud/
│       └── __init__.py
├── tests/
│   ├── __init__.py
│   └── test_config.py
└── pyproject.toml
```

### 4. Configure main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared.config_loader import load_config

config = load_config()

app = FastAPI(
    title="Categories Module API",
    description="Category management endpoints",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_list("cors.allowed_origins"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Categories Module API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### 5. Create Run Script
Create `run.sh` or `run.bat`:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

### 6. Verify Setup
- Start server: `./run.sh`
- Visit http://localhost:8002/docs for Swagger UI
- Visit http://localhost:8002/health for health check

## Deliverables
- [ ] Project initialized with uv
- [ ] Dependencies installed
- [ ] Folder structure created
- [ ] main.py configured with FastAPI
- [ ] CORS configured
- [ ] Server starts successfully
- [ ] Swagger UI accessible at /docs
- [ ] Health check endpoint working

## Next Phase
Phase 2: Models, Schemas & CRUD
