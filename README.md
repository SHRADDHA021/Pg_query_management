# PG/Hostel Management System

A role-based centralized web application built using **React (Vite + Tailwind CSS)** and **Spring Boot 3 (Security + JWT + JPA)** to digitize and automate hostel/PG operations.

## Key Features

1. **Role-Based Workflows**: Dedicated dashboards for Students and Admins.
2. **Verified Onboarding**: Direct email-based registration stays in a pending state until approved by an Admin who assigns a room.
3. **Room Allocation**: Track room capacities, floors, occupancy, and vacant slots in real time.
4. **Complaint Resolution**: Students raise maintenance/electrical/wifi complaints with updates (Open → In Progress → Resolved) and receive email updates.
5. **Fee Ledger & Billing**: Automatic monthly rent invoices, due date alerts, overdue status auto-mark, and manual invoice generation.
6. **Weekly Mess Menu**: Interactive weekly food planner editable by admins and viewable by students.

---

## Tech Stack

### Frontend
- **React + Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **React Router v6**
- **Axios**
- **React Hot Toast**

### Backend
- **Java 17 & Spring Boot 3.2.5**
- **Spring Security + JWT Authentication**
- **Spring Data JPA & Hibernate**
- **PostgreSQL**
- **JavaMailSender (Gmail SMTP)**
- **Spring Scheduling (@Scheduled)**
- **SpringDoc OpenAPI (Swagger UI)**

---

## Project Structure
```
PG_query_management/
├── backend/          # Spring Boot Application
└── frontend/         # React SPA (Vite)
```

---

## Setup & Running Guide

### 1. Database Setup
Ensure **PostgreSQL** is running. Create a database named `pg_management`.
Update database configuration in `backend/src/main/resources/application.yml` if your username or password is not `postgres/postgres`.

### 2. Run Backend
Go to `backend/` and run using Maven or your IDE:
```bash
mvn spring-boot:run
```
Swagger UI will be available at: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 3. Run Frontend
Go to `frontend/` and run the development server:
```bash
npm install
npm run dev
```
Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## Demo Credentials
- **Admin**: `admin@pgmanagement.com` / `Admin@123`
- **Student**: Sign up via the platform register page and verify using the admin dashboard.
