# RBAC/UBAC Module - Developer Setup Guide

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Clone the Repository](#3-clone-the-repository)
4. [Database Setup](#4-database-setup)
5. [Install Dependencies](#5-install-dependencies)
6. [Environment Configuration](#6-environment-configuration)
7. [Running the Application](#7-running-the-application)
8. [Verify the Setup](#8-verify-the-setup)
9. [Default Login Credentials](#9-default-login-credentials)
10. [API Documentation (Swagger)](#10-api-documentation-swagger)
11. [Project Structure](#11-project-structure)
12. [Running Tests](#12-running-tests)
13. [Docker Setup (Optional)](#13-docker-setup-optional)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Overview

The RBAC/UBAC Module is a Role-Based and User-Based Access Control system built as a monorepo with the following services:

| Service                      | Port | Description                                                         |
| ---------------------------- | ---- | ------------------------------------------------------------------- |
| `nmbp-auth-backend`          | 7001 | Authentication & Authorization API                                  |
| `nmbp-admin-profile-backend` | 7002 | User Management API                                                 |
| `nmbp-admin-backend`         | 7003 | Admin Management API (Menus, Roles, Tenants, Projects, FormBuilder) |
| `nmbp-admin-frontend`        | 3001 | React Admin Dashboard                                               |

**Tech Stack:**

- **Backend:** Node.js, TypeScript, Express.js
- **Frontend:** React 18, TypeScript, Mantine UI, Tailwind CSS
- **Databases:** PostgreSQL, MongoDB, Redis
- **Shared Library:** `ts-commons` (private git package)

---

## 2. Prerequisites

Install the following on your development machine:

| Software       | Version                  | Purpose                     |
| -------------- | ------------------------ | --------------------------- |
| **Node.js**    | v18+ (LTS recommended)   | Runtime                     |
| **npm**        | v9+ (comes with Node.js) | Package manager             |
| **Git**        | Latest                   | Version control             |
| **PostgreSQL** | 12+                      | Relational database         |
| **MongoDB**    | 4.0+                     | NoSQL database              |
| **Redis**      | 6.0+                     | Caching and session storage |

### Installation by Platform

<details>
<summary><strong>Windows</strong></summary>

- **Node.js:** Download the LTS installer from https://nodejs.org and run it. This installs both Node.js and npm.
- **Git:** Download from https://git-scm.com/download/win and install. Use Git Bash or add Git to your system PATH.
- **PostgreSQL:** Download from https://www.postgresql.org/download/windows/ and run the installer. The installer includes pgAdmin and psql CLI. Ensure the PostgreSQL bin directory is added to your PATH.
- **MongoDB:** Download from https://www.mongodb.com/try/download/community and install as a Windows service. Add the MongoDB bin directory to your PATH.
- **Redis:** Download from https://github.com/microsoftarchive/redis/releases (Windows port) or use WSL. Alternatively, use Memurai (https://www.memurai.com/) as a Redis-compatible alternative for Windows.

Start services via **Services** (Win+R → `services.msc`) or from the command line:

```cmd
net start postgresql-x64-15
net start MongoDB
net start Redis
```

</details>

<details>
<summary><strong>macOS</strong></summary>

```bash
# Install Homebrew (if not installed): https://brew.sh

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install Redis
brew install redis
brew services start redis
```

</details>

<details>
<summary><strong>Linux (Ubuntu/Debian)</strong></summary>

```bash
# Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# MongoDB
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
sudo systemctl start mongod
sudo systemctl enable mongod

# Redis
sudo apt-get install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

</details>

<details>
<summary><strong>Linux (RHEL/CentOS/Fedora)</strong></summary>

```bash
# Node.js (via NodeSource)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# PostgreSQL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# MongoDB
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/
sudo systemctl start mongod
sudo systemctl enable mongod

# Redis
sudo yum install -y redis
sudo systemctl start redis
sudo systemctl enable redis
```

</details>

---

## 3. Clone the Repository

```bash
# Clone the project
git clone https://openforge.gov.in/plugins/git/common-components-negd/rbac-ubac-module.git

# Navigate into the project
cd rbac-ubac-module
```

---

## 4. Database Setup

### 4.1 PostgreSQL Setup

#### Create the database and user

```bash
# Connect to PostgreSQL (use your terminal, Git Bash on Windows, or pgAdmin's SQL editor)
psql -U postgres
```

> **Windows note:** If `psql` is not recognized, add the PostgreSQL bin directory to your PATH (e.g., `C:\Program Files\PostgreSQL\15\bin`), or use pgAdmin's built-in Query Tool.

```sql
-- Create the database
CREATE DATABASE reusable_components;

-- Verify
\l
```

Press `\q` to exit psql.

#### Run the DDL scripts (create tables and views)

```bash
# Create tables
psql -U postgres -d reusable_components -f ts-db/postgresql/ddl/tables.sql

# Create views
psql -U postgres -d reusable_components -f ts-db/postgresql/ddl/views.sql
```

#### Run the DML scripts (seed data)

```bash
psql -U postgres -d reusable_components -f ts-db/postgresql/dml/script.sql
```

This will create:

- Default **Super Admin** role
- Default **permissions** (Read, Write)
- Default **menu items** (Dashboard, User Management, Role Management, Password Policy, Tenant Management)
- Default **Super Admin user** (username: `1234567890`)
- **Access control** mappings for Super Admin
- **Password policy** defaults
- **Countries** reference data (250+ entries)

#### Verify the setup

```bash
psql -U postgres -d reusable_components -c "SELECT menu_id, menu_name, route_url FROM m_menus ORDER BY menu_order;"
```

Expected output:

```
 menu_id |     menu_name      |    route_url
---------+--------------------+------------------
       1 | Dashboard          | /dashboard
       2 | User Management    | /user-management
       3 | Role Management    | /role-management
       5 | Tenant Management  | /tenants
       4 | Password Policy    | /password-policy
```

### 4.2 MongoDB Setup

#### Create the database and user

```bash
# Connect to MongoDB (use your terminal or Git Bash on Windows)
mongosh
```

> **Windows note:** If `mongosh` is not recognized, add the MongoDB bin directory to your PATH (e.g., `C:\Program Files\MongoDB\Server\7.0\bin`), or download `mongosh` separately from https://www.mongodb.com/try/download/shell.

```javascript
// Switch to admin database
use admin

// Create the application user
db.createUser({
  user: "dev_local",
  pwd: "reusable_components",
  roles: [
    { role: "readWrite", db: "reusable-components" }
  ]
});

// Switch to the application database
use reusable-components

// Verify
db.getCollectionNames()
```

Type `exit` to quit mongosh.

> **Note:** MongoDB collections (tenants, projects, formBuilders) are created automatically when the application first writes to them.

### 4.3 Redis Setup

Redis should be running with default configuration (no authentication required for local dev).

```bash
# Verify Redis is running
redis-cli ping
```

Expected output: `PONG`

---

## 5. Install Dependencies

From the project root directory:

```bash
# Install all dependencies for all services in one command
npm run install:all
```

This will run `npm install` in:

1. Root (installs `concurrently`)
2. `nmbp-admin-backend`
3. `nmbp-admin-frontend`
4. `nmbp-admin-profile-backend`
5. `nmbp-auth-backend`

> **Note:** The backend services depend on `ts-commons`, a private git package. The credentials are embedded in the `package.json` git URL. If you encounter authentication errors, ensure your network can reach `openforge.gov.in`.

---

## 6. Environment Configuration

Environment variables are preconfigured in each service's `package.json` under `nodemonConfig.env`. **No `.env` files are needed for the backends** in local development.

### Backend Services (nmbp-auth-backend, nmbp-admin-profile-backend, nmbp-admin-backend)

The default configuration in `package.json` points to:

| Variable                      | Value                 | Description             |
| ----------------------------- | --------------------- | ----------------------- |
| `APP_ENV`                     | `dev`                 | Application environment |
| `INIT_COMMON_MASTER_HOST`     | `localhost`           | PostgreSQL host         |
| `INIT_COMMON_MASTER_PORT`     | `5432`                | PostgreSQL port         |
| `INIT_COMMON_MASTER_USER`     | `postgres`            | PostgreSQL user         |
| `INIT_COMMON_MASTER_PASSWORD` | `postgres`            | PostgreSQL password     |
| `INIT_COMMON_MASTER_DATABASE` | `reusable_components` | PostgreSQL database     |
| `INIT_COMMON_NOSQL_HOST`      | `localhost`           | MongoDB host            |
| `INIT_COMMON_NOSQL_PORT`      | `27017`               | MongoDB port            |
| `INIT_COMMON_NOSQL_DATABASE`  | `reusable-components` | MongoDB database        |
| `INIT_COMMON_NOSQL_USER`      | `dev_local`           | MongoDB user            |
| `INIT_COMMON_NOSQL_PASSWORD`  | `reusable_components` | MongoDB password        |
| `INIT_COMMON_REDIS_HOST`      | `127.0.0.1`           | Redis host              |
| `INIT_COMMON_REDIS_PORT`      | `6379`                | Redis port              |

If your local database credentials differ, update the respective `nodemonConfig.env` section in:

- `nmbp-auth-backend/package.json`
- `nmbp-admin-profile-backend/package.json`
- `nmbp-admin-backend/package.json`

### Frontend (nmbp-admin-frontend)

The frontend uses a `.env` file at `nmbp-admin-frontend/.env`:

```env
REACT_APP_AUTH_API_BASE_URL=http://localhost:7001
REACT_APP_USER_API_BASE_URL=http://localhost:7002
REACT_APP_ADMIN_API_BASE_URL=http://localhost:7003
```

This file is already preconfigured for local development. No changes needed.

---

## 7. Running the Application

### Option A: Start all services together (recommended)

From the project root:

```bash
npm run dev
```

This uses `concurrently` to start all 4 services with color-coded output:

- **Blue** — ADMIN-BE (port 7003)
- **Green** — ADMIN-FE (port 3001)
- **Yellow** — USER-BE (port 7002)
- **Magenta** — AUTH-BE (port 7001)

### Option B: Start services individually

Open 4 separate terminal windows:

```bash
# Terminal 1 - Auth Backend
cd nmbp-auth-backend && npm start

# Terminal 2 - User Backend
cd nmbp-admin-profile-backend && npm start

# Terminal 3 - Admin Backend
cd nmbp-admin-backend && npm start

# Terminal 4 - Admin Frontend
cd nmbp-admin-frontend && npm start
```

> **Note:** Each backend runs a `prestart` script that auto-generates Swagger documentation before starting.

---

## 8. Verify the Setup

### Check all services are running

| Service        | URL                                             | Expected   |
| -------------- | ----------------------------------------------- | ---------- |
| Auth Backend   | http://localhost:7001/api/v1/auth/docs          | Swagger UI |
| User Backend   | http://localhost:7002/api/v1/admin-profile/docs | Swagger UI |
| Admin Backend  | http://localhost:7003/api/v1/admin/docs         | Swagger UI |
| Admin Frontend | http://localhost:3001                           | Login page |

### Test login

1. Open http://localhost:3001
2. Login with the default credentials (see section 9)
3. You should see the Dashboard with the sidebar menu

---

## 9. Default Login Credentials

| Field        | Value        |
| ------------ | ------------ |
| **Username** | `1234567890` |
| **Password** | `TS123!@#`   |
| **Role**     | Super Admin  |

> **Important:** This password works only when `APP_ENV=dev`. In production, passwords follow the configured password policy.

---

## 10. API Documentation (Swagger)

Each backend service auto-generates Swagger documentation on startup.

| Service | Swagger URL                                     |
| ------- | ----------------------------------------------- |
| Auth    | http://localhost:7001/api/v1/auth/docs          |
| User    | http://localhost:7002/api/v1/admin-profile/docs |
| Admin   | http://localhost:7003/api/v1/admin/docs         |

### Key API Endpoints

**Authentication (port 7001):**

- `POST /api/v1/auth/login` — User login
- `POST /api/v1/auth/forgotPassword` — Forgot password
- `POST /api/v1/auth/changePassword` — Change password

**User Management (port 7002):**

- `GET /api/v1/admin-profile/users/getLoggedInUserInfo` — Get current user info
- `POST /api/v1/admin-profile/users/logout` — Logout

**Admin (port 7003):**

- `POST /api/v1/admin/users/createUser` — Create user
- `GET /api/v1/admin/users/listUsers` — List users
- `POST /api/v1/admin/roles/createRole` — Create role
- `GET /api/v1/admin/roles/listRoles` — List roles
- `GET /api/v1/admin/menus/list` — List menus
- `POST /api/v1/admin/tenants/createTenant` — Create tenant
- `GET /api/v1/admin/tenants/getTenants` — List tenants
- `POST /api/v1/admin/projects/createProject` — Create project
- `POST /api/v1/admin/formBuilder/createFormBuilder` — Create form

---

## 11. Project Structure

```
rbac-ubac-module/
├── package.json                    # Root monorepo config (concurrently)
├── DEVELOPER_SETUP.md              # This file
│
├── nmbp-auth-backend/                # Authentication Service (port 7001)
│   ├── package.json
│   ├── Dockerfile
│   └── src/main/
│       ├── app.ts                  # Entry point
│       ├── api/
│       │   ├── controllers/        # Request handlers
│       │   ├── routes/             # Express route definitions
│       │   ├── services/           # Business logic
│       │   ├── repositories/       # Database queries
│       │   └── validations/        # Joi validation schemas
│       ├── config/                 # Auth config, error codes, environment
│       ├── enums/                  # SQL queries, Redis keys, status codes
│       ├── helpers/                # Cron jobs, encryption, Redis utilities
│       ├── startup/routes.ts       # Route registration
│       ├── swagger/                # Auto-generated Swagger docs
│       └── types/                  # TypeScript type definitions
│
├── nmbp-admin-profile-backend/                # User Service (port 7002)
│   ├── package.json
│   ├── Dockerfile
│   └── src/main/                   # Same structure as auth-backend
│
├── nmbp-admin-backend/               # Admin Service (port 7003)
│   ├── package.json
│   ├── Dockerfile
│   └── src/main/
│       ├── app.ts
│       ├── api/
│       │   ├── controllers/
│       │   ├── models/             # MongoDB model definitions
│       │   ├── routes/
│       │   ├── services/
│       │   ├── repositories/
│       │   └── validations/
│       ├── config/
│       ├── enums/
│       ├── helpers/
│       ├── startup/routes.ts
│       ├── swagger/
│       └── types/
│
├── nmbp-admin-frontend/              # React Admin Dashboard (port 3001)
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf                  # Production nginx config
│   ├── .env                        # Local dev API URLs
│   ├── .env.dev                    # Dev environment API URLs
│   ├── .env.prod                   # Production API URLs
│   └── src/
│       ├── App.tsx                 # Route definitions
│       ├── api/                    # Axios HTTP client config
│       ├── components/             # Reusable UI components
│       │   └── common/
│       │       ├── DataTable/
│       │       ├── Drawer/
│       │       ├── DropDown/
│       │       ├── Header/
│       │       └── SideBarMenu/
│       ├── constants/              # Form types and other constants
│       ├── contexts/               # Auth, Loader, Logger, Toast providers
│       ├── enums/
│       ├── hooks/                  # Custom React hooks
│       ├── pages/
│       │   ├── Admin/
│       │   │   ├── Dashboard/
│       │   │   ├── UserManagement/
│       │   │   ├── RoleManagement/
│       │   │   ├── PasswordPolicy/
│       │   │   ├── TenantManagement/
│       │   │   ├── ProjectDetails/
│       │   │   └── FormBuilder/
│       │   ├── Home/
│       │   └── Login/
│       └── utils/                  # Encryption, preferences
│
└── ts-db/                          # Database Scripts
    ├── postgresql/
    │   ├── ddl/
    │   │   ├── tables.sql          # Table definitions
    │   │   └── views.sql           # View definitions
    │   └── dml/
    │       └── script.sql          # Seed data
    └── mongodb/
        └── index.js                # Placeholder
```

---

## 12. Running Tests

Each backend service has Mocha-based tests:

```bash
# Run tests for a specific service
cd nmbp-auth-backend && npm test
cd nmbp-admin-profile-backend && npm test
cd nmbp-admin-backend && npm test

# Run frontend tests
cd nmbp-admin-frontend && npm test
```

---

## 13. Docker Setup (Optional)

Each service includes a `Dockerfile` for containerized deployment.

### Build individual services

```bash
# Auth Backend
cd nmbp-auth-backend
docker build -t rbac-auth-backend .

# User Backend
cd nmbp-admin-profile-backend
docker build -t rbac-user-backend .

# Admin Backend
cd nmbp-admin-backend
docker build -t rbac-admin-backend .

# Admin Frontend (pass environment: dev or prod)
cd nmbp-admin-frontend
docker build --build-arg ENVIRONMENT=dev -t rbac-admin-frontend .
```

### Run containers

```bash
# Backends
docker run -p 7001:7001 --env-file .env rbac-auth-backend
docker run -p 7002:7002 --env-file .env rbac-user-backend
docker run -p 7003:7003 --env-file .env rbac-admin-backend

# Frontend (served via Nginx on port 80)
docker run -p 3001:80 rbac-admin-frontend
```

> **Note:** When running in Docker, update database host variables from `localhost` to the appropriate Docker network addresses or host machine IP.

---

## 14. Troubleshooting

### Common Issues

**1. `npm install` fails with git authentication error**

```
npm ERR! fatal: Authentication failed for 'https://openforge.gov.in/...'
```

The `ts-commons` package is hosted on a private git server. Ensure your network can reach `openforge.gov.in`. If behind a VPN, connect first before running install.

**2. PostgreSQL connection refused**

```
error: connect ECONNREFUSED 127.0.0.1:5432
```

- Ensure PostgreSQL is running:
  - **Windows:** Check in Services (`services.msc`) or run `pg_isready`
  - **macOS:** `brew services list` or `pg_isready`
  - **Linux:** `sudo systemctl status postgresql` or `pg_isready`
- Verify credentials in the service's `package.json` → `nodemonConfig.env`

**3. MongoDB authentication failed**

```
MongoServerError: Authentication failed
```

- Ensure the `dev_local` user exists in the `admin` database
- Re-run the MongoDB user creation step from Section 4.2

**4. Redis connection error**

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

- Start Redis:
  - **Windows:** Start from Services (`services.msc`) or run `redis-server` manually
  - **macOS:** `brew services start redis`
  - **Linux:** `sudo systemctl start redis`

**5. Port already in use**

```
Error: listen EADDRINUSE: address already in use :::7003
```

- Kill the existing process:
  - **Windows:** `netstat -ano | findstr :7003` then `taskkill /PID <PID> /F`
  - **macOS/Linux:** `lsof -ti:7003 | xargs kill -9`
- Or change the port in the service's `package.json` → `nodemonConfig.env.PORT`

**6. Frontend compilation errors in `node_modules`**

```
node_modules/@mantine/core/lib/... error TS1005
```

These are pre-existing Mantine library type definition issues. They do not affect the application. The frontend runs correctly via `react-scripts`.

**7. Swagger generation fails**
If the `prestart` swagger script fails, you can skip it and start manually:

```bash
cd nmbp-admin-backend
npx ts-node src/main/app.ts
```

---

## Quick Start (TL;DR)

```bash
# 1. Clone
git clone https://openforge.gov.in/plugins/git/common-components-negd/rbac-ubac-module.git
cd rbac-ubac-module

# 2. Setup PostgreSQL
psql -U postgres -c "CREATE DATABASE reusable_components;"
psql -U postgres -d reusable_components -f ts-db/postgresql/ddl/tables.sql
psql -U postgres -d reusable_components -f ts-db/postgresql/ddl/views.sql
psql -U postgres -d reusable_components -f ts-db/postgresql/dml/script.sql

# 3. Setup MongoDB
mongosh --eval 'use admin; db.createUser({user:"dev_local",pwd:"reusable_components",roles:[{role:"readWrite",db:"reusable-components"}]})'

# 4. Ensure Redis is running
redis-cli ping

# 5. Install all dependencies
npm run install:all

# 6. Start all services
npm run dev

# 7. Open browser
# http://localhost:3001
# Login: 1234567890 / TS123!@#
```
