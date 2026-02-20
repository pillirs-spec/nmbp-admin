export const FormType = {
  NORMAL_FORM: "NORMAL_FORM",
  STEPPER_FORM: "STEPPER_FORM",
} as const;

export type FormType = (typeof FormType)[keyof typeof FormType];

export const FormTypeValues = Object.values(FormType);
