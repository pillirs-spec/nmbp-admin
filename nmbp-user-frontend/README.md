Overview
The API Form Builder Frontend is a React-based application that provides an interface for building and managing API forms dynamically.

frontend/
├── public/
├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── services/ # API services
│ ├── utils/ # Utility functions
│ ├── App.js # Main component
│ └── index.js # Entry point
├── .env # Environment variables
├── .env.example # Example environment file
└── package.json

Key Features
• Dynamic form generation
• API endpoint configuration
• Form validation
• Real-time preview
• Export/Import functionality

How To Run
cd nmbp-user-frontend
npm install

Configure environment
Set up environment variables in config/environment.ts or via .env file.

Run the service
npm run dev

Customization
• Add new pages in src/pages/
• Add new components in src/components/
• Update environment settings in src/config/environment.ts
• Extend contexts or hooks as needed

ENV File Changes

VITE_TENANT_ID= tenant_Super_Parent (Please update value as per database collection value)
VITE_PROJECT_ID= project_Bricks (Please update value as per database collection value)
