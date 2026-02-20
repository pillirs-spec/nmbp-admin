import { environment } from "./environment";

const AUTH = {
    SECRET_KEY: environment.secretKey,
    ENFORCE_ONLY_ONE_SESSION: environment.enforceSingleSession,
    API: {
        PUBLIC: [
            "/api/v1/user/health"
        ]
    }
}

export {
    AUTH
};