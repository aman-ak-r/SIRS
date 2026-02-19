# Smart Incident Response System (SIRS)

## Overview
**SIRS** is a full-stack web application that helps engineering teams report, track, and manage production incidents in a structured way. When something goes wrong in production — a service crashes, an API starts failing, or users are affected — engineers can log incidents, the system auto-calculates severity, notifies the right people, and maintains a full audit trail for post-incident review.

The primary focus is on the **backend** (75% weightage), with clean OOP design, design patterns, and a scalable service architecture. The frontend is kept minimal — just enough to interact with the APIs.

---

## Problem Statement
1. **No centralized incident tracking** — Teams rely on scattered Slack messages, emails, or spreadsheets to manage production issues.
2. **Inconsistent severity assignment** — Different engineers classify the same issue differently, leading to misplaced priorities.
3. **Delayed notifications** — Critical incidents don't reach the right people fast enough because there's no automated alerting.
4. **No incident history** — Without a timeline of what happened, teams can't do proper post-mortems or learn from past failures.
5. **Manual status tracking** — Incident lifecycle (created → in progress → resolved) is tracked informally, with no enforced workflow.

---

## Scope

### In Scope
- User authentication and role-based access control (Admin, Engineer, Manager)
- Incident creation with automatic severity calculation
- Incident lifecycle management (CREATED → IN_PROGRESS → RESOLVED)
- Rule-based severity engine using Strategy pattern
- Notification system with observer-like event handling
- Incident history / audit log for every status change
- Basic reporting (incidents per service, resolution time, severity distribution)
- RESTful API design with proper validation and DTOs
- Post-incident review support

### Out of Scope (for Milestone 1)
- Real-time dashboards or live monitoring
- External integrations (PagerDuty, Slack, Jira)
- Mobile application
- Advanced analytics or ML-based incident prediction
- Multi-tenant architecture

---

## Key Features

### 1. Incident Management
- **Create Incidents**: Engineers report incidents with title, description, affected service, and estimated user impact.
- **Lifecycle Tracking**: Status transitions are enforced (CREATED → IN_PROGRESS → RESOLVED) with validation.
- **Assignment**: Incidents can be assigned to specific engineers for resolution.
- **Comments**: Team members can add notes and updates to incidents.

### 2. Automatic Severity Calculation
- **Rule-Based Engine**: Severity is calculated automatically when an incident is created.
- **Strategy Pattern**: Multiple severity strategies (user count, service criticality) run independently and the highest severity wins.
- **Configurable Rules**: Admins can adjust thresholds without code changes.

### 3. Notification System
- **Event-Driven**: Notifications fire on incident creation, status changes, and escalation.
- **Role-Based Routing**: HIGH/CRITICAL incidents automatically notify all managers and admins.
- **Multi-Channel**: Supports in-app and email notifications via a channel interface.

### 4. Incident History & Reporting
- **Full Audit Trail**: Every status change is logged with timestamp, user, and optional comment.
- **Reports**: Incidents per service, average resolution time, severity breakdown.

### 5. User Management
- **Role-Based Access**: Admin, Engineer, and Manager roles with different permissions.
- **JWT Authentication**: Secure token-based auth with role validation.

---

## Tech Stack
| Layer          | Technology                                |
|----------------|-------------------------------------------|
| **Backend**    | Node.js (NestJS-style structure), TypeScript |
| **Database**   | PostgreSQL                                |
| **ORM**        | TypeORM / Prisma                          |
| **Frontend**   | React.js (minimal UI)                     |
| **Auth**       | JWT + RBAC (Role-Based Access Control)    |
| **API**        | RESTful API                               |
| **Testing**    | Jest                                      |

---

## Architecture Principles
- **Clean Architecture**: Controllers → Services → Repositories separation
- **OOP Principles**: Encapsulation, Abstraction, Inheritance, Polymorphism across the domain model
- **Design Patterns** (used where they naturally fit):
  - **Strategy** — Severity calculation with interchangeable rules
  - **Observer** — Notification dispatch on incident events
  - **State** — Incident status lifecycle management
  - **Repository** — Data access abstraction for all entities
  - **DTO Pattern** — Data transfer between layers with validation

---

## User Roles
| Role         | Description                                                       |
|--------------|-------------------------------------------------------------------|
| **Admin**    | Full system access, user management, severity rule configuration  |
| **Engineer** | Creates incidents, updates status, gets assigned, adds comments   |
| **Manager**  | Views dashboards, gets notified on critical incidents, reviews reports |
