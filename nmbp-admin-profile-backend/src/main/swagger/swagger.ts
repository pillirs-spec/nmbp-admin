import swaggerAutogen from "swagger-autogen";

const moduleName = process.env.MODULE || "nmbp-admin-profile-backend";
const port = process.env.PORT || 7002;
const apiBaseUrl = process.env.TS_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";
const doc = {
  info: {
    title: moduleName,
    description:
      "User Backend APIs for the RBAC/UBAC Module. Provides endpoints for logged-in users to view and update their own profile information.",
    version: "1.0.0",
  },
  basePath: "/",
  host: apiBaseUrl,
  schemes: [scheme],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Users", description: "User service health check" },
    {
      name: "Admin",
      description:
        "User self-service endpoints - view profile, update profile, and upload profile picture",
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
