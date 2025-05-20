import Joi from "joi";

export const refreshTokenSchema = Joi.object({
  accessToken: Joi.string().optional(),
  refreshToken: Joi.string().required(),
});

export const AccessTokenSchema = Joi.object({
  accessToken: Joi.string().required(),
});