import { envUtils } from "ts-commons";

const environment = {
  moduleName: envUtils.getStringEnvVariableOrDefault(
    "MODULE",
    "nmbp-auth-backend",
  ),
  port: envUtils.getNumberEnvVariableOrDefault("PORT", 7001),
  apiBaseUrl: envUtils.getStringEnvVariableOrDefault(
    "TS_APIS_BASE_URL",
    `localhost:${envUtils.getNumberEnvVariableOrDefault("PORT", 7001)}`,
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
  cryptoEncryptionKey: envUtils.getStringEnvVariableOrDefault(
    "CRYPTO_ENCRYPTION_KEY",
    "TS@$#&*(!@%^&",
  ),
  customerLoginExpiryTime: envUtils.getNumberEnvVariableOrDefault(
    "TS_CUSTOMER_AUTH_TOKEN_EXPIRY_TIME",
    48,
  ),
  decryptSensitiveData: envUtils.getBooleanEnvVariableOrDefault(
    "TS_DECRYPT_SENSITIVE_DATA",
    true,
  ),
  devoteeLoginExpiryTime: envUtils.getNumberEnvVariableOrDefault(
    "TS_DEVOTEE_AUTH_TOKEN_EXPIRY_TIME",
    48,
  ),
  defaultPassword: envUtils.getStringEnvVariableOrDefault(
    "DEFAULT_PASSWORD",
    "TS123!@#",
  ),
  adminLoginExpiryTime: envUtils.getNumberEnvVariableOrDefault(
    "TS_ADMIN_AUTH_TOKEN_EXPIRY_TIME",
    8,
  ),
  enableAdminEmailLoginOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_ADMIN_EMAIL_LOGIN_OTP",
    true,
  ),
  enableCustomerEmailLoginOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_CUSTOMER_EMAIL_LOGIN_OTP",
    true,
  ),
  enableAdminPhoneLoginOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_ADMIN_PHONE_LOGIN_OTP",
    true,
  ),
  enableAdminEmailForgotPwdOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_ADMIN_EMAIL_FORGOT_PWD_OTP",
    true,
  ),
  enableAdminPhoneForgotPwdOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_ADMIN_PHONE_FORGOT_PWD_OTP",
    true,
  ),
  enableCustomerPhoneLoginOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_CUSTOMER_PHONE_LOGIN_OTP",
    true,
  ),
  enableCustomerEmailForgotPwdOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_CUSTOMER_EMAIL_FORGOT_PWD_OTP",
    true,
  ),
  enableCustomerPhoneForgotPwdOtp: envUtils.getBooleanEnvVariableOrDefault(
    "TS_ENABLE_CUSTOMER_PHONE_FORGOT_PWD_OTP",
    true,
  ),
};

export { environment };
