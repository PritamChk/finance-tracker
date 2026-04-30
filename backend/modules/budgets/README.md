# Budgets Module

Budget management service for tracking spending limits.

## Overview

FastAPI-based microservice handling budget creation, tracking, and progress monitoring.

## Tech Stack

- **Framework:** FastAPI
- **Database:** SQLite (development)
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Package Manager:** uv

## Quick Start

### Prerequisites

- Python 3.11+
- uv package manager

### Installation

```bash
cd backend/modules/budgets
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

Server runs on `http://localhost:8004`

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
- Swagger UI: `http://localhost:8004/docs`
- ReDoc: `http://localhost:8004/redoc`
- Health check: `http://localhost:8004/health`

## Configuration

Edit `application.properties`:

```properties
# Server
server.host=0.0.0.0
server.port=8004

# CORS
cors.allowed_origins=http://localhost:5173,http://localhost:3000
```

## Project Structure

```
budgets/
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

## Status

- 🔄 Planned - Budget CRUD
- 🔄 Planned - Progress tracking
- 🔄 Planned - Alerts and notifications

## License

MIT