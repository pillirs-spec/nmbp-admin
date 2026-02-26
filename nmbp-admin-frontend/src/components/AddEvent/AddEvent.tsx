import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityDetails from "./ActivityDetails/ActivityDetails";
import LocationDetails from "./LocationDetails/LocationDetails";
import UploadFiles from "./UploadFiles/UploadFiles";
import Review from "./Review/Review";
import EventSubmit from "./EventSubmit/EventSubmit";

const AddEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    activityType: "Drawing Competition",
    activityDate: "11/02/2026",
    coordinatingDepartment: "Ministry of Social Justice",
    activityTitle: "Quit Smoking Awareness Drawing Competition",
    numberOfEducationalInstitutions: 2,
    numberOfFemale: 40,
    numberOfMale: 40,
    numberOfParticipants: 80,
    description:
      "A drawing competition was held in the school to raise awareness about the harmful effects of smoking and promote a smoke-free lifestyle among students.",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const steps = [
    { number: 1, label: "Activity Details" },
    { number: 2, label: "Location" },
    { number: 3, label: "Upload Photos/Videos" },
    { number: 4, label: "Review" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSaveAndContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
  };

  console.log("Current Step:", currentStep);

  return (
    <div>
      {formSubmitted ? (
        <EventSubmit formData={formData} />
      ) : (
        <div className="w-full h-full p-2 overflow-y-auto">
          {currentStep === 1 ? (
            <ActivityDetails
              formData={formData}
              handleInputChange={handleInputChange}
              steps={steps}
              currentStep={currentStep}
              handleCancel={handleCancel}
              handleSaveAndContinue={handleSaveAndContinue}
            />
          ) : currentStep === 2 ? (
            <LocationDetails
              formData={formData}
              handleInputChange={handleInputChange}
              steps={steps}
              currentStep={currentStep}
              handleCancel={handleCancel}
              handleSaveAndContinue={handleSaveAndContinue}
            />
          ) : currentStep === 3 ? (
            <UploadFiles
              formData={formData}
              handleInputChange={handleInputChange}
              steps={steps}
              currentStep={currentStep}
              handleCancel={handleCancel}
              handleSaveAndContinue={handleSaveAndContinue}
            />
          ) : (
            <Review
              formData={formData}
              handleInputChange={handleInputChange}
              steps={steps}
              currentStep={currentStep}
              handleCancel={handleCancel}
              handleSaveAndContinue={handleSaveAndContinue}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AddEvent;
