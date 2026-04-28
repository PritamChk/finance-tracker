# Docker Image Plan - Auth Module Phase 1 v1.0

## Context
Auth module Phase 1 sets up FastAPI project structure with uv package manager. Need containerized deployment for consistent runtime environment.

## Goals
- Create Dockerfile for auth module
- Support uv-based dependency management
- Expose port 8001
- Enable hot-reload for development
- Production-ready image for deployment

## Tech Stack
- **Base Image:** python:3.11-slim
- **Package Manager:** uv
- **Runtime:** uvicorn
- **Port:** 8001

## Dockerfile Structure

### Multi-stage Build

#### Stage 1: Builder
```dockerfile
FROM python:3.11-slim as builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set working directory
WORKDIR /app

# Copy pyproject.toml and lock file
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev
```

#### Stage 2: Runtime
```dockerfile
FROM python:3.11-slim

# Install uv for runtime
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set working directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY app ./app

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Run application
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

## Docker Compose (Development)

```yaml
version: '3.8'

services:
  auth:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    volumes:
      - ./app:/app/app  # Hot-reload
      - ./pyproject.toml:/app/pyproject.toml
    environment:
      - ENVIRONMENT=development
    command: uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Docker Compose (Production)

```yaml
version: '3.8'

services:
  auth:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
    ports:
      - "8001:8001"
    environment:
      - ENVIRONMENT=production
    restart: unless-stopped
```

## Build Commands

### Build image
```bash
docker build -t auth-module:latest .
```

### Build with specific tag
```bash
docker build -t auth-module:v1.0.0 .
```

### Run container
```bash
docker run -p 8001:8001 auth-module:latest
```

### Run with environment variables
```bash
docker run -p 8001:8001 -e CORS_ALLOWED_ORIGINS=http://localhost:3000 auth-module:latest
```

## Configuration Files

### .dockerignore
```
.git
.gitignore
__pycache__
*.pyc
.pytest_cache
.venv
tests
*.md
.env
```

## Verification Steps

1. Build image: `docker build -t auth-module:test .`
2. Run container: `docker run -p 8001:8001 auth-module:test`
3. Check health: `curl http://localhost:8001/health`
4. Check docs: `curl http://localhost:8001/docs`
5. Verify CORS: Test from browser

## Deliverables
- [ ] Dockerfile created
- [ ] .dockerignore created
- [ ] docker-compose.dev.yml created
- [ ] docker-compose.prod.yml created
- [ ] Image builds successfully
- [ ] Container runs on port 8001
- [ ] Health check passes
- [ ] Swagger UI accessible

## Next Phase
Phase 2: Add database connection to Docker configuration
