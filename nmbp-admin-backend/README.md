Overview
The nmbp-admin-backend is a Node.js/TypeScript service designed to provide administrative backend functionality for your platform. It handles post authentication (after login functionalities), API routing, business logic, and integrations with databases and external services.

Project Structure
• Dockerfile: Containerization setup for deployment.
• package.json: Project dependencies, env configurations and scripts.
• tsconfig.json: TypeScript configuration.
src/main/
• app.ts: Entry point; initializes Express app, middleware, and error handling.
• api/
◦ controllers/: Business logic for API endpoints.
◦ models/: Data models and schemas.
◦ repositories/: Database access and queries.
◦ routes/: API route definitions.
◦ services/: Core service logic (e.g., user management, notifications).
◦ validations/: Input validation logic.
• config/: Configuration files (auth, environment, error codes, etc.).
• enums/: Enumerations for domain logic, cache TTL, status, etc.
• helpers/: Utility functions (cron jobs, encryption, Redis key formatting).
• startup/routes.ts: Application route setup.
• swagger/: API documentation (swagger.json, swagger.ts).
• types/: Custom TypeScript type definitions.
• views/: Template files for rendering responses.
• worker/: Background job processing.

Key Features
• Authentication: Managed via config/authConfig.ts and related middleware.
• API Documentation: Swagger integration for API reference (http://localhost:7003/api/v1/admin/docs).
• Database Integration: Supports MongoDB and PostgreSQL via repositories and models.
• Error Handling: Centralized error codes and handling logic.
• Environment Configuration: Flexible environment setup via config/environment.ts.

How To Run
cd nmbp-admin-backend
npm install

Configure environment
Set up environment variables in config/environment.ts or via package.json.

Run the service
npm start
