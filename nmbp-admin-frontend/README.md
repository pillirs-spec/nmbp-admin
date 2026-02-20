Overview
The admin frontend is a TypeScript React application located in the nmbp-admin-frontend directory. It provides the UI for admin users to manage and interact with backend services.

    • src/: Main source code
    • api/: Axios configuration and API utilities
    • assets/: Images and icons for UI
    • components/: Reusable UI components (common/)
    • config/: Environment configuration
    • contexts/: React context providers (Auth, Loader, Logger, Toast)
    • enums/: Enumerations for log levels, menu access, toast types
    • hooks/: Custom React hooks for context and utilities
    • pages/: Main pages (Admin, Home, Login)
    • utils/: Utility functions (preferences, encoding/decoding)
    • App.tsx: Root component
    • index.tsx: Entry point
    • public/: Static files (index.html, manifest, robots.txt)
    • Dockerfile: Containerization setup
    • nginx.conf: Nginx configuration for serving the app
    • package.json: Project dependencies and scripts
    • tailwind.config.js: Tailwind CSS configuration
    • tsconfig.json: TypeScript configuration

Key Features
• Authentication and authorization via AuthContext
• Toast notifications via ToastContext
• Loader and logging utilities
• API integration using Axios
• Modular page and component structure
• Tailwind CSS for styling

How To Run
cd nmbp-admin-frontend
npm install --force

Configure environment
Set up environment variables in config/environment.ts or via .env file.

Run the service
npm start

Customization
• Add new pages in src/pages/
• Add new components in src/components/
• Update environment settings in src/config/environment.ts
• Extend contexts or hooks as needed
