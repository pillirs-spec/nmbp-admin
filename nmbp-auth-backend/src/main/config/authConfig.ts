import { environment } from "./environment";

const AUTH = {
    SECRET_KEY: environment.secretKey,
    ENFORCE_ONLY_ONE_SESSION: environment.enforceSingleSession,
    API: {
        PUBLIC: [
            "/api/v1/auth/health",
            "/api/v1/auth/admin/login",
            "/api/v1/auth/admin/getForgetPasswordOtp",
            "/api/v1/auth/admin/verifyForgetPasswordOtp",
            "/api/v1/auth/admin/resetForgetPassword",
            "/api/v1/auth/admin/getLoginOtp",
            "/api/v1/auth/admin/verifyLoginOtp",
            "/api/v1/auth/devotee/login",
            "/api/v1/auth/devotee/getForgetPasswordOtp",
            "/api/v1/auth/devotee/verifyForgetPasswordOtp",
            "/api/v1/auth/devotee/resetForgetPassword",
            "/api/v1/auth/devotee/getLoginOtp",
            "/api/v1/auth/devotee/verifyLoginOtp",
        ]
    }
}

export {
    AUTH
};