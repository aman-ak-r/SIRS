# Smart Incident Response System (SIRS)

SIRS is a backend-focused full-stack project for managing incidents with role-based access, severity detection, notifications, and lifecycle tracking.

## Tech Stack

- Backend: NestJS (TypeScript), Prisma ORM, PostgreSQL, JWT Auth
- Frontend: React (TypeScript), Vite
- Database: PostgreSQL

## Project Structure

- `backend/` NestJS API server
- `frontend/` React app
- `docker-compose.yml` PostgreSQL local setup

## Features

- User Authentication (register/login)
- Role-based access control (`ADMIN`, `ENGINEER`, `MANAGER`)
- Incident creation and management
- Severity classification using Strategy Pattern:
  - `HIGH` for keywords: `crash`, `down`, `failure`
  - `MEDIUM` for keywords: `slow`, `delay`
  - `LOW` otherwise
- Incident lifecycle with transition validation:
  - `CREATED -> IN_PROGRESS -> RESOLVED`
- Incident logs in `IncidentLog`
- Notification service (console logs)
- Manager report summary endpoint

## Step-by-Step Setup

## 1) Start PostgreSQL

Use Docker:

```bash
docker compose up -d
```

## 2) Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Update `.env` if your PostgreSQL credentials are different.

## 3) Install Backend Dependencies

```bash
cd backend
npm install
```

## 4) Generate Prisma Client and Run Migration

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## 5) Start Backend

```bash
cd backend
npm run start:dev
```

Backend runs on `http://localhost:3000`.

## 6) Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

## 7) Install and Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Incidents

- `POST /incidents` (Engineer/Admin)
- `GET /incidents` (Engineer/Manager/Admin)
- `PATCH /incidents/:id/status` (Engineer/Admin)
- `PATCH /incidents/:id/resolve` (Engineer/Admin)
- `GET /incidents/reports/summary` (Manager/Admin)

### Users

- `GET /users` (Admin only)

## Example Request Bodies

### Register

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123",
  "role": "ENGINEER"
}
```

### Login

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Create Incident

```json
{
  "title": "Payment API is down",
  "description": "Checkout requests fail due to gateway failure"
}
```

### Update Status

```json
{
  "status": "IN_PROGRESS"
}
```

## Notes for Students

- DTOs are used for validation in controllers.
- Business logic is inside services.
- Role checks use custom `@Roles()` decorator + guard.
- Severity rules are implemented using a simple Strategy Pattern for readability.
