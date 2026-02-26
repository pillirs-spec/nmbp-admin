import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewEvent = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add delete API call here
    console.log("Activity deleted");
    setShowDeleteModal(false);
    navigate(-1); // Navigate back after deletion
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="p-5 mt-40 md:mt-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-[#374151] hover:text-[#003366] transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-[#374151]">
            Event Details
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="px-6 py-2 border-[1px] border-[#D64539] text-[#D64539] font-[500] rounded-lg hover:bg-red-50 transition text-sm"
        >
          Delete
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB]">
        {/* EVENT DETAILS Section */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                EVENT DETAILS
              </h3>
              <span className="w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Activity Type
                </p>
                <p className="text-sm text-[#374151]">Drawing Competition</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Activity Date
                </p>
                <p className="text-sm text-[#374151]">11/02/2026</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Coordinating Department's Name
                </p>
                <p className="text-sm text-[#374151]">
                  Ministry of Social Justice
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Participants
                </p>
                <p className="text-sm text-[#374151]">80</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Male
                </p>
                <p className="text-sm text-[#374151]">40</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Female
                </p>
                <p className="text-sm text-[#374151]">40</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Number of Educational Institutions
                </p>
                <p className="text-sm text-[#374151]">2</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs text-[#6B7280] font-medium mb-1">
                Description
              </p>
              <p className="text-sm text-[#374151] leading-relaxed">
                A drawing competition was held in the school to raise awareness
                about the harmful effects of smoking and promote a smoke-free
                lifestyle among students.
              </p>
            </div>
          </div>

          {/* LOCATION DETAILS Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                LOCATION DETAILS
              </h3>
              <span className="w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  District
                </p>
                <p className="text-sm text-[#374151]">Harda, Madhya Pradesh</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Location Coordinates
                </p>
                <p className="text-sm text-[#374151]">22.3467, 77.0890</p>
              </div>
            </div>
          </div>

          {/* Divider */}

          {/* UPLOADED PHOTOS/VIDEOS Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#6B7280] uppercase tracking-wide text-nowrap">
                UPLOADED PHOTOS/VIDEOS
              </h3>
              <span className="w-full">
                <hr />
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Image Card 1 */}
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#F9FAFB]">
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
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#F9FAFB]">
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
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg">
            {/* Modal Content */}
            <div className="p-8">
              {/* Alert Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#D64539"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h3 className="text-xl font-semibold text-[#374151] text-center mb-3">
                Are you sure?
              </h3>

              {/* Description */}
              <p className="text-sm text-[#6B7280] text-center mb-6">
                You are about to delete this Activity.
              </p>

              {/* Activity Details */}
              <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
                <h4 className="text-base font-semibold text-[#374151] mb-3">
                  Drawing Competition
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#6B7280] mb-1">Date</p>
                    <p className="text-[#374151] font-medium">11/02/2026</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] mb-1">Participants</p>
                    <p className="text-[#374151] font-medium">80</p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] mb-1">Location</p>
                    <p className="text-[#374151] font-medium">
                      Harda, Madhya Pradesh
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Text */}
              <p className="text-sm text-[#D64539] text-center mb-6">
                This action{" "}
                <span className="font-semibold">cannot be undone.</span>
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-3 border-[1px] border-[#6B7280] text-[#6B7280] font-[500] rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-3 bg-[#D64539] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm"
                >
                  Yes, I want to Delete.
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvent;
