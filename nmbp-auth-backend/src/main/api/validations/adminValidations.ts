import Joi from "joi";
import { IUser } from "../../types/custom";

const adminValidations = {
  validateLoginDetails: (user: IUser): Joi.ValidationResult => {
    const loginSchema = Joi.object({
      user_name: Joi.string()
        .pattern(/^[a-zA-Z0-9_.]+$/)
        .required(),
      password: Joi.string().required(),
    });
    return loginSchema.validate(user);
  },
  validateVerifyForgotPassword: (otpDetails: {
    otp: string;
    txnId: string;
  }): Joi.ValidationResult => {
    const verifyForgotPasswordSchema = Joi.object({
      otp: Joi.string().required(),
      txnId: Joi.string().required(),
    });
    return verifyForgotPasswordSchema.validate(otpDetails);
  },
  validateResetPassword: (resetPasswordDetails: {
    newPassword: string;
    confirmPassword: string;
    txnId: string;
  }): Joi.ValidationResult => {
    const resetPasswordSchema = Joi.object({
      txnId: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    });
    return resetPasswordSchema.validate(resetPasswordDetails);
  },
  validateVerifyLoginOTP: (verifyOtpDetails: {
    otp: string;
    txnId: string;
  }): Joi.ValidationResult => {
    const verifyLoginOTPSchema = Joi.object({
      otp: Joi.string().required(),
      txnId: Joi.string().required(),
    });
    return verifyLoginOTPSchema.validate(verifyOtpDetails);
  },
};

export default adminValidations;
