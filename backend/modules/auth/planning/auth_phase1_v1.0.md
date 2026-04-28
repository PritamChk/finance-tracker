# Auth Module - Phase 1 v1.0

## Overview
Setup and configuration for the Auth module. Initialize project structure, install dependencies, and configure FastAPI application.

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
- **Port:** 8001 (from config)

## Prerequisites
- Python 3.11+
- uv package manager installed
- Shared utilities available (config_loader.py, database.py, security.py)

## Implementation Steps

### 1. Initialize Project
```bash
cd backend/modules/auth
uv init
```

### 2. Install Dependencies
```bash
uv add fastapi uvicorn[standard] sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
uv add --dev pytest pytest-asyncio httpx
```

### 3. Create Project Structure
```
auth/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── models/
│   │   └── __init__.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── auth.py          # Auth endpoints
│   └── core/
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
    title="Auth Module API",
    description="Authentication and authorization endpoints",
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
    return {"message": "Auth Module API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

### 5. Create Run Script
Create `run.sh` or `run.bat`:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 6. Verify Setup
- Start server: `./run.sh`
- Visit http://localhost:8001/docs for Swagger UI
- Visit http://localhost:8001/health for health check

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
Phase 2: Database Models & Schemas
