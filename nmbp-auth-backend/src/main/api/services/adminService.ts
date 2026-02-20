import { redis, logger, nodemailerUtils, ejsUtils, smsUtility, whatsappUtility, generateToken } from "ts-commons";
import { IUser } from "../../types/custom";
import { v4 as uuidv4 } from 'uuid';
import { communicationTemplates, environment } from "../../config";
import { CacheTTL, RedisKeys } from "../../enums";
import bcrypt from "bcryptjs";
import adminRepository from "../repositories/adminRepository";
import { redisKeysFormatter } from "../../helpers";
import { Request } from "../../types/express";

const adminService = {
    getUserInRedisByUserName: async (username: string): Promise<string> => {
        const logPrefix = `adminService :: getUserInRedisByUserName :: username :: ${username}`;
        try {
            let key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, { username });
            let result = await redis.GetKeyRedis(key);
            logger.debug(`${logPrefix} :: Fetched result from Redis for username :: ${username} :: ${result}`);
            return result;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setForgotPasswordOTPInRedis: async (otpDetails: any) => {
        const logPrefix = `adminService :: setForgotPasswordOTPInRedis :: otpDetails :: ${JSON.stringify(otpDetails)}`;
        try {
            if (otpDetails) {
                logger.debug(`${logPrefix} :: Setting OTP details in Redis :: ${JSON.stringify(otpDetails)}`);
                redis.SetRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_USER_DETAILS_BY_USERNAME, { username: otpDetails.userName }), otpDetails, 3 * 60);
                redis.SetRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_DETAILS_BY_TXNID, { txnId: otpDetails.txnId }), otpDetails, 3 * 60)
                logger.debug(`${logPrefix} :: OTP details successfully set for userName: ${otpDetails.userName} and txnId: ${otpDetails.txnId}`);
            };
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUserByUserName: async (userName: string): Promise<IUser> => {
        const logPrefix = `adminService :: getUserByUserName :: userName :: ${userName}`;
        try {
            const cachedResult = await adminService.getUserInRedisByUserName(userName);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            } else {
                const user = await adminRepository.getUserByUserName(userName);
                logger.debug(`${logPrefix} :: Fetched user data for userName: ${userName} :: ${JSON.stringify(user)}`);

                if (user) {
                    redis.SetRedis(`users|username:${userName}`, user, CacheTTL.LONG);
                    return user;
                };
            }
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string, clearInvalidAttempts?: boolean) => {
        const logPrefix = 'adminService :: updateUserLoginStatus :: loginStatus :: ${loginStatus} :: userName :: ${userName}';
        try {
            await adminRepository.updateUserLoginStatus(loginStatus, userName);
            logger.debug(`adminService :: updateUserLoginStatus :: loginStatus :: ${loginStatus} :: userName :: ${userName} :: clearInvalidAttempts :: ${clearInvalidAttempts}`);
            await adminRepository.updateUserLoginStatus(loginStatus, userName, clearInvalidAttempts);
            await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, { username: userName }));
            logger.debug(`${logPrefix} :: Successfully updated login status for userName :: ${userName}`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    isForgotPasswordOtpAlreadySent: async (mobileNumber: string): Promise<boolean> => {
        const logPrefix = `adminService :: isForgotPasswordOtpAlreadySent :: mobileNumber :: ${mobileNumber}`;
        try {
            logger.info(`${logPrefix} :: Checking OTP status for mobileNumber: ${mobileNumber}`);
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_USER_DETAILS_BY_USERNAME, { username: mobileNumber });
            const cachedResult = await redis.GetKeyRedis(key);
            logger.info(`${logPrefix} :: cachedResult for mobileNumber ${mobileNumber}: ${cachedResult}`);
            return cachedResult ? true : false;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getForgotPasswordOtpDetails: async (txnId: string): Promise<string> => {
        const logPrefix = `adminService :: getForgotPasswordOtpDetails :: txnId :: ${txnId}`;
        try {
            logger.info(`${logPrefix} :: Request received for txnId: ${txnId}`);
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_DETAILS_BY_TXNID, { txnId });
            const cachedResult = await redis.GetKeyRedis(key);
            logger.debug(`${logPrefix} :: Retrieved OTP details: ${cachedResult}`);
            return cachedResult;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getForgetPasswordOtp: async (mobileNumber: string): Promise<string> => {
        const logPrefix = `adminService :: getForgetPasswordOtp :: mobileNumber :: ${mobileNumber}`;
        try {
            let txnId = uuidv4();
            let otp = Math.floor(100000 + Math.random() * 900000);
            const user = await adminService.getUserByUserName(mobileNumber);
            const otpDetails = {
                otp,
                txnId,
                userName: user.user_name,
                displayName: user.display_name,
                emailId: user.email_id,
                mobileNumber: mobileNumber
            }
            logger.info(`${logPrefix} :: Request received for mobileNumber: ${mobileNumber}`);

            adminService.setForgotPasswordOTPInRedis(otpDetails);
            adminService.shareForgotOTPUserDetails(otpDetails);
            logger.debug(`${logPrefix} :: OTP details shared with user :: ${JSON.stringify(otpDetails)}`);
            return txnId;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    shareForgotOTPUserDetails: async (otpDetails: any) => {
        const logPrefix = `adminService :: shareForgotOTPUserDetails :: otpDetails :: ${otpDetails}`;
        try {
            logger.debug(`${logPrefix} :: otpDetails :: ${otpDetails}`);
            if (otpDetails.emailId && environment.enableAdminEmailForgotPwdOtp) {
                const emailTemplateHtml = await ejsUtils.generateHtml('src/main/views/forgotPasswordHtmlTemplate.ejs', otpDetails);
                await nodemailerUtils.sendEmail('Temple Seva | FORGOT PASSWORD OTP', emailTemplateHtml, otpDetails.emailId);
                logger.debug(`${logPrefix} :: email sent to :: ${otpDetails.emailId}`);
            }
            if (otpDetails.mobileNumber && environment.enableAdminPhoneForgotPwdOtp) {
                const smsBodyTemplate = communicationTemplates.SMS.USER_LOGIN_WITH_OTP.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<otp>", otpDetails.otp)
                    .replace("<module>", "Temple Seva")
                    .replace("<time>", "3 min");
                await smsUtility.sendSMS(smsBodyTemplate, otpDetails.mobileNumber, smsBodyCompiled);
                logger.debug(`${logPrefix} :: SMS sent to mobileNumber :: ${otpDetails.mobileNumber} :: ${smsBodyCompiled}`);
                await whatsappUtility.sendWhatsappSms(communicationTemplates.WHATSAPP.USER_LOGIN_WITH_OTP.template_id, otpDetails.mobileNumber, [otpDetails.otp, "Temple Seva", "3 min"]);
                logger.debug(`${logPrefix} :: WhatsApp message sent to mobileNumber :: ${otpDetails.mobileNumber}`);
            }
        } catch (error) {
            logger.error(`adminService :: shareForgotOTPUserDetails :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    verifyForgetPasswordOtp: async (userName: string, oldTxnId: string): Promise<string> => {
        const logPrefix = `adminService :: verifyForgetPasswordOtp :: userName :: ${userName} :: oldTxnId :: ${oldTxnId}`;
        try {
            const txnId = uuidv4();
            const forgotPasswordUserKey = redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_USER_DETAILS_BY_USERNAME, { username: userName });
            const forgotPasswordChangeKey = redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_CHANGE_BY_TXNID, { txnId });
            const forgotPasswordTxnIdKey = redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_DETAILS_BY_TXNID, { txnId: oldTxnId });

            await redis.deleteRedis(forgotPasswordUserKey);
            await redis.deleteRedis(forgotPasswordTxnIdKey);
            redis.SetRedis(forgotPasswordChangeKey, { userName }, CacheTTL.SHORT);
            logger.debug(`${logPrefix} :: Redis key set :: ${forgotPasswordChangeKey} :: ${JSON.stringify({ userName })}`);
            return txnId;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error)
        }
    },
    setUserInActive: async (userName: string) => {
        const logPrefix = `adminService :: setUserInActive :: userName :: ${userName}`;
        try {
            await adminRepository.setUserInActive(userName);
            logger.debug(`${logPrefix} :: userName :: ${userName} set to inactive successfully`);
            await redis.deleteRedis(`users|offset:0|limit:50`);
            await redis.deleteRedis(`users_count`);
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetForgetPassword: async (reqData: any, userName: string): Promise<boolean> => {
        const logPrefix = `adminService :: resetForgetPassword :: userName :: ${userName} :: reqData :: ${reqData}`;
        try {
            logger.debug(`${logPrefix} :: Request received for userName: ${userName}`);
            const hashedPassword = await bcrypt.hash(reqData.newPassword, 10);
            const passwordUpdated = await adminRepository.resetPassword(hashedPassword, parseInt(userName));

            if (passwordUpdated) {
                logger.debug(`${logPrefix} :: Password successfully updated for userName: ${userName}`);
                await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_CHANGE_BY_TXNID, { txnId: reqData.txnId }));
                await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_USER_DETAILS_BY_USERNAME, { username: userName }));
                await redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, { username: userName }));
                await redis.deleteRedis(userName);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error)
        }
    },
    setLoginOTP: async (otpDetails: any) => {
        const logPrefix = `adminService :: setLoginOTP :: otpDetails :: ${JSON.stringify(otpDetails)}`;
        try {
            if (otpDetails) {
                const loginOtpTxnIdKey = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_TXNID, { txnId: otpDetails.txnId });
                const loginOtpMobileKey = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_MOBILE, { mobileNumber: otpDetails.mobileNumber });
                redis.SetRedis(loginOtpTxnIdKey, otpDetails, 3 * 60);
                redis.SetRedis(loginOtpMobileKey, otpDetails, 3 * 60);
                logger.debug(`${logPrefix} :: Redis keys set: [TxnIdKey: ${loginOtpTxnIdKey}, MobileKey: ${loginOtpMobileKey}]`);

                const user = await adminService.getUserByUserName(otpDetails.mobileNumber);

                if (user && user.email_id && environment.enableAdminEmailLoginOtp) {
                    otpDetails.emailId = user.email_id;
                    otpDetails.devoteeName = `${user.display_name}`;
                    otpDetails.userId = user.user_id;
                    otpDetails.userName = user.user_name;

                    const emailTemplateHtml = await ejsUtils.generateHtml('src/main/views/loginOtpHtmlTemplate.ejs', otpDetails);
                    await nodemailerUtils.sendEmail('Temple Seva | LOGIN OTP DETAILS', emailTemplateHtml, [otpDetails.emailId]);
                    logger.debug(`${logPrefix} :: Email sent to :: ${otpDetails.emailId}`);
                }

                if (user.mobile_number && environment.enableAdminPhoneLoginOtp) {
                    const smsBodyTemplate = communicationTemplates.SMS.USER_LOGIN_WITH_OTP.body;
                    const smsBodyCompiled = smsBodyTemplate.replace("<otp>", otpDetails.otp)
                        .replace("<module>", "Temple Seva")
                        .replace("<time>", "3 min");
                    await smsUtility.sendSMS(communicationTemplates.SMS.USER_LOGIN_WITH_OTP.template_id, user.mobile_number, smsBodyCompiled);
                    logger.debug(`${logPrefix} :: SMS sent to mobileNumber :: ${user.mobile_number} :: ${smsBodyCompiled}`);
                    await whatsappUtility.sendWhatsappSms(communicationTemplates.WHATSAPP.USER_LOGIN_WITH_OTP.template_id, user.mobile_number, [otpDetails.otp, "Temple Seva", "3 min"]);
                    logger.debug(`${logPrefix} :: WhatsApp message sent to mobileNumber :: ${user.mobile_number}`);
                }
            };
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw error;
        }
    },
    getLoginOTPByTxnId: async (txnId: string) => {
        const logPrefix = `adminService :: getLoginOTPByTxnId :: txnId :: ${txnId}`;
        try {
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_TXNID, { txnId });
            const cachedResult = await redis.GetKeyRedis(key);
            logger.debug(`${logPrefix} :: cachedResult :: ${JSON.stringify(cachedResult)}`);
            return JSON.parse(cachedResult);
        } catch (error) {
            logger.error(`${logPrefix} :: txnId :: ${txnId} :: ${error.message} :: ${error}`);
            throw error;
        }
    },
    getLoginOTPByMobile: async (mobileNumber: string) => {
        const logPrefix = `adminService :: getLoginOTPByMobile :: mobileNumber :: ${mobileNumber}`;
        try {
            const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_MOBILE, { mobileNumber });
            const cachedResult = await redis.GetKeyRedis(key);
            logger.debug(`${logPrefix} :: cachedResult :: ${JSON.stringify(cachedResult)}`);
            return JSON.parse(cachedResult);
        } catch (error) {
            logger.error(`${logPrefix} :: mobileNumber :: ${mobileNumber} :: ${error.message} :: ${error}`);
            throw error;
        }
    },
    verifyLoginOTP: async (otpDetails: any, req: Request): Promise<{ token: string, expiryTime?: string }> => {
        const logPrefix = `adminService :: verifyLoginOTP`;
        try {
            logger.debug(`${logPrefix} :: otpDetails :: ${otpDetails}`);
            const user = await adminService.getUserByUserName(otpDetails.mobileNumber);

            redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_MOBILE, { mobileNumber: otpDetails.mobileNumber }));
            redis.deleteRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.ADMIN_LOGIN_OTP_BY_TXNID, { txnId: otpDetails.txnId }));

            if (user) {
                const payload = {
                    user_id: user.user_id,
                    role_id: user.role_id,
                    user_name: user.user_name,
                    level: user.level,
                    email_id: user.email_id,
                    mobile_number: user.mobile_number
                }
                const token = await generateToken.generate(payload.user_name, payload, environment.adminLoginExpiryTime, environment.secretKey, req);
                logger.debug(`${logPrefix} :: success :: token generated :: ${JSON.stringify(token)}`);
                return { token: token.encoded, expiryTime: `${environment.adminLoginExpiryTime}h` };
            } else {
                return { token: null };
            }
        } catch (error) {
            logger.error(`${logPrefix} :: otpDetails :: ${JSON.stringify(otpDetails)} :: ${error.message} :: ${error}`);
            throw error;
        }
    },
    getForgotPasswordChangeDetails: async (txnId: string): Promise<string> => {
        const logPrefix = `adminService :: getForgotPasswordChangeDetails`;
        try {
            logger.debug(`${logPrefix} :: txnId :: ${txnId}`);
            const cachedResult = await redis.GetKeyRedis(redisKeysFormatter.getFormattedRedisKey(RedisKeys.FORGOT_PASSWORD_CHANGE_BY_TXNID, { txnId }));
            logger.debug(`${logPrefix} :: cachedResult :: ${JSON.stringify(cachedResult)}`);
            return cachedResult;
        } catch (error) {
            logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
            throw new Error(error)
        }
    },
}

export default adminService;