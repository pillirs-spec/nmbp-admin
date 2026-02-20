import * as Yup from "yup";

export const loginValidations = {
  validateLoginWithPassword: () => {
    return Yup.object().shape({
      mobile_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("This field is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    });
  },
};
