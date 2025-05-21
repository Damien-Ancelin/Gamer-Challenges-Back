import Joi from "joi";

export const refreshTokenSchema = Joi.object({
  accessToken: Joi.string().optional(),
  refreshToken: Joi.string().required(),
});

export const accessTokenSchema = Joi.object({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().optional(),
});