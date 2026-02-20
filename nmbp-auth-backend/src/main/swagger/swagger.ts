import swaggerAutogen from "swagger-autogen";

const moduleName = process.env.MODULE || "nmbp-auth-backend";
const port = process.env.PORT || 7001;
const apiBaseUrl = process.env.TS_APIS_BASE_URL || `localhost:${port}`;
const scheme = apiBaseUrl.includes("localhost") ? "http" : "https";
const doc = {
  info: {
    title: moduleName,
    description:
      "Auth Backend APIs for the RBAC/UBAC Module. Handles authentication, login (password & OTP), logout, token validation, and forgot password flows.",
    version: "1.0.0",
  },
  basePath: "/",
  host: apiBaseUrl,
  schemes: [scheme],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Auth", description: "Auth service health check" },
    {
      name: "Admin",
      description:
        "Authentication endpoints - login, logout, OTP, token validation, and password reset",
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT token obtained from the login endpoint",
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../startup/routes.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
