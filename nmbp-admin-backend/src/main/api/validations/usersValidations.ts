import Joi from "joi";
import { IUser } from "../../types/custom";
import { GenderStatus, UserStatus } from "../../enums";
import { errorCodes } from "../../config";

const usersValidations = {
    validateCreateUser: (user: IUser): Joi.ValidationResult => {
        const userSchema = Joi.object({
        user_id: Joi.number().optional(),
        user_name: Joi.string().min(3).max(50).error(
            new Error(errorCodes.users.USER00001.errorMessage)
        ).allow("", null).optional(),
        display_name: Joi.string().min(3).max(50).error(
            new Error(errorCodes.users.USER00002.errorMessage)
        ).allow("", null).optional(),
        first_name: Joi.string().min(3).max(20).required().error(
            new Error(errorCodes.users.USER00003.errorMessage)
        ),
        last_name: Joi.string().min(3).max(20).required().error(
            new Error(errorCodes.users.USER00004.errorMessage)
        ),
        mobile_number: Joi.number().integer().min(6000000000).max(9999999999).required(),
        dob: Joi.date().iso().allow("", null).optional(),
        email_id: Joi.string().email().min(3).max(50).required(),
        // gender: Joi.number().valid(...Object.values(GenderStatus).filter(value => typeof value === 'number')).required(),
        gender: Joi.number().valid(...Object.values(GenderStatus).filter(value => typeof value === 'number')).allow("", null).optional(),
        role_id: Joi.number().required(),
        password: Joi.string().min(3).max(200).optional(),
        invalid_attempts: Joi.number(),
        status: Joi.number(),
        last_logged_in: Joi.string().allow("", null).optional(),
        date_created: Joi.string().allow("", null).optional(),
        date_updated: Joi.string().allow("", null).optional(),
        created_by: Joi.number(),
        updated_by: Joi.number()
        });
        return userSchema.validate(user);
    },
    validateUpdateUser: (user: IUser): Joi.ValidationResult => {
        const userSchema = Joi.object({
        user_id: Joi.number().required(),
        user_name: Joi.string().min(3).max(50).required().error(
            new Error(errorCodes.users.USER00001.errorMessage)
        ),
        display_name: Joi.string().min(3).max(50),
        first_name: Joi.string().min(3).max(20).allow(null, "").optional(),
        last_name: Joi.string().min(3).max(20).allow(null, "").optional(),
        dob: Joi.date().iso().allow("", null).optional(),
        mobile_number: Joi.number().integer().min(6000000000).max(9999999999).allow(null, "").optional(),
        email_id: Joi.string().email().min(3).max(50).allow(null,"").optional(),
        gender: Joi.number().valid(...Object.values(GenderStatus).filter(value => typeof value === 'number')).allow("", null).optional(),
        role_id: Joi.number().required(),
        status: Joi.number().valid(...Object.values(UserStatus).filter(value => typeof value === 'number')),
        });
        return userSchema.validate(user);
    },
    ValidateUpdateUserStatus: (user: any): Joi.ValidationResult => {
        const userSchema = Joi.object({
          user_id: Joi.string().required(),
          status: Joi.number().valid(...Object.values(UserStatus).filter(value => typeof value === 'number')).required().error(
            new Error(errorCodes.users.USER000014.errorMessage)
          )
        });
        return userSchema.validate(user);
      }
};

export default usersValidations;