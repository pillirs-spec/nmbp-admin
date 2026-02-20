import { logger, pg } from "ts-commons";
import { IUser } from "../../types/custom";
import { pgQueries } from "../../enums";

export const adminRepository = {
    getLoggedInUserInfo: async (userId: number): Promise<IUser> => {
        const logPrefix = `adminRepository :: getLoggedInUserInfo`;
        try {
            const _query = {
                text: pgQueries.UserQueries.GET_LOGGED_IN_USER_INFO,
                values: [userId]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateProfilePic: async (profilePictureUrl: string, userId: number) => {
        const logPrefix = `adminRepository :: updateProfilePic`;
        try {
            const _query = {
                text: pgQueries.UserQueries.UPDATE_PROFILE_PIC,
                values: [userId, profilePictureUrl]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUser: async (user: IUser, userId: number) => {
        const logPrefix = `adminRepository :: updateUser`;
        try {
            const _query = {
                text: pgQueries.UserQueries.UPDATE_PROFILE,
                values: [userId, user.first_name, user.last_name, user.email_id, user.dob, `${user.first_name} ${user.last_name}`]
            };
            logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}