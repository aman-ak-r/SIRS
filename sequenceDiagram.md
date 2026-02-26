# Sequence Diagram — SIRS

## Main Flow: Incident Creation → Severity Calculation → Notification

This sequence diagram illustrates the complete lifecycle of an incident — from an engineer reporting a production issue, the system calculating severity using the strategy pattern, through to saving the incident and notifying relevant users.

---

```mermaid
sequenceDiagram
    actor Eng as Engineer
    participant FE as Frontend (React)
    participant API as API Gateway
    participant Auth as Auth Service
    participant IC as Incident Controller
    participant IS as Incident Service
    participant SC as Severity Calculator
    participant IR as Incident Repository
    participant NS as Notification Service
    participant DB as PostgreSQL

    Note over Eng, DB: Phase 1 — Engineer Creates Incident

    Eng ->> FE: Fill incident form & click Submit
    FE ->> API: POST /api/incidents (title, desc, service, userCount)
    API ->> Auth: Validate JWT Token
    Auth -->> API: Token Valid (userId, role: ENGINEER)
    API ->> IC: createIncident(createIncidentDto)
    IC ->> IC: Validate request DTO
    Note right of IC: Validators: TitleValidator →<br/>ServiceValidator → UserCountValidator
    IC ->> IS: createIncident(validatedData)

    Note over Eng, DB: Phase 2 — Severity Calculation (Strategy Pattern)

    IS ->> SC: calculateSeverity(incidentData)
    Note right of SC: Strategy Pattern — runs all<br/>registered strategies independently:<br/>UserCountStrategy, ServiceCriticalityStrategy
    SC ->> SC: UserCountStrategy.evaluate()
    SC ->> SC: ServiceCriticalityStrategy.evaluate()
    SC ->> SC: Pick highest severity across strategies
    SC -->> IS: Severity result (e.g., HIGH)

    Note over Eng, DB: Phase 3 — Persist Incident

    IS ->> IS: Set status = CREATED, severity = HIGH
    IS ->> IR: save(incident)
    IR ->> DB: INSERT INTO incidents (status=CREATED, severity=HIGH)
    DB -->> IR: Incident created (incidentId)
    IR -->> IS: Saved incident with ID

    Note over Eng, DB: Phase 4 — Notification Dispatch (Observer Pattern)

    IS ->> NS: notifyOnCreation(incident)
    NS ->> NS: Check severity level

    alt severity >= HIGH (Escalation Path)
        NS ->> DB: INSERT INTO notifications (recipient=creator, type=URGENT)
        NS ->> DB: SELECT users WHERE role IN (MANAGER, ADMIN)
        NS ->> DB: INSERT INTO notifications for each manager/admin
        Note right of NS: Escalation: All managers<br/>and admins are notified
    else severity < HIGH (Standard Path)
        NS ->> DB: INSERT INTO notifications (recipient=creator, type=STANDARD)
    end

    NS -->> IS: Notification dispatched

    Note over Eng, DB: Phase 5 — Response

    IS -->> IC: Return incident response
    IC -->> API: 201 Created {incident}
    API -->> FE: Incident creation response
    FE -->> Eng: "Incident reported successfully"
```

---

## Flow Summary
| Phase | Description | Key Patterns Used |
|-------|-------------|-------------------|
| **1. Incident Creation** | Engineer submits incident details. Request validated through controller DTO validation. | DTO Pattern |
| **2. Severity Calculation** | Severity calculator runs all registered strategies and picks the highest result. | Strategy Pattern |
| **3. Persist Incident** | Incident saved to database with calculated severity and CREATED status. | Repository Pattern |
| **4. Notification Dispatch** | Notifications sent based on severity. HIGH/CRITICAL triggers escalation to managers and admins. | Observer Pattern |
| **5. Response** | Success response returned to engineer through the controller chain. | Clean Architecture |
