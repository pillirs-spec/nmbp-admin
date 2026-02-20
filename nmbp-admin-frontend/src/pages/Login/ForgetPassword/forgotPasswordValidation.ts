import * as Yup from "yup";

const forgotPasswordValidation = {
  validateForgotPassword: (otpSent: boolean) => {
    return Yup.object().shape({
      mobileNumber: Yup.string()
        .matches(/^[1-9]\d{9}$/, "Invalid mobile number")
        .matches(/^\d{10}$/, "Mobile number must contain exactly 10 digits")
        .required("Mobile number is required"),
      otp: otpSent
        ? Yup.string()
            .matches(/^\d{6}$/, "Invalid OTP")
            .required("OTP is required")
        : Yup.string().notRequired(),
      txnId: otpSent
        ? Yup.string().required("Transaction ID is required")
        : Yup.string().notRequired(),
    });
  },
};

export default forgotPasswordValidation;
