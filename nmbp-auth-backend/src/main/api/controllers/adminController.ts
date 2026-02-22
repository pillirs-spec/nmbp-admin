import { Response } from "express";
import { Request } from "../../types/express";
import jwt from "jsonwebtoken";
import { authConfig, environment, errorCodes } from "../../config";
import { STATUS, logger, redis, generateToken } from "ts-commons";
import { UserStatus } from "../../enums";
import { adminService } from "../services";
import { v4 as uuidv4 } from "uuid";
import { encDecHelper, redisKeysFormatter } from "../../helpers";
import { IUser } from "../../types/custom";
import bcrypt from "bcryptjs";
import { adminRepository } from "../repositories";
import { adminValidations } from "../validations";
import { RedisKeys } from "../../enums";

const adminController = {
  validateToken: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `adminController :: validateToken`;
    const token = req.header("authorization");
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Validate Token'
                #swagger.description = 'Verify a JWT token and return the decoded payload. Pass the token in the Authorization header.'
            */
      const decodedToken = jwt.verify(token, environment.secretKey);
      return res.status(STATUS.OK).send({
        data: decodedToken,
        message: "Token Validated",
      });
    } catch (error: any) {
      logger.error(
        `${logPrefix} :: token :: ${token} :: error :: ${error.message}`,
      );
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  login: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `adminController :: login`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Login (Password)'
                #swagger.description = 'Authenticate with username (mobile number) and password. Returns a JWT token on success. Password must be AES-encrypted if decryptSensitiveData is enabled. Account locks after exceeding max invalid attempts.'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        user_name: '1234567890',
                        password: 'encryptedPassword'
                    }
                }  
            */
      const user: IUser = req.body;
      const { error } = await adminValidations.validateLoginDetails(req.body);

      if (!user.password || user.password.trim() === "") {
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00023);
      }

      if (error) {
        if (error.details)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.message,
            });
      }

      logger.debug(
        `${logPrefix} :: Fetching user by user_name: ${user.user_name} `,
      );
      const existingUser: IUser = await adminService.getUserByUserName(
        user.user_name,
      );
      if (!existingUser)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00001);

      if (environment.decryptSensitiveData) {
        user.password = encDecHelper.decryptPayload(user.password);
      }
      if (user.password == environment.defaultPassword)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00002);

      const isPasswordValid = await bcrypt.compare(
        user.password,
        existingUser.password,
      );
      const currentInvalidAttempts =
        await adminRepository.getInvalidLoginAttempts(user.user_name);
      const maximumInvalidAttempts =
        await adminRepository.getMaxInvalidLoginAttempts();

      if (isPasswordValid) {
        logger.info(
          `${logPrefix} :: Successful login for user: ${user.user_name}`,
        );
        const tokenDetails = {
          user_id: existingUser.user_id,
          role_id: existingUser.role_id,
          user_name: existingUser.user_name,
          level: existingUser.level,
          email_id: existingUser.email_id,
          mobile_number: existingUser.mobile_number,
          state_id: existingUser.state_id,
          distirct_id: existingUser.district_id,
        };
        const token = await generateToken.generate(
          existingUser.user_name,
          tokenDetails,
          environment.adminLoginExpiryTime,
          authConfig.AUTH.SECRET_KEY,
          req,
        );
        await adminRepository.resetInvalidLoginAttempts(user.user_name);
        adminService.updateUserLoginStatus(
          UserStatus.LOGGED_IN,
          req.body.user_name,
          currentInvalidAttempts != 0 &&
            currentInvalidAttempts < maximumInvalidAttempts,
        );

        return res.status(STATUS.OK).send({
          data: {
            token: token.encoded,
            expiryTime: `${environment.adminLoginExpiryTime}h`,
          },
          message: "User Logged in Successfully",
        });
      } else {
        const currentInvalidAttempts =
          await adminRepository.getInvalidLoginAttempts(user.user_name);
        const maximumInvalidAttempts =
          await adminRepository.getMaxInvalidLoginAttempts();

        if (maximumInvalidAttempts > currentInvalidAttempts) {
          await adminRepository.incrementInvalidLoginAttempts(user.user_name);
          return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00001);
        } else {
          await adminService.setUserInActive(user.user_name);
          return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00003);
        }
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  logout: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `adminController :: logout`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Logout'
                #swagger.description = 'Logout the currently authenticated user. Invalidates the session and clears cached user data from Redis.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'JWT token for authentication'
                }
            */
      const userName = req.plainToken.user_name;
      const user_id = req.plainToken.user_id;
      await adminService.updateUserLoginStatus(UserStatus.LOGGED_OUT, userName);
      await redis.deleteRedis(userName);
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(
          RedisKeys.ADMIN_USER_BY_USER_ID,
          { userId: user_id.toString() },
        ),
      );
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, {
          username: userName,
        }),
      );
      return res.status(STATUS.OK).send({
        data: null,
        message: "User Logged out Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  getForgetPasswordOtp: async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const logPrefix = `adminController :: getForgetPasswordOtp`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Request Forgot Password OTP'
                #swagger.description = 'Generate and send a one-time password (OTP) to the registered mobile number for the forgot password flow. Returns a txnId to use in the verify step.'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        mobile_number: 8169104556
                    }
                }    
            */
      let mobile_number = req.body.mobile_number;
      if (!mobile_number || mobile_number.toString().length !== 10) {
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00004);
      }

      const userExists =
        await adminRepository.existsByMobileNumber(mobile_number);
      if (!userExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00024);

      const alreadySent =
        await adminService.isForgotPasswordOtpAlreadySent(mobile_number);
      if (alreadySent)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00006);

      const txnId = await adminService.getForgetPasswordOtp(mobile_number);

      return res.status(STATUS.OK).send({
        data: { txnId },
        message: "Generated Forget Password OTP Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  verifyForgetPasswordOtp: async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const logPrefix = `adminController :: verifyForgetPasswordOtp`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Verify Forgot Password OTP'
                #swagger.description = 'Verify the OTP received for forgot password. On success, returns a new txnId to use in the reset password step. OTP must be AES-encrypted if decryptSensitiveData is enabled.'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        otp: 'encryptedOtp',
                        txnId: 'uuid'
                    }
                }    
            */
      const otpDetails = req.body;
      const { error } =
        await adminValidations.validateVerifyForgotPassword(otpDetails);
      if (error) {
        if (error.details)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.message,
            });
      }

      if (environment.decryptSensitiveData)
        otpDetails.otp = encDecHelper.decryptPayload(otpDetails.otp);
      const txnId = otpDetails.txnId;

      const forgotPasswordOtpDetailsCachedResult =
        await adminService.getForgotPasswordOtpDetails(txnId);
      if (!forgotPasswordOtpDetailsCachedResult)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00007);

      const forgotPasswordOtpDetails = JSON.parse(
        forgotPasswordOtpDetailsCachedResult,
      );
      if (
        forgotPasswordOtpDetails.otp != parseInt(otpDetails.otp) ||
        forgotPasswordOtpDetails.txnId != txnId
      ) {
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00007);
      }

      const newTxnId = await adminService.verifyForgetPasswordOtp(
        forgotPasswordOtpDetails.userName,
        txnId,
      );

      return res.status(STATUS.OK).send({
        data: { txnId: newTxnId },
        message: "Verified Forget Password OTP Success Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  resetForgetPassword: async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const logPrefix = `adminController :: resetForgetPassword`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Reset Forgot Password'
                #swagger.description = 'Set a new password after OTP verification. Requires the txnId from the verify step. Passwords must be AES-encrypted if decryptSensitiveData is enabled. New password must differ from the current password and meet complexity requirements (min 8 chars, at least 1 letter and 1 digit).'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        txnId: 'uuid',
                        newPassword: 'encryptedPasswordHash',
                        confirmPassword: 'encryptedPasswordHash'
                    }
                }    
            */
      const resetForgetPasswordDetails = req.body;
      const { error } = await adminValidations.validateResetPassword(
        resetForgetPasswordDetails,
      );
      if (error) {
        if (error.details)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.details[0].message,
            });
      }

      if (environment.decryptSensitiveData)
        resetForgetPasswordDetails.newPassword = encDecHelper.decryptPayload(
          resetForgetPasswordDetails.newPassword,
        );
      if (environment.decryptSensitiveData)
        resetForgetPasswordDetails.confirmPassword =
          encDecHelper.decryptPayload(
            resetForgetPasswordDetails.confirmPassword,
          );

      if (
        resetForgetPasswordDetails.newPassword !==
        resetForgetPasswordDetails.confirmPassword
      )
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00008);

      if (
        !/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(
          resetForgetPasswordDetails.newPassword,
        )
      )
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00009);

      const forgotPasswordChangeRequestDetails =
        await adminService.getForgotPasswordChangeDetails(
          resetForgetPasswordDetails.txnId,
        );
      if (!forgotPasswordChangeRequestDetails)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00010);

      const parsedForgotPasswordChangeRequestDetails = JSON.parse(
        forgotPasswordChangeRequestDetails,
      );

      const user: IUser = await adminService.getUserByUserName(
        parsedForgotPasswordChangeRequestDetails.userName,
      );
      const isPasswordNotChanged = await bcrypt.compare(
        resetForgetPasswordDetails.newPassword,
        user.password,
      );
      if (isPasswordNotChanged)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00019);

      const passwordHash = await bcrypt.hash(
        resetForgetPasswordDetails.newPassword,
        10,
      );

      const passwordResetted = await adminRepository.resetPassword(
        passwordHash,
        parsedForgotPasswordChangeRequestDetails.userName,
      );
      if (!passwordResetted)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00011);
      redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, {
          username: parsedForgotPasswordChangeRequestDetails.userName,
        }),
      );

      return res.status(STATUS.OK).send({
        data: null,
        message: "Password Resetted Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  getLoginOtp: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `adminController :: getLoginOtp`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Request Login OTP'
                #swagger.description = 'Generate and send a 6-digit OTP to the registered mobile number for OTP-based login. Returns a txnId to use in the verify step. If an OTP was already generated, returns the existing txnId.'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        mobileNumber: '8169104556'
                    }
                } 
            */
      const mobileNumber = req.body.mobileNumber;
      if (!mobileNumber || mobileNumber.toString().length !== 10)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00014);

      const userExists =
        await adminRepository.existsByMobileNumber(mobileNumber);
      if (!userExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00024);

      const txnId = uuidv4();
      const otp = Math.floor(100000 + Math.random() * 900000);

      const loginOtpDetails =
        await adminService.getLoginOTPByMobile(mobileNumber);
      if (loginOtpDetails)
        return res
          .status(STATUS.OK)
          .send({
            data: { txnId: loginOtpDetails.txnId },
            message: "OTP Generated Successfully",
          });

      await adminService.setLoginOTP({
        mobileNumber,
        txnId,
        otp,
      });

      return res
        .status(STATUS.OK)
        .send({ data: { txnId }, message: "OTP Generated Successfully" });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
  verifyLoginOtp: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `adminController :: verifyLoginOtp`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Verify Login OTP'
                #swagger.description = 'Verify the OTP for OTP-based login. On success, returns a JWT token. OTP must be AES-encrypted if decryptSensitiveData is enabled.'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        otp: 'encryptedOtpHash',
                        txnId: 'uuid'
                    }   
                } 
            */
      const otpDetails = req.body;
      const { error } =
        await adminValidations.validateVerifyLoginOTP(otpDetails);
      if (error) {
        if (error.details)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.auth.AUTH00000,
              errorMessage: error.message,
            });
      }

      const loginOtpDetails = await adminService.getLoginOTPByTxnId(
        otpDetails.txnId,
      );
      if (!loginOtpDetails)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00020);

      if (environment.decryptSensitiveData)
        otpDetails.otp = encDecHelper.decryptPayload(otpDetails.otp);
      if (loginOtpDetails.otp != parseInt(otpDetails.otp))
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00021);

      const response = await adminService.verifyLoginOTP(loginOtpDetails, req);
      if (!response.token)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.auth.AUTH00022);

      return res
        .status(STATUS.OK)
        .send({ data: response, message: "OTP Verified Successfully" });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.auth.AUTH00000);
    }
  },
};

export default adminController;
