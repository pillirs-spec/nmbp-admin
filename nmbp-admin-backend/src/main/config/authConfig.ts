import { environment } from "./environment";

const AUTH = {
    SECRET_KEY: environment.secretKey,
    ENFORCE_ONLY_ONE_SESSION: environment.enforceSingleSession,
    API: {
        PUBLIC: [
            "/api/v1/admin/health",
            "/api/v1/admin/broadcasts/list",
            "/api/v1/admin/cdn/download"
        ]
    }
}

export {
    AUTH
};