import { logger, pg } from "ts-commons";
import { IUser } from "../../types/custom";
import { pgQueries, UserStatus } from "../../enums";

const usersRepository = {
  existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
    const logPrefix = `usersRepository :: existsByMobileNumber :: mobileNumber :: ${mobileNumber}`;

    try {
      const _query = {
        text: pgQueries.UserQueries.EXISTS_BY_MOBILE_NUMBER,
        values: [mobileNumber],
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
  createUser: async (user: IUser): Promise<number> => {
    const logPrefix = `usersRepository :: createUser :: user :: ${JSON.stringify(
      user,
    )}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.CREATE_USER,
        values: [
          user.user_name,
          user.first_name,
          user.last_name,
          user.display_name,
          user.dob,
          user.gender,
          user.mobile_number,
          user.password,
          user.role_id,
          user.email_id,
          user.created_by,
          user.updated_by,
        ],
      };

      logger.debug(
        `${logPrefix} :: Executing query :: ${JSON.stringify(_query)}`,
      );
      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: Query result :: ${JSON.stringify(result)}`);

      const userId = result.length > 0 ? result[0].user_id : false;
      return userId;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  updateUser: async (user: IUser): Promise<boolean> => {
    const logPrefix = `usersRepository :: updateUser :: user :: ${JSON.stringify(
      user,
    )}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.UPDATE_USER,
        values: [
          user.user_id,
          user.first_name,
          user.last_name,
          user.dob,
          user.gender,
          user.mobile_number,
          user.email_id,
          user.updated_by,
          user.role_id,
          `${user.first_name} ${user.last_name}`,
        ],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      const updateSuccess = result.rowCount > 0;
      return updateSuccess;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  existsByUserId: async (userId: number): Promise<boolean> => {
    const logPrefix = `usersRepository :: existsByUserId :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.EXISTS_BY_USER_ID,
        values: [userId],
      };
      logger.debug(
        `${logPrefix} :: Executing query :: ${JSON.stringify(_query)}`,
      );

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: Query result :: ${JSON.stringify(result)}`);

      return result && result.length > 0 ? result[0].exists : false;
    } catch (error) {
      logger.error(`${logPrefix} :: ${error.message}`, { error });
      throw new Error(error.message);
    }
  },
  getUserById: async (userId: number): Promise<IUser> => {
    const logPrefix = `usersRepository ::getUserById :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.GET_USER_BY_ID,
        values: [userId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
      return result.length ? result[0] : null;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  updateUserStatus: async (
    user: IUser,
    status: UserStatus,
    updatedBy: number,
  ) => {
    const logPrefix = `usersRepository :: updateUserStatus :: user :: ${JSON.stringify(
      user,
    )} :: status :: ${status} :: updatedBy :: ${updatedBy}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.UPDATE_USER_STATUS,
        values: [user.user_id, status, updatedBy],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  usersUpdatedWithinfiveMinutes: async (): Promise<boolean> => {
    const logPrefix = `usersRepository :: usersUpdatedWithinfiveMinutes`;
    try {
      logger.info(`${logPrefix} :: Inside usersUsersUpdatedWithinfiveMinutes`);
      const _querylatestupdatedchecked = {
        text: pgQueries.UserQueries.LATEST_UPDATED_CHECK,
      };
      logger.debug(
        `${logPrefix} :: query :: ${JSON.stringify(_querylatestupdatedchecked)}`,
      );

      const latestUpdatedInForm = await pg.executeQueryPromise(
        _querylatestupdatedchecked,
      );
      const isUserUpdatedWithin5mins = latestUpdatedInForm[0].count > 0;
      return isUserUpdatedWithin5mins;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getUsersByRoleId: async (roleId: number): Promise<IUser[]> => {
    const logPrefix = `usersRepository :: getUsersByRoleId :: roleId :: ${roleId}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.GET_USERS_BY_ROLE_ID,
        values: [roleId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: DB result :: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  resetPasswordForUserId: async (newPassword: string, userId: number) => {
    const logPrefix = `usersRepository :: resetPasswordForUserId :: newPassword :: ${newPassword} :: userId :: ${userId}`;
    try {
      const _query = {
        text: pgQueries.UserQueries.RESET_PASSWORD_FOR_USER_ID,
        values: [userId, newPassword],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default usersRepository;
