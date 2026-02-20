import { logger, STATUS } from "ts-commons";
import { Response } from "express";
import { Request } from "../../types/express";
import { errorCodes } from "../../config";
import { passwordPoliciesService } from "../services";
import { IPasswordPolicy } from "../../types/custom";
import { passwordPoliciesValidations } from "../validations";
import { passwordPoliciesModel } from "../models";
import { passwordPoliciesRepository } from "../repositories";

const passwordPoliciesController = {
  listPasswordPolicies: async ( req: Request, res: Response): Promise<Response> => {
    const logPrefix = `passwordPoliciesController :: listPasswordPolicies`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Password Policies']
            #swagger.summary = 'List Password Policies'
            #swagger.description = 'Retrieve all configured password policies including expiry, history, complexity rules, and allowed special characters'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
        */
      const passwordPolicies =
        await passwordPoliciesService.listPasswordPolicies();
      return res.status(STATUS.OK).send({
        data: passwordPolicies,
        message: "Password Policies Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.password_policies.PASSWORDPOLICIES000);
    }
  },
  addPasswordPolicy: async (req: Request, res: Response): Promise<Response> => {
    const logPrefix = `passwordPoliciesController :: addPasswordPolicy`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Password Policies']
            #swagger.summary = 'Create Password Policy'
            #swagger.description = 'Create a new password policy with rules for expiry, history, minimum length, complexity, and maximum invalid login attempts'
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
                    password_expiry: 10,
                    password_history: 10,
                    minimum_password_length: 8,
                    complexity: 3,
                    alphabetical: 1,
                    numeric: 1,
                    special_characters: 1,
                    allowed_special_characters: '!@#$%^&*()',
                    maximum_invalid_attempts: 5,
                }
            }    
        */
      const passwordPolicy: IPasswordPolicy = new passwordPoliciesModel.PasswordPolicy(req.body);
      logger.info(`${logPrefix} :: Request received :: passwordPolicy :: ${JSON.stringify(passwordPolicy)}`);
      const { error } =
        passwordPoliciesValidations.validateCreatePasswordPolicy(
          passwordPolicy
        );

      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode:
              errorCodes.password_policies.PASSWORDPOLICIES000.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode:
              errorCodes.password_policies.PASSWORDPOLICIES000.errorCode,
            errorMessage: error.message,
          });
      }

      await passwordPoliciesService.createPasswordPolicy(passwordPolicy);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Password Policy Added Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.password_policies.PASSWORDPOLICIES000);
    }
  },
  updatePasswordPolicy: async ( req: Request, res: Response): Promise<Response> => {
    const logPrefix = `passwordPoliciesController :: updatePasswordPolicy`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Password Policies']
            #swagger.summary = 'Update Password Policy'
            #swagger.description = 'Update an existing password policy by its ID. All policy fields can be modified.'
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
                    id: 1,
                    password_expiry: 10,
                    password_history: 10,
                    minimum_password_length: 8,
                    complexity: 3,
                    alphabetical: 1,
                    numeric: 1,
                    special_characters: 1,
                    allowed_special_characters: '!@#$%^&*()',
                    maximum_invalid_attempts: 5,
                }
            }    
        */
      const passwordPolicy: IPasswordPolicy = req.body;
      logger.info(`${logPrefix} :: Request received :: passwordPolicy :: ${JSON.stringify(passwordPolicy)}`);
      const { error } =passwordPoliciesValidations.validateUpdatePasswordPolicy(passwordPolicy);

      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode:
              errorCodes.password_policies.PASSWORDPOLICIES000.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode:
              errorCodes.password_policies.PASSWORDPOLICIES000.errorCode,
            errorMessage: error.message,
          });
      }

      const passwordPolicyExists =
        await passwordPoliciesRepository.existByPasswordPolicyId(
          passwordPolicy.id
        );
      if (!passwordPolicyExists)
        return res
          .status(STATUS.BAD_REQUEST)
          .send(errorCodes.password_policies.PASSWORDPOLICIES001);

      await passwordPoliciesService.updatePasswordPolicy(passwordPolicy);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Password Policy Updated Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.password_policies.PASSWORDPOLICIES000);
    }
  },
  getPasswordPolicyById: async ( req: Request, res: Response): Promise<Response> => {
    const logPrefix = `passwordPoliciesController :: getPasswordPolicyById`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
            #swagger.tags = ['Password Policies']
            #swagger.summary = 'Get Password Policy by ID'
            #swagger.description = 'Retrieve a specific password policy by its ID (passed as URL parameter)'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'JWT token for authentication'
            }
        */
      const passwordPolicyId = req.params.passwordPolicyId;
      logger.debug(`${logPrefix} :: Parsed parameters ::  passwordPolicyId :: ${ passwordPolicyId}`);
      if (!passwordPolicyId)
        return res.status(STATUS.BAD_REQUEST).send(errorCodes.password_policies.PASSWORDPOLICIES002);

      const passwordPolicyExists =
        await passwordPoliciesRepository.existByPasswordPolicyId(
          parseInt(passwordPolicyId)
        );
      if (!passwordPolicyExists)
        return res
          .status(STATUS.BAD_REQUEST)
          .send(errorCodes.password_policies.PASSWORDPOLICIES001);

      const passwordPolicy =
        await passwordPoliciesService.getPasswordPolicyById(
          parseInt(passwordPolicyId)
        );

      return res.status(STATUS.OK).send({
        data: passwordPolicy,
        message: "Password Policy Fetched Successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.password_policies.PASSWORDPOLICIES000);
    }
  },
};

export default passwordPoliciesController;
