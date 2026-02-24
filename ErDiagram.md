# ER Diagram — SIRS

## Overview
This Entity-Relationship diagram shows the database schema for the SIRS platform. All tables, columns, types, and relationships are defined below.

---

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar name
        varchar email UK
        varchar password_hash
        enum role "ADMIN | ENGINEER | MANAGER"
        timestamp created_at
        timestamp updated_at
    }

    INCIDENTS {
        uuid id PK
        varchar title
        text description
        enum status "CREATED | IN_PROGRESS | RESOLVED"
        enum severity "LOW | MEDIUM | HIGH | CRITICAL"
        varchar affected_service
        integer affected_user_count
        uuid created_by FK
        uuid assigned_to FK
        timestamp created_at
        timestamp updated_at
        timestamp resolved_at
    }

    INCIDENT_HISTORY {
        uuid id PK
        uuid incident_id FK
        uuid changed_by FK
        enum previous_status "CREATED | IN_PROGRESS | RESOLVED"
        enum new_status "CREATED | IN_PROGRESS | RESOLVED"
        text comment
        timestamp changed_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid recipient_id FK
        uuid incident_id FK
        text message
        enum type "EMAIL | IN_APP"
        boolean is_read
        timestamp created_at
    }

    SEVERITY_RULES {
        uuid id PK
        varchar rule_name UK
        varchar rule_type "USER_COUNT | SERVICE_CRITICALITY"
        jsonb config
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    %% ===== RELATIONSHIPS =====

    USERS ||--o{ INCIDENTS : "creates"
    USERS ||--o{ INCIDENTS : "assigned to"
    USERS ||--o{ INCIDENT_HISTORY : "changed by"
    USERS ||--o{ NOTIFICATIONS : "receives"
    INCIDENTS ||--o{ INCIDENT_HISTORY : "has"
    INCIDENTS ||--o{ NOTIFICATIONS : "triggers"
```

---

## Table Summary
| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `USERS` | All platform users (admins, engineers, managers) | → Incidents, Notifications, History |
| `INCIDENTS` | Reported production incidents with severity and status | ← User (created_by, assigned_to) → History, Notifications |
| `INCIDENT_HISTORY` | Audit log of every status change for an incident | ← Incident, User (changed_by) |
| `NOTIFICATIONS` | Notifications sent to users on incident events | ← User (recipient), Incident |
| `SEVERITY_RULES` | Configurable rules and thresholds for severity calculation | Standalone config table |

---

## Key Indexes
| Table | Index | Purpose |
|-------|-------|---------|
| `INCIDENTS` | `(status)` | Fast filtering by incident status |
| `INCIDENTS` | `(severity)` | Filter incidents by severity for reports |
| `INCIDENTS` | `(created_by)` | Find all incidents reported by a user |
| `INCIDENTS` | `(assigned_to)` | Find incidents assigned to an engineer |
| `INCIDENT_HISTORY` | `(incident_id, changed_at)` | Timeline queries for a specific incident |
| `NOTIFICATIONS` | `(recipient_id, is_read)` | Unread notification count and listing |
| `USERS` | `(email)` | Login lookup (already has UNIQUE constraint) |
