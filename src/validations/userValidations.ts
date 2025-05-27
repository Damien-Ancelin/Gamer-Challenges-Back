import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/^[a-zA0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .lowercase()
    .messages({
      "string.pattern.base": "L'email doit être une adresse email valide",
      "any.required": "L'email est obligatoire",
      "string.empty": "L'email ne peut pas être vide",
      "string.lowercase": "L'email ne doit contenir que des minuscule."
    }),
  password: Joi.string().required().messages({
    "any.required": "Le mot de passe est obligatoire",
    "string.empty": "Le mot de passe ne peut pas être vide",
  }),
});

export const registerSchema = Joi.object({
  lastname: Joi.string().min(3).required().messages({
    "string.min": "Le nom doit contenir au moins 3 caractères.",
    "any.required": "Le nom est obligatoire.",
    "string.empty": "Le nom ne peut pas être vide.",
  }),
  firstname: Joi.string().min(3).required().messages({
    "string.min": "Le prénom doit contenir au moins 3 caractères.",
    "any.required": "Le prénom est obligatoire.",
    "string.empty": "Le prénom ne peut pas être vide.",
  }),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .lowercase()
    .messages({
      "string.pattern.base": "L'email doit être une adresse email valide",
      "any.required": "L'email est obligatoire",
      "string.empty": "L'email ne peut pas être vide",
      "string.lowercase": "L'email ne doit contenir que des minuscule."
    }),
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Le nom d'utilisateur doit contenir au moins 3 caractères.",
    "string.max": "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
    "any.required": "Le nom d'utilisateur est obligatoire.",
    "string.empty": "Le nom d'utilisateur ne peut pas être vide.",
  }),
  password: Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)
  .required()
  .messages({
    "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
    "string.max": "Le mot de passe ne peut pas dépasser 128 caractères.",
    "any.required": "Le mot de passe est obligatoire.",
    "string.empty": "Le mot de passe ne peut pas être vide.",
  }),
});

export const updateUserSchema = Joi.object({
  lastname: Joi.string().optional(),
  firstname: Joi.string().optional(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .required()
    .lowercase()
    .messages({
      "string.pattern.base": "L'email doit être une adresse email valide",
      "any.required": "L'email est obligatoire",
      "string.empty": "L'email ne peut pas être vide",
      "string.lowercase": "L'email ne doit contenir que des minuscule."
    }),
  avatar: Joi.string()
    .pattern(/^(https?:\/\/.*\.(?:png|jpg|webp))$/)
    .optional()
    .messages({
      "string.pattern.base": "L'URL de l'avatar doit être une URL valide."
    }),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  password: Joi.string()
    .allow("", null)
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.max": "Le mot de passe ne peut pas dépasser 128 caractères.",
    }),
});

