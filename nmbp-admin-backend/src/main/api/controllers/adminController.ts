import { Response } from "express";
import { Request } from "../../types/express";
import { STATUS, logger } from "ts-commons";
import { errorCodes } from "../../config";
import { adminService } from "../services";
import { adminValidations } from "../validations";
import { v4 as uuidv4 } from "uuid";
import { adminRepository } from "../repositories";

const adminController = {
  health: (req: Request, res: Response): Response => {
    /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Health Check'
                #swagger.description = 'Verify that the Admin Backend service is running and responsive'
        */
    return res.status(STATUS.OK).send({
      data: null,
      message: "Admin Service is Up and Running!",
    });
  },

  getPledges: async (req: Request, res: Response) => {
    const logPrefix = `rolesController :: listRoles`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'List Pledges (Paginated)'
                #swagger.description = 'Retrieve a paginated list of pledges with optional filtering by active status and search term. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "Kiran Kumar",
                        selectedState: 1,
                        selectedDistrict: 1,
                        dateRange: "2024-01-01"
                    }
                }    
            */

      const pageSize = req.body.pageSize || 11;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 10;
      const selectedState = Number(req.body.selectedState) || 0;
      const selectedDistrict = Number(req.body.selectedDistrict) || 0;
      const dateRange = req.body.dateRange || "";
      const searchFilter = req.body.searchFilter || "";
      logger.debug(
        `${logPrefix} :: Parsed parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );

      const pledgesList = await adminService.getPledges(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
        selectedDistrict,
        dateRange,
      );
      const pledgesCount = await adminService.pledgeCount(searchFilter);
      const totalPledgeCount = await adminService.totalPledgeCount();
      const totalPledgeTodayCount = await adminService.totalPledgeTodayCount();

      return res.status(STATUS.OK).send({
        data: {
          pledgesList,
          pledgesCount,
          totalPledgeCount,
          totalPledgeTodayCount,
        },
        message: "Pledges fetched successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.roles.ROLE00000);
    }
  },

  getSnoList: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: getSnoList`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*                #swagger.tags = ['Admin']
                #swagger.summary = 'Get SNO List'
                #swagger.description = 'Retrieve a list of SNOs. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "Venkatesh",
                        selectedState: 1
                    }
                }  
            */

      const pageSize = req.body.pageSize || 11;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 11;
      const selectedState = Number(req.body.selectedState) || 0;
      const searchFilter = req.body.searchFilter || "";
      const snoList = await adminService.getSnoList(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
      );

      const snoCount = await adminService.snoCount(searchFilter);
      const totalSnoCount = await adminService.totalSnoCount();
      return res.status(STATUS.OK).send({
        data: {
          snoList,
          snoCount,
          totalSnoCount,
        },
        message: "SNO List fetched successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.roles.ROLE00000);
    }
  },

  getDnoList: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: getDnoList`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Get DNO List'
                #swagger.description = 'Retrieve a list of DNOs. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "Venkatesh",
                        selectedState: 1
                    }
                }  
        */

      const userId = req.plainToken.user_id;
      const pageSize = req.body.pageSize || 10;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 10;
      const selectedState = Number(req.body.selectedState) || 0;
      const searchFilter = req.body.searchFilter || "";

      const user = await adminRepository.getUserByUserId(userId);

      if (!user) {
        return res.status(STATUS.NOT_FOUND).send({
          data: null,
          message: "User not found",
        });
      }

      const stateId = user.state_id;
      const userRoleName = user.role_name || "";

      const dnoList = await adminService.getDnoList(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
        stateId,
        userRoleName,
      );

      const dnoCount = await adminService.dnoCount(searchFilter);
      const totalDnoCount = await adminService.totalDnoCount();
      return res.status(STATUS.OK).send({
        data: {
          dnoList,
          dnoCount,
          totalDnoCount,
        },
        message: "DNO List fetched successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.roles.ROLE00000);
    }
  },

  listDocuments: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: listDocuments`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'List Documents (Paginated)'
                #swagger.description = 'Retrieve a paginated list of documents with optional filtering by search term. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "document_name_or_user"
                    }
                }    
            */

      const pageSize = req.body.pageSize || 10;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 0;
      const searchFilter = req.body.searchFilter || "";

      logger.debug(
        `${logPrefix} :: Parsed parameters :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );

      const documentsList = await adminService.listDocuments(
        pageSize,
        currentPage,
        searchFilter,
      );
      const documentsCount = await adminService.documentsCount(searchFilter);
      const totalDocumentsCount = await adminService.totalDocumentsCount();

      return res.status(STATUS.OK).send({
        data: {
          documentsList,
          documentsCount,
          totalDocumentsCount,
          pageSize,
          currentPage: Math.ceil(currentPage / pageSize) + 1,
        },
        message: "Documents fetched successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.roles.ROLE00000);
    }
  },

  addDocuments: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: addDocuments`;
    try {
      logger.info(
        `${logPrefix} :: Request received :: ${JSON.stringify(req.body)}`,
      );
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Add Documents'
                #swagger.description = 'Upload documents to the system. Supports PDF, CSV, Excel (xlsx, xls), PNG, JPEG and MP4 files with maximum 10 MB file size. Documents can be published immediately or saved as drafts. Requires authentication.'
                #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['document_name'] = {
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'Name of the document (3-255 characters)'
                }
                #swagger.parameters['is_published'] = {
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'Document status: "Save and publish" (published and visible) or "Draft" (not published, admin only)'
                }
                #swagger.parameters['file'] = {
                    in: 'formData',
                    type: 'file',
                    required: true,
                    description: 'Document file (PDF, CSV, Excel, PNG, JPEG, MP4 - max 10 MB)'
                }
            */
      const userId = req.plainToken.user_id;
      const document_id = uuidv4();
      const { document_name, is_published } = req.body;
      const file = req.files?.file as any;
      const file_type = file?.mimetype || "";
      const file_size = file?.size || 0;
      const documents = {
        document_id,
        document_name,
        is_published,
        file,
      };

      const { error } = adminValidations.validateDocument(documents);
      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.documents.DOCUMENTS00001.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.documents.DOCUMENTS00001.errorCode,
            errorMessage: error.message,
          });
      }

      if (!document_name || !file || !is_published) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message: "Missing required fields: document_name, file, is_published",
        });
      }

      await adminService.addDocuments(
        document_id,
        document_name,
        file,
        userId,
        file_type,
        file_size,
        is_published,
      );

      return res.status(STATUS.CREATED).send({
        data: null,
        message: "Document added successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.documents.DOCUMENTS00000);
    }
  },

  getDocumentById: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: getDocumentById`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Get Document by ID'
                #swagger.description = 'Retrieve document details by document ID. Returns document metadata including file URL.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['document_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Document ID'
                }
            */
      const { document_id } = req.params;

      if (!document_id) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message: "Missing required field: document_id",
        });
      }

      const document = await adminService.getDocumentById(document_id);

      if (!document) {
        return res.status(STATUS.NOT_FOUND).send({
          data: null,
          message: "Document not found",
        });
      }

      return res.status(STATUS.OK).send({
        data: document,
        message: "Document retrieved successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.documents.DOCUMENTS00000);
    }
  },

  downloadDocument: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: downloadDocument`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Download Document'
                #swagger.description = 'Get a signed download URL for a document. The URL is valid for 5 minutes.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['document_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Document ID'
                }
            */
      const { document_id } = req.params;

      if (!document_id) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message: "Missing required field: document_id",
        });
      }

      const downloadUrl =
        await adminService.getDocumentDownloadUrl(document_id);

      if (!downloadUrl) {
        return res.status(STATUS.NOT_FOUND).send({
          data: null,
          message: "Document not found or unable to generate download URL",
        });
      }

      return res.status(STATUS.OK).send({
        data: {
          download_url: downloadUrl,
          expires_in_seconds: 300,
        },
        message: "Download URL generated successfully. Valid for 5 minutes.",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.documents.DOCUMENTS00000);
    }
  },

  previewDocument: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: previewDocument`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Preview Document'
                #swagger.description = 'Get a signed preview URL for a document. The URL is valid for 5 minutes. For images and PDFs, the URL can be used to directly preview the document. For other file types, the URL can be used to download the document for preview.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['document_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Document ID'
                }
      */
      const { document_id } = req.params;

      if (!document_id) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message: "Missing required field: document_id",
        });
      }
      const previewUrl = await adminService.getDocumentPreviewUrl(document_id);
      if (!previewUrl) {
        return res.status(STATUS.NOT_FOUND).send({
          data: null,
          message: "Document not found or unable to generate preview URL",
        });
      }
      return res.status(STATUS.OK).send({
        data: {
          preview_url: previewUrl,
          expires_in_seconds: 300,
        },
        message: "Preview URL generated successfully. Valid for 5 minutes.",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
    }
  },

  updateDocument: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: updateDocument`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Update Document'
                #swagger.description = 'Update an existing document. Can update document name, status, and optionally replace the file. Requires authentication.'
                #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['document_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Document ID'
                }
                #swagger.parameters['document_name'] = {
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'Name of the document (3-255 characters)'
                }
                #swagger.parameters['status'] = {
                    in: 'formData',
                    type: 'string',
                    required: true,
                    description: 'Document status: "Save and publish" or "Draft"'
                }
                #swagger.parameters['file'] = {
                    in: 'formData',
                    type: 'file',
                    required: false,
                    description: 'Document file (PDF, CSV, Excel, PNG, JPEG, MP4 - max 10 MB). Optional - if not provided, existing file is kept.'
                }
            */
      const userId = req.plainToken.user_id;
      const { document_id } = req.params;
      const { document_name, is_published } = req.body;
      const file = req.files?.file as any;

      const documents = {
        document_id,
        document_name,
        is_published,
        file,
      };

      const { error } = adminValidations.validateUpdateDocument(documents);
      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.documents.DOCUMENTS00001.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.documents.DOCUMENTS00001.errorCode,
            errorMessage: error.message,
          });
      }

      if (!document_name || !file || !is_published || !document_id) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message:
            "Missing required fields: document_name, file, is_published, document_id",
        });
      }

      // Check if document exists
      const existingDocument = await adminService.getDocumentById(document_id);
      if (!existingDocument) {
        return res.status(STATUS.NOT_FOUND).send({
          data: null,
          message: "Document not found",
        });
      }

      const updatedDocument = await adminService.updateDocument(
        document_id,
        document_name,
        file,
        userId,
        is_published,
      );

      return res.status(STATUS.OK).send({
        data: updatedDocument,
        message: "Document updated successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send(errorCodes.documents.DOCUMENTS00000);
    }
  },

  addEvent: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: addEvent`;
    try {
      logger.info(
        `${logPrefix} :: Request received :: ${JSON.stringify(req.body)}`,
      );
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Add/Update Event (Multi-Step Form)'
                #swagger.description = 'Create a new event or update an existing draft event. Supports multi-step submission where each step saves as a draft (event_submitted=false). Final submission sets event_submitted=true to mark event as complete. Supports single or multiple media files (JPEG, PNG, MP4). Requires authentication.'
                #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['event_id'] = {
                    in: 'formData',
                    type: 'string',
                    required: false,
                    description: 'Event ID (provide to update existing draft, omit to create new event)'
                }
                #swagger.parameters['activity_id'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Activity ID (Step 1)'
                }
                #swagger.parameters['activity_date'] = {
                    in: 'formData',
                    type: 'string',
                    format: 'date',
                    required: false,
                    description: 'Activity date in YYYY-MM-DD format (Step 1)'
                }
                #swagger.parameters['activity_title'] = {
                    in: 'formData',
                    type: 'string',
                    required: false,
                    description: 'Activity title (Step 1)'
                }
                #swagger.parameters['coordinating_department_name'] = {
                    in: 'formData',
                    type: 'string',
                    required: false,
                    description: 'Coordinating department name (Step 1)'
                }
                #swagger.parameters['number_of_participants'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Total number of participants (Step 1)'
                }
                #swagger.parameters['number_of_female'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Number of female participants (Step 1)'
                }
                #swagger.parameters['number_of_male'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Number of male participants (Step 1)'
                }
                #swagger.parameters['number_of_educational_institutions'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Number of educational institutions (Step 1)'
                }
                #swagger.parameters['description'] = {
                    in: 'formData',
                    type: 'string',
                    required: false,
                    description: 'Event description (Step 1)'
                }
                #swagger.parameters['state_id'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'State ID (Step 2)'
                }
                #swagger.parameters['district_id'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'District ID (Step 2)'
                }
                #swagger.parameters['latitude'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Event location latitude -90 to 90 (Step 2)'
                }
                #swagger.parameters['longitude'] = {
                    in: 'formData',
                    type: 'number',
                    required: false,
                    description: 'Event location longitude -180 to 180 (Step 2)'
                }
                #swagger.parameters['media_files'] = {
                    in: 'formData',
                    type: 'file',
                    required: false,
                    description: 'Media files - images (JPEG, PNG) or videos (MP4) - max 50 MB each. Can upload single or multiple files (Step 3)'
                }
                #swagger.parameters['event_submitted'] = {
                    in: 'formData',
                    type: 'string',
                    required: false,
                    description: 'Set to "true" for final submission (event_submitted=true marks event as complete) or "false"/"omit" to save as draft'
                }
            */

      const userId = req.plainToken.user_id;

      const {
        event_id,
        activity_id,
        activity_date,
        activity_title,
        coordinating_department_name,
        number_of_participants,
        number_of_female,
        number_of_male,
        number_of_educational_institutions,
        description,
        state_id,
        district_id,
        latitude,
        longitude,
        event_submitted,
      } = req.body;

      // Handle multiple files - check if media_files is an array or single file
      let media_files = [];
      if (req.files?.media_files) {
        const files = req.files.media_files;
        media_files = Array.isArray(files) ? files : [files];
      }

      // Sanitize event_id - if provided as empty string, treat as null (new insert)
      const sanitizedEventId =
        event_id && typeof event_id === "string" && event_id.trim()
          ? event_id.trim()
          : null;

      // Validate event data
      const eventData = {
        event_id: sanitizedEventId,
        activity_id: activity_id ? parseInt(activity_id) : null,
        activity_date: activity_date || null,
        activity_title: activity_title || null,
        coordinating_department_name: coordinating_department_name || null,
        number_of_participants: number_of_participants
          ? parseInt(number_of_participants)
          : null,
        number_of_female: number_of_female ? parseInt(number_of_female) : null,
        number_of_male: number_of_male ? parseInt(number_of_male) : null,
        number_of_educational_institutions: number_of_educational_institutions
          ? parseInt(number_of_educational_institutions)
          : null,
        description: description || null,
        state_id: state_id ? parseInt(state_id) : null,
        district_id: district_id ? parseInt(district_id) : null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        event_submitted:
          event_submitted === "true" || event_submitted === true ? true : false,
        media_files,
      };

      const { error } = adminValidations.validateAddEvent(eventData);
      if (error) {
        logger.error(`${logPrefix} :: Validation error :: ${error.message}`);
        return res.status(STATUS.BAD_REQUEST).send({
          errorCode: "EVENT00001",
          errorMessage: error.details
            ? error.details[0].message
            : error.message,
        });
      }

      // Add/Update event with media files
      const result = await adminService.addEvent(
        eventData.event_id,
        eventData.activity_id,
        eventData.activity_date,
        eventData.activity_title,
        eventData.coordinating_department_name,
        eventData.number_of_participants,
        eventData.number_of_female,
        eventData.number_of_male,
        eventData.number_of_educational_institutions,
        eventData.description,
        eventData.state_id,
        eventData.district_id,
        eventData.latitude,
        eventData.longitude,
        eventData.event_submitted,
        media_files,
        userId,
      );

      logger.info(
        `${logPrefix} :: Event ${sanitizedEventId ? "update" : "create"} operation - ${sanitizedEventId ? "Updating event ID: " + sanitizedEventId : "Creating new event"} successfully`,
      );
      return res.status(sanitizedEventId ? STATUS.OK : STATUS.CREATED).send({
        data: result,
        message: `Event ${sanitizedEventId ? "updated" : "created"} successfully${eventData.event_submitted ? " and submitted" : " as draft"}`,
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "EVENT00000",
        errorMessage: "Failed to process event",
      });
    }
  },

  getEventById: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: getEventById`;
    /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Get Event by ID'
                #swagger.description = 'Retrieve a specific event (draft or submitted) by ID. Requires authentication.'
                #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }

                #swagger.parameters['event_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Event ID'
                }
    */
    try {
      const { event_id } = req.params;
      logger.info(`${logPrefix} :: event_id :: ${event_id}`);

      const event = await adminService.getEventById(event_id);

      logger.info(`${logPrefix} :: Event retrieved successfully`);
      return res.status(STATUS.OK).send({
        data: event,
        message: "Event retrieved successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "EVENT00002",
        errorMessage: "Failed to retrieve event",
      });
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: deleteEvent`;
    /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Delete Event'
                #swagger.description = 'Delete a specific event (draft or submitted) by ID. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['event_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Event ID'
                }
    */
    try {
      const { event_id } = req.params;
      logger.info(`${logPrefix} :: event_id :: ${event_id}`);

      const result = await adminService.deleteEvent(event_id);

      logger.info(`${logPrefix} :: Event deleted successfully`);
      return res.status(STATUS.OK).send({
        data: result,
        message: "Event deleted successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "EVENT00005",
        errorMessage: "Failed to delete event",
      });
    }
  },

  listSubmittedEvents: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: listSubmittedEvents`;
    /*        #swagger.tags = ['Admin']
                #swagger.summary = 'List Submitted Events'
                #swagger.description = 'Retrieve all submitted events with pagination. Requires authentication.'
               #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        search: ""
                    }
                }    
    */
    try {
      const { pageSize = 10, currentPage = 1, search = "" } = req.body;
      logger.info(
        `${logPrefix} :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: search :: ${search}`,
      );

      const events = await adminService.listSubmittedEvents(
        pageSize,
        currentPage,
        search,
      );

      const totalCount = await adminService.getSubmittedEventsCount(search);

      logger.info(
        `${logPrefix} :: Retrieved ${events.length} submitted events :: Total count :: ${totalCount}`,
      );
      return res.status(STATUS.OK).send({
        data: {
          events,
          totalCount,
          pageSize,
          currentPage,
        },
        message: "Submitted events retrieved successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "EVENT00003",
        errorMessage: "Failed to retrieve submitted events",
      });
    }
  },

  listDraftEvents: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: listDraftEvents`;

    /*        #swagger.tags = ['Admin']
                #swagger.summary = 'List Draft Events'
                #swagger.description = 'Retrieve all draft events with pagination. Requires authentication.'
               #swagger.consumes = ['multipart/form-data']
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1
                    }
                }

    */
    try {
      const userId = req.plainToken.user_id;
      const { pageSize = 10, currentPage = 1 } = req.body;
      logger.info(
        `${logPrefix} :: userId :: ${userId} :: pageSize :: ${pageSize} :: currentPage :: ${currentPage}`,
      );

      const events = await adminService.listDraftEvents(
        userId,
        pageSize,
        currentPage,
      );

      logger.info(`${logPrefix} :: Retrieved ${events.length} draft events`);
      return res.status(STATUS.OK).send({
        data: events,
        message: "Draft events retrieved successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "EVENT00004",
        errorMessage: "Failed to retrieve draft events",
      });
    }
  },

  addFeedback: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: addFeedback`;
    try {
      logger.info(
        `${logPrefix} :: Request received :: ${JSON.stringify(req.body)}`,
      );
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Add Feedback'
                #swagger.description = 'Add general feedback.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        feedback: "Easy to access and use",
                    }
                }  
        */
      const userId = req.plainToken.user_id;
      const { error } = adminValidations.validateFeedback(req.body);
      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.feedback.FEEDBACK00000.errorCode,
            errorMessage: error.details[0].message,
          });
        else
          return res.status(STATUS.BAD_REQUEST).send({
            errorCode: errorCodes.feedback.FEEDBACK00000.errorCode,
            errorMessage: error.message,
          });
      }
      const result = await adminService.addFeedback(userId, req.body.feedback);

      return res.status(STATUS.CREATED).send({
        data: result,
        message: "Feedback submitted successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "FEEDBACK00000",
        errorMessage: "Failed to submit feedback",
      });
    }
  },

  listFeedback: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: listFeedback`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'List Feedback'
                #swagger.description = 'Retrieve all feedback entries. Only shows feedback created by the current user. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        searchFilter: "Enum",
                       
                    }
                }   
        */
      const userId = req.plainToken.user_id;
      const { pageSize, currentPage, searchFilter } = req.body;
      logger.info(
        `${logPrefix} :: userId :: ${userId} :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchFilter :: ${searchFilter}`,
      );
      const feedbackList = await adminService.listFeedback(
        pageSize,
        currentPage,
        searchFilter,
        userId,
      );

      const feedbackCount = await adminService.feedbackCount(
        searchFilter,
        userId,
      );
      const totalFeedbackCount = await adminService.totalFeedbackCount(userId);
      return res.status(STATUS.OK).send({
        data: feedbackList,
        feedbackCount,
        totalFeedbackCount,
        message: "Feedback retrieved successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "FEEDBACK00000",
        errorMessage: "Failed to retrieve feedback",
      });
    }
  },

  deleteFeedback: async (req: Request, res: Response) => {
    const logPrefix = `adminController :: deleteFeedback`;
    try {
      logger.info(`${logPrefix} :: Request received`);
      /*        #swagger.tags = ['Admin']
                #swagger.summary = 'Delete Feedback'
                #swagger.description = 'Delete a specific feedback entry by ID. Requires authentication.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "JWT token for authentication"
                }
                #swagger.parameters['feedback_id'] = {
                    in: 'path',
                    type: 'string',
                    required: true,
                    description: 'Feedback ID'
                }
    */
      const { feedback_id } = req.params;
      logger.info(`${logPrefix} :: feedback_id :: ${feedback_id}`);
      const result = await adminService.deleteFeedback(feedback_id);

      logger.info(`${logPrefix} :: Feedback deleted successfully`);
      return res.status(STATUS.OK).send({
        data: result,
        message: "Feedback deleted successfully",
      });
    } catch (error) {
      logger.error(`${logPrefix} :: Error :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send({
        errorCode: "FEEDBACK00001",
        errorMessage: "Failed to delete feedback",
      });
    }
  },
};

export default adminController;
