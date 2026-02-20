import Joi from "joi";
import { IPasswordPolicy } from "../../types/custom";

const passwordPoliciesValidations = {
  validateCreatePasswordPolicy: (
    PasswordPolicy: IPasswordPolicy
  ): Joi.ValidationResult => {
    const PasswordPolicySchema = Joi.object({
      id: Joi.number().optional(),
      password_expiry: Joi.number().required(),
      password_history: Joi.number().required(),
      minimum_password_length: Joi.number().required(),
      complexity: Joi.number().required(),
      alphabetical: Joi.number().required(),
      numeric: Joi.number().required(),
      special_characters: Joi.number().required(),
      allowed_special_characters: Joi.string().required(),
      maximum_invalid_attempts: Joi.number().required(),
      date_created: Joi.string().allow("", null).optional(),
      date_updated: Joi.string().allow("", null).optional(),
    });
    return PasswordPolicySchema.validate(PasswordPolicy);
  },
  validateUpdatePasswordPolicy: (
    PasswordPolicy: IPasswordPolicy
  ): Joi.ValidationResult => {
    const PasswordPolicySchema = Joi.object({
      id: Joi.number().required(),
      password_expiry: Joi.number().required(),
      password_history: Joi.number().required(),
      minimum_password_length: Joi.number().required(),
      complexity: Joi.number().required(),
      alphabetical: Joi.number().required(),
      numeric: Joi.number().required(),
      special_characters: Joi.number().required(),
      allowed_special_characters: Joi.string().required(),
      maximum_invalid_attempts: Joi.number().required(),
      date_created: Joi.string().allow("", null).optional(),
      date_updated: Joi.string().allow("", null).optional(),
    });
    return PasswordPolicySchema.validate(PasswordPolicy);
  },
};

export default passwordPoliciesValidations;
