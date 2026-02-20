import { Response } from "express";
import { STATUS, logger, envUtils } from "ts-commons";
import { adminService } from "../services";
import { UploadedFile } from "express-fileupload";
import { Request } from "../../types/express";
import { errorCodes } from "../../config";
import { IUser } from "../../types/custom";
import { adminValidations } from "../validations";

export const adminController = {
    getLoggedInUserInfo: async (req: Request, res: Response): Promise<Response> => {
        const logPrefix = `adminController :: getLoggedInUserInfo`;
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Get Logged-In User Info'
                #swagger.description = 'Retrieve the profile details (name, email, mobile, role, profile picture URL) of the currently authenticated user using the JWT token'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
            */
            logger.info(`${logPrefix} :: Request Received `);
            const userId = req.plainToken.user_id;
            console.log("userId", userId);
            const user = await adminService.getLoggedInUserInfo(userId);
            return res.status(STATUS.OK).send({
                data: user,
                message: "Logged In User Info Fetched Successfully",
            });
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.admin.ADMIN00000);
        }
    },
    updateProfilePic: async (req: Request, res: Response): Promise<Response> => {
        const logPrefix = `adminController :: updateProfilePic`;
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Upload Profile Picture'
                #swagger.description = 'Upload or replace the profile picture for the currently authenticated user. Accepts JPEG/PNG files only. Max file size is configured via EP_UPLOAD_FILE_SIZE_LIMIT (default 5MB).'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'JWT token for authentication'
                }
                #swagger.parameters['file'] = {
                    in: 'formData',
                    required: true,
                    type: 'file',
                    description: 'Profile picture file to upload'
                }
            */
            logger.info(`${logPrefix} :: Request Received `);
            const plainToken = req.plainToken;
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(errorCodes.admin.ADMIN00001);

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.mimetype)) return res.status(STATUS.BAD_REQUEST).send(errorCodes.admin.ADMIN00002);

            const uploadSizeLimit = envUtils.getNumberEnvVariableOrDefault("EP_UPLOAD_FILE_SIZE_LIMIT", 5 * 1024 * 1024)
            if (file.size > uploadSizeLimit) return res.status(STATUS.BAD_REQUEST).send(errorCodes.admin.ADMIN00003);

            await adminService.updateProfilePic(file, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Profile Picture Updated Successfully",
            });
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.admin.ADMIN00000);
        }
    },
    updateProfile: async (req: Request, res: Response): Promise<Response> => {
        const logPrefix = `adminController :: updateProfile`;
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Update My Profile'
                #swagger.description = 'Update the profile details (first name, last name, email, date of birth) of the currently authenticated user'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'JWT token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        first_name: 'Narsima',
                        last_name: 'Chilkuri',
                        email_id: 'narsimachilkuri237@gmail.com',
                        dob: '1997-08-16'
                    }
                }  
            */
            const user: IUser = req.body;
            logger.info(`${logPrefix} :: Request Received :: ${user} `);
            const { error } = adminValidations.validateUpdateUser(user);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.admin.ADMIN00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: errorCodes.admin.ADMIN00000.errorCode, errorMessage: error.message });
            }

            const userId = req.plainToken.user_id;
            await adminService.updateProfile(user, userId);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Profile Updated Successfully",
            });
        } catch (error) {
            logger.error(`${logPrefix} :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(errorCodes.admin.ADMIN00000);
        }
    },
}


