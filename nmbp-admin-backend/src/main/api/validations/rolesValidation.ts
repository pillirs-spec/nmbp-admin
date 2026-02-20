import Joi from "joi";
import { IRole } from "../../types/custom";
import { errorCodes } from "../../config";
import { Levels, RoleStatus } from "../../enums/status";
const rolesValidations = {
  validateCreateRole: (role: IRole): Joi.ValidationResult => {
    const roleSchema = Joi.object({
      role_id: Joi.number().optional(),
      role_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error(errorCodes.roles.ROLE00001.errorMessage)),
      role_description: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(new Error(errorCodes.roles.ROLE00002.errorMessage)),
      // level: Joi.string()
      //   .valid(
      //     ...Object.values(Levels).filter((value) => typeof value === "string")
      //   )
      //   .required(),
      permissions: Joi.array()
        .items(
          Joi.object({
            menu_id: Joi.number().required(),
            permission_id: Joi.number().required(),
          })
        )
        .required()
        .error(new Error(errorCodes.roles.ROLE00010.errorMessage)),
      status: Joi.number().valid(
        ...Object.values(RoleStatus).filter(
          (value) => typeof value === "number"
        )
      ),
      date_created: Joi.string().allow("", null).optional(),
      date_updated: Joi.string().allow("", null).optional(),
      created_by: Joi.number(),
      updated_by: Joi.number(),
    });
    return roleSchema.validate(role);
  },
  validateUpdateRole: (role: IRole): Joi.ValidationResult => {
    const roleSchema = Joi.object({
      role_id: Joi.number().required(),
      role_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error(errorCodes.roles.ROLE00001.errorMessage)),
      role_description: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(new Error(errorCodes.roles.ROLE00002.errorMessage)),
      // level: Joi.string()
      //   .valid(
      //     ...Object.values(Levels).filter((value) => typeof value === "string")
      //   )
      //   .required(),
      permissions: Joi.array()
        .items(
          Joi.object({
            menu_id: Joi.number().required(),
            permission_id: Joi.number().required(),
          })
        )
        .required()
        .error(new Error(errorCodes.roles.ROLE00010.errorMessage)),
      status: Joi.number().valid(
        ...Object.values(RoleStatus).filter(
          (value) => typeof value === "number"
        )
      ),
    });
    return roleSchema.validate(role);
  },
  validateUpdateRoleStatus: (role: IRole): Joi.ValidationResult => {
    const roleSchema = Joi.object({
      role_id: Joi.number().required(),
      status: Joi.number()
        .valid(
          ...Object.values(RoleStatus).filter(
            (value) => typeof value === "number"
          )
        )
        .required()
        .error(new Error(errorCodes.roles.ROLE00004.errorMessage)),
    });
    return roleSchema.validate(role);
  },
};
export default rolesValidations;
