import React, { useEffect, useState, useCallback, useRef } from "react";
import * as Yup from "yup";
import LocationMap from "./LocationMap";
import { useLogger, useToast } from "../../../hooks";
import usersListService from "../../../pages/Admin/UserManagement/UserList/usersListService";
import { LogLevel, ToastType } from "../../../enums";

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
  const [latitude, setLatitude] = useState<string>(
    formData.latitude || "22.3467",
  );
  const [longitude, setLongitude] = useState<string>(
    formData.longitude || "77.0890",
  );

  const [selectedState, setSelectedState] = useState<string>(
    formData.state_id || "",
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    formData.district_id || "",
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [selectedStateName, setSelectedStateName] = useState<string>("");
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const lastGeocodedDistrict = useRef<string | null>(null);
  const debounceTimer = useRef<any>(null);
  const { log } = useLogger();
  const { showToast } = useToast();

  // Validation schema - state and district are required
  const validationSchema = Yup.object().shape({
    state_id: Yup.string().required("State is required"),
    district_id: Yup.string().required("District is required"),
    latitude: Yup.string(),
    longitude: Yup.string(),
  });

  // Validate form
  const validateForm = async () => {
    try {
      await validationSchema.validate(
        {
          state_id: formData.state_id || "",
          district_id: formData.district_id || "",
          latitude: formData.latitude || "",
          longitude: formData.longitude || "",
        },
        { abortEarly: false },
      );
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors = {} as { [key: string]: string };
      if (err.inner) {
        err.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSaveAndContinueWithValidation = async () => {
    const isValid = await validateForm();
    if (isValid) {
      // showToast("Location details validated", "success");
      handleSaveAndContinue();
    } else {
      showToast("Please check location details", "error");
    }
  };

  const listStates = useCallback(async () => {
    try {
      const response = await usersListService.listStates();
      log(LogLevel.INFO, "States :: listStates", response);
      if (response.data && response.data.data) {
        setStates(response.data.data);
      }
    } catch (error) {
      log(LogLevel.ERROR, "Roles :: listRoles", error);
      showToast(
        "Failed to load roles. Please try again later.",
        "Error",
        ToastType.ERROR,
      );
    }
  }, [log, showToast]);

  const listDistrictsByStateId = useCallback(
    async (stateId: string) => {
      try {
        const response = await usersListService.listDistrictsByStateId(stateId);
        log(LogLevel.INFO, "Districts :: listDistrictsByStateId", response);
        if (response.data && response.data.data) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        log(LogLevel.ERROR, "Districts :: listDistrictsByStateId", error);
        showToast(
          "Failed to load districts. Please try again later.",
          "Error",
          ToastType.ERROR,
        );
      }
    },
    [log, showToast],
  );

  useEffect(() => {
    listStates();
  }, [listStates]);

  useEffect(() => {
    if (selectedState) {
      listDistrictsByStateId(selectedState);
    }
  }, [selectedState, listDistrictsByStateId]);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const latStr = lat.toString();
          const lngStr = lng.toString();
          setLatitude(latStr);
          setLongitude(lngStr);
          // Sync to formData
          handleInputChange({
            target: {
              name: "latitude",
              value: latStr,
            },
          } as any);
          handleInputChange({
            target: {
              name: "longitude",
              value: lngStr,
            },
          } as any);
          log(LogLevel.INFO, "User location obtained", `${lat}, ${lng}`);
        },
        (error) => {
          log(LogLevel.WARN, "Geolocation error", error.message);
          // Fallback to default location if geolocation fails
          setLatitude("22.3467");
          setLongitude("77.0890");
          handleInputChange({
            target: {
              name: "latitude",
              value: "22.3467",
            },
          } as any);
          handleInputChange({
            target: {
              name: "longitude",
              value: "77.0890",
            },
          } as any);
          showToast(
            "Unable to get your location. Using default location.",
            "Info",
            ToastType.WARNING,
          );
        },
      );
    } else {
      log(LogLevel.WARN, "Geolocation", "Geolocation not supported");
      showToast(
        "Geolocation not supported on this device.",
        "Warning",
        ToastType.WARNING,
      );
    }
  }, [log, showToast, handleInputChange]);

  // Handle map center updates based on state/district selection
  // useEffect(() => {
  //   if (selectedState && selectedDistrict && selectedDistrictName) {
  //     // Geocode district name to get its center coordinates
  //     const geocodeDistrict = async () => {
  //       try {
  //         const query = `${selectedDistrictName}, ${selectedStateName}, India`;
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
  //         );
  //         const data = await response.json();
  //         if (data && data.length > 0) {
  //           const lat = parseFloat(data[0].lat).toFixed(6);
  //           const lng = parseFloat(data[0].lon).toFixed(6);
  //           setLatitude(lat);
  //           setLongitude(lng);
  //           // Sync to formData
  //           handleInputChange({
  //             target: {
  //               name: "latitude",
  //               value: lat,
  //             },
  //           } as any);
  //           handleInputChange({
  //             target: {
  //               name: "longitude",
  //               value: lng,
  //             },
  //           } as any);
  //           console.log(`District ${selectedDistrictName} geocoded:`, lat, lng);
  //           log(
  //             LogLevel.INFO,
  //             "District geocoded",
  //             `${selectedDistrictName}: ${lat}, ${lng}`,
  //           );
  //         } else {
  //           log(
  //             LogLevel.WARN,
  //             "Geocoding failed for district",
  //             selectedDistrictName,
  //           );
  //           // Fallback to geolocation if geocoding fails
  //           getUserLocation();
  //         }
  //       } catch (error) {
  //         log(LogLevel.ERROR, "Geocoding error", error);
  //         getUserLocation();
  //       }
  //     };
  //     geocodeDistrict();
  //   } else {
  //     // If no state/district selected, use user's current location
  //     getUserLocation();
  //   }
  // }, [
  //   selectedState,
  //   selectedDistrict,
  //   selectedDistrictName,
  //   selectedStateName,
  //   getUserLocation,
  //   log,
  //   handleInputChange,
  // ]);

  useEffect(() => {
    if (!selectedDistrictName || !selectedStateName) return;

    // prevent repeated geocoding for same district
    if (lastGeocodedDistrict.current === selectedDistrictName) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const query = `${selectedDistrictName}, ${selectedStateName}, India`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&format=json&limit=1`,
        );

        const data = await response.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat).toFixed(6);
          const lng = parseFloat(data[0].lon).toFixed(6);

          setLatitude(lat);
          setLongitude(lng);

          handleInputChange({
            target: { name: "latitude", value: lat },
          } as any);

          handleInputChange({
            target: { name: "longitude", value: lng },
          } as any);

          lastGeocodedDistrict.current = selectedDistrictName;
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      }
    }, 800); // debounce

    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrictName, selectedStateName]);

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setLatitude(formData.latitude);
      setLongitude(formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  // Initialize state and district names from formData (for draft loading)
  useEffect(() => {
    if (formData.state_name) {
      setSelectedStateName(formData.state_name);
    }
    if (formData.district_name) {
      setSelectedDistrictName(formData.district_name);
    }
  }, [formData.state_name, formData.district_name]);

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
        {/* Form Header */}
        <div className="p-6">
          <h2 className="font-semibold text-[#374151] mb-1">
            Upload Location Details
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
                  State <span className="text-red-500">*</span>{" "}
                  {/* <img src={LockIcon} alt="Locked" className="inline" /> */}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const stateId = e.target.value;
                    const stateIdNum = parseInt(stateId, 10);
                    const stateName =
                      states.find((s) => s.state_id === stateIdNum)
                        ?.state_name || "";
                    setSelectedState(stateId);
                    setSelectedStateName(stateName);
                    setSelectedDistrict("");
                    setSelectedDistrictName("");
                    // Clear errors
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["state_id"];
                      return newErrors;
                    });
                    // Sync to formData
                    handleInputChange({
                      target: {
                        name: "state_id",
                        value: stateId,
                      },
                    } as any);
                    handleInputChange({
                      target: {
                        name: "state_name",
                        value: stateName,
                      },
                    } as any);
                    // Reset district in formData
                    handleInputChange({
                      target: {
                        name: "district_id",
                        value: "",
                      },
                    } as any);
                    handleInputChange({
                      target: {
                        name: "district_name",
                        value: "",
                      },
                    } as any);
                  }}
                  className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
                >
                  <option value="">All States</option>
                  {states.map((state: any) => (
                    <option key={state.state_id} value={state.state_id}>
                      {state.state_name}
                    </option>
                  ))}
                </select>{" "}
                {errors.state_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.state_id}</p>
                )}{" "}
              </div>

              <div className="">
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  District <span className="text-red-500">*</span>{" "}
                  {/* <img src={LockIcon} alt="Locked" className="inline" /> */}
                </label>
                <select
                  value={selectedDistrict}
                  disabled={!selectedState}
                  onChange={(e) => {
                    const districtId = e.target.value;
                    const districtIdNum = parseInt(districtId, 10);
                    const districtName =
                      districts.find((d) => d.district_id === districtIdNum)
                        ?.district_name || "";
                    setSelectedDistrict(districtId);
                    setSelectedDistrictName(districtName);
                    // Clear errors
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["district_id"];
                      return newErrors;
                    });
                    // Sync to formData
                    handleInputChange({
                      target: {
                        name: "district_id",
                        value: districtId,
                      },
                    } as any);
                    handleInputChange({
                      target: {
                        name: "district_name",
                        value: districtName,
                      },
                    } as any);
                  }}
                  className={`w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm ${!selectedState ? "bg-gray-100 !cursor-not-allowed" : "bg-white cursor-pointer"}`}
                >
                  <option value="">All Districts</option>
                  {districts.map((district: any) => (
                    <option
                      key={district.district_id}
                      value={district.district_id}
                    >
                      {district.district_name}
                    </option>
                  ))}
                </select>
                {errors.district_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.district_id}
                  </p>
                )}
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setLatitude(val);
                        // Clear errors
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors["latitude"];
                          return newErrors;
                        });
                        handleInputChange({
                          target: { name: "latitude", value: val },
                        } as any);
                      }}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLongitude(val);
                        // Clear errors
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors["longitude"];
                          return newErrors;
                        });
                        handleInputChange({
                          target: { name: "longitude", value: val },
                        } as any);
                      }}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm"
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
              {/* <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg overflow-hidden">
              
                <div className="relative h-[400px] bg-gray-200">
                 
                  <div className="absolute inset-0 flex items-center justify-center text-[#6B7280] text-sm bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p>Map View</p>
                    </div>
                  </div>

                
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
              </div> */}
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg overflow-hidden h-[400px]">
                <LocationMap
                  latitude={latitude}
                  longitude={longitude}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  selectedDistrictName={selectedDistrictName}
                  selectedStateName={selectedStateName}
                />
              </div>

              <button
                onClick={getUserLocation}
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
                Use Current Location
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
            onClick={handleSaveAndContinueWithValidation}
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
