import { envUtils } from "ts-commons";

const environment = {
  moduleName: envUtils.getStringEnvVariableOrDefault(
    "MODULE",
    "nmbp-admin-profile-backend",
  ),
  port: envUtils.getNumberEnvVariableOrDefault("PORT", 7002),
  apiBaseUrl: envUtils.getStringEnvVariableOrDefault(
    "TS_APIS_BASE_URL",
    `localhost:${envUtils.getNumberEnvVariableOrDefault("PORT", 7002)}`,
  ),
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
  xFrameOptions: envUtils.getStringEnvVariableOrDefault(
    "TS_X_FRAME_OPTIONS",
    "DENY",
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
  defaultPassword: envUtils.getStringEnvVariableOrDefault(
    "DEFAULT_PASSWORD",
    "TS123!@#",
  ),
  redisExpireTimePwd: envUtils.getNumberEnvVariableOrDefault(
    "REDIS_EXPIRE_TIME_PWD",
    28800,
  ),
  sha256PvtKey: envUtils.getStringEnvVariableOrDefault(
    "SHA256_PVT_KEY",
    "TS_2024",
  ),
  cryptoEncryptionKey: envUtils.getStringEnvVariableOrDefault(
    "CRYPTO_ENCRYPTION_KEY",
    "TS@$#&*(!@%^&",
  ),
  objectStorageBucket: envUtils.getStringEnvVariableOrDefault(
    "TS_OBJECT_STORAGE_BUCKET",
    "temple-seva",
  ),
};

export { environment };
