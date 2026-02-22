# Use Case Diagram — SIRS

## Overview
This diagram shows all major use cases for the SIRS platform, organized by the three primary actors: **Admin**, **Engineer**, and **Manager**, plus the internal **System** actor.

---

```mermaid
graph TB
    subgraph SIRS Platform
        UC1["Register / Login"]
        UC2["Manage Profile"]
        UC3["Create Incident"]
        UC4["Update Incident Status"]
        UC5["View Incidents"]
        UC6["Assign Incident"]
        UC7["Add Comment"]
        UC8["View Incident History"]
        UC9["Manage Users"]
        UC10["Assign Roles"]
        UC11["Configure Severity Rules"]
        UC12["View Reports"]
        UC13["Receive Notifications"]
        UC14["View Notifications"]
        UC15["Calculate Severity"]
        UC16["Send Notification"]
        UC17["Log Status Change"]
        UC18["Escalate Incident"]
    end

    Admin((Admin))
    Engineer((Engineer))
    Manager((Manager))

    %% Admin use cases
    Admin --> UC1
    Admin --> UC2
    Admin --> UC5
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC14

    %% Engineer use cases
    Engineer --> UC1
    Engineer --> UC2
    Engineer --> UC3
    Engineer --> UC4
    Engineer --> UC5
    Engineer --> UC6
    Engineer --> UC7
    Engineer --> UC8
    Engineer --> UC14

    %% Manager use cases
    Manager --> UC1
    Manager --> UC2
    Manager --> UC5
    Manager --> UC8
    Manager --> UC12
    Manager --> UC13
    Manager --> UC14

    %% System-driven (internal)
    UC3 -.->|triggers| UC15
    UC15 -.->|determines| UC16
    UC4 -.->|triggers| UC17
    UC16 -.->|if HIGH/CRITICAL| UC18
```

---

## Use Case Descriptions

| # | Use Case | Actors | Description |
|---|----------|--------|-------------|
| UC1 | Register / Login | All | Create account or authenticate with JWT. Role assigned at registration. |
| UC2 | Manage Profile | All | Update personal information and notification preferences. |
| UC3 | Create Incident | Engineer | Report a new production incident with title, description, affected service, and user impact. |
| UC4 | Update Incident Status | Engineer | Transition incident status: CREATED → IN_PROGRESS → RESOLVED. |
| UC5 | View Incidents | All | Browse incidents filtered by status, severity, service, or assignment. |
| UC6 | Assign Incident | Engineer | Assign an incident to a specific engineer for resolution. |
| UC7 | Add Comment | Engineer | Add notes or progress updates to an incident. |
| UC8 | View Incident History | Engineer, Manager | See the full timeline of status changes and comments for an incident. |
| UC9 | Manage Users | Admin | Create, update, or deactivate user accounts. |
| UC10 | Assign Roles | Admin | Assign Admin, Engineer, or Manager role to users. |
| UC11 | Configure Severity Rules | Admin | Set up or modify rules and thresholds used for severity calculation. |
| UC12 | View Reports | Admin, Manager | Access summary reports (incidents per service, resolution time, severity stats). |
| UC13 | Receive Notifications | Manager | Get notified automatically about HIGH/CRITICAL severity incidents. |
| UC14 | View Notifications | All | View in-app notification history and mark as read. |
| UC15 | Calculate Severity | System | Automatically calculate severity using registered strategies when incident is created. |
| UC16 | Send Notification | System | Send notifications to relevant users based on incident severity and roles. |
| UC17 | Log Status Change | System | Record every status transition in the incident history table. |
| UC18 | Escalate Incident | System | For HIGH/CRITICAL incidents, escalate by notifying all managers and admins. |
