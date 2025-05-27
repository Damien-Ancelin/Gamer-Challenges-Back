import Joi from "joi";

export const createChallengeSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).messages({
    "string.min": "Le nom du challenge doit contenir au moins 3 caractères.",
    "string.max": "Le nom du challenge ne peut pas dépasser 50 caractères.",
    "any.required": "Le nom du challenge est obligatoire.",
    "string.empty": "Le nom du challenge ne peut pas être vide.",
  }),
  description: Joi.string().required().min(10).max(500).messages({
    "string.min": "La description du challenge doit contenir au moins 10 caractères.",
    "string.max": "La description du challenge ne peut pas dépasser 500 caractères.",
    "any.required": "La description du challenge est obligatoire.",
    "string.empty": "La description du challenge ne peut pas être vide.",
  }),
  rules: Joi.string().required().min(10).max(10000).messages({
    "string.min": "Les règles du challenge doivent contenir au moins 10 caractères.",
    "string.max": "Les règles du challenge ne peuvent pas dépasser 10000 caractères.",
    "any.required": "Les règles du challenge sont obligatoires.",
    "string.empty": "Les règles du challenge ne peuvent pas être vides.",
  }),
  gameId: Joi.string().required().messages({
    "any.required": "Le jeu est obligatoire.",
    "string.empty": "Le jeu doit être sélectionné.",
  }),
  categoryId: Joi.string().required().messages({
    "any.required": "La catégorie est obligatoire.",
    "string.empty": "La catégorie doit être sélectionnée.",
  }),
  levelId: Joi.string().required().messages({
    "any.required": "La difficulté est obligatoire.",
    "string.empty": "La difficulté doit être sélectionnée.",
  }),
})