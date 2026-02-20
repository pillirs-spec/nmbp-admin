import { envUtils } from "ts-commons";

const environment = {
  appEnv: envUtils.getStringEnvVariableOrDefault("APP_ENV", "prod"),
  moduleName: envUtils.getStringEnvVariableOrDefault(
    "MODULE",
    "nmbp-admin-backend",
  ),
  port: envUtils.getNumberEnvVariableOrDefault("PORT", 7003),
  bodyParserLimit: envUtils.getStringEnvVariableOrDefault(
    "TS_BODY_PARSER_LIMIT",
    "5mb",
  ),
  allowedMethods: envUtils.getStringEnvVariableOrDefault(
    "TS_ALLOWED_METHODS",
    "GET,OPTIONS,PUT,PATCH,POST,DELETE",
  ),
  allowedOrigins: envUtils.getStringEnvVariableOrDefault(
    "TS_ALLOWED_ORIGINS",
    "*",
  ),
  allowedHeaders: envUtils.getStringEnvVariableOrDefault(
    "TS_ALLOWED_HEADERS",
    "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip",
  ),
  riskyCharacters: envUtils.getStringEnvVariableOrDefault(
    "RISKY_CHARS",
    "=,-,@,|",
  ),
  enforceSingleSession: envUtils.getBooleanEnvVariableOrDefault(
    "INIT_COMMON_ENFORCE_ONLY_ONE_SESSION",
    false,
  ),
  secretKey: envUtils.getStringEnvVariableOrDefault("TS_SECRET_KEY", "TS_2024"),
  rateLimit: envUtils.getNumberEnvVariableOrDefault("TS_RATE_LIMIT", 100),
  cspAllowFrameAncestorsDomain: envUtils.getStringEnvVariableOrDefault(
    "CSP_ALLOW_FRAME_ANCESTORS_DOMAIN",
    "http://localhost:3000,http://admints.dev.orrizonte.in",
  ),
  uthoApiBaseUrl: envUtils.getStringEnvVariableOrDefault(
    "UTHO_API_BASE_URL",
    `https://api.utho.com/v2`,
  ),
  uthoApiKey: envUtils.getStringEnvVariableOrDefault(
    "UTHO_API_KEY",
    "MtSZKGdEYHWOjXunRJgmFwvrsfbPykaVCUzoqQNpIixlcheDLABT",
  ),
  merchantRootDomain: envUtils.getStringEnvVariableOrDefault(
    "MERCHANT_ROOT_DOMAIN",
    "orrizonte.in",
  ),
  objectStorageBucket: envUtils.getStringEnvVariableOrDefault(
    "TS_OBJECT_STORAGE_BUCKET",
    "temple-seva",
  ),
  defaultPassword: envUtils.getStringEnvVariableOrDefault(
    "DEFAULT_PASSWORD",
    "TS123!@#",
  ),
  adminFrontendUrl: envUtils.getStringEnvVariableOrDefault(
    "TS_ADMIN_FRONTEND_URL",
    "http://localhost:3000",
  ),
  adminCdnUrl: envUtils.getStringEnvVariableOrDefault(
    "TS_ADMIN_CDN_URL",
    "http://localhost:7003",
  ),
};

export { environment };
