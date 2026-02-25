import React, { useState } from "react";
import LockIcon from "../../../assets//lock.svg";

interface LocationDetailsProps {
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
}

const LocationDetails: React.FC<LocationDetailsProps> = ({
  formData,
  handleInputChange,
  steps,
  currentStep,
  handleCancel,
  handleSaveAndContinue,
}) => {
  const [district, setDistrict] = useState<string>("Harda");
  const [latitude, setLatitude] = useState<string>("22.3467");
  const [longitude, setLongitude] = useState<string>("77.0890");

  return (
    <div className="p-5">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center">
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
        <div className="p-6">
          <h2 className="font-semibold text-[#374151] mb-1">
            Upload Images/Videos
          </h2>
          <p className="text-sm text-[#6B7280]">
            Please provide location details for geo-tagging
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Section - Form Fields */}
            <div className="space-y-6">
              {/* District Field */}
              <div className="">
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  District <span className="text-red-500">*</span>{" "}
                  <img src={LockIcon} alt="Locked" className="inline" />
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-md outline-none text-[#374151] text-sm appearance-none bg-[#F3F4F6] focus:border-[#003366] transition"
                >
                  <option>Harda</option>
                  <option>Amroha</option>
                  <option>Auraiya</option>
                  <option>Ayodhya</option>
                  <option>Azamgarh</option>
                </select>
              </div>

              {/* Location Coordinates Section */}
              <div>
                <h3 className="text-sm font-medium text-[#374151] mb-4">
                  Location Coordinates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                      placeholder="22.3467"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                      placeholder="77.0890"
                    />
                  </div>
                </div>
              </div>

              {/* Instructional Text */}
              <div className="text-xs text-[#6B7280] space-y-2">
                <p className="font-medium">
                  You can select the location in any of the following ways:
                </p>
                <ul className="list-none space-y-1 pl-0">
                  <li>
                    • Click "Use This Location" to automatically capture your
                    GPS location.
                  </li>
                  <li>
                    • Drag the map and place the pin to select the activity
                    location manually.
                  </li>
                  <li>
                    • Enter coordinates or address details below Location
                    Coordinates section if location services are unavailable.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section - Map Display */}
            <div className="space-y-4">
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg overflow-hidden">
                {/* Map Container - This would be replaced with actual map component */}
                <div className="relative h-[400px] bg-gray-200">
                  {/* Placeholder for Map */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#6B7280] text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p>Map View</p>
                    </div>
                  </div>

                  {/* Map Pin Marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-4 bg-[#003366]"></div>
                    </div>
                  </div>
                </div>

                {/* Location Info Card */}
                <div className="bg-white p-4 border-t border-[#E5E7EB]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#003366] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#374151] mb-1">
                        Govt Excellence School Harda
                      </h4>
                      <p className="text-xs text-[#6B7280] leading-relaxed">
                        Chimpaner Rd, Kukrawad, Harda, Madhya Pradesh 461331
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use This Location Button */}
              <button
                onClick={handleSaveAndContinue}
                className="w-full px-6 py-3 bg-[#003366] text-white font-medium rounded-lg hover:opacity-90 transition text-sm flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Use This Location
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border-[1px] border-[#003366] text-[#003366] font-[500] rounded-lg hover:bg-blue-50 transition text-sm"
          >
            Back
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

export default LocationDetails;
