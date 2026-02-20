import { logger, STATUS } from "ts-commons";
import { Response } from "express";
import { Request } from "../../types/express";
import { usersService } from "../services";
import { IUser } from "../../types/custom";
import { usersModel } from "../models";
import { rolesRepository, usersRepository } from "../repositories";
import { errorCodes } from "../../config";
import { usersValidations } from "../validations";
import { GridDefaultOptions } from "../../enums";
import { encDecHelper } from "../../helpers";

const usersController = {
  createUser: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `usersController :: createUser`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Users']
            #swagger.summary = 'Create User'
            #swagger.description = 'Create a new user account with the given details. The mobile number is used as the username. A default password is auto-generated and sent via email.'
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
                    first_name: 'Rajesh',
                    last_name: 'Nayak',
                    email_id: 'rajeshnayak899@gmail.com',
                    mobile_number: '8249834095',
                    dob: '1997-07-21',
                    gender: 1,
                    role_id: 2
                }
            }
        */
      const plainToken = req.plainToken;
      const user: IUser = new usersModel.User(req.body);
      logger.debug(`${logPrefix} :: Parsed parameters  :: user :: ${user}`);

      const { error } = usersValidations.validateCreateUser(user);

      if (error) {
        if (error.details != null)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.message,
            });
      }

      const roleExists = await rolesRepository.existsByRoleId(user.role_id);
      if (!roleExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      const userExists = await usersRepository.existsByMobileNumber(
        user.mobile_number,
      );
      if (userExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER00005);

      user.created_by = plainToken.user_id;
      user.updated_by = plainToken.user_id;

      await usersService.createUser(user);

      return res.status(STATUS.OK).send({
        data: null,
        message: "User Added Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  updateUser: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `usersController :: updateUser`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Update User'
                #swagger.description = 'Update an existing user account details. The user_id must be an encrypted hash.'
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
                        user_id: 'encryptedHash',
                        first_name: 'Rajesh',
                        last_name: 'Nayak',
                        email_id: 'rajeshnayak899@gmail.com',
                        mobile_number: '8249834095',
                        dob: '1997-07-21',
                        gender: 1,
                        role_id: 2,
                    }
                }    
            */
      const plainToken = req.plainToken;
      if (req.body.user_id) req.body.user_id = parseInt(req.body.user_id);

      const user: IUser = req.body;
      logger.debug(`${logPrefix} :: Parsed parameters  :: user :: ${user}`);

      if (user.mobile_number) {
        user.user_name = user.mobile_number.toString();
      }

      const { error } = usersValidations.validateUpdateUser(user);

      if (error) {
        if (error.details != null)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.message,
            });
      }

      const roleExists = await rolesRepository.existsByRoleId(user.role_id);
      if (!roleExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.roles.ROLE00006);

      const userExists = await usersRepository.existsByUserId(user.user_id);
      if (!userExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER000011);

      user.updated_by = plainToken.user_id;

      await usersService.updateUser(user);

      return res.status(STATUS.OK).send({
        data: null,
        message: "User Updated Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  getUserById: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `userscontroller :: getUserById`;
    try {
      logger.info(`${logPrefix}:: Request received`);
      /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Get User by ID'
                #swagger.description = 'Retrieve detailed user information by user ID (passed as URL parameter)'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'JWT token for authentication'
                } 
            */
      const userId = req.params.userId;
      logger.debug(`${logPrefix} :: Parsed parameters  :: userId :: ${userId}`);

      const userIdExists = await usersRepository.existsByUserId(userId);
      if (!userIdExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER00006);

      const user = await usersService.getUserById(parseInt(userId));

      return res.status(STATUS.OK).send({
        data: user,
        message: "User Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  listUsersByRoleId: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `usersController :: listUsersByRoleId`;
    try {
      logger.info(`${logPrefix}:: Request received`);
      /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'List Users by Role ID'
                #swagger.description = 'Retrieve all users assigned to a specific role (passed as URL parameter)'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'JWT token for authentication'
                } 
            */
      const roleId = req.params.roleId;
      if (!roleId)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER00007);

      logger.info(`${logPrefix} :: Fetching users for roleId :: ${roleId}`);

      const users = await usersService.getUsersByRoleId(parseInt(roleId));
      logger.info(`${logPrefix} :: Users fetched successfully`);

      return res.status(STATUS.OK).send({
        data: users,
        message: "Users Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  resetPasswordForUserId: async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const logPrefix = `userController :: resetPasswordForUserId`;
    try {
      logger.info(`${logPrefix}:: Request received`);
      /*
            #swagger.tags = ['Users']
            #swagger.summary = 'Reset User Password'
            #swagger.description = 'Reset a user password to the default password by user ID (passed as URL parameter). The user will need to change it on next login.'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
            */
      const userId = req.params.userId;
      if (!userId)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER00006);

      const userExists = await usersRepository.existsByUserId(parseInt(userId));
      if (!userExists)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER000011);

      await usersService.resetPasswordForUserId(parseInt(userId));

      return res.status(STATUS.OK).send({
        data: null,
        message: "Resetted Password Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  listUsers: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `usersController :: listUsers`;
    try {
      logger.info(`${logPrefix}:: Request received`);
      /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'List Users (Paginated)'
                #swagger.description = 'Retrieve a paginated list of all users with optional search filter. Supports pagination via page_size and current_page.'
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
                        page_size: 50,
                        current_page: 1,
                        search_query: '8249834095'
                    }
                }    
            */
      const user_id = req.plainToken.user_id;
      const pageSize = req.body.page_size || GridDefaultOptions.PAGE_SIZE;
      let currentPage =
        req.body.current_page || GridDefaultOptions.CURRENT_PAGE;
      const searchQuery = req.body.search_query || "";
      logger.debug(
        `${logPrefix} :: parased parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchQuery :: ${searchQuery}`,
      );

      if (currentPage > 1) {
        currentPage = (currentPage - 1) * pageSize;
      } else {
        currentPage = 0;
      }

      const usersList = await usersService.listUsers(
        pageSize,
        currentPage,
        searchQuery,
        user_id,
      );
      const usersCount = await usersService.getUsersCount(searchQuery);
      return res.status(STATUS.OK).send({
        data: { usersList, usersCount },
        message: "Users Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
  updateStatus: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `userscontroller :: updateStatus`;
    try {
      logger.info(`${logPrefix}:: Request received`);
      /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Update User Status'
                #swagger.description = 'Activate or deactivate a user account. The user_id must be an encrypted hash. Status: 1 = Active, 2 = Inactive'
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
                        user_id: 'encryptedHash',
                        status: 1
                    }
                }
            */
      const user = req.body;
      const updatedBy = req.plainToken.user_id;
      logger.debug(`${logPrefix} :: Parsed parameters  :: user :: ${user}`);

      const { error } = usersValidations.ValidateUpdateUserStatus(user);

      if (error) {
        if (error.details != null)
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.details[0].message,
            });
        else
          return res
            .status(STATUS.BAD_REQUEST)
            .send({
              errorCode: errorCodes.users.USER00000.errorCode,
              errorMessage: error.message,
            });
      }

      user.user_id = parseInt(encDecHelper.decryptPayload(user.user_id));

      const userDetails = await usersService.getUserById(user.user_id);
      if (!userDetails)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.users.USER000011);

      await usersService.updateUserStatus(userDetails, user.status, updatedBy);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Updated User Status Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.users.USER00000);
    }
  },
};

export default usersController;
