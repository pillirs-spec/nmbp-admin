import { redisKeysFormatter } from "../../helpers";
import { logger, redis } from "ts-commons";
import { IPasswordPolicy } from "../../types/custom";
import { passwordPoliciesRepository } from "../repositories";
import { CacheTTL, RedisKeys } from "../../enums";

const passwordPoliciesService = {
  createPasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    const logPrefix = `passwordPolicyService :: createPasswordPolicy :: ${JSON.stringify(passwordPolicy)}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PASSWORD_POLICIES,
        {}
      );
      await passwordPoliciesRepository.createPasswordPolicy(passwordPolicy);
      await redis.deleteRedis(key);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  updatePasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    const logPrefix = `passwordPolicyService :: updatePasswordPolicy :: ${JSON.stringify(passwordPolicy)}`;
    try {
      await passwordPoliciesRepository.updatePasswordPolicy(passwordPolicy);
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.PASSWORD_POLICIES, {})
      );
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(
          RedisKeys.PASSWORD_POLICY_BY_ID,
          { passwordPolicyId: passwordPolicy.id.toString() }
        )
      );
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  listPasswordPolicies: async (): Promise<IPasswordPolicy[]> => {
    const logPrefix = `passwordPolicyService :: listPasswordPolicies`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PASSWORD_POLICIES,
        {}
      );
      const cachedResult = await redis.GetKeyRedis(key);

      if (cachedResult) {
        logger.debug(
          `${logPrefix} :: returned from cachedResult :: ${cachedResult}`
        );
        return JSON.parse(cachedResult);
      }

      const passwordPolicies =
        await passwordPoliciesRepository.listPasswordPolicies();
      logger.debug(
        `${logPrefix} :: returned from DB :: ${passwordPolicies}`
      );
      if (passwordPolicies && passwordPolicies.length > 0)
        redis.SetRedis(key, passwordPolicies, CacheTTL.LONG);
      return passwordPolicies;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getPasswordPolicyById: async ( passwordPolicyId: number): Promise<IPasswordPolicy> => {
    const logPrefix = `passwordPolicyService :: getPasswordPolicyById :: passwordPolicyId :: ${passwordPolicyId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.PASSWORD_POLICY_BY_ID,
        { passwordPolicyId: passwordPolicyId.toString() }
      );
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(
          `${logPrefix} :: returned from cachedResult :: ${cachedResult}`
        );
        return JSON.parse(cachedResult);
      }

      const passwordPolicy =
        await passwordPoliciesRepository.getPasswordPolicyById(
          passwordPolicyId
        );
      logger.debug(
        `${logPrefix} :: returned from DB :: ${passwordPolicy}`
      );
      if (passwordPolicy) redis.SetRedis(key, passwordPolicy, CacheTTL.LONG);
      return passwordPolicy;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default passwordPoliciesService;
