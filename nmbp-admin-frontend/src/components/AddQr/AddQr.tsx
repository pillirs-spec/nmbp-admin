import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadIcon from "../../assets/upload.svg";

const AddQr = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: "Drawing Competition",
    assignedTo: "Ministry of Social Justice",
    activeStatus: "2",
    qrImage: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        qrImage: file,
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    navigate(-1);
  };

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="p-5">
        <div className="bg-[#F3F4F6] rounded-2xl  border border-[#E5E7EB]">
          {/* Header */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-[#374151] mb-2">
              Add QR Code
            </h2>
            <p className="text-sm text-[#6B7280]">
              Please provide QR Code details required for submission.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 p-6 bg-white">
            {/* URL Field */}

            {/* Assigned to and Active Status - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <select
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm appearance-none bg-white focus:border-[#003366] transition"
                >
                  <option>Drawing Competition</option>
                  <option>Slogan Writing</option>
                  <option>Nukkad Natak</option>
                  <option>Marathon Run</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Assigned to <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="Ministry of Social Justice"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Active Status <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="activeStatus"
                  value={formData.activeStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="2"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                QR Code Image
              </label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-12 flex flex-col items-center justify-center bg-[#F9FAFB] hover:bg-gray-50 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-24 w-24 object-cover mb-3 rounded"
                    />
                    <p className="text-sm font-medium text-[#374151]">
                      Image uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-[#E5E7EB] rounded-full p-3 mb-3">
                      <img src={UploadIcon} alt="upload-icon" />
                    </div>
                    <p className="text-sm font-semibold text-[#374151]">
                      Click to Upload QR Code Image
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1 font-medium">
                      PNG, JPG (Max 1 MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center p-6 ">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border-[1px] border-[#003366] text-[#003366] font-[500] rounded-lg hover:bg-blue-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-[#003366] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm flex items-center gap-2"
            >
              Submit
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQr;
