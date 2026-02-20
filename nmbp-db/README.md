The ts-db directory in your workspace is structured to provide database resources for your project. Here’s an overview of its contents and purpose:

ts-db Overview
The ts-db folder contains database scripts and resources for both MongoDB and PostgreSQL, supporting the backend services in your monorepo.

Structure
mongodb/
index.js: Likely contains MongoDB initialization scripts, seed data, or utility functions for managing MongoDB collections.

postgresql/
ddl/
tables.sql: SQL script for creating PostgreSQL tables (Data Definition Language).
views.sql: SQL script for creating PostgreSQL views.
dml/
script.sql: SQL script for inserting or manipulating data (Data Manipulation Language).

Usage
Use the scripts in the ddl folder to set up your PostgreSQL schema (tables and views).
Use the dml/script.sql to populate or modify data in your PostgreSQL database.
Use mongodb/index.js to initialize or manage your MongoDB collections.

Integration
These scripts are intended to be run manually or as part of your deployment/CI process to ensure your databases are correctly structured and seeded.
Backend services (such as nmbp-admin-backend, nmbp-auth-backend, nmbp-admin-profile-backend) will connect to these databases as configured in their respective settings.

Default Credentials (Dev Environment)
Username: 1234567890
Password: TS123!@#

When APP_ENV is set to "dev" in package.json, all newly created users will be assigned the default password: TS123!@#
For UAT/Prod environments, passwords are generated based on the password policy configuration.

Best Practices
Run DDL scripts before DML scripts to ensure all tables and views exist before inserting data.
Review and update these scripts as your data model evolves.
Consider versioning or migration tools for production environments.
