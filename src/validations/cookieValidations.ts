import Joi from "joi";

export const refreshTokenSchema = Joi.object({
  accessToken: Joi.string().optional(),
  refreshToken: Joi.string().required().messages({
      "string.pattern.base": "Une erreur est survenue",
      "string.empty": "Le refreshToken ne peut pas être vide",
      "any.required": "Le refreshToken est obligatoire",
    }),
});

export const accessTokenSchema = Joi.object({
  accessToken: Joi.string().required().messages({
    "string.pattern.base": "Une erreur est survenue",
    "string.empty": "L'accessToken ne peut pas être vide",
    "any.required": "L'accessToken est obligatoire",
  }),
  refreshToken: Joi.string().optional(),
});