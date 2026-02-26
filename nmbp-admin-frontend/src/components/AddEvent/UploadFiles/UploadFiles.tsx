import React, { useState } from "react";
import EditIcon from "../../../assets/edit.svg";
import DeleteIcon from "../../../assets/delete.svg";
import UploadFile from "../../../assets/upload.svg";

interface UploadFilesProps {
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

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  url: string;
  type: "image" | "video";
}

const UploadFiles: React.FC<UploadFilesProps> = ({
  formData,
  handleInputChange,
  steps,
  currentStep,
  handleCancel,
  handleSaveAndContinue,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 1,
      name: "Activity_Name_DD/MM/YYYY.jpg",
      size: "1.8 MB",
      url: "/path/to/image1.jpg",
      type: "image",
    },
    {
      id: 2,
      name: "Activity_Name_DD/MM/YYYY.jpg",
      size: "1.8 MB",
      url: "/path/to/image2.jpg",
      type: "image",
    },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newFile: UploadedFile = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
            url: event.target?.result as string,
            type: file.type.startsWith("image") ? "image" : "video",
          };
          setUploadedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleEditFile = (id: number) => {
    console.log("Edit file:", id);
  };

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
        {/* Header */}
        <div className="mb-6 p-6">
          <h2 className="font-semibold text-[#374151] mb-1">
            Upload Photos/Videos
          </h2>
          <p className="text-sm text-[#6B7280]">
            Submit supporting evidence for the event
          </p>
        </div>

        {/* Upload Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6 bg-white p-6">
          {/* Uploaded Files */}
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="relative border border-[#E5E7EB] rounded-lg overflow-hidden"
            >
              {/* Image Preview */}
              <div className="h-48 bg-[#F9FAFB] flex items-center justify-center">
                {file.type === "image" ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-4xl">
                    🖼️
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-4xl">
                    🎥
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex justify-between items-center">
                <div className="p-3 bg-white ">
                  <p className="text-sm font-medium text-[#374151] truncate mb-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#6B7280]">{file.size}</p>
                </div>
                <div className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEditFile(file.id)}
                    className="w-8 h-8  flex items-center justify-center  hover:bg-gray-100 hover:rounded-lg transition"
                  >
                    <img src={EditIcon} alt="edit" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-8 h-8 flex items-center justify-center  hover:bg-red-50 hover:rounded-lg transition"
                  >
                    <img src={DeleteIcon} alt="delete" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="relative border-2 border-dashed border-[#E5E7EB] rounded-lg bg-[#F9FAFB] hover:bg-gray-50 transition cursor-pointer flex items-center justify-center min-h-[280px]">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-[#E5E7EB] rounded-full flex items-center justify-center mb-4">
                <img src={UploadFile} alt="upload-icon" />
              </div>
              <p className="text-sm font-semibold text-[#374151] mb-1 text-center">
                Click to Upload Photos/Videos
              </p>
              <p className="text-xs text-[#6B7280] font-medium text-center">
                PNG, JPG, MP4 (Max 10 MB)
              </p>
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

export default UploadFiles;
