import React from "react";
import { useNavigate } from "react-router-dom";

interface EventSubmitProps {
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
}

const EventSubmit: React.FC<EventSubmitProps> = ({ formData }) => {
  const navigate = useNavigate();

  const handleSubmitNew = () => {
    window.location.reload();
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#27682A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-semibold text-[#27682A] text-center mb-2">
          Activity Submitted Successfully!
        </h2>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Your Activity under the NASHA MUKT BHARAT ABHIYAAN has been
          successfully submitted.
        </p>

        {/* Activity Summary Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#374151] mb-4">
            {formData.activityType}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Date</p>
              <p className="font-medium text-[#374151]">
                {formData.activityDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Participants</p>
              <p className="font-medium text-[#374151]">
                {formData.numberOfParticipants}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">
                Number of Educational Institutions
              </p>
              <p className="font-medium text-[#374151]">
                {formData.numberOfEducationalInstitutions}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-xs text-[#6B7280] mb-1">Location</p>
            <p className="font-medium text-[#374151]">Harda, Madhya Pradesh</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmitNew}
            className="px-6 py-2 border-[1px] border-[#003366] text-[#003366] font-[500] rounded-lg hover:bg-blue-50 transition text-sm flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Submit New Event
          </button>
          <button
            onClick={handleReturnToDashboard}
            className="px-8 py-2 bg-[#003366] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSubmit;
