import Joi from "joi";

export const addNoteSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        ownerId: Joi.string().required()
    })
};