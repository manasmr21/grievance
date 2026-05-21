# Grievance Management System - Architecture & Flow Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Database Architecture](#database-architecture)
6. [Core Modules](#core-modules)
7. [Application Flows](#application-flows)
8. [API Documentation](#api-documentation)
9. [Security & Authentication](#security--authentication)
10. [Business Logic](#business-logic)

---

## Project Overview

The Grievance Management System is a comprehensive NestJS-based backend application designed to manage and track grievances in an educational institution environment. The system handles both academic and hostel-related grievances with automatic assignment logic, priority management, and SLA tracking.

### Key Features

- **User Management**: Role-based access control for students, employees, HODs, and wardens
- **Grievance Submission**: Students can submit grievances with automatic categorization
- **Auto-Assignment**: Intelligent assignment of grievances to appropriate authorities
- **Priority Management**: Dynamic priority assignment based on grievance type and hostel status
- **SLA Tracking**: Automatic SLA due date calculation
- **Execution Tracking**: Complete audit trail of grievance assignments and actions
- **Department & Hostel Management**: Hierarchical management of academic and hostel structures

---

## Technology Stack

### Backend Framework
- **NestJS** v11.0.1 - Progressive Node.js framework
- **TypeScript** v5.7.3 - Type-safe JavaScript
- **Node.js** - Runtime environment

### Database & ORM
- **PostgreSQL** - Primary database
- **Sequelize** v6.37.8 - ORM
- **Sequelize-TypeScript** v2.1.6 - TypeScript decorators for Sequelize

### Authentication & Security
- **Passport** v0.7.0 - Authentication middleware
- **Passport-JWT** v4.0.1 - JWT authentication strategy
- **@nestjs/jwt** v11.0.2 - JWT utilities
- **bcrypt** v6.0.0 - Password hashing

### Documentation & Validation
- **Swagger/OpenAPI** v11.4.2 - API documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

### Additional Features
- **svg-captcha** v1.4.0 - CAPTCHA generation
- **dotenv** v17.4.2 - Environment configuration

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│              (Web/Mobile Applications)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    API Gateway Layer                         │
│                  (NestJS Controllers)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │Grievance │  │  User    │  │  Master  │   │
│  │  APIs    │  │   APIs   │  │   APIs   │  │   Data   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Middleware Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ JWT Guard    │  │ Error        │  │ Interceptors │     │
│  │ (Auth)       │  │ Handler      │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Service Layer                              │
│           (Business Logic & Validation)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Grievance Service - Auto-assignment Logic           │  │
│  │  User Service - Authentication & Authorization       │  │
│  │  Master Data Services - CRUD Operations              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Data Layer                                │
│                 (Sequelize ORM)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models with Associations & Validations              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Relational Tables with Foreign Key Constraints      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Modular Architecture

The application follows NestJS's modular architecture pattern:

- **AppModule**: Root module that imports all feature modules
- **Feature Modules**: Self-contained modules for specific domains
- **Shared Modules**: Common utilities, decorators, guards, and pipes

---

## Project Structure

```
grievance/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                # Root controller
│   ├── app.service.ts                   # Root service
│   │
│   ├── config/
│   │   └── database.config.ts           # Database configuration
│   │
│   ├── auth/
│   │   ├── jwt.guard.ts                 # JWT authentication guard
│   │   ├── jwt.strategy.ts              # Passport JWT strategy
│   │   └── jwt.module.ts                # JWT module configuration
│   │
│   ├── common/
│   │   ├── decorators/                  # Custom decorators
│   │   ├── filters/                     # Exception filters
│   │   ├── guards/                      # Custom guards
│   │   ├── interceptors/                # Custom interceptors
│   │   ├── interfaces/                  # Shared interfaces
│   │   └── pipes/                       # Custom pipes
│   │
│   ├── utils/
│   │   ├── Error/
│   │   │   └── errorHandler.ts          # Centralized error handler
│   │   └── codeGenerator.ts             # Utility functions
│   │
│   └── modules/
│       ├── captcha/                     # CAPTCHA generation
│       ├── userAccount/                 # User authentication & management
│       ├── roles/                       # Role management
│       ├── department/                  # Department management
│       ├── employeeDetails/             # Employee information
│       ├── studentDetails/              # Student information
│       ├── hostel/                      # Hostel management
│       ├── hostelBlock/                 # Hostel block management
│       ├── hostelRoom/                  # Room management
│       ├── grievanceCategory/           # Grievance categories
│       ├── grievanceSubCategory/        # Grievance sub-categories
│       ├── ticketStatus/                # Ticket status management
│       ├── ticketPriority/              # Ticket priority levels
│       └── grievances/                  # Core grievance module
│           ├── models/
│           │   ├── grievance.model.ts           # Main grievance entity
│           │   └── grievanceExecution.model.ts  # Execution tracking
│           ├── dto/
│           │   └── grievance.dto.ts             # Data transfer objects
│           ├── grievances.controller.ts         # REST endpoints
│           ├── grievances.service.ts            # Business logic
│           └── grievances.module.ts             # Module definition
│
├── .env                                 # Environment variables
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript configuration
└── nest-cli.json                        # NestJS CLI configuration
```

### Module Structure Pattern

Each feature module follows a consistent structure:

```
module-name/
├── models/                    # Sequelize models
│   └── entity.model.ts
├── dto/                       # Data Transfer Objects
│   └── entity.dto.ts
├── entity.controller.ts       # REST API endpoints
├── entity.service.ts          # Business logic
└── entity.module.ts           # Module definition
```

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────────┐
│  UserAccount    │
│─────────────────│
│ id (PK, UUID)   │
│ email           │
│ password        │
│ role_id (FK)    │──────┐
│ account_status  │      │
└─────────────────┘      │
                         │
                    ┌────▼──────┐
                    │   Roles   │
                    │───────────│
                    │ id (PK)   │
                    │ name      │
                    │ code      │
                    └───────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
┌────────▼────────┐            ┌─────────▼────────┐
│ StudentDetails  │            │ EmployeeDetails  │
│─────────────────│            │──────────────────│
│ id (PK, UUID)   │            │ id (PK, UUID)    │
│ user_id (FK)    │            │ user_id (FK)     │
│ registration_no │            │ employee_code    │
│ name            │            │ name             │
│ is_active       │            │ department_id(FK)│
└────────┬────────┘            │ hostel_id (FK)   │
         │                     │ role_id (FK)     │
         │                     │ is_active        │
         │                     └─────────┬────────┘
         │                               │
         │                               │
         │      ┌──────────────────┐     │
         │      │   Department     │◄────┘
         │      │──────────────────│
         │      │ id (PK)          │
         │      │ name             │
         │      │ code             │
         │      │ default_hod_     │
         │      │ employee_id (FK) │
         │      └──────────────────┘
         │
         │
┌────────▼─────────────────────────────────────────────────┐
│                  Grievance Details                        │
│───────────────────────────────────────────────────────────│
│ id (PK, UUID)                                            │
│ public_ticket_no (UNIQUE)                                │
│ student_id (FK) ──────────────────┐                      │
│ category_id (FK) ─────────────┐   │                      │
│ sub_category_id (FK) ──────┐  │   │                      │
│ subject                     │  │   │                      │
│ description                 │  │   │                      │
│ status_id (FK) ──────┐      │  │   │                      │
│ priority_id (FK) ──┐ │      │  │   │                      │
│ current_assigned_   │ │      │  │   │                      │
│  employee_id (FK)   │ │      │  │   │                      │
│ hostel_id (FK)      │ │      │  │   │                      │
│ hostel_block_id(FK) │ │      │  │   │                      │
│ room_no_id (FK)     │ │      │  │   │                      │
│ department (FK)     │ │      │  │   │                      │
│ class_of           │ │      │  │   │                      │
│ first_response_at  │ │      │  │   │                      │
│ resolved_at        │ │      │  │   │                      │
│ sla_due_at         │ │      │  │   │                      │
│ createdAt          │ │      │  │   │                      │
│ updatedAt          │ │      │  │   │                      │
└────────────────────┼─┼──────┼──┼───┼──────────────────────┘
                     │ │      │  │   │
          ┌──────────┘ │      │  │   └─────────────┐
          │            │      │  │                  │
   ┌──────▼──────┐    │      │  │      ┌───────────▼────────┐
   │TicketPriority│    │      │  │      │GrievanceCategory   │
   │──────────────│    │      │  │      │────────────────────│
   │ id (PK)      │    │      │  │      │ id (PK)            │
   │ name         │    │      │  │      │ name               │
   │ code         │    │      │  │      │ code               │
   │ is_active    │    │      │  │      │ is_active          │
   └──────────────┘    │      │  │      └────────────────────┘
                       │      │  │
              ┌────────┘      │  └────────────────┐
              │               │                   │
      ┌───────▼──────┐        │     ┌─────────────▼──────────┐
      │ TicketStatus │        │     │GrievanceSubCategory    │
      │──────────────│        │     │────────────────────────│
      │ id (PK)      │        │     │ id (PK)                │
      │ name         │        │     │ name                   │
      │ code         │        │     │ category_id (FK)       │
      │ is_active    │        │     │ is_active              │
      └──────────────┘        │     └────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
             ┌──────▼─────┐      ┌──────▼──────┐
             │   Hostel   │      │ HostelBlock │
             │────────────│      │─────────────│
             │ id (PK)    │◄─────│ id (PK)     │
             │ name       │      │ hostel_id   │
             │ code       │      │ block_name  │
             │ is_special │      │ warden_     │
             │ default_   │      │ employee_id │
             │ warden_    │      │ is_active   │
             │ employee_id│      └──────┬──────┘
             │ is_active  │             │
             └────────────┘             │
                                   ┌────▼────────┐
                                   │ HostelRoom  │
                                   │─────────────│
                                   │ id (PK)     │
                                   │ room_no     │
                                   │ block_id(FK)│
                                   └─────────────┘

┌───────────────────────────────────────────────┐
│      GrievanceExecution (Audit Trail)         │
│───────────────────────────────────────────────│
│ id (PK, UUID)                                 │
│ title                                         │
│ grievance_id (FK) → Grievance Details         │
│ from_id (FK) → UserAccount/Employee/Student   │
│ to_id (FK) → UserAccount/Employee             │
│ remarks                                       │
│ createdAt                                     │
└───────────────────────────────────────────────┘
```

### Key Database Relationships

1. **UserAccount → Roles**: Many-to-One
2. **UserAccount → StudentDetails**: One-to-One
3. **UserAccount → EmployeeDetails**: One-to-One
4. **Grievance → Student**: Many-to-One
5. **Grievance → Employee (Assignee)**: Many-to-One
6. **Grievance → Category/SubCategory**: Many-to-One
7. **Grievance → Status/Priority**: Many-to-One
8. **Grievance → Hostel/Block/Room**: Many-to-One (Optional)
9. **EmployeeDetails → Department**: Many-to-One
10. **EmployeeDetails → Hostel**: Many-to-One (for Wardens)
11. **GrievanceExecution → Grievance**: Many-to-One

---

## Core Modules

### 1. Authentication Module (`auth/`)

**Purpose**: Handle JWT-based authentication

**Components**:
- `jwt.guard.ts`: Guards protected routes
- `jwt.strategy.ts`: Validates JWT tokens and extracts user data
- `jwt.module.ts`: Configures JWT settings

**Flow**:
```
User Login → Generate JWT → Include in Authorization Header → 
JWT Guard validates → Strategy extracts user → Attach to request object
```

### 2. User Account Module (`modules/userAccount/`)

**Purpose**: User registration, login, and profile management

**Key Operations**:
- User registration with password hashing
- Login with JWT token generation
- Token verification
- User profile updates
- User deletion

**Endpoints**:
- `POST /user-account/register`
- `POST /user-account/login`
- `GET /user-account/verify` (Protected)
- `GET /user-account` (Get all users)
- `PUT /user-account/update/:id`
- `DELETE /user-account/delete/:id`

### 3. Grievances Module (`modules/grievances/`)

**Purpose**: Core grievance management functionality

**Key Features**:
- Automatic ticket number generation
- Smart assignment based on grievance type
- Dynamic priority assignment
- SLA calculation (24 hours default)
- Grievance execution tracking

**Business Logic**:

#### Academic Grievances:
- Requires: `department`, `class_of`
- Excludes: Hostel details
- Auto-assigned to: HOD of the department
- Priority: MEDIUM

#### Hostel Grievances:
- Requires: `hostel_id`, `hostel_block_id`, `room_no_id`
- Excludes: Department, class details
- Auto-assigned to: Block Warden or Hostel Warden
- Priority: HIGH (if special hostel), MEDIUM (otherwise)

**Endpoints**:
- `POST /grievances` - Create grievance
- `GET /grievances` - Get all grievances
- `GET /grievances/:id` - Get specific grievance
- `PATCH /grievances/:id` - Update grievance
- `DELETE /grievances/:id` - Delete grievance
- `PATCH /grievances/:id/assign` - Assign to another employee

### 4. Master Data Modules

#### Roles Module
- Define system roles (Student, HOD, Warden, Admin, etc.)

#### Department Module
- Manage academic departments
- Link default HOD for auto-assignment

#### Grievance Category Module
- Define grievance types (Academic, Hostel, etc.)
- Link to auto-assignment logic

#### Grievance Sub-Category Module
- Detailed classification within categories

#### Ticket Status Module
- Manage lifecycle states (ACTIVE, RESOLVED, CLOSED, etc.)

#### Ticket Priority Module
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)

#### Hostel/Block/Room Modules
- Hierarchical hostel structure management
- Link wardens for auto-assignment

#### Student/Employee Details Modules
- Extended user profile information
- Links to academic/organizational structure

### 5. CAPTCHA Module (`modules/captcha/`)

**Purpose**: Generate CAPTCHA for bot prevention

**Features**:
- SVG-based CAPTCHA generation
- Session-based verification

---

## Application Flows

### 1. User Registration & Login Flow

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ User Submits    │
│ Registration    │
│ Form            │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Validate Input  │
│ (Email, Role)   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Hash Password   │
│ (bcrypt)        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Create User     │
│ Account in DB   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Return Success  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ User Login      │
│ (Email+Pass)    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Validate        │
│ Credentials     │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Generate JWT    │
│ Token           │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Return Token    │
│ to Client       │
└────┬────────────┘
     │
     ▼
┌─────────┐
│   END   │
└─────────┘
```

### 2. Grievance Submission Flow (Academic)

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ Student Submits      │
│ Academic Grievance   │
│ (with department &   │
│  class_of)           │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Student     │
│ (Active status)      │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Category    │
│ & Sub-Category       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Check Category Type  │
│ → ACADEMIC           │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Reject if hostel     │
│ details provided     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Find Department HOD  │
│ (from department or  │
│  role query)         │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Set Priority:        │
│ MEDIUM               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Set Status:          │
│ ACTIVE               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Generate Ticket No   │
│ (GRV-XXXXXX-XXXX)    │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Calculate SLA        │
│ (createdAt + 24hrs)  │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Create Grievance     │
│ Record               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Create Execution     │
│ Entry (Assignment    │
│ Audit)               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Return Full          │
│ Grievance with       │
│ Relations            │
└────┬─────────────────┘
     │
     ▼
┌─────────┐
│   END   │
└─────────┘
```

### 3. Grievance Submission Flow (Hostel)

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ Student Submits      │
│ Hostel Grievance     │
│ (with hostel, block, │
│  room details)       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Student     │
│ (Active status)      │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Category    │
│ & Sub-Category       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Check Category Type  │
│ → HOSTEL             │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Reject if dept/class │
│ details provided     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Room &      │
│ Block existence      │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Hostel      │
│ (Active status)      │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Check Hostel Type    │
│ (is_special?)        │
└────┬─────────────────┘
     │
     ├─Yes─► Priority: HIGH
     │
     └─No──► Priority: MEDIUM
                │
                ▼
┌──────────────────────┐
│ Find Warden:         │
│ 1. Block Warden      │
│ 2. Hostel Warden     │
│ 3. Query by Role     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Set Status:          │
│ ACTIVE               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Generate Ticket No   │
│ Calculate SLA        │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Create Grievance     │
│ Record               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Create Execution     │
│ Entry                │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Return Full          │
│ Grievance            │
└────┬─────────────────┘
     │
     ▼
┌─────────┐
│   END   │
└─────────┘
```

### 4. Grievance Assignment Flow

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ HOD/Warden Requests  │
│ Assignment to        │
│ Another Employee     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Grievance   │
│ Exists               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Check Current        │
│ Assignee             │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Requestor   │
│ Role (HOD/WARDEN)    │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Validate Target      │
│ Employee (Active)    │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Update Grievance     │
│ Assignment           │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Create Execution     │
│ Entry (Audit)        │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Return Success       │
└────┬─────────────────┘
     │
     ▼
┌─────────┐
│   END   │
└─────────┘
```

### 5. JWT Authentication Flow

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ Client Sends Request │
│ with JWT in          │
│ Authorization Header │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ JWT Guard Intercepts │
│ Request              │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Extract Token from   │
│ Header               │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ JWT Strategy         │
│ Validates Token      │
│ (Secret & Expiry)    │
└────┬─────────────────┘
     │
     ├─Invalid─► 401 Unauthorized
     │
     └─Valid
         │
         ▼
┌──────────────────────┐
│ Extract User ID      │
│ from Payload         │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Query User from DB   │
│ (id, role, email,    │
│  status)             │
└────┬─────────────────┘
     │
     ├─Not Found─► 401 User Doesn't Exist
     │
     └─Found
         │
         ▼
┌──────────────────────┐
│ Attach User Object   │
│ to Request           │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Proceed to           │
│ Controller           │
└────┬─────────────────┘
     │
     ▼
┌─────────┐
│   END   │
└─────────┘
```

---

## API Documentation

### Swagger/OpenAPI Integration

The API is fully documented using Swagger. Access documentation at:

```
http://localhost:{PORT}/api/docs
```

### API Base Structure

**Base URL**: `http://localhost:{PORT}`

**Authentication**: Bearer Token (JWT)

```http
Authorization: Bearer <jwt_token>
```

### Main API Groups

#### 1. User Account APIs (`/user-account`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user-account/register` | Register new user | No |
| POST | `/user-account/login` | User login | No |
| GET | `/user-account/verify` | Verify token | Yes |
| GET | `/user-account` | Get all users | No |
| PUT | `/user-account/update/:id` | Update user | No |
| DELETE | `/user-account/delete/:id` | Delete user | No |

#### 2. Grievance APIs (`/grievances`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/grievances` | Submit grievance | TBD |
| GET | `/grievances` | Get all grievances | TBD |
| GET | `/grievances/:id` | Get specific grievance | TBD |
| PATCH | `/grievances/:id` | Update grievance | TBD |
| DELETE | `/grievances/:id` | Delete grievance | TBD |
| PATCH | `/grievances/:id/assign` | Assign grievance | TBD |

#### 3. Master Data APIs

Each master data module follows CRUD pattern:

- `/roles` - Role management
- `/departments` - Department management
- `/hostel` - Hostel management
- `/hostel-block` - Block management
- `/hostel-room` - Room management
- `/grievance-category` - Category management
- `/grievance-sub-category` - Sub-category management
- `/ticket-status` - Status management
- `/ticket-priority` - Priority management
- `/student-details` - Student information
- `/employee-details` - Employee information

#### 4. CAPTCHA APIs (`/captcha`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/captcha/generate` | Generate CAPTCHA |
| POST | `/captcha/verify` | Verify CAPTCHA |

---

## Security & Authentication

### JWT Authentication

**Configuration**:
- Secret: Stored in environment variable `JWT_SECRET`
- Token Location: Authorization header
- Extraction: Custom extractor from headers

**Token Payload**:
```json
{
  "id": "user-uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Password Security

- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: Configured in bcrypt implementation
- Passwords never stored in plain text

### Guards

**JWT Guard** (`@UseGuards(AuthGuard)`):
- Protects endpoints requiring authentication
- Validates JWT token
- Attaches user to request object

### Environment Variables

Critical security configurations stored in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=grievance_db

# Server
PORT=8080

# JWT
JWT_SECRET=your_secret_key

# Node Environment
NODE_ENV=development
```

---

## Business Logic

### Auto-Assignment Logic

#### Academic Grievances

1. **Check category code/name** contains "ACADEMIC"
2. **Validate required fields**: department, class_of
3. **Find HOD**:
   - First: Check `department.default_hod_employee_id`
   - Fallback: Query employee with role='HOD' in that department
4. **Set priority**: MEDIUM
5. **Assign** to HOD

#### Hostel Grievances

1. **Check category code/name** contains "HOSTEL" or is non-academic
2. **Validate required fields**: hostel_id, hostel_block_id, room_no_id
3. **Determine priority**:
   - HIGH if `hostel.is_special = true`
   - MEDIUM otherwise
4. **Find Warden**:
   - First: Check `hostel_block.warden_employee_id`
   - Second: Check `hostel.default_warden_employee_id`
   - Fallback: Query employee with role='WARDEN' in that hostel
5. **Assign** to Warden

### Ticket Number Generation

**Format**: `GRV-{timestamp}-{random}`

**Components**:
- Prefix: "GRV"
- Timestamp: Last 6 digits of current timestamp
- Random: 4-digit random number (1000-9999)

**Example**: `GRV-123456-7890`

### SLA Calculation

**Default SLA**: 24 hours from creation

```typescript
const sla_due_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
```

### Execution Tracking

Every assignment/action creates an entry in `grievance_execution`:

**Fields**:
- `title`: Action description
- `grievance_id`: Related grievance
- `from_id`: Initiator (student/employee)
- `to_id`: Recipient (employee)
- `remarks`: Additional notes
- `createdAt`: Timestamp

**Use Cases**:
- Initial assignment upon creation
- Re-assignment tracking
- Status change history
- Complete audit trail

### Status Lifecycle

Typical grievance status flow:

```
ACTIVE → IN_PROGRESS → RESOLVED → CLOSED
   │
   └──► REJECTED (if invalid)
```

### Error Handling

Centralized error handler in `utils/Error/errorHandler.ts`:

**Features**:
- Catches HttpException
- Formats error responses consistently
- Returns structured error objects

**Response Format**:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

---

## Configuration

### Database Configuration

**File**: `src/config/database.config.ts`

**Settings**:
- Dialect: PostgreSQL
- Auto-load models: Enabled
- Synchronize: Enabled (development)
- Sync mode: `alter` (updates schema without dropping)

### CORS Configuration

**File**: `src/main.ts`

**Settings**:
- Origin: `true` (allows all origins)
- Credentials: `true`

### Swagger Configuration

**Title**: Grievance Management API  
**Version**: 1.0  
**Authentication**: Bearer Auth  
**Endpoint**: `/api/docs`

---

## Deployment Considerations

### Environment Setup

1. Set all required environment variables
2. Ensure PostgreSQL database is running
3. Run migrations (if applicable)
4. Start server with appropriate script

### Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure database with SSL
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure database connection pooling
- [ ] Set up backup strategy
- [ ] Implement proper error tracking
- [ ] Configure reverse proxy (nginx/apache)

---

## Future Enhancements

### Potential Features

1. **Real-time Notifications**: WebSocket integration for live updates
2. **File Attachments**: Support for uploading evidence/screenshots
3. **Email Notifications**: Automatic email alerts on assignments
4. **Advanced Analytics**: Dashboard for grievance metrics
5. **Rating System**: Student satisfaction ratings
6. **Escalation Logic**: Auto-escalate if SLA is breached
7. **Multi-language Support**: Internationalization
8. **Mobile App**: Dedicated mobile application
9. **Chat Feature**: Real-time communication on grievances
10. **Advanced Search**: Elasticsearch integration

### Technical Improvements

1. **Caching**: Redis for frequently accessed data
2. **Queue System**: Bull/Redis for background jobs
3. **Rate Limiting**: Protect APIs from abuse
4. **API Versioning**: Version control for APIs
5. **Database Migrations**: Proper migration system
6. **Unit Tests**: Comprehensive test coverage
7. **E2E Tests**: Full integration testing
8. **CI/CD Pipeline**: Automated deployment
9. **Monitoring**: APM integration (New Relic, DataDog)
10. **Logging**: Structured logging (Winston/Bunyan)

---

## Support & Maintenance

### Code Quality

- Follow NestJS best practices
- Maintain consistent code style
- Use TypeScript strict mode
- Document complex business logic
- Write meaningful commit messages

### Troubleshooting

**Common Issues**:

1. **Database Connection Failure**: Check `.env` configuration
2. **JWT Validation Error**: Verify JWT_SECRET matches
3. **Port Already in Use**: Change PORT in `.env`
4. **Model Sync Issues**: Check foreign key constraints

---

## Conclusion

This Grievance Management System is a robust, scalable, and well-architected application built with modern technologies and best practices. The modular structure ensures maintainability, and the comprehensive business logic handles complex assignment scenarios automatically.

The system is designed to grow with the organization's needs and can be extended with additional features as requirements evolve.

---

**Document Version**: 1.0  
**Last Updated**: May 21, 2026  
**Maintained By**: Development Team
