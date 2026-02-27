import React, { useEffect } from "react";
import LockImage from "../../../assets/lock.svg";
import dashboardListService from "../../../pages/Admin/DashboardManagement/DashboardList/dashboardListService";

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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm appearance-none bg-white focus:border-[#003366] transition"
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
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Activity Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="activityDate"
                value={formData.activityDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
              />
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                placeholder="Ministry of Social Justice"
              />
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                placeholder="Enter activity title"
              />
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                placeholder="0"
              />
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Number of Male <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numberOfMale"
                value={formData.numberOfMale}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                placeholder="0"
              />
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
              onChange={handleInputChange}
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
            onClick={handleSaveAndContinue}
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
