# Auth Module

Authentication and authorization service for TicTacToe application.

## Overview

FastAPI-based microservice handling user authentication, registration, and JWT token management.

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite (development), PostgreSQL (production)
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Security:** JWT (python-jose), bcrypt (passlib)
- **Package Manager:** uv

## Quick Start

### Prerequisites

- Python 3.11+
- uv package manager

### Installation

```bash
cd backend/modules/auth
uv sync
```

### Running

**Windows:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
./start.sh
```

Server runs on `http://localhost:8001`

### Stopping

**Windows:**
```powershell
.\stop.ps1
```

**Linux/Mac:**
```bash
./stop.sh
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`
- Health check: `http://localhost:8001/health`

## Configuration

Edit `application.properties`:

```properties
# Server
server.host=0.0.0.0
server.port=8001

# CORS
cors.allowed_origins=http://localhost:3000,http://localhost:8000

# Environment
environment=development
```

## Project Structure

```
auth/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core utilities
│   ├── crud/         # Database operations
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   └── main.py       # FastAPI app entry point
├── tests/            # Test files
├── planning/         # Design docs
├── start.sh          # Linux/Mac start script
├── start.ps1         # Windows start script
├── stop.sh           # Linux/Mac stop script
├── stop.ps1          # Windows stop script
├── pyproject.toml    # Python dependencies
└── application.properties  # Config
```

## Development Progress

See `progress.md` for current status and next steps.

## License

MIT
