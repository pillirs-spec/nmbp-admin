import { Response } from "express";
import { Request } from "../../types/express";
import { STATUS, logger } from "ts-commons";
import { errorCodes } from "../../config";
import { adminService } from "../services";
import { adminValidations } from "../validations";
import { v4 as uuidv4 } from "uuid";

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
      /*                #swagger.tags = ['Admin']
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

      const pageSize = req.body.pageSize || 11;
      const currentPage = req.body.currentPage
        ? (req.body.currentPage - 1) * pageSize
        : 10;
      const selectedState = Number(req.body.selectedState) || 0;
      const searchFilter = req.body.searchFilter || "";
      const dnoList = await adminService.getDnoList(
        pageSize,
        currentPage,
        searchFilter,
        selectedState,
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
      const file_type = file?.mimetype || "";
      const file_size = file?.size || 0;

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

      if (!document_id || !document_name || !is_published) {
        return res.status(STATUS.BAD_REQUEST).send({
          data: null,
          message:
            "Missing required fields: document_id, document_name, is_published",
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
        file_type,
        file_size,
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
};

export default adminController;
