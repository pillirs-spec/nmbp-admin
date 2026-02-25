import React from "react";
import { useNavigate } from "react-router-dom";
import Success from "../../../assets/success.svg";

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
    <div className="w-full  flex items-center justify-center p-5 h-[calc(100vh-150px)]">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <img src={Success} alt="Success" className="" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-medium text-[#1B5E20] text-center mb-2">
          Activity Submitted Successfully!
        </h2>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Your Activity under the NASHA MUKT BHARAT ABHIYAAN has been
          successfully submitted.
        </p>

        {/* Activity Summary Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-6 mb-8">
          <h3 className="text-xl font-medium text-[#374151] mb-4">
            {formData.activityType}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#6B7280] mb-1 font-medium">Date</p>
              <p className="text-sm text-[#374151]">{formData.activityDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1 font-medium">
                Participants
              </p>
              <p className="text-sm text-[#374151]">
                {formData.numberOfParticipants}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1 font-medium text-nowrap">
                Number of Educational Institutions
              </p>
              <p className="text-sm text-[#374151]">
                {formData.numberOfEducationalInstitutions}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4">
            <p className="text-xs text-[#6B7280] mb-1 font-medium">Location</p>
            <p className="text-[#374151] text-sm">Harda, Madhya Pradesh</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
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
