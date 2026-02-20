export enum RedisKeys {
    USER_BY_USERNAME = "user|username:${username}",
    FORGOT_PASSWORD_USER_DETAILS_BY_USERNAME = "forgot_password|user:${username}",
    FORGOT_PASSWORD_DETAILS_BY_TXNID = "forgot_password|txnId:${txnId}",
    FORGOT_PASSWORD_CHANGE_BY_TXNID = "forgot_password_change|txnId:${txnId}",
    ADMIN_USER_BY_USER_ID = "admin|user:${userId}",
    ADMIN_LOGIN_OTP_BY_MOBILE = "admin|login_otp|mobileNumber:${mobileNumber}",
    ADMIN_LOGIN_OTP_BY_TXNID = "admin|login_otp|txnId:${txnId}",
}
