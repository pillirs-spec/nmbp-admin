import * as Yup from "yup";

const addFeedbackValidations = {
  validateAddFeedback: () => {
    return Yup.object().shape({
      feedback: Yup.string()
        .min(3, "Feedback must be at least 3 characters")
        .max(200, "Feedback must not exceed 200 characters")
        .matches(
          /^[a-zA-Z\s]*$/,
          "Feedback can only contain letters and spaces",
        )
        .required("Feedback is required"),
    });
  },
};

export default addFeedbackValidations;
