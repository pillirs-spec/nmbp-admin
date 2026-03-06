import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import LockImage from "../../../assets/lock.svg";
import dashboardListService from "../../../pages/Admin/DashboardManagement/DashboardList/dashboardListService";
import { useToast } from "../../../hooks";

interface ActivityDetailsProps {
  formData: {
    activityType: string;
    activityDate: string;
    coordinatingDepartment: string;
    activityTitle: string;
    numberOfEducationalInstitutions: number;
    numberOfFemale: number;
    numberOfMale: number;
    numberOfParticipants: number;
    description: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  steps: { number: number; label: string }[];
  currentStep: number;
  handleCancel: () => void;
  handleSaveAndContinue: () => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  formData,
  handleInputChange,
  steps,
  currentStep,
  handleCancel,
  handleSaveAndContinue,
}) => {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showToast } = useToast();

  // Validation schema
  const validationSchema = Yup.object().shape({
    activityType: Yup.string().required("Activity Type is required"),
    activityDate: Yup.string().required("Activity Date is required"),
    coordinatingDepartment: Yup.string().required(
      "Coordinating Department is required",
    ),
    activityTitle: Yup.string().required("Activity Title is required"),
    numberOfEducationalInstitutions: Yup.number()
      .min(
        1,
        "Number of Educational Institutions is mandatory and must be greater than 0",
      )
      .required("Number of Educational Institutions is required"),
    numberOfFemale: Yup.number()
      .min(1, "Number of Female is mandatory and must be greater than 0")
      .required("Number of Female is required"),
    numberOfMale: Yup.number()
      .min(1, "Number of Male is mandatory and must be greater than 0")
      .required("Number of Male is required"),
  });

  // Validate form
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors = {} as { [key: string]: string };
      if (err.inner) {
        err.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSaveAndContinueWithValidation = async () => {
    const isValid = await validateForm();
    if (isValid) {
      showToast("Activity details validated successfully", "success");
      handleSaveAndContinue();
    } else {
      showToast("Please fill all mandatory fields correctly", "error");
    }
  };
  const getActivities = async () => {
    try {
      const response = await dashboardListService.activitiesList();
      if (response.status === 200) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Handle input change with auto-calculation of participants
  const handleInputChangeWithCalculation = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleInputChange(e);

    // Auto-calculate numberOfParticipants when female or male count changes
    if (name === "numberOfFemale" || name === "numberOfMale") {
      const femaleCount =
        name === "numberOfFemale"
          ? parseInt(value) || 0
          : parseInt(String(formData.numberOfFemale)) || 0;
      const maleCount =
        name === "numberOfMale"
          ? parseInt(value) || 0
          : parseInt(String(formData.numberOfMale)) || 0;

      // Trigger the calculation through a synthetic event
      const syntheticEvent = {
        target: {
          name: "numberOfParticipants",
          value: (femaleCount + maleCount).toString(),
        },
      } as any;
      handleInputChange(syntheticEvent);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div className="p-5">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center px-20">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-semibold text-sm ${
                  currentStep > step.number
                    ? "bg-[#27682A] text-white"
                    : currentStep === step.number
                      ? "bg-white text-[#27682A] border-2 border-[#27682A]"
                      : "bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {currentStep > step.number ? (
                  <span className="text-white">✓</span>
                ) : (
                  step.number
                )}
              </div>
              <p
                className={`text-xs font-medium text-center ${
                  currentStep >= step.number
                    ? "text-[#27682A]"
                    : "text-[#6B7280]"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-4 mt-[-24px] ${
                  currentStep > step.number ? "bg-[#27682A]" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-[#F9FAFB] rounded-[20px] border border-[#E5E7EB]">
        {/* Form Header */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className=" font-semibold text-[#374151] mb-1">
            Activity Details
          </h2>
          <p className="text-sm text-[#6B7280]">
            Please provide activity details required for submission.
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6 bg-white">
          {/* Row 1: Activity Type, Activity Date, Coordinating Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Activity Type <span className="text-red-500">*</span>
              </label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm bg-white focus:border-[#003366] transition ${
                  errors.activityType
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
              >
                <option value="">Select Activity</option>
                {activities.map((activity) => (
                  <option
                    key={activity.activity_id}
                    value={activity.activity_id}
                  >
                    {activity.activity_name}
                  </option>
                ))}
              </select>
              {errors.activityType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityType}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Activity Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="activityDate"
                value={formData.activityDate}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.activityDate
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
              />
              {errors.activityDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Coordinating Department's Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="coordinatingDepartment"
                value={formData.coordinatingDepartment}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.coordinatingDepartment
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
                placeholder="Ministry of Social Justice"
              />
              {errors.coordinatingDepartment && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.coordinatingDepartment}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Activity Title */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Activity Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="activityTitle"
                value={formData.activityTitle}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.activityTitle
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
                placeholder="Enter activity title"
              />
              {errors.activityTitle && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityTitle}
                </p>
              )}
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Number of Educational Institutions{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfEducationalInstitutions"
                value={formData.numberOfEducationalInstitutions}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.numberOfEducationalInstitutions
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
                placeholder="0"
              />
              {errors.numberOfEducationalInstitutions && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfEducationalInstitutions}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Number of Educational Institutions, Female, Male, Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Number of Female <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfFemale"
                value={formData.numberOfFemale}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.numberOfFemale
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
                placeholder="0"
              />
              {errors.numberOfFemale && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfFemale}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Number of Male <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfMale"
                value={formData.numberOfMale}
                onChange={handleInputChangeWithCalculation}
                className={`w-full px-4 py-2 border rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition ${
                  errors.numberOfMale
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB]"
                }`}
                placeholder="0"
              />
              {errors.numberOfMale && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfMale}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Number of Participants{" "}
                <img src={LockImage} alt="lock-image" className="inline ml-1" />
              </label>
              <input
                type="number"
                name="numberOfParticipants"
                value={formData.numberOfParticipants}
                disabled
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm bg-[#F9FAFB] cursor-not-allowed"
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Auto-calculated (Female + Male)
              </p>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChangeWithCalculation}
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
              placeholder="Enter description"
              rows={4}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border-[1px] border-[#003366] text-[#003366] font-[500] rounded-lg hover:bg-blue-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndContinueWithValidation}
            className="px-8 py-2 bg-[#003366] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm flex items-center gap-2"
          >
            Save and Continue <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
