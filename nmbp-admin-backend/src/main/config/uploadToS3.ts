import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadToS3 = async (file, userId, folder) => {
  // Handle both express-fileupload (name, data) and multer (originalname, buffer) formats
  const fileName = file.originalname || file.name;
  const fileBuffer = file.buffer || file.data;

  if (!fileName) {
    throw new Error("File name is undefined");
  }

  const cleanName = fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  const key = `${folder}/${userId}_${Date.now()}_${cleanName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ContentDisposition:
        file.mimetype === "application/pdf" ? "attachment" : "inline",

      CacheControl: "no-store",

      Metadata: {
        "x-content-type-options": "nosniff",
      },
    }),
  );

  return key;
};

export const getSignedS3Url = async (key, expiresIn = 300) => {
  if (!key) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
};
