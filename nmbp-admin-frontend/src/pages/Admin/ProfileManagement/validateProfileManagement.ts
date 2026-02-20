import * as Yup from "yup";

export const profileValidation = {
  validateProfile: () => {
    return Yup.object().shape({
      first_name: Yup.string().required("Please enter first name"),
      last_name: Yup.string().required("Please enter last name"),
      email_id: Yup.string().required("Please enter email id"),
      dob: Yup.date().required("Please select date of birth"),
    });
  },
};

export default profileValidation;
