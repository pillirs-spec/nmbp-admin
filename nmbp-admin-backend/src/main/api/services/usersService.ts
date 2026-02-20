import {
  pg,
  logger,
  redis,
  JSONUTIL,
  ejsUtils,
  smsUtility,
  whatsappUtility,
  nodemailerUtils,
} from "ts-commons";
import { IPasswordPolicy, IUser } from "../../types/custom";
import { passwordPoliciesService } from ".";
import { CacheTTL, pgQueries, RedisKeys } from "../../enums";
import bcrypt from "bcryptjs";
import RandExp from "randexp";
import { usersRepository } from "../repositories";
import { redisKeysFormatter } from "../../helpers";
import { communicationTemplates, environment } from "../../config";

const usersService = {
  createUser: async (user: IUser) => {
    const logPrefix = `usersService :: createUser :: user :: ${JSON.stringify(user)} `;
    try {
      let encryptedPassword: string;
      let plainPassword: string;

      if (environment.appEnv === "dev") {
        plainPassword = environment.defaultPassword;
        const salt = await bcrypt.genSalt(10);
        encryptedPassword = await bcrypt.hash(plainPassword, salt);
        logger.info(
          `${logPrefix} :: Dev environment :: Using default password`,
        );
      } else {
        const passwordPolicies =
          await passwordPoliciesService.listPasswordPolicies();
        const passwordPolicy = passwordPolicies[0];
        const generated =
          await usersService.generatePasswordFromPasswordPolicy(passwordPolicy);
        encryptedPassword = generated.encryptedPassword;
        plainPassword = generated.plainPassword;
      }

      user.password = encryptedPassword;
      user.display_name = JSONUTIL.capitalize(user.display_name.trim());
      const userId = await usersRepository.createUser(user);

      if (!userId) {
        const message = "Failed to create user in the database";
        logger.error(`${logPrefix} :: ${message}`);
        return { success: false, message };
      }
      logger.info(
        `${logPrefix} :: User created successfully with ID ${userId}`,
      );

      await usersService.clearRedisCache(userId, user.mobile_number);

      usersService
        .sharePasswordToUser({
          emailId: user.email_id,
          password: plainPassword,
          displayName: user.display_name,
          mobileNumber: user.mobile_number,
          communicationType: "CREATE_USER",
        })
        .catch((err) =>
          logger.error(
            `${logPrefix} :: Failed to send password notification :: ${err.message}`,
          ),
        );

      return { success: true, userId };
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  updateUser: async (user: IUser): Promise<{ success: boolean }> => {
    const logPrefix = `usersService :: updateUser :: user :: ${JSON.stringify(user)}`;
    try {
      await usersRepository.updateUser(user);

      await usersService.clearRedisCache(user.user_id, user.mobile_number);
      logger.info(
        `${logPrefix} :: User updated and cache invalidated successfully`,
      );
      return { success: true };
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  generatePasswordFromPasswordPolicy: async (
    passwordPolicy: IPasswordPolicy,
  ): Promise<{ encryptedPassword: string; plainPassword: string }> => {
    const logPrefix = `usersService :: generatePasswordFromPasswordPolicy :: passwordPolicy :: ${JSON.stringify(passwordPolicy)}`;
    try {
      logger.info(`${logPrefix} :: Generating password based on policy`);
      let pattern = "",
        tempStr = "";
      const alphabetical = /[A-Z][a-z]/;
      const numeric = /[0-9]/;
      const special = /[!@#$&*]/;

      const passwordLength = passwordPolicy.minimum_password_length;
      tempStr +=
        passwordPolicy.complexity && passwordPolicy.alphabetical
          ? alphabetical.source
          : "";
      tempStr += numeric.source;

      if (passwordPolicy.complexity && passwordPolicy.numeric) {
        tempStr += numeric.source;
      }

      if (passwordPolicy.complexity && passwordPolicy.special_characters) {
        tempStr += special.source;
      }

      if (tempStr) {
        tempStr += `{${passwordLength}}`;
        pattern = tempStr;
      } else {
        pattern = "[1-9]{" + length + "}";
      }

      const regexPattern = new RegExp(pattern);
      const randomExpression = new RandExp(regexPattern).gen();
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(randomExpression, salt);
      logger.info(
        `${logPrefix} :: Password successfully generated and encrypted`,
      );
      return { encryptedPassword, plainPassword: randomExpression };
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  listUsers: async (
    pageSize: number,
    currentPage: number,
    searchQuery: string,
    userId: number,
  ): Promise<IUser[]> => {
    const logPrefix = `usersService :: listusers :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchQuery :: ${searchQuery} :: userId :: ${userId}`;
    try {
      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.USERS_LIST,
        {},
      );
      const _query: { text: string; values?: number[] } = {
        text: pgQueries.UserQueries.USERS_LIST,
      };

      if (userId) {
        _query.text += ` AND created_by = '${userId}'`;
        key += `|created_by:${userId}`;
      }

      if (searchQuery) {
        const issearchstringAMobilenumber = /^\d{10}$/.test(searchQuery);
        if (issearchstringAMobilenumber) {
          key += `|search|mobile_number:${searchQuery}`;
          _query.text += ` AND mobile_number =${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE '%${searchQuery}%'`;
          key += `|search|display_name:${searchQuery}`;
        }
      }

      if (pageSize) {
        key += `|LIMIT:${pageSize}`;
        _query.text += ` LIMIT ${pageSize}`;
      }

      if (currentPage) {
        key += `|OFFSET:${currentPage}`;
        _query.text += ` OFFSET ${currentPage}`;
      }

      const isUserUpdatedwithin5mins =
        await usersRepository.usersUpdatedWithinfiveMinutes();
      if (!isUserUpdatedwithin5mins) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`);
          return JSON.parse(cachedResult);
        }
      }
      logger.info(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const usersResult: IUser[] = await pg.executeQueryPromise(_query);
      if (usersResult && usersResult.length > 0)
        redis.SetRedis(key, usersResult, CacheTTL.LONG);
      return usersResult;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getUserById: async (userId: number): Promise<IUser> => {
    const logPrefix = `usersService :: getUserById :: userId :: ${userId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.USER_BY_ID,
        { userId: userId.toString() },
      );
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(
          `${logPrefix}:: userId :: ${userId} :: cached result :: ${cachedResult}`,
        );
        return JSON.parse(cachedResult);
      }

      const user = await usersRepository.getUserById(userId);
      if (user) {
        redis.SetRedis(key, user, CacheTTL.LONG);
        return user;
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  updateUserStatus: async (user: IUser, status: number, updatedBy: number) => {
    const logPrefix = `usersService ::  updateUserStatus :: user :: ${JSON.stringify(user)} :: status :: ${status} :: updatedBy :: ${updatedBy} `;
    try {
      await usersRepository.updateUserStatus(user, status, updatedBy);

      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_ID, {
          userId: user.user_id.toString(),
        }),
      );
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, {
          username: user.user_name,
        }),
      );
    } catch (error) {
      logger.error(`${logPrefix}:: Error:: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getUsersByRoleId: async (roleId: number): Promise<IUser[]> => {
    const logPrefix = `usersService :: getUsersByRoleId :: roleId :: ${roleId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.USERS_BY_ROLE_ID,
        { roleId: roleId.toString() },
      );
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: Cached result found :: ${cachedResult}`);
        return JSON.parse(cachedResult);
      }

      const users = await usersRepository.getUsersByRoleId(roleId);

      if (users && users.length > 0) redis.SetRedis(key, users, CacheTTL.LONG);
      return users;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  resetPasswordForUserId: async (userId: number) => {
    const logPrefix = `usersService :: resetPasswordForUserId :: userId :: ${userId}`;
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(environment.defaultPassword, salt);

      await usersRepository.resetPasswordForUserId(password, userId);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  sharePasswordToUser: async (passwordDetails: any) => {
    const logPrefix = `usersService :: sharePasswordToUser :: passwordDetails :: ${passwordDetails}`;
    try {
      switch (passwordDetails.communicationType) {
        case "CREATE_USER":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml(
              "src/main/views/sharePasswordEmailTemplate.ejs",
              passwordDetails,
            );
            await nodemailerUtils.sendEmail(
              "ADMIN | LOGIN DETAILS",
              emailTemplateHtml,
              [passwordDetails.emailId],
            );
          }

          // if (passwordDetails.mobileNumber) {
          //     const adminUrl = environment.adminFrontendUrl;
          //     const smsBodyTemplate = communicationTemplates.SMS.ADMIN_USER_CREATION.body;
          //     const smsBodyCompiled = smsBodyTemplate.replace("<name>", passwordDetails.displayName)
          //         .replace("<password>", passwordDetails.password)
          //         .replace("<url>", adminUrl);
          //     await smsUtility.sendSMS(smsBodyTemplate, passwordDetails.mobileNumber, smsBodyCompiled);
          //     await whatsappUtility.sendWhatsappSms(communicationTemplates.WHATSAPP.ADMIN_USER_CREATION.template_id, passwordDetails.mobileNumber, [passwordDetails.displayName, passwordDetails.password, adminUrl])
          // }
          break;
        case "RESET_PASSWORD":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml(
              "src/main/views/sharePasswordEmailTemplate.ejs",
              passwordDetails,
            );
            await nodemailerUtils.sendEmail(
              "ADMIN | LOGIN DETAILS",
              emailTemplateHtml,
              [passwordDetails.emailId],
            );
          }

          if (passwordDetails.mobileNumber) {
            const smsBodyTemplate =
              communicationTemplates.SMS.ADMIN_RESET_PASSWORD.body;
            const smsBodyCompiled = smsBodyTemplate
              .replace("<name>", passwordDetails.displayName)
              .replace("<password>", passwordDetails.password);
            await smsUtility.sendSMS(
              smsBodyTemplate,
              passwordDetails.mobileNumber,
              smsBodyCompiled,
            );
            await whatsappUtility.sendWhatsappSms(
              communicationTemplates.WHATSAPP.ADMIN_RESET_PASSWORD.template_id,
              passwordDetails.mobileNumber,
              [passwordDetails.displayName, passwordDetails.password],
            );
          }
          break;
        case "USER_LOGIN_OTP":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml(
              "src/main/views/sharePasswordEmailTemplate.ejs",
              passwordDetails,
            );
            await nodemailerUtils.sendEmail(
              "ADMIN | LOGIN DETAILS",
              emailTemplateHtml,
              [passwordDetails.emailId],
            );
          }

          if (passwordDetails.mobileNumber) {
            const smsBodyTemplate =
              communicationTemplates.SMS.USER_LOGIN_WITH_OTP.body;
            const smsBodyCompiled = smsBodyTemplate
              .replace("<otp>", passwordDetails.otp)
              .replace("<module>", "Admin")
              .replace("<time>", "3 min");
            await smsUtility.sendSMS(
              smsBodyTemplate,
              passwordDetails.mobileNumber,
              smsBodyCompiled,
            );
            await whatsappUtility.sendWhatsappSms(
              communicationTemplates.WHATSAPP.USER_LOGIN_WITH_OTP.template_id,
              passwordDetails.mobileNumber,
              ["Admin", passwordDetails.otp, "3 mins"],
            );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getUsersCount: async (searchQuery: string): Promise<number> => {
    const logPrefix = `usersService :: resetPasswordForUserId :: searchQuery :: ${searchQuery}`;
    try {
      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.USERS_COUNT,
        {},
      );
      const _query: { text: string; values?: number[] } = {
        text: pgQueries.UserQueries.USERS_COUNT,
        values: [],
      };

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|search|mobile_number:${searchQuery}`;
          _query.text += ` AND mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE '%${searchQuery}%'`;
          key += `|search|display_name:${searchQuery}`;
        }
      }

      const isUserUpdatedWithin5min =
        await usersRepository.usersUpdatedWithinfiveMinutes();

      if (!isUserUpdatedWithin5min) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(
            `usersService :: getUsersCount :: cached result :: ${cachedResult}`,
          );
          return JSON.parse(cachedResult);
        }
      }

      logger.debug(
        `usersService :: getUsersCount :: query :: ${JSON.stringify(_query)}`,
      );

      const result = await pg.executeQueryPromise(_query);
      logger.debug(
        `usersService :: getUsersCount :: db result :: ${JSON.stringify(result)}`,
      );

      if (result.length > 0) {
        const count = parseInt(result[0].count);
        if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
        return count;
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  clearRedisCache: async (
    userId?: number,
    mobileNumber?: number,
    roleId?: number,
  ) => {
    const logPrefix = `usersService :: clearRedisCache :: userId :: ${userId} :: username :: ${mobileNumber.toString()} :: roleId :: ${roleId}`;
    try {
      if (userId)
        await redis.deleteRedis(
          redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_ID, {
            userId: userId.toString(),
          }),
        );
      if (mobileNumber) {
        const username = mobileNumber.toString();
        await redis.deleteRedis(
          redisKeysFormatter.getFormattedRedisKey(RedisKeys.USER_BY_USERNAME, {
            username,
          }),
        );
      }
      if (roleId)
        await redis.deleteRedis(
          redisKeysFormatter.getFormattedRedisKey(RedisKeys.USERS_BY_ROLE_ID, {
            roleId: roleId.toString(),
          }),
        );

      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USERS_LIST, {}),
      );
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.USERS_COUNT, {}),
      );
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default usersService;
