import { logger, pg } from "ts-commons";
import { pgQueries, RoleStatus } from "../../enums";
import { IRole } from "../../types/custom";


const rolesRepository = {
  getRole: async (roleId: number): Promise<IRole> => {
    const logPrefix = `rolesRepository :: getRole :: roleId :: ${roleId}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.GET_ROLE,
        values: [roleId],
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

  updateRoleStatus: async (roleId: number,status: RoleStatus,updatedBy: number) => {
    const logPrefix = `rolesRepository :: updateRoleStatus :: roleId :: ${roleId} :: status :: ${status} :: updatedBy :: ${updatedBy}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.UPDATE_ROLE_STATUS,
        values: [updatedBy,status, roleId]
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  existsByRoleId: async (roleId: number): Promise<boolean> => {
    const logPrefix = `rolesRepository :: existsByRoleId :: roleId :: ${roleId}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.EXISTS_BY_ROLE_ID,
        values: [roleId],
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

  existsByRoleName: async (roleName: string,roleId?: number): Promise<boolean> => {
    const logPrefix = `rolesRepository :: existsByRoleName :: roleId :: ${roleId} :: roleName :: ${roleName}`;
    try {
      const _query: { text: string; values?: string[] } = {
        text: pgQueries.RoleQueries.EXISTS_BY_ROLE_NAME,
        values: [roleName],
      };
      if (roleId)
        _query.text = _query.text.replace(
          `status = 1`,
          `status = 1 AND role_id <> ${roleId}`
        );
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result && result.length > 0 ? result[0].exists : false;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  addRole: async (role: IRole): Promise<IRole[]> => {
    const logPrefix = `rolesRepository :: addRole :: role :: ${JSON.stringify(role)}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.ADD_ROLE,
        values: [
          role.role_name,
          role.role_description,
          // role.level,
          role.status,
          role.created_by,
          role.updated_by,
        ],
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

  addPermissions: async (roleId: number,menu_id: number,permission_id: number,updated_by: number) => {
    const logPrefix = `rolesRepository :: addPermissions :: roleId :: ${roleId} :: menu_id :: ${menu_id} :: permission_id :: ${permission_id} updated_by :: ${updated_by}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.ADD_PERMISSIONS,
        values: [roleId, menu_id, permission_id, updated_by],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },

  updateRole: async (role: IRole) => {
    const logPrefix = `rolesRepository :: updateRole :: role :: ${JSON.stringify(role)}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.UPDATE_ROLE,
        values: [
          role.role_id,
          role.role_name,
          role.role_description,
          // role.level,
          role.updated_by,
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

  deleteExistingPermissions: async (roleId: number) => {
    const logPrefix = `rolesRepository :: deleteExistingPermissions :: roleId :: ${roleId}`;
    try {
      const _query = {
        text: pgQueries.RoleQueries.DELETE_EXISTING_PERMISSIONS,
        values: [roleId],
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
    }
  },
  getMenusList: async (isActive: boolean): Promise<any> => {
    const logPrefix = `rolesRepository :: getMenusList :: isActive :: ${isActive}`;
    try {
        const _query: { text: string, values?: string[] } = {
            text: pgQueries.RoleQueries.GET_MENUS_LIST + ` ${isActive ? 'WHERE status = 1 ORDER BY menu_order ASC' : 'ORDER BY menu_order ASC'}`
        };
        logger.debug(`${logPrefix} :: Preparing query :: ${JSON.stringify(_query)}`);

        const result = await pg.executeQueryPromise(_query);
        logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

        return result;
    } catch (error) {
      logger.error(`${logPrefix}  :: ${error.message} :: ${error}`);
        throw new Error(error.message);
    }
},
getDefaultAccessList: async (): Promise<any> => {
  const logPrefix = `rolesRepository :: getDefaultAccessList`;
  try {
      const _query = {
          text: pgQueries.RoleQueries.GET_DEFAULT_ACCESS_LIST
      };
      logger.debug(`${logPrefix} :: Preparing query :: ${JSON.stringify(_query)}`);
      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} ::  db result :: ${JSON.stringify(result)}`);

      return result;
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
  }
},
getCombinedAccess: async (roleId: number): Promise<{ menu_name: string, access: string, icon_class: string, route_url: string }[]> => {
  const logPrefix = `rolesRepository :: getCombinedAccess :: roleId :: ${roleId}`;
  try {
      const _query = {
          text: pgQueries.RoleQueries.GET_COMBINED_ACCESS_BY_ROLE_ID,
          values: [roleId]
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
getAccessListByRoleId: async (roleId: number): Promise<any> => {
  const logPrefix = `rolesRepository :: getAccessListByRoleId :: roleId :: ${roleId}`;
  try {
      const _query = {
          text: pgQueries.RoleQueries.GET_ACCESS_LIST_BY_ROLE_ID,
          values: [roleId]
      };
      logger.debug(`${logPrefix} :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`${logPrefix} :: db result :: ${JSON.stringify(result)}`);

      return result;
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw new Error(error.message);
  }
}
};

export default rolesRepository;
