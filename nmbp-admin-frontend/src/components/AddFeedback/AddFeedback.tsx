import React from "react";
import { useLogger, useToast } from "../../hooks";
import { LogLevel, ToastType } from "../../enums";
import { useNavigate } from "react-router-dom";
import { useForm, yupResolver } from "@mantine/form";
import addFeedbackValidations from "./addFeedbackValidations";

const AddFeedback = () => {
  const navigate = useNavigate();
  const { log } = useLogger();
  const { showToast } = useToast();

  const form = useForm({
    initialValues: {
      feedback: "",
    },
    validate: yupResolver(addFeedbackValidations.validateAddFeedback()),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = form.validate();
    if (Object.keys(errors.errors).length > 0) {
      showToast(
        "Please fix the validation errors.",
        "Validation Error",
        ToastType.WARNING,
      );
      return;
    }
    console.log("Form submitted", form.values);
    try {
    } catch (error) {
      log(LogLevel.ERROR, "PledgeReportList :: getPledgesList", error);
    }
  };

  return (
    <div className="p-5 mt-40 md:mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#003366]">
              Feedback / Grievances
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Feedback / Grievances (Maximum 200 Characters only){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  maxLength={200}
                  rows={4}
                  //   name="feedback"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="Write your feedback / grievance here"
                  {...form.getInputProps("feedback")}
                />
              </div>
              {form.errors.feedback && (
                <p className="text-red-500 text-xs mt-1">
                  {form.errors.feedback}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-6">
              <button
                type="button"
                className="px-12 py-2 border border-[#003366] text-[#003366] font-[500] rounded-lg text-sm"
                onClick={() => navigate("/feedback")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-12 py-2 bg-[#003366] text-white font-[500] rounded-lg  text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFeedback;
