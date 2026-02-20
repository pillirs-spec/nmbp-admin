import { v4 as uuidv4 } from "uuid";
import {
  IFormProject,
  IStepperFormStructure,
  IFormField,
} from "../types/custom";
import { logger } from "ts-commons";
import { FormType } from "../enums";

const formBuilderHelper = {
  /**
   * Restructures form data based on type (normal or stepper)
   * @param formProject - The form project object containing type and fields
   * @returns Restructured form project object
   */
  restructureFormByType: (formProject: IFormProject): IFormProject => {
    const logPrefix = `formBuilderHelper :: restructureFormByType`;

    try {
      if (!formProject.type) {
        formProject.type = FormType.NORMAL_FORM;
      }

      if (formProject.type === FormType.STEPPER_FORM) {
        return formBuilderHelper.restructureStepperForm(formProject);
      }

      return formProject;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw error;
    }
  },

  /**
   * Restructures stepper form data
   * Converts the incoming format (array of steps from frontend) to the internal format with steps structure
   * Frontend can send either:
   * - Without groups: [{label: "step1", form_fields: [...]}, {label: "step2", form_fields: [...]}]
   * - With groups: [{label: "step1", groups: [{label: "group1", form_fields: [...]}, ...]}, ...]
   * Backend stores: {step_1: {label: "step1", form_fields: [...] OR groups: [...]}, step_2: {...}}
   * @param formProject - The form project object
   * @returns Restructured form project with steps
   */
  restructureStepperForm: (formProject: IFormProject): IFormProject => {
    const logPrefix = `formBuilderHelper :: restructureStepperForm`;

    try {
      const steps: IStepperFormStructure = {};
      const fieldsData = formProject.fields as any;

      // Handle array format from frontend: [{label, form_fields/groups}, ...]
      if (Array.isArray(fieldsData)) {
        fieldsData.forEach((step: any, index: number) => {
          const stepKey = `step_${index + 1}`;

          if (!step.label) return;

          // Check if step has groups (new grouped format)
          if (Array.isArray(step.groups) && step.groups.length > 0) {
            // Handle grouped stepper form
            steps[stepKey] = {
              label: step.label,
              groups: step.groups.map((group: any) => ({
                label: group.label,
                form_fields: group.form_fields.map((field: any) => ({
                  ...field,
                  ...(field.label ? {labelName : field.label?.trim().toLowerCase().replace(/\s+/g, "_")} :  {}),
                  // Add fieldId if not present
                  ...(field.fieldId ? {} : { fieldId: uuidv4() }),
                })),
                labelName: group.label?.trim().toLowerCase().replace(/\s+/g, "_"),
              })),
            };
          } else if (Array.isArray(step.form_fields) && step.form_fields.length > 0) {
            // Handle traditional non-grouped stepper form
            steps[stepKey] = {
              label: step.label,
              form_fields: step.form_fields.map((field: any) => ({
                ...field,
                ...field["labelName"].trim().toLowerCase().replace(/\s+/g, "_"),
                // Add fieldId if not present
                ...(field.fieldId ? {} : { fieldId: uuidv4() }),
              })),
            };
          }
        });
      }

      // Update the formProject with restructured steps
      formProject.fields = steps as any;

      logger.debug(
        `${logPrefix} :: Stepper form restructured with ${Object.keys(steps).length} steps`,
      );

      return formProject;
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      throw error;
    }
  },

  /**
   * Validates that the stepper form has valid structure
   * @param fields - The fields object to validate
   * @returns boolean indicating if structure is valid
   */
  isValidStepperStructure: (fields: any): boolean => {
    if (typeof fields !== "object" || Array.isArray(fields)) {
      return false;
    }

    try {
      for (const [stepKey, stepData] of Object.entries(fields)) {
        const step = stepData as any;

        // Check if step has required properties
        if (!step.label || typeof step.label !== "string") {
          return false;
        }

        if (!Array.isArray(step.form_fields) || step.form_fields.length === 0) {
          return false;
        }

        // Check if each form field has required properties
        for (const field of step.form_fields) {
          if (!field.name || typeof field.name !== "string") {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Converts a normal form to stepper format
   * Useful for migration or conversion purposes
   * @param normalFields - Array of form fields
   * @param stepLabel - Label for the step
   * @returns Stepper form structure with single step
   */
  convertNormalToStepper: (
    normalFields: IFormField[],
    stepLabel: string = "Basic Information",
  ): IStepperFormStructure => {
    return {
      step_1: {
        label: stepLabel,
        form_fields: normalFields.map((field) => ({
          name: field.label,
          labelName: field.label.trim().toLowerCase().replace(/\s+/g, "_"),
          fieldType: field.fieldType,
          placeholder: field.placeholder,
          requiredField: field.requiredField,
          options: field.options,
          minLength: field.minLength,
          maxLength: field.maxLength,
          regExPattern: field.regExPattern,
          regExValidationMessage: field.regExValidationMessage,
          fileSize: field.fileSize,
          fileType: field.fileType,
          validations: {},
        })),
      },
    };
  },
};

export default formBuilderHelper;
