import * as Yup from "yup";

const addOrUpdateRoleValidation = {
  validateAddOrUpdateRole: () => {
    return Yup.object().shape({
      role_name: Yup.string()
        .min(3, "Role Name must be at least 2 characters")
        .max(50, "Role Name must not exceed 50 characters")
        .matches(
          /^[a-zA-Z\s]*$/,
          "Role Name can only contain letters and spaces"
        )
        .required("Role Name is required"),

      role_description: Yup.string()
        .min(10, "Role Description must be at least 10 characters")
        .max(100, "Role Description must not exceed 200 characters")
        .required("Role Description is required"),

      // level: Yup.string()
      //   .oneOf(
      //     ["Admin", "Editor", "Viewer"],
      //     "Level must be either Admin, Editor, or Viewer"
      //   )
      //   .required("Level is required"),

      permissions: Yup.array().of(
        Yup.object().shape({
          menu_id: Yup.number()
            .positive("menu_id must be a positive number")
            .required("menu_id is required"),

          permission_id: Yup.number()
            .positive("permission_id must be a positive number")
            .required("permission_id is required"),
        })
      ),
    });
  },
};

export default addOrUpdateRoleValidation;
