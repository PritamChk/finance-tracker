# Analytics Module

Financial analytics and reporting service.

## Overview

FastAPI-based microservice providing spending insights, trends, and visualization data.

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
cd backend/modules/analytics
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

Server runs on `http://localhost:8005`

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
- Swagger UI: `http://localhost:8005/docs`
- ReDoc: `http://localhost:8005/redoc`
- Health check: `http://localhost:8005/health`

## Configuration

Edit `application.properties`:

```properties
# Server
server.host=0.0.0.0
server.port=8005

# CORS
cors.allowed_origins=http://localhost:5173,http://localhost:3000
```

## Project Structure

```
analytics/
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

## Features

- Spending trends analysis
- Category-wise breakdown
- Monthly/weekly comparisons
- Goal progress tracking

## Status

- 🔄 Planned - Data aggregation
- 🔄 Planned - Trend analysis
- 🔄 Planned - Visualization data

## License

MIT