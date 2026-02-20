import Joi from "joi";
import { errorCodes } from "../../config";
import { IUser } from "../../types/custom";

const adminValidations = {
  validateUpdateUser: (user: Partial<IUser>): Joi.ValidationResult => {
    const userSchema = Joi.object({
      first_name: Joi.string().min(3).max(50).required().error(
        new Error(errorCodes.admin.ADMIN00004.errorMessage)
      ),
      last_name: Joi.string().min(3).max(50).required().error(
        new Error(errorCodes.admin.ADMIN00005.errorMessage)
      ),
      dob: Joi.date().iso(),
      email_id: Joi.string().email().required()
    });
    return userSchema.validate(user);
  }
}

export default adminValidations;