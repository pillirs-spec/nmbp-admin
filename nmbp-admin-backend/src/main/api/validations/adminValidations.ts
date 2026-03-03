import Joi from "joi";
import { IDocument, IMenu } from "../../types/custom";
import { MenuStatus } from "../../enums/status";

const adminValidations = {
  validateDocument: (document: IDocument): Joi.ValidationResult => {
    const documentSchema = Joi.object({
      document_id: Joi.string().required(),
      document_name: Joi.string().min(3).max(255).required(),
      file: Joi.object({
        name: Joi.string().required(),
        mimetype: Joi.string()
          .valid(
            "application/pdf",
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "image/jpeg",
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
};

export default adminValidations;
