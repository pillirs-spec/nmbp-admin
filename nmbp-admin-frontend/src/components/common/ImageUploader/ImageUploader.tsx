import React, { useState, useEffect } from "react";
import { ImageUploaderProps } from "./ImageUploaderTypes";
import { useToast } from "../../../hooks/useToast";
import { ToastType } from "../../../enums/ToastType";
import { Cropper, RectangleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setFile,
  file,
  allowedTypes,
  close,
  maxSize,
  cropWidth,
  cropHeight,
}) => {
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (file) {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSize * 1024 * 1024;

      if (!isValidType) {
        showToast(
          "Invalid file type. Allowed types: " + allowedTypes.join(", "),
          "Upload Error",
          ToastType.ERROR,
        );
        close();
        return;
      }

      if (!isValidSize) {
        showToast(
          `File size exceeds ${maxSize}MB limit.`,
          "Upload Error",
          ToastType.ERROR,
        );
        close();
        return;
      }

      const fileBlob = new Blob([file], {
        type: file.type || "image/jpeg",
      });
      const newFile = new File([fileBlob], file.name || "image.jpg");
      setTempFile(newFile);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(fileBlob);
    }
  }, [file]);

  const onCropChange = (cropper: any) => {
    setTimeout(() => {
      const croppedCanvas = cropper.getCanvas();
      if (croppedCanvas) {
        const croppedDataUrl = croppedCanvas.toDataURL(
          `image/${tempFile?.type}`,
        );
        setCroppedImage(croppedDataUrl);
      }
    }, 200);
  };

  const handleCropSubmit = () => {
    if (!croppedImage || !tempFile) return;

    const byteString = atob(croppedImage.split(",")[1]);
    const mimeString = croppedImage.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: mimeString });
    const croppedFile = new File([blob], tempFile.name, { type: blob.type });
    setFile(croppedFile);
    close();
  };

  return (
    <div className="dialog-box">
      <div className="uploadFile">
        <Cropper
          src={previewUrl}
          stencilComponent={RectangleStencil}
          stencilProps={{ aspectRatio: cropWidth / cropHeight }}
          onChange={onCropChange}
          className="rounded-lg mb-3"
        />
      </div>
      <div>
        <p className="text-[0.8rem] leading-6">
          **For a great profile picture, use{" "}
          {allowedTypes
            .map((type: string) => type.replace("image/", "").toUpperCase())
            .join("/")}{" "}
          with recommended dimensions and stay under {maxSize}MB**
        </p>
      </div>
      <div className="mt-2  flex justify-center">
        <button
          className="bg-[#990007] text-white rounded-lg px-5 py-2 text-sm"
          onClick={handleCropSubmit}
          disabled={!croppedImage}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
