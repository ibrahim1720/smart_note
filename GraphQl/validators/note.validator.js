import Joi from "joi";
export const paginationNoteSchema = Joi.object({
    token: Joi.string().optional(),
    ownerId: Joi.string().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.when("page", {
      is: Joi.exist(),
      then: Joi.number().integer().min(1).required(),
      otherwise: Joi.forbidden(),
    }).messages({
      "any.unknown": "Limit is required when page is provided",
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
    }),
  }).unknown(true);