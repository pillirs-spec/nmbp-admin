import { Response } from "express";
import { logger, STATUS } from "ts-commons";
import rolesService from "../services/rolesService";
import { Request } from "../../types/express";
import { errorCodes } from "../../config";
import { Role } from "../models/rolesModel";
import { promises } from "dns";
import { IRole } from "../../types/custom";
import rolesRepository from "../repositories/rolesRepository";
import rolesValidations from "../validations/rolesValidation";
import { Levels } from "../../enums";

const rolesController = {
  listRoles: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `rolesController :: listRoles`;
    try {
        logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Roles']
                #swagger.summary = 'List Roles (Paginated)'
                #swagger.description = 'Retrieve a paginated list of roles with optional search and active/inactive filter. Returns roles and total count.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        is_active: true,
                        page_size: 50,
                        current_page: 1,
                        searchFilter: "Admin"
                    }
                }    
            */

      const roleId = req.plainToken.role_id;
      const isActive = req.body.is_active || false;
      const pageSize = req.body.page_size || 11;
      const currentPage = req.body.current_page? (req.body.current_page - 1) * pageSize: 11;
      const searchFilter = req.body.searchFilter || "";
      logger.debug(`${logPrefix} :: Parsed parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: roleId :: ${roleId} :: isActive :: ${isActive} :: searchFilter :: ${searchFilter}`);

      const rolesList = await rolesService.listRoles(
        isActive,
        pageSize,
        currentPage,
        roleId,
        searchFilter
      );
      const rolesCount = await rolesService.listRolesCount(isActive, roleId, searchFilter);

      return res.status(STATUS.OK).send({
        data: { rolesList, rolesCount },
        message: "Roles Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
    }
  },

  updateRoleStatus: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `rolesController :: updateRoleStatus`;
    try {
        logger.info(`${logPrefix} :: Request received`);
      /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Update Role Status'
            #swagger.description = 'Activate or deactivate a role. Status: 1 = Active, 2 = Inactive'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                        role_id: 2,
                        status: 1
                }
            }
            */

      const plainToken = req.plainToken;
      const role: IRole = req.body;
      logger.debug(`${logPrefix} :: Parsed parameters :: role :: ${JSON.stringify(role)}`);
      const { error } = rolesValidations.validateUpdateRoleStatus(role);
      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.roles.ROLE00000.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.roles.ROLE00000.errorCode,
            errorMessage: error.message,
          });
      }
      const roleExists = await rolesRepository.existsByRoleId(role.role_id);
      if (!roleExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      await rolesService.updateRoleStatus(
        role.role_id,
        role.status,
        plainToken.user_id
      );

      return res.status(STATUS.OK).send({
        data: null,
        message: "Role Status Updated Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
    }
  },

  addRole: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `rolesController :: addRole`;
    try {
        logger.info(`${logPrefix} :: Request received`);
      /*
        #swagger.tags = ['Roles']
        #swagger.summary = 'Create Role'
        #swagger.description = 'Create a new role with a name, description, level, and menu-level permissions. Role names must be unique.'
        #swagger.parameters['Authorization'] = {
            in: 'header',
            required: true,
            type: 'string',
            description: 'JWT token for authentication'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                    role_name: 'Department Head',
                    role_description: 'Head of the Department',
                    level: 'Admin',
                    permissions: [
                        {
                            menu_id: 1,
                            permission_id: 2
                        }
                    ]
            }
        }
        */
      const plainToken = req.plainToken;
      const role: IRole = new Role(req.body);
      logger.debug(`${logPrefix} :: Parsed parameters :: role :: ${JSON.stringify(role)}`);
      const { error } = rolesValidations.validateCreateRole(role);

      if (error) {
        if (error.details != null) {
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.roles.ROLE00000.errorCode,
            errorMessage: error.details[0].message,
          });
        } else {
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.roles.ROLE00000.errorCode,
            errorMessage: error.message,
          });
        }
      }

      const roleExistsByName = await rolesRepository.existsByRoleName(
        role.role_name,
        null
      );
      if (roleExistsByName) {
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00007);
      }

      role.created_by = plainToken.user_id;
      role.updated_by = plainToken.user_id;

      await rolesService.addRole(role);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Role Added Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
    }
  },
  updateRole: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `rolesController :: updateRole`;
    try {
        logger.info(`${logPrefix} :: Request received`);
      /*
        #swagger.tags = ['Roles']
        #swagger.summary = 'Update Role'
        #swagger.description = 'Update an existing role details including name, description, level, status, and permissions'
        #swagger.parameters['Authorization'] = {
            in: 'header',
            required: true,
            type: 'string',
            description: 'JWT token for authentication'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                    role_id: 2,
                    role_name: 'Department Head',
                    role_description: 'Head of the Department',
                    level: 'Admin',
                    status: 1,
                    permissions: [
                        {
                            menu_id: 1,
                            permission_id: 2
                        }
                    ]
            }
        }
        */
      const plainToken = req.plainToken;
      const role: IRole = req.body;
      logger.debug(`${logPrefix} :: Parsed parameters :: role :: ${JSON.stringify(role)}`);
      const { error } = rolesValidations.validateUpdateRole(role);

      if (error) {
        if (error.details != null)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.roles.ROLE00000.errorCode,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.roles.ROLE00000.errorCode,
              errorMessage: error.message,
            });
      }

      const roleExistsById = await rolesRepository.existsByRoleId(role.role_id);
      if (!roleExistsById)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      const roleExistsByName = await rolesRepository.existsByRoleName(
        role.role_name,
        role.role_id
      );
      if (roleExistsByName)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00007);

      role.updated_by = plainToken.user_id;

      await rolesService.updateRole(role);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Role Updated Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
    }
  },
  getMenusList: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `rolesController :: getMenusList`;
    try {
        logger.info(`${logPrefix} :: Request received`);
        /*
        #swagger.tags = ['Roles']
        #swagger.summary = 'Get Menus for Role Assignment'
        #swagger.description = 'Retrieve the list of menus available for assigning permissions to roles. Use query param isActive=1 for active menus only.'
        #swagger.parameters['Authorization'] = {
            in: 'header',
            required: true,
            type: 'string',
            description: 'JWT token for authentication'
        }
        */
        const isActive = req.query.isActive === "1";
        logger.info(`${logPrefix} :: Fetching menus list with isActive status :: ${isActive}`);
        const menusList = await rolesRepository.getMenusList(Boolean(isActive));
        logger.info(`${logPrefix} :: Menus list fetched successfully`);

        return res.status(STATUS.OK).send({
            data: menusList,
            message: "Menus List Fetched Successfully",
        });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
    }
},
getDefaultAccessList: async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `rolesController :: getDefaultAccessList`;
  try {
    logger.info(`${logPrefix} :: Request received`);
      /*
      #swagger.tags = ['Roles']
      #swagger.summary = 'Get Default Access List'
      #swagger.description = 'Retrieve the default access/permission matrix for all menus. Used as a template when creating new roles.'
      #swagger.parameters['Authorization'] = {
          in: 'header',
          required: true,
          type: 'string',
          description: 'JWT token for authentication'
      }
      */
      const defaultAccessList = await rolesService.getDefaultAccessList();
      return res.status(STATUS.OK).send({
          data: defaultAccessList,
          message: "Default Access List Fetched Successfully",
      });
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
  }
},
getCombinedAccess: async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `rolesController :: getCombinedAccess`;
  try {
      logger.info(`${logPrefix} :: Request received`);
      /*
      #swagger.tags = ['Roles']
      #swagger.summary = 'Get Combined Access'
      #swagger.description = 'Retrieve the combined access/permissions for the currently logged-in user based on their role'
      #swagger.parameters['Authorization'] = {
          in: 'header',
          required: true,
          type: 'string',
          description: 'JWT token for authentication'
      }
      */
      const combinedAccess = await rolesService.getCombinedAccess(req.plainToken.role_id);
      return res.status(STATUS.OK).send({
          data: combinedAccess,
          message: "Combined Access Fetched Successfully",
      });
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
  }
},
listLevels: async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `rolesController :: listLevels`;
  try {
      logger.info(`${logPrefix} :: Request received`);
      /*
      #swagger.tags = ['Roles']
      #swagger.summary = 'List Role Levels'
      #swagger.description = 'Retrieve the available role hierarchy levels (excluding ADMIN). Used when creating or updating roles.'
      #swagger.parameters['Authorization'] = {
          in: 'header',
          required: true,
          type: 'string',
          description: 'JWT token for authentication'
      }
      */
      return res.status(STATUS.OK).send({
          data: Object.values(Levels).filter(value => typeof value === 'string' && value !== Levels.ADMIN),
          message: "Levels Fetched Successfully",
      });
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
  }
},
getAccessListByRoleId: async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `rolesController :: getAccessListByRoleId`;
  try {
      logger.info(`${logPrefix} :: Request received`);
      /*
      #swagger.tags = ['Roles']
      #swagger.summary = 'Get Access List by Role ID'
      #swagger.description = 'Retrieve the menu-level permission/access list assigned to a specific role (passed as URL parameter)'
      #swagger.parameters['Authorization'] = {
          in: 'header',
          required: true,
          type: 'string',
          description: 'JWT token for authentication'
      }
      */
      const roleId = req.params.roleId;
      logger.debug(`${logPrefix} :: Parsed parameters :: roleId ::  ${roleId}`);
      if (!roleId) return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00003);

      const roleExists = await rolesRepository.existsByRoleId(parseInt(roleId));
      if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      const accessList = await rolesService.getAccessListByRoleId(parseInt(roleId));

      return res.status(STATUS.OK).send({
          data: accessList,
          message: "Access List Fetched Successfully",
      });
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
  }
},
getRoleById: async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `rolesController :: getRoleById`;
  try {
      logger.info(`${logPrefix} :: Request received`);
      /*
      #swagger.tags = ['Roles']
      #swagger.summary = 'Get Role by ID'
      #swagger.description = 'Retrieve detailed role information by role ID (passed as URL parameter)'
      #swagger.parameters['Authorization'] = {
          in: 'header',
          required: true,
          type: 'string',
          description: 'JWT token for authentication'
      }
      */

      const roleId = req.params.roleId;
      logger.debug(`${logPrefix} :: Parsed parameters :: roleId ::  ${roleId}`);
      if (!roleId) return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00003)

      const roleExists = await rolesRepository.existsByRoleId(parseInt(roleId));
      if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      const role = await rolesService.getRoleById(parseInt(roleId));

      return res.status(STATUS.OK).send({
          data: role,
          message: "Role Fetched Successfully",
      });
  } catch (error) {
    logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.roles.ROLE00000);
  }
}
};

export default rolesController;
