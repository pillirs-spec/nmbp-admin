import { pgQueries } from "../../enums";
import { IPasswordPolicy } from "../../types/custom";
import { pg, logger } from "ts-commons";

const passwordPoliciesRepository = {
  listPasswordPolicies: async (): Promise<IPasswordPolicy[]> => {
    const logPrefix = `passwordPoliciesRepository :: listPasswordPolicies`;
    try {
      
      const _query = {
        text: pgQueries.PasswordPolicyQueries.LIST_PASSWORD_POLICIES,
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  createPasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    const logPrefix = `passwordPoliciesRepository :: createPasswordPolicy :: passwordPolicy :: ${JSON.stringify(passwordPolicy)}`;
    try {
      const _query = {
        text: pgQueries.PasswordPolicyQueries.ADD_PASSWORD_POLICY,
        values: [
          passwordPolicy.password_expiry,
          passwordPolicy.password_history,
          passwordPolicy.minimum_password_length,
          passwordPolicy.complexity,
          passwordPolicy.alphabetical,
          passwordPolicy.numeric,
          passwordPolicy.special_characters,
          passwordPolicy.allowed_special_characters,
          passwordPolicy.maximum_invalid_attempts,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  updatePasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    const logPrefix = `passwordPoliciesRepository :: updatePasswordPolicy :: passwordPolicy :: ${JSON.stringify(passwordPolicy)}`;
    try {
      const _query = {
        text: pgQueries.PasswordPolicyQueries.UPDATE_PASSWORD_POLICY,
        values: [
          passwordPolicy.id,
          passwordPolicy.password_expiry,
          passwordPolicy.password_history,
          passwordPolicy.minimum_password_length,
          passwordPolicy.complexity,
          passwordPolicy.alphabetical,
          passwordPolicy.numeric,
          passwordPolicy.special_characters,
          passwordPolicy.allowed_special_characters,
          passwordPolicy.maximum_invalid_attempts,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  existByPasswordPolicyId: async (passwordPolicyId: number): Promise<boolean> => {
    const logPrefix = `passwordPoliciesRepository :: existByPasswordPolicyId :: passwordPolicyId :: ${passwordPolicyId}`;
    try {
      const _query = {
        text: pgQueries.PasswordPolicyQueries.EXISTS_BY_PASSWORD_POLICY_ID,
        values: [passwordPolicyId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result && result.length > 0 ? result[0].exists : false;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getPasswordPolicyById: async (passwordPolicyId: number): Promise<IPasswordPolicy> => {
    const logPrefix = `passwordPoliciesRepository :: getPasswordPolicyById :: passwordPolicyId :: ${passwordPolicyId}`;
    try {
      const _query = {
        text: pgQueries.PasswordPolicyQueries.GET_PASSWORD_POLICY_BY_ID,
        values: [passwordPolicyId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result && result.length > 0 ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default passwordPoliciesRepository;
