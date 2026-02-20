export const environment = {
    production: process.env.NODE_ENV === 'production',
    useLocalStorage: process.env.REACT_APP_USE_LOCAL_STORAGE === 'true',
    appPreferencesPrefix: process.env.REACT_APP_PREFERENCES_PREFIX || 'ts:admin:',
    authApiBaseUrl: process.env.REACT_APP_AUTH_API_BASE_URL || 'http://localhost:7001',
    userApiBaseUrl: process.env.REACT_APP_USER_API_BASE_URL || 'http://localhost:7002',
    adminApiBaseUrl: process.env.REACT_APP_ADMIN_API_BASE_URL || 'http://localhost:7003',
    devoteeApiUrl: process.env.REACT_APP_DEVOTEE_API_BASE_URL || 'http://localhost:7004',
    encDecSecretKey: process.env.REACT_APP_ENC_DEC_SECRET_KEY || 'TS@$#&*(!@%^&',
    defaultDevoteeTrialPeriod: process.env.REACT_APP_DEFAULT_DEVOTEE_TRIAL_PERIOD || 3,
    skipLoaderRoutes: [
        '/api/v1/auth/health'
    ],
    footerHiddenRoutes : ['/login', '/reset-password', '/forget-password'],
};
  