import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddDocument = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    status: "Save and publish",
    documentFile: null as File | null,
  });

  const [fileName, setFileName] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "video/mp4",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Allowed: PDF, JPG, JPEG, PNG, mp4");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        documentFile: file,
      }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here
    navigate(-1);
  };

  return (
    <div className="p-5 mt-40 md:mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#003366]">Add File</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="Title"
                  required
                />
              </div>

              {/* Upload Docs Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Upload Docs <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md bg-white text-[#6B7280] text-sm cursor-pointer hover:bg-gray-50 transition flex items-center">
                    <span className="flex-1 truncate">
                      {fileName || "No file chosen"}
                    </span>
                    <span className="bg-[#E5E7EB] px-3 py-1 rounded text-[#374151] text-xs ml-2">
                      Choose file
                    </span>
                  </div>
                </div>
                <span className="text-[#27682A] text-xs inline-block">
                  (Allowed: PDF, JPG, JPEG, PNG, mp4 | Max Size: 5MB)
                </span>
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm appearance-none bg-white focus:border-[#003366] transition cursor-pointer"
                  required
                >
                  <option value="Save and publish">Save and publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-6">
              <button
                type="submit"
                className="px-12 py-2 border border-[#003366] text-[#003366] font-[500] rounded-lg text-sm"
                onClick={() => navigate("/important-documents")}
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

export default AddDocument;
