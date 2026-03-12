import Joi from "joi";
import { IDocument, IMenu } from "../../types/custom";
import { MenuStatus } from "../../enums/status";

const adminValidations = {
  validateDocument: (document: IDocument): Joi.ValidationResult => {
    const documentSchema = Joi.object({
      document_id: Joi.string().required(),
      document_name: Joi.string().min(3).max(255).required(),
      is_published: Joi.boolean().required(),
      file: Joi.object({
        name: Joi.string().required(),
        mimetype: Joi.string()
          .valid(
            "application/pdf",
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "video/mp4",
          )
          .required(),
        data: Joi.binary().required(),
        size: Joi.number()
          .max(10 * 1024 * 1024)
          .required()
          .messages({
            "number.max": "File size should not exceed 10MB",
          }),
      })
        .unknown(true)
        .required(),
    });
    return documentSchema.validate(document);
  },

  validateListDocuments: (params: any): Joi.ValidationResult => {
    const listDocumentsSchema = Joi.object({
      pageSize: Joi.number()
        .positive()
        .default(10)
        .error(new Error("pageSize must be a positive number")),
      currentPage: Joi.number()
        .positive()
        .default(1)
        .error(new Error("currentPage must be a positive number")),
      searchFilter: Joi.string()
        .max(255)
        .allow("")
        .optional()
        .error(
          new Error("searchFilter must be a string with max 255 characters"),
        ),
    });
    return listDocumentsSchema.validate(params);
  },

  validateUpdateDocument: (
    document: Partial<IDocument>,
  ): Joi.ValidationResult => {
    const updateDocumentSchema = Joi.object({
      document_id: Joi.string().required(),
      document_name: Joi.string().min(3).max(255).required(),
      is_published: Joi.boolean().required(),
      file: Joi.object({
        name: Joi.string().required(),
        mimetype: Joi.string()
          .valid(
            "application/pdf",
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "video/mp4",
          )
          .required(),
        data: Joi.binary().required(),
        size: Joi.number()
          .max(10 * 1024 * 1024)
          .required()
          .messages({
            "number.max": "File size should not exceed 10MB",
          }),
      })
        .unknown(true)
        .optional(),
    });
    return updateDocumentSchema.validate(document);
  },

  validateAddEvent: (event: any): Joi.ValidationResult => {
    const addEventSchema = Joi.object({
      event_id: Joi.string().optional().allow(null, ""),
      activity_id: Joi.alternatives()
        .try(Joi.number().integer().positive(), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      activity_date: Joi.alternatives()
        .try(Joi.date().iso(), Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/))
        .optional()
        .allow(null, ""),
      activity_title: Joi.string().max(255).optional().allow(null, ""),
      coordinating_department_name: Joi.string()
        .max(255)
        .optional()
        .allow(null, ""),
      number_of_participants: Joi.alternatives()
        .try(Joi.number().integer().min(0), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      number_of_female: Joi.alternatives()
        .try(Joi.number().integer().min(0), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      number_of_male: Joi.alternatives()
        .try(Joi.number().integer().min(0), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      number_of_educational_institutions: Joi.alternatives()
        .try(Joi.number().integer().min(0), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      description: Joi.string().max(2000).optional().allow(null, ""),
      state_id: Joi.alternatives()
        .try(Joi.number().integer().positive(), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      district_id: Joi.alternatives()
        .try(Joi.number().integer().positive(), Joi.string().regex(/^\d+$/))
        .optional()
        .allow(null, ""),
      latitude: Joi.alternatives()
        .try(
          Joi.number().min(-90).max(90),
          Joi.string().regex(/^-?\d+(\.\d+)?$/),
        )
        .optional()
        .allow(null, ""),
      longitude: Joi.alternatives()
        .try(
          Joi.number().min(-180).max(180),
          Joi.string().regex(/^-?\d+(\.\d+)?$/),
        )
        .optional()
        .allow(null, ""),
      event_submitted: Joi.boolean().optional().default(false),
      media_files: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            mimetype: Joi.string()
              .valid("image/jpeg", "image/jpg", "image/png", "video/mp4")
              .required(),
            data: Joi.binary().required(),
            size: Joi.number()
              .max(50 * 1024 * 1024)
              .required()
              .messages({
                "number.max": "Each file size should not exceed 50MB",
              }),
          }).unknown(true),
        )
        .optional()
        .allow(null),
    });
    return addEventSchema.validate(event);
  },

  validateFeedback: (feedback: any): Joi.ValidationResult => {
    const feedbackSchema = Joi.object({
      feedback: Joi.string().min(3).max(200).required(),
    });
    return feedbackSchema.validate(feedback);
  },
};

export default adminValidations;
