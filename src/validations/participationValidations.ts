import Joi from "joi";

export const checkUserParticipationSchema = Joi.object({
  challenge_id: Joi.number().required().messages({
    "any.required": "Le champ challenge_id est requis.",
    "number.base": "Le champ challenge_id doit être un nombre.",
  }),
});

export const createUserParticipationSchema = Joi.object({
  challenge_id: Joi.number().required().messages({
    "any.required": "Le champ challenge_id est requis.",
    "number.base": "Le champ challenge_id doit être un nombre.",
  }),
});

export const deleteUserParticipationSchema = Joi.object({
  challenge_id: Joi.number().required().messages({
    "any.required": "Le champ challenge_id est requis.",
    "number.base": "Le champ challenge_id doit être un nombre.",
  }),
});

export const getParticipationByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Le champ id est requis.",
    "string.base": "Le champ id doit être une chaîne de caractères.",
  }),
});

export const participationOwnerSchema = Joi.object({
  participation_id: Joi.number().required().messages({
    "any.required": "L'ID de la participation est obligatoire.",
    "number.base": "L'ID de la participation doit être un nombre.",
    "number.integer": "L'ID de la participation doit être un entier.",
    "number.min": "L'ID de la participation doit être supérieur ou égal à 1.",
  }),
});