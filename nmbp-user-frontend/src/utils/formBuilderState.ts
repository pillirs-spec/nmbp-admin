interface StepperFormField {
  fieldId: string;
  labelName?: string;
}

interface FormGroup {
  labelName: string;
  form_fields: StepperFormField[];
}

interface StepperStep {
  groups?: FormGroup[];
}

interface FormResponse {
  tenantId: string;
  projectId: string;
  formName: string;
  fields?: Record<string, StepperStep>;
}

interface GroupState {
  label: string;
  data: Record<string, string>;
}

interface InitialFormState {
  tenantId: string;
  projectId: string;
  formName: string;
  formData: {
    groups: GroupState[];
  };
}

export const buildInitialFormState = (
  formResponse: FormResponse
): InitialFormState => {
  const { tenantId, projectId, formName, fields } = formResponse;

  const steps = Object.values(fields ?? {});

  const groups: GroupState[] = steps.flatMap((step) =>
    (step.groups ?? []).map((group) => ({
      label: group.labelName,
      data: group.form_fields.reduce<Record<string, string>>((acc, field) => {
        const key = field.labelName || field.fieldId;
        acc[key] = "";
        return acc;
      }, {}),
    }))
  );

  return {
    tenantId,
    projectId,
    formName,
    formData: { groups },
  };
};
