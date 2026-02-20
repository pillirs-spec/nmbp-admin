import { logger, pg } from "ts-commons";
import { IUser } from "../../types/custom";
import { pgQueries } from "../../enums";
 
const adminRepository = {
    getUserByUserName: async (userName: string): Promise<IUser> => {
        const logPrefix = `adminRepository :: getUserByUserName :: userName :: ${userName}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.GET_USER_BY_USERNAME,
                values: [userName]
            };
            logger.debug(`${logPrefix} :: query: ${_query.text} :: Values: ${JSON.stringify(_query.values)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
            
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string, clearInvalidAttempts?: boolean) => {
        const logPrefix = `adminRepository :: updateUserLoginStatus :: loginStatus :: ${loginStatus} :: userName :: ${userName}`;
        try {
            const _query: { text: string, values: string[] } = {
                text: pgQueries.UserQueries.UPDATE_USER_LOGGED_IN_STATUS,
                values: [userName, loginStatus.toString()]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMaxInvalidLoginAttempts: async (): Promise<number> => {
        const logPrefix = `adminRepository :: getMaxInvalidLoginAttempts`;
        try {
            const _query = {
                text: pgQueries.UserQueries.GET_MAX_INVALID_LOGIN_ATTEMPTS
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].maximum_invalid_attempts;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<number> => {
        const logPrefix = `adminRepository :: getInvalidLoginAttempts :: user_name :: ${user_name}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.GET_INVALID_ATTEMPTS,
                values: [user_name]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].invalid_attempts;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    incrementInvalidLoginAttempts: async (userName: string) => {
        const logPrefix = `adminRepository :: incrementInvalidLoginAttempts :: userName :: ${userName}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.INCREMENT_INVALID_ATTEMPTS,
                values: [userName]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
        const logPrefix = `adminRepository :: existsByMobileNumber :: mobileNumber :: ${mobileNumber}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.EXISTS_BY_MOBILE_NUMBER,
                values: [mobileNumber]
            };
            logger.debug(`${logPrefix} :: query: ${_query.text} :: Values: ${JSON.stringify(_query.values)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        const logPrefix = `setUserInActive :: setUserInActive :: userName :: ${userName}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.SET_USER_INACTIVE,
                values: [userName]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetPassword: async (newPassword: string, mobileNumber: number): Promise<boolean> => {
        const logPrefix = ` adminRepository :: resetPassword :: newPassword :: ${newPassword} :: mobileNumber :: ${mobileNumber}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.RESET_PASSWORD,
                values: [newPassword, mobileNumber]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

            return true;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetInvalidLoginAttempts: async (userName: string) => {
        const logPrefix = `adminRepository :: resetInvalidLoginAttempts :: userName :: ${userName}`;
        try {
            const _query = {
                text: pgQueries.UserQueries.RESET_INVALID_ATTEMPTS,
                values: [String(userName)]
            };
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
            return result;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}

export default adminRepository;