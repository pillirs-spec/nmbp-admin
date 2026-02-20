Overview
The user backend, located in the nmbp-admin-profile-backend/ directory, is a Node.js/TypeScript service designed to handle user-related operations (profile management) for your application. Here’s an overview of its structure and purpose:

Project Structure
• Dockerfile: Containerization setup for deployment.
• package.json: Project dependencies, env configurations and scripts.
• tsconfig.json: TypeScript configuration.
• logs/: Directory for log files.
src/main/
• app.ts: Entry point; initializes Express app, middleware, and error handling.
• api/
◦ controllers/: Business logic for API endpoints.
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

Key Features
• API Endpoints: Handles user registration, authentication, profile management, and other user-related operations.
• Configuration: Centralized config for environment variables, authentication, and error handling.
• Helpers: Utility functions for encryption, validation, and other common tasks.
• Swagger Integration: API documentation available via Swagger UI (http://localhost:7002/api/v1/user/docs).
• Testing: Includes test files to ensure reliability.

How To Run
cd nmbp-admin-profile-backend
npm install

Configure environment
Set up environment variables in config/environment.ts or via package.json.

Run the service
npm start
