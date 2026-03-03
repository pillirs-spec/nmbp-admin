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
};

export default adminValidations;
