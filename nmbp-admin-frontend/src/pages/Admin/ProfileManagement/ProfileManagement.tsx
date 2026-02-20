import { TextInput, Button } from "@mantine/core";
import React, { useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import imagePlaceholder from "../../../assets/images/image_placeholder.svg";
import ImageCropper from "../../../components/common/ImageCropper/ImageCropper";
import profileValidation from "./validateProfileManagement";
import { useForm, yupResolver } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { profileService } from "./profileManagementService";
import { format } from "date-fns";
import { useAuth } from "../../../hooks";

interface ProfileManagementProps {
  closeSlider: () => void;
}
const ProfileManagement: React.FC<ProfileManagementProps> = ({
  closeSlider,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const { userDetails, setUserDetailsToContext } = useAuth();

  const parseDateString = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const validationSchema = profileValidation.validateProfile();
  const form = useForm({
    initialValues: {
      first_name: userDetails?.first_name || "",
      last_name: userDetails?.last_name || "",
      email_id: userDetails?.email_id || "",
      dob: userDetails?.dob ? parseDateString(userDetails.dob) : null,
    },
    validate: yupResolver(validationSchema),
  });

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
        setFileError("Only JPEG and PNG formats are allowed");
        return;
      }
      setFile(selectedFile);
      setShowCropper(true);
    }
  };

  const handleSaveCroppedImage = (croppedFile: File) => {
    setFile(croppedFile);
    setImage(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const handleSubmit = async (values: {
    first_name: string;
    last_name: string;
    email_id: string;
    dob: Date | null;
  }) => {
    try {
      if (fileError) return;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await profileService.updateProfilePic(formData);
      }
      const formattedDob = values.dob ? format(values.dob, "yyyy-MM-dd") : "";

      const formattedValues = {
        ...values,
        dob: formattedDob,
      };
      const profileUpdateResponse = await profileService.updateProfile(
        formattedValues
      );
      if (profileUpdateResponse.status === 200) {
        const response = await profileService.getLoggedInUserInfo();
        if (response.data && response.data.data) {
          setUserDetailsToContext(response.data.data);
        }
        // showToast("Profile Updated", "Success", ToastType.SUCCESS);
        closeSlider();
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  return (
    <div className="">
      <div className="flex justify-center mb-3">
        <div className="relative border border-[#d9d9d9] h-40 w-40 flex flex-col items-center justify-center rounded-full">
          {image || userDetails?.profile_pic_url ? (
            <img
              src={image ? image : userDetails?.profile_pic_url}
              alt="Uploaded"
              className="h-40 w-40 rounded-full"
            />
          ) : (
            <img
              src={imagePlaceholder}
              alt="Placeholder"
              className="w-20 h-20"
            />
          )}
          <Dropzone
            onDrop={handleFileChange}
            accept={["image/*", "application/pdf"]}
          >
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-[#D05A15] text-lg cursor-pointer absolute bottom-3 right-2 bg-white py-1 px-[0.6rem] rounded-full">
                <i className="fa-solid fa-upload"></i>
              </p>
            </div>
            {fileError && !file && (
              <p className="text-red-500 text-sm mt-2">{fileError}</p>
            )}
          </Dropzone>

          <ImageCropper
            isOpen={showCropper}
            onClose={() => setShowCropper(false)}
            imageSrc={file ? URL.createObjectURL(file) : ""}
            onSave={handleSaveCroppedImage}
          />
        </div>
      </div>
      <form className="space-y-3" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          radius="md"
          size="sm"
          placeholder="Enter First Name"
          className="mt-2"
          error={form.errors.first_name}
          {...form.getInputProps("first_name")}
        />
        <TextInput
          label="Last Name"
          radius="md"
          size="sm"
          placeholder="Enter Last Name"
          className="mt-2"
          error={form.errors.last_name}
          {...form.getInputProps("last_name")}
        />
        <TextInput
          label="Email ID"
          radius="md"
          size="sm"
          placeholder="Enter Email Id"
          type="email"
          error={form.errors.email_id}
          {...form.getInputProps("email_id")}
        />

        <DateInput
          label="Select Birth Date"
          valueFormat="DD/MM/YYYY"
          placeholder="Select Birth Date"
          error={form.errors.dob}
          {...form.getInputProps("dob")}
        />

        <Button fullWidth color="#990007" className="!mt-14" type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileManagement;
