import Joi from "joi";

export const createChallengeSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).messages({
    "string.min": "Le nom du challenge doit contenir au moins 3 caractères.",
    "string.max": "Le nom du challenge ne peut pas dépasser 50 caractères.",
    "any.required": "Le nom du challenge est obligatoire.",
    "string.empty": "Le nom du challenge ne peut pas être vide.",
  }),
  description: Joi.string().required().min(10).max(1000).messages({
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

export const challengeOwnerSchema = Joi.object({
  challenge_id: Joi.number().required().messages({
    "any.required": "L'ID du challenge est obligatoire.",
    "number.base": "L'ID du challenge doit être un nombre.",
    "number.integer": "L'ID du challenge doit être un entier.",
    "number.min": "L'ID du challenge doit être supérieur ou égal à 1.",
  })
});

export const updateChallengeSchema = Joi.object({
  name: Joi.string().optional().min(3).max(50).messages({
    "string.min": "Le nom du challenge doit contenir au moins 3 caractères.",
    "string.max": "Le nom du challenge ne peut pas dépasser 50 caractères.",
    "any.optional": "Le nom du challenge est obligatoire.",
    "string.empty": "Le nom du challenge ne peut pas être vide.",
  }),
  description: Joi.string().optional().min(10).max(1000).messages({
    "string.min": "La description du challenge doit contenir au moins 10 caractères.",
    "string.max": "La description du challenge ne peut pas dépasser 500 caractères.",
    "any.optional": "La description du challenge est obligatoire.",
    "string.empty": "La description du challenge ne peut pas être vide.",
  }),
  rules: Joi.string().optional().min(10).max(10000).messages({
    "string.min": "Les règles du challenge doivent contenir au moins 10 caractères.",
    "string.max": "Les règles du challenge ne peuvent pas dépasser 10000 caractères.",
    "any.optional": "Les règles du challenge sont obligatoires.",
    "string.empty": "Les règles du challenge ne peuvent pas être vides.",
  }),
  gameId: Joi.string().optional().messages({
    "any.optional": "Le jeu est obligatoire.",
    "string.empty": "Le jeu doit être sélectionné.",
  }),
  categoryId: Joi.string().optional().messages({
    "any.optional": "La catégorie est obligatoire.",
    "string.empty": "La catégorie doit être sélectionnée.",
  }),
  levelId: Joi.string().optional().messages({
    "any.optional": "La difficulté est obligatoire.",
    "string.empty": "La difficulté doit être sélectionnée.",
  }),
  isOpen: Joi.boolean().optional().messages({
    "any.optional": "L'état d'ouverture du challenge est optionnel.",
    "boolean.base": "L'état d'ouverture du challenge doit être un booléen.",
  }),
})

export const deleteChallengeSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "L'ID du challenge est obligatoire.",
    "number.base": "L'ID du challenge doit être un nombre.",
    "number.integer": "L'ID du challenge doit être un entier.",
    "number.min": "L'ID du challenge doit être supérieur ou égal à 1.",
  })
});