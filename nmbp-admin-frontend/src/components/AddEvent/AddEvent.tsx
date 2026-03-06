import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityDetails from "./ActivityDetails/ActivityDetails";
import LocationDetails from "./LocationDetails/LocationDetails";
import UploadFiles from "./UploadFiles/UploadFiles";
import Review from "./Review/Review";
import EventSubmit from "./EventSubmit/EventSubmit";
import addEventService from "./addEventService";
import { useLogger, useToast } from "../../hooks";
import { LogLevel, ToastType } from "../../enums";

const AddEvent = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { log } = useLogger();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State to store event_id
  const [eventId, setEventId] = useState<string>("");

  // Form data matching child component expectations
  const [formData, setFormData] = useState({
    activityType: "",
    activityDate: "",
    coordinatingDepartment: "",
    activityTitle: "",
    numberOfEducationalInstitutions: 0,
    numberOfFemale: 0,
    numberOfMale: 0,
    numberOfParticipants: 0,
    description: "",
    state_id: "",
    state_name: "",
    district_id: "",
    district_name: "",
    latitude: "",
    longitude: "",
    media_files: [] as File[],
  });

  const steps = [
    { number: 1, label: "Activity Details" },
    { number: 2, label: "Location" },
    { number: 3, label: "Upload Photos/Videos" },
    { number: 4, label: "Review" },
  ];

  // Load draft event on mount
  useEffect(() => {
    const loadDraft = async () => {
      let draftEventId = localStorage.getItem("draft_event_id");

      // If no draft_event_id in localStorage, check for user's draft events
      if (!draftEventId) {
        try {
          setIsLoading(true);
          const draftsResponse = await addEventService.listDraftEvents({
            pageSize: 1,
            pageNumber: 1,
          });

          if (draftsResponse.data?.data?.events?.length > 0) {
            // Get the most recent draft event
            const mostRecentDraft = draftsResponse.data.data.events[0];
            draftEventId = mostRecentDraft.event_id;
            if (draftEventId) {
              localStorage.setItem("draft_event_id", draftEventId);
              log(
                LogLevel.INFO,
                "AddEvent :: Found existing draft",
                draftEventId,
              );
            }
          } else {
            // No drafts found, user is starting fresh
            setIsLoading(false);
            return;
          }
        } catch (error: any) {
          log(LogLevel.ERROR, "AddEvent :: Failed to fetch drafts", error);
          setIsLoading(false);
          return;
        }
      }

      // Load the draft event by ID
      if (draftEventId) {
        try {
          setIsLoading(true);
          const response = await addEventService.getEventById(draftEventId);
          const eventData = response.data.data;

          setEventId(eventData.event_id || "");

          setFormData({
            activityType: eventData.activity_id?.toString() || "",
            activityDate: eventData.activity_date
              ? new Date(eventData.activity_date).toISOString().split("T")[0]
              : "",
            coordinatingDepartment:
              eventData.coordinating_department_name || "",
            activityTitle: eventData.activity_title || "",
            numberOfEducationalInstitutions:
              eventData.number_of_educational_institutions || 0,
            numberOfFemale: eventData.number_of_female || 0,
            numberOfMale: eventData.number_of_male || 0,
            numberOfParticipants: eventData.number_of_participants || 0,
            description: eventData.description || "",
            state_id: eventData.state_id?.toString() || "",
            state_name: eventData.state_name || "",
            district_id: eventData.district_id?.toString() || "",
            district_name: eventData.district_name || "",
            latitude: eventData.latitude?.toString() || "",
            longitude: eventData.longitude?.toString() || "",
            media_files: [],
          });

          // Determine step to resume
          // if (eventData.media_files?.length > 0) {
          //   setCurrentStep(4);
          //   showToast("Draft loaded. Review and submit.", ToastType.INFO);
          // } else if (eventData.latitude && eventData.longitude) {
          //   setCurrentStep(3);
          //   showToast("Draft loaded. Continue from upload.", ToastType.INFO);
          // } else if (eventData.activity_id) {
          //   setCurrentStep(2);
          //   showToast("Draft loaded. Continue from location.", ToastType.INFO);
          // } else {
          //   showToast("Draft loaded.", ToastType.INFO);
          // }

          log(LogLevel.INFO, "AddEvent :: Draft loaded", eventData);
        } catch (error: any) {
          log(LogLevel.ERROR, "AddEvent :: Draft load failed", error);
          localStorage.removeItem("draft_event_id");
          showToast("Failed to load draft.", ToastType.ERROR);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSaveAndContinue = async () => {
    if (currentStep >= 4) return;

    try {
      setIsLoading(true);

      const currentEventId =
        eventId || localStorage.getItem("draft_event_id") || undefined;

      // For step 2+, event_id must exist
      if (currentStep > 1 && !currentEventId) {
        showToast(
          "Error: Draft ID not found. Start from Step 1.",
          ToastType.ERROR,
        );
        log(
          LogLevel.ERROR,
          "AddEvent :: Missing event_id for step " + currentStep,
        );
        setIsLoading(false);
        return;
      }

      let payload: any = {
        event_id: currentEventId,
        event_submitted: false,
      };

      // STEP 1: Map frontend field names to backend API field names
      if (currentStep === 1) {
        payload = {
          ...payload,
          activity_id: formData.activityType,
          activity_date: formData.activityDate,
          activity_title: formData.activityTitle,
          coordinating_department_name: formData.coordinatingDepartment,
          number_of_participants: formData.numberOfParticipants,
          number_of_female: formData.numberOfFemale,
          number_of_male: formData.numberOfMale,
          number_of_educational_institutions:
            formData.numberOfEducationalInstitutions,
          description: formData.description,
        };
      }
      // STEP 2: Location fields
      else if (currentStep === 2) {
        payload = {
          ...payload,
          state_id: formData.state_id,
          district_id: formData.district_id,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };
      }
      // STEP 3: Media files
      else if (currentStep === 3) {
        payload = {
          ...payload,
          media_files: formData.media_files,
        };
      }

      const response = await addEventService.addEvent(payload);

      if (response.status === 200 || response.status === 201) {
        const newEventId = response.data.data?.event?.event_id;

        // Save event_id from first step
        if (currentStep === 1 && newEventId) {
          setEventId(newEventId);
          localStorage.setItem("draft_event_id", newEventId);
          log(LogLevel.INFO, "AddEvent :: Event created with ID", newEventId);
        }

        // Clear media files from formData after successful upload
        if (currentStep === 3 && response.data?.media) {
          setFormData((prev) => ({ ...prev, media_files: [] }));
        }

        showToast(`Step ${currentStep} saved as draft.`, ToastType.SUCCESS);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error: any) {
      log(LogLevel.ERROR, `AddEvent :: Step ${currentStep} save failed`, error);
      showToast(
        error?.response?.data?.errorMessage ||
          `Failed to save step ${currentStep}.`,
        ToastType.ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const currentEventId = eventId || localStorage.getItem("draft_event_id");

      if (!currentEventId) {
        showToast("Error: Event ID not found.", ToastType.ERROR);
        log(LogLevel.ERROR, "AddEvent :: Missing event_id for submit");
        setIsLoading(false);
        return;
      }

      const payload: any = {
        event_id: currentEventId,
        event_submitted: true,
      };

      const response = await addEventService.addEvent(payload);

      if (response.status === 200 || response.status === 201) {
        log(LogLevel.INFO, "AddEvent :: Event submitted", response.data);
        localStorage.removeItem("draft_event_id");
        showToast("Event submitted successfully!", ToastType.SUCCESS);
        setFormSubmitted(true);
      }
    } catch (error: any) {
      log(LogLevel.ERROR, "AddEvent :: Submit failed", error);
      showToast(
        error?.response?.data?.errorMessage || "Failed to submit event.",
        ToastType.ERROR,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && currentStep === 1 && !formData.activityType) {
    return <div className="p-4 text-center">Loading draft...</div>;
  }

  return (
    <div>
      {formSubmitted ? (
        <EventSubmit formData={formData} />
      ) : (
        <div className="w-full h-full p-2 overflow-y-auto">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded">Saving...</div>
            </div>
          )}
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
              setFormData={setFormData}
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
