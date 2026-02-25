import React from "react";

interface ReviewProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  steps: { number: number; label: string }[];
  currentStep: number;
  handleCancel: () => void;
  handleSaveAndContinue: () => void;
  handleSubmit: () => void;
}

const Review: React.FC<ReviewProps> = ({
  formData,
  handleInputChange,
  steps,
  currentStep,
  handleCancel,
  handleSaveAndContinue,
  handleSubmit,
}) => {
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
      <div className="bg-[#F9FAFB] rounded-[20px] border border-[#E5E7EB] ">
        {/* Header */}
        <div className="p-6">
          <h2 className="font-semibold text-[##374151] mb-1">
            Review Event Details
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            Please verify all details before final submission.
          </p>
        </div>

        {/* EVENT DETAILS Section */}
        <div className="bg-white p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className=" text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                EVENT DETAILS
              </h3>
              <span className=" w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Activity Type
                </p>
                <p className="text-sm text-[#374151]">
                  {formData.activityType || "Drawing Competition"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Activity Date
                </p>
                <p className="text-sm text-[#374151]">
                  {formData.activityDate || "11/02/2026"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Coordinating Department's Name
                </p>
                <p className="text-sm text-[#374151]">
                  {formData.coordinatingDepartment ||
                    "Ministry of Social Justice"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Participants
                </p>
                <p className="text-sm  text-[#374151]">
                  {formData.numberOfParticipants || "80"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Female
                </p>
                <p className="text-sm text-[#374151]">
                  {formData.numberOfFemale || "40"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Male
                </p>
                <p className="text-sm  text-[#374151]">
                  {formData.numberOfMale || "40"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Educational Institutions
                </p>
                <p className="text-sm text-[#374151]">
                  {formData.numberOfEducationalInstitutions || "2"}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-[#6B7280] font-medium mb-1">
                Description
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">
                {formData.description ||
                  "A drawing competition was held in the school to raise awareness about the harmful effects of smoking and promote a smoke-free lifestyle among students."}
              </p>
            </div>
          </div>

          {/* LOCATION DETAILS Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className=" text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                Location DETAILS
              </h3>
              <span className=" w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  District
                </p>
                <p className="text-sm  text-[#374151]">Harda, Madhya Pradesh</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Location Coordinates
                </p>
                <p className="text-sm text-[#374151]">22.3467, 77.0890</p>
              </div>
            </div>
          </div>

          {/* UPLOADED PHOTOS/VIDEOS Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className=" text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                UPLOADED PHOTOS/VIDEOS
              </h3>
              <span className=" w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 ">
              {/* Image Card 1 */}
              <div className="h-60 border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#F9FAFB]">
                <div className="h-44 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-3xl">
                  🖼️
                </div>
                <div className="p-3 bg-white border-t border-[#E5E7EB]">
                  <p className="text-[13px] font-semibold text-[#374151] truncate mb-1">
                    Activity_Name_DD/MM/YYYY.jpg
                  </p>
                  <p className="text-xs text-[#6B7280]">1.8 Mb</p>
                </div>
              </div>

              {/* Image Card 2 */}
              <div className="h-60 border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#F9FAFB]">
                <div className="h-44 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-3xl">
                  🖼️
                </div>
                <div className="p-3 bg-white border-t border-[#E5E7EB]">
                  <p className="text-[13px] font-medium text-[#374151] truncate mb-1">
                    Activity_Name_DD/MM/YYYY.jpg
                  </p>
                  <p className="text-xs text-[#6B7280]">1.8 Mb</p>
                </div>
              </div>
            </div>
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
            onClick={handleSubmit}
            className="px-8 py-2 bg-[#27682A] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm flex items-center gap-2"
          >
            Submit Activity <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
