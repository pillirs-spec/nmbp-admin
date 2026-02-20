import { logger, redis, objectStorageUtility } from "ts-commons";
import { UploadedFile } from "express-fileupload";
import { adminRepository } from "../repositories";
import { IUser } from "../../types/custom";
import { CacheTTL, RedisKeys } from "../../enums";
import { environment } from "../../config";
import { redisKeysFormatter } from "../../helpers";

export const adminService = {
    getLoggedInUserInfo: async (user_id: number): Promise<IUser> => {
        const logPrefix = `adminService :: getLoggedInUserInfo`;
        try {
            logger.info(`${logPrefix} :: Request received :: user_id :: ${user_id}`);
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_USER_BY_USER_ID, { userId: user_id.toString() });
            const cachedResult = await redis.GetKeyRedis(key);
            logger.debug(`${logPrefix} :: cachedResult :: ${cachedResult}`);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            }

            const user = await adminRepository.getLoggedInUserInfo(user_id);
            logger.debug(`${logPrefix} :: user :: ${JSON.stringify(user)}`);

            if (user) {
                if (user.profile_pic_url) user.profile_pic_url = await adminService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
                redis.SetRedis(key, user, CacheTTL.LONG)
                return user
            };
        } catch (error) {
            logger.error(`${logPrefix}  :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    generatePublicURLFromObjectStoragePrivateURL: async (locationPath: string, expiresIn: number = 3600): Promise<string> => {
        const logPrefix = `adminService :: generatePublicURLFromObjectStoragePrivateURL`;
        try {
            logger.info(`${logPrefix} :: locationPath :: ${locationPath} :: expiresIn :: ${expiresIn}`);
            const temporaryPublicURL = await objectStorageUtility.presignedGetObject(environment.objectStorageBucket, locationPath, expiresIn);
            return temporaryPublicURL;
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateProfilePic: async (profilePicture: UploadedFile, userId: number) => {
        const logPrefix = `adminService :: updateProfilePic`;
        try {
            logger.info(`${logPrefix} :: userId :: ${userId}`);
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_USER_BY_USER_ID, { userId: userId.toString() });
            const objectStoragePath = `profile_pictures/profile_picture_${userId}.${profilePicture.mimetype.split("/")[1]}`;
            await objectStorageUtility.putObject(environment.objectStorageBucket, objectStoragePath, profilePicture.data);
            await adminRepository.updateProfilePic(objectStoragePath, userId);
            await redis.deleteRedis(key);
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateProfile: async (user: IUser, userId: number) => {
        const logPrefix = `adminService :: updateProfile`;
        try {
            logger.info(`${logPrefix} :: user :: ${user}`);
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_USER_BY_USER_ID, { userId: userId.toString() });
            await adminRepository.updateUser(user, userId);
            await redis.deleteRedis(key);
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}