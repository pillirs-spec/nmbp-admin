import { CacheTTL, pgQueries } from "../../enums";
import { RedisKeys } from "../../enums/redisKeysEnum";
import { redisKeysFormatter } from "../../helpers";
import { pg, logger, redis } from "ts-commons";
import { IRole } from "../../types/custom";
import rolesRepository from "../repositories/rolesRepository";
import { GridDefaultOptions, RoleStatus } from "../../enums/status";


const rolesService = {
  listRoles: async (isActive: boolean,pageSize: number,currentPage: number,roleId: number, searchFilter?: string): Promise<IRole[]> => {
    const logPrefix = `rolesService :: listRoles :: isActive :: ${isActive} :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: roleId :: ${roleId} :: searchFilter :: ${searchFilter}`;
    try {
      let key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ROLES, {});
      let whereQuery = `WHERE`;

      if (isActive) {
        key += "|active";
        whereQuery += ` status = 1 AND role_id NOT IN (1, ${roleId})`;
      } else {
        whereQuery += ` status IN (0,1) AND role_id NOT IN (1, ${roleId})`;
      }

      if (searchFilter) {
        if (searchFilter) key += `|search:${searchFilter}`;
        whereQuery += ` AND role_name ILIKE '%${searchFilter}%'`;
    }

      if (pageSize) {
        key += `|limit:${pageSize}`;
        whereQuery += ` LIMIT ${pageSize}`;
      }

      if (currentPage) {
        key += `|offset:${currentPage}`;
        whereQuery += ` OFFSET ${currentPage}`;
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`);
        return JSON.parse(cachedResult);
      }

      const _query: { text: string; values?: string[] } = {
        text: pgQueries.RoleQueries.LIST_ROLES + ` ${whereQuery}`,
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      if (result && result.length > 0)
        redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  listRolesCount: async (isActive: boolean,roleId: number, searchFilter?: string): Promise<number> => {
    const logPrefix = `rolesService :: listRolesCount :: isActive :: ${isActive} :: roleId :: ${roleId} :: searchFilter :: ${searchFilter}`;
    try {
      let key = redisKeysFormatter.getFormattedRedisKey(
        RedisKeys.ROLES_COUNT,
        {}
      );
      let whereQuery = `WHERE`;

      if (isActive) {
        key += "|active";
        whereQuery += ` status = 1 AND role_id NOT IN (1, ${roleId})`;
      } else {
        whereQuery += ` status IN (0,1) AND role_id NOT IN (1, ${roleId})`;
      }

      if (searchFilter) {
        if (searchFilter) key += `|search:${searchFilter}`;
        whereQuery += ` AND role_name ILIKE '%${searchFilter}%'`;
    }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`);
        // return JSON.parse(cachedResult);
      }

      const _query: { text: string; values?: string[] } = {
        text: pgQueries.RoleQueries.LIST_ROLES_COUNT + ` ${whereQuery}`,
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

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

  updateRoleStatus: async (roleId: number,status: number,updatedBy: number) => {
    const logPrefix = `rolesService :: updateRoleStatus :: roleId :: ${roleId} :: status :: ${status} :: updatedBy :: ${updatedBy} `;
    try {
      await rolesRepository.updateRoleStatus(roleId, status, updatedBy);
      await redis.deleteRedis(
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.ROLE_BY_ID, {
          roleId: roleId.toString(),
        })
      );
      await rolesService.clearRedisCache(roleId);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  addRole: async (role: IRole) => {
    const logPrefix = `rolesService :: addRole :: role :: ${JSON.stringify(role)}`;
    try {
      const createdRole = await rolesRepository.addRole(role);
      const createRoleId = createdRole[0].role_id;

      if (role.permissions && role.permissions.length > 0) {
        for (const permission of role.permissions) {
          await rolesRepository.addPermissions(
            createRoleId,
            permission.menu_id,
            permission.permission_id,
            role.updated_by
          );
        }
      }
      await rolesService.clearRedisCache(createRoleId);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  updateRole: async (role: IRole) => {
    const logPrefix = `rolesService :: updateRole :: role :: ${JSON.stringify(role)}`;
    try {
      await rolesRepository.updateRole(role);

      if (role.permissions && role.permissions.length > 0) {
        await rolesRepository.deleteExistingPermissions(role.role_id);
        for (const permission of role.permissions) {
          await rolesRepository.addPermissions(
            role.role_id,
            permission.menu_id,
            permission.permission_id,
            role.updated_by
          );
        }
      }
      await rolesService.clearRedisCache(role.role_id);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getDefaultAccessList: async (): Promise<any> => {
    const logPrefix = `rolesService :: getDefaultAccessList`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.DEFAULT_ACCESS_LIST, {});
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: Cached result found :: ${cachedResult}`);
        return JSON.parse(cachedResult)
      }

      const result = await rolesRepository.getDefaultAccessList();
      logger.debug(`${logPrefix} :: Data fetched from repository :: ${JSON.stringify(result)}`);
      if (result && result.length > 0) redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getCombinedAccess: async (roleId: number): Promise<any> => {
    const logPrefix = `rolesService :: getCombinedAccess :: roleId :: ${roleId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.COMBINED_ACCESS_BY_ROLE_ID, { roleId: roleId.toString() });
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const result = await rolesRepository.getCombinedAccess(roleId);
      if (result && result.length > 0) redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getAccessListByRoleId: async (roleId: number): Promise<any> => {
    const logPrefix = `rolesService :: getAccessListByRoleId :: roleId :: ${roleId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ACCESS_LIST_BY_ROLE_ID, { roleId: roleId.toString() });
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const result = await rolesRepository.getAccessListByRoleId(roleId);
      if (result) redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getRoleById: async (roleId: number): Promise<IRole> => {
    const logPrefix = `rolesService :: getRoleById :: roleId :: ${roleId}`;
    try {
      const key = redisKeysFormatter.getFormattedRedisKey(RedisKeys.ROLE_BY_ID, { roleId: roleId.toString() });
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`${logPrefix} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const role = await rolesRepository.getRole(roleId);
      if (role) redis.SetRedis(key, role, CacheTTL.LONG);
      return role;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  clearRedisCache: async (roleId?: number, pageSize: number = 11, searchFilter?: string) => {
    const logPrefix = `rolesService :: clearRedisCache :: roleId :: ${roleId}`;
    try {
      const keysToDelete = [
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.ROLE_BY_ID, { roleId: roleId.toString() }),
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.ACCESS_LIST_BY_ROLE_ID, { roleId: roleId.toString() }),
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.COMBINED_ACCESS_BY_ROLE_ID, { roleId: roleId.toString() }),
        RedisKeys.ROLES,
        redisKeysFormatter.getFormattedRedisKey(RedisKeys.ROLES_LIST, { pageSize: pageSize.toString() }),
        `dev|temple_seva|roles|count|active`,
        RedisKeys.DEFAULT_ACCESS_LIST,
        `${RedisKeys.ACTIVE_ROLES}|count|active`,
        `${RedisKeys.ACTIVE_ROLES}|limit:${pageSize}`
      ];
  
      if (searchFilter) {
        keysToDelete.push(`${RedisKeys.ROLES}|search:${searchFilter}`);
        keysToDelete.push(`${RedisKeys.ROLES_COUNT}|search:${searchFilter}`);
      }

      for (const key of keysToDelete) {
        logger.debug(`${logPrefix} :: Attempting to delete key :: ${key}`);
        const result = await redis.deleteRedis(key);
        if (result === 0) {
          logger.debug(`${logPrefix} :: Key not found, skipping :: ${key}`);
        } else {
          logger.info(`${logPrefix} :: Successfully deleted key :: ${key}`);
        }
      }
    } catch (error) {
      logger.error(`${logPrefix} :: Error clearing cache :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
};

export default rolesService;
