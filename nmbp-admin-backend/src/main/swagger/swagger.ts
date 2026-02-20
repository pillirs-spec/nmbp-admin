import swaggerAutogen from "swagger-autogen";

const moduleName = process.env.MODULE || "nmbp-admin-backend";
const port = process.env.PORT || 7003;
const apiBaseUrl = process.env.TS_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";
const doc = {
  info: {
    title: moduleName,
    description:
      "Admin Backend APIs for the RBAC/UBAC Module. Provides endpoints for managing users, roles, menus, and password policies.",
    version: "1.0.0",
  },
  basePath: "/",
  host: apiBaseUrl,
  schemes: [scheme],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Admin", description: "Admin service health check" },
    {
      name: "Users",
      description:
        "User management - create, update, list, and manage user accounts",
    },
    {
      name: "Roles",
      description:
        "Role management - create, update, and configure role-based access control",
    },
    {
      name: "Menus",
      description:
        "Menu management - create, update, and organize navigation menus",
    },
    {
      name: "Password Policies",
      description:
        "Password policy management - configure password rules and constraints",
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT token obtained from the Auth service login endpoint",
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../startup/routes.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
