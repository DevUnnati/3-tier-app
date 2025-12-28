# Full-stack App (Java 17 + Node + Postgres + Docker)

This workspace contains:
- Backend: Spring Boot 3 (Java 17) with PostgreSQL (JPA)
- Frontend: Vite + React calling the backend API
- Dockerfiles for each and a docker-compose to run everything

## Quick start (Docker)

1. Build and start all services:

```powershell
# From the workspace root
docker compose build
docker compose up -d
```

2. Visit:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

3. Try the API:

```powershell
curl http://localhost:8080/api/users
curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\"}"
```

## Configuration
- Database defaults (compose): `POSTGRES_DB=appdb`, `POSTGRES_USER=appuser`, `POSTGRES_PASSWORD=apppassword`
- Backend reads env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `SPRING_JPA_HIBERNATE_DDL_AUTO`
- Frontend build arg `VITE_API_URL` is set in compose to `http://backend:8080`

## Development notes
- Backend runs on port 8080; Frontend runs behind nginx on port 3000
- Update packages and dependencies as needed; images use JDK 17 and Node 20
