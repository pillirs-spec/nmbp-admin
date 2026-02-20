// export const environment = {
//     production: process.env.NODE_ENV === 'production',
//     useLocalStorage: process.env.REACT_APP_USE_LOCAL_STORAGE === 'true',
//     appPreferencesPrefix: process.env.REACT_APP_PREFERENCES_PREFIX || 'ts:admin:',
//     authApiBaseUrl: process.env.REACT_APP_AUTH_API_BASE_URL || 'http://localhost:7001',
//     userApiBaseUrl: process.env.REACT_APP_USER_API_BASE_URL || 'http://localhost:7002',
//     adminApiBaseUrl: process.env.REACT_APP_ADMIN_API_BASE_URL || 'http://localhost:7003',
//     devoteeApiUrl: process.env.REACT_APP_DEVOTEE_API_BASE_URL || 'http://localhost:7004',
//     encDecSecretKey: process.env.REACT_APP_ENC_DEC_SECRET_KEY || 'TS@$#&*(!@%^&',
//     defaultDevoteeTrialPeriod: process.env.REACT_APP_DEFAULT_DEVOTEE_TRIAL_PERIOD || 3,
//     skipLoaderRoutes: [
//         '/api/v1/auth/health'
//     ],
//     footerHiddenRoutes : ['/login', '/reset-password', '/forgot-password'],
// };

export const environment = {
  production: import.meta.env.PROD,

  useLocalStorage: import.meta.env.VITE_USE_LOCAL_STORAGE === "true",

  appPreferencesPrefix: import.meta.env.VITE_PREFERENCES_PREFIX || "ts:admin:",

  authApiBaseUrl:
    import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:7001",

  userApiBaseUrl:
    import.meta.env.VITE_USER_API_BASE_URL || "http://localhost:7002",

  adminApiBaseUrl:
    import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:7003",

  devoteeApiUrl:
    import.meta.env.VITE_FORM_API_BASE_URL || "http://localhost:7004",

  encDecSecretKey: import.meta.env.VITE_ENC_DEC_SECRET_KEY || "TS@$#&*(!@%^&",

  defaultDevoteeTrialPeriod: Number(
    import.meta.env.VITE_DEFAULT_DEVOTEE_TRIAL_PERIOD ?? 3,
  ),

  skipLoaderRoutes: ["/api/v1/auth/health"],

  footerHiddenRoutes: ["/login", "/reset-password", "/forgot-password"],
};
