import React, { useEffect, useState } from "react";
import { formService } from "./formService";
import "./Form.css";

const FORM_TYPES = {
  STEPPER_FORM: "STEPPER_FORM",
  NORMAL_FORM: "NORMAL_FORM",
} as const;

interface FormField {
  fieldId: string;
  label?: string;
  labelName?: string;
  fieldType: string;
  placeholder?: string;
  requiredField?: boolean;
  options?: unknown[];
  minLength?: string;
  maxLength?: string;
}
interface StepperFormField {
  label: string;
  labelName?: string;
  fieldType: string;
  placeholder?: string;
  requiredField?: boolean;
  options?: unknown[];
  fieldId: string;
  minLength?: string;
  maxLength?: string;
}

interface FormGroup {
  label: string;
  labelName: string;
  form_fields: StepperFormField[];
}

interface StepperStep {
  label: string;
  form_fields?: StepperFormField[];
  groups?: FormGroup[];
}

interface FormData {
  formName: string;
  type?: string;
  fields?: FormField[] | Record<string, StepperStep>;
}

const Form = () => {
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const tenantId = import.meta.env.VITE_TENANT_ID as string;
  const projectId = import.meta.env.VITE_PROJECT_ID as string;
  // const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = {
          tenantId,
          projectId,
          formName: "Stepper Form",
        };
        const response = await formService.getFormByIdentifiers(payload);
        if (response.status === 200) {
          const responseData = (response.data as { data: FormData }).data;

          setForm(responseData);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenantId, projectId]);

  if (loading) return <div className="container">Loading...</div>;
  if (!form) return <div className="container">No form found</div>;

  const isStepperForm = form.type === FORM_TYPES.STEPPER_FORM;

  // Get stepper steps if it's a stepper form
  const stepperSteps =
    isStepperForm &&
    form.fields &&
    typeof form.fields === "object" &&
    !Array.isArray(form.fields)
      ? Object.entries(form.fields as Record<string, StepperStep>).map(
          ([key, value]) => ({
            key,
            ...value,
          }),
        )
      : [];

  const totalSteps = stepperSteps.length;

  if (loading) return <div className="container">Loading...</div>;
  if (!form) return <div className="container">No form found</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) return;
    try {
      setSubmitting(true);
      const fd = new FormData(e.currentTarget);
      const data: Record<string, unknown> = {};

      if (isStepperForm && stepperSteps.length > 0) {
        // Stepper form: submit current step only
        const currentStepData = stepperSteps[currentStep];

        // Check if step has groups
        if (currentStepData.groups && currentStepData.groups.length > 0) {
          // If groups exist, collect data organized by groups
          const groupsData = currentStepData.groups.map((group) => {
            const groupFormData: Record<string, unknown> = {};
            for (const f of group.form_fields || []) {
              const fieldId = f.fieldId;
              const labelName = f.labelName || fieldId;
              const options = Array.isArray(f.options)
                ? f.options
                    .map((o: unknown) => String(o).trim())
                    .filter((o: string) => o.length > 0)
                : [];
              if (f.fieldType === "checkbox") {
                if (options.length > 0) {
                  groupFormData[labelName] = fd.getAll(fieldId);
                } else {
                  groupFormData[labelName] = fd.get(fieldId) === "on";
                }
              } else if (f.fieldType === "radio") {
                groupFormData[labelName] = fd.get(fieldId) ?? null;
              } else if (f.fieldType === "file") {
                const file = fd.get(fieldId) as File | null;
                groupFormData[labelName] =
                  file instanceof File ? file.name : null;
              } else {
                groupFormData[labelName] = fd.get(fieldId) ?? "";
              }
            }
            return {
              label: group.labelName,
              data: groupFormData,
            };
          });
          data["groups"] = groupsData;
        } else {
          // Legacy: if no groups, collect from form_fields directly
          for (const f of currentStepData.form_fields || []) {
            const fieldId = f.fieldId;
            const labelName = f.labelName || fieldId;
            const options = Array.isArray(f.options)
              ? f.options
                  .map((o: unknown) => String(o).trim())
                  .filter((o: string) => o.length > 0)
              : [];
            if (f.fieldType === "checkbox") {
              if (options.length > 0) {
                data[labelName] = fd.getAll(fieldId);
              } else {
                data[labelName] = fd.get(fieldId) === "on";
              }
            } else if (f.fieldType === "radio") {
              data[labelName] = fd.get(fieldId) ?? null;
            } else if (f.fieldType === "file") {
              const file = fd.get(fieldId) as File | null;
              data[labelName] = file instanceof File ? file.name : null;
            } else {
              data[labelName] = fd.get(fieldId) ?? "";
            }
          }
        }

        const payload = {
          tenantId,
          projectId,
          formName: form.formName,
          formData: data,
        };
        // Pass current step key as query param
        const response = await formService.createApiBuilderForm(
          payload,
          currentStepData.key,
        );
        if (response.status === 201 || response.status === 200) {
          if (currentStep < totalSteps - 1) {
            alert(`Step ${currentStep + 1} saved successfully!`);
            setCurrentStep(currentStep + 1);
          } else {
            alert("Form submitted successfully!");
            setCurrentStep(0);
          }
        } else {
          alert("Error submitting form");
        }
      } else {
        // Normal form: submit all fields at once
        console.log(form.fields);
        const normalFields = Array.isArray(form.fields)
          ? (form.fields as FormField[])
          : [];
        for (const f of normalFields) {
          const fieldId = f.fieldId;
          const label = f.labelName || fieldId;
          const options = Array.isArray(f.options)
            ? f.options
                .map((o: unknown) => String(o).trim())
                .filter((o: string) => o.length > 0)
            : [];
          if (f.fieldType === "checkbox") {
            if (options.length > 0) {
              data[label] = fd.getAll(fieldId);
            } else {
              data[label] = fd.get(fieldId) === "on";
            }
          } else if (f.fieldType === "radio") {
            data[label] = fd.get(fieldId) ?? null;
          } else if (f.fieldType === "file") {
            const file = fd.get(fieldId) as File | null;
            data[label] = file instanceof File ? file.name : null;
          } else {
            data[label] = fd.get(fieldId) ?? "";
          }
        }

        const payload = {
          tenantId,
          projectId,
          formName: form.formName,
          formData: data,
        };
        const response = await formService.createApiBuilderForm(payload);
        if (response.status === 201) {
          alert("Form submitted successfully");
        } else {
          alert("Error submitting form");
        }
      }
    } catch (err: unknown) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to render a form field
  const renderFormField = (f: FormField | StepperFormField) => {
    const requiredMark = f.requiredField ? (
      <span style={{ color: "#dc2626" }}>*</span>
    ) : null;
    const options = Array.isArray(f.options)
      ? f.options
          .map((o: unknown) => String(o).trim())
          .filter((o: string) => o.length > 0)
      : [];

    return (
      <div key={f.fieldId} className="formGroup">
        <label className="label">
          {f.label} {requiredMark}
        </label>
        {["text", "email", "password", "date", "number"].includes(
          f.fieldType,
        ) ? (
          <input
            type={f.fieldType}
            className="input"
            placeholder={f.placeholder}
            required={f.requiredField}
            minLength={f.minLength ? parseInt(f.minLength) : undefined}
            maxLength={f.maxLength ? parseInt(f.maxLength) : undefined}
            name={f.fieldId}
          />
        ) : f.fieldType === "textarea" ? (
          <textarea
            className="textarea"
            placeholder={f.placeholder}
            required={f.requiredField}
            minLength={f.minLength ? parseInt(f.minLength) : undefined}
            maxLength={f.maxLength ? parseInt(f.maxLength) : undefined}
            name={f.fieldId}
          />
        ) : f.fieldType === "dropdown" ? (
          <select
            className="select"
            required={f.requiredField}
            name={f.fieldId}
          >
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : f.fieldType === "checkbox" ? (
          <div className="controlGroup">
            {options.length > 0 ? (
              options.map((opt: string) => (
                <label key={opt} className="control">
                  <input type="checkbox" value={opt} name={f.fieldId} /> {opt}
                </label>
              ))
            ) : (
              <label className="control">
                <input type="checkbox" name={f.fieldId} /> {f.label}
              </label>
            )}
          </div>
        ) : f.fieldType === "radio" ? (
          <div className="controlGroup">
            {options.map((opt: string) => (
              <label key={opt} className="control">
                <input type="radio" name={f.fieldId} value={opt} /> {opt}
              </label>
            ))}
          </div>
        ) : f.fieldType === "file" ? (
          <input type="file" className="input" name={f.fieldId} />
        ) : (
          <input
            className="input"
            placeholder={f.placeholder}
            required={f.requiredField}
            minLength={f.minLength ? parseInt(f.minLength) : undefined}
            maxLength={f.maxLength ? parseInt(f.maxLength) : undefined}
            name={f.fieldId}
          />
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2 className="formTitle">{form.formName}</h2>
          {isStepperForm ? (
            <>
              {/* Stepper Progress */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  {stepperSteps.map((step, index) => (
                    <div
                      key={step.key}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor:
                            index <= currentStep ? "#0000FF" : "#E5E7EB",
                          color: index <= currentStep ? "white" : "#6B7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 8px",
                          fontWeight: "600",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: index <= currentStep ? "#0000FF" : "#6B7280",
                          fontWeight: index === currentStep ? "600" : "400",
                        }}
                      >
                        {step.label}
                      </div>
                      {index < stepperSteps.length - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "16px",
                            left: "50%",
                            width: "100%",
                            height: "2px",
                            backgroundColor:
                              index < currentStep ? "#0000FF" : "#E5E7EB",
                            zIndex: -1,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Current Step Fields */}
              {totalSteps > 0 && stepperSteps[currentStep] && (
                <div style={{ marginTop: "16px" }}>
                  {stepperSteps[currentStep].groups &&
                  stepperSteps[currentStep].groups!.length > 0
                    ? // Render groups if they exist
                      stepperSteps[currentStep].groups!.map(
                        (group: FormGroup, groupIndex: number) => (
                          <div
                            key={groupIndex}
                            style={{ marginBottom: "24px" }}
                          >
                            <h3
                              style={{
                                marginBottom: "16px",
                                color: "#1F2937",
                                fontSize: "16px",
                                fontWeight: "600",
                              }}
                            >
                              {group.label}
                            </h3>
                            <div
                              style={{
                                paddingLeft: "16px",
                                borderLeft: "2px solid #E5E7EB",
                              }}
                            >
                              {group.form_fields?.map((f: StepperFormField) =>
                                renderFormField(f),
                              )}
                            </div>
                          </div>
                        ),
                      )
                    : // Fallback to direct form_fields if no groups
                      stepperSteps[currentStep].form_fields?.map(
                        (f: StepperFormField) => renderFormField(f),
                      )}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  className="primaryBtn cursor-pointer"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  style={{
                    backgroundColor: currentStep === 0 ? "#E5E7EB" : "#6B7280",
                    cursor: currentStep === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="primaryBtn cursor-pointer"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : currentStep === totalSteps - 1
                      ? "Submit"
                      : "Next"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Normal Form */}
              {(form.fields as FormField[])?.map((f: FormField) =>
                renderFormField(f),
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button
                  type="submit"
                  className="primaryBtn cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
