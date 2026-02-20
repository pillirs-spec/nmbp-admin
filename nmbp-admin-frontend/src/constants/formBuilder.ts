export const FORM_TYPES = {
  NORMAL_FORM: "NORMAL_FORM",
  STEPPER_FORM: "STEPPER_FORM",
} as const;

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];

export const FORM_TYPE_OPTIONS = [
  { label: "Normal Form", value: FORM_TYPES.NORMAL_FORM },
  { label: "Stepper Form", value: FORM_TYPES.STEPPER_FORM },
];
