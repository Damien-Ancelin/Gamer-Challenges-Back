import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  lastname: Joi.string().min(3).required(),
  firstname: Joi.string().min(3).required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "L'email doit être une adresse email valide",
      "any.required": "L'email est obligatoire",
      "string.empty": "L'email ne peut pas être vide",
    }),
  username: Joi.string().min(3).max(30).required(),
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
  }),
});

export const updateUserSchema = Joi.object({
  lastname: Joi.string().optional(),
  firstname: Joi.string().optional(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .optional()
    .messages({
      "string.pattern.base": "L'email doit être une adresse email valide",
      "string.empty": "L'email ne peut pas être vide",
    }),
  avatar: Joi.string()
    .pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/)
    .optional()
    .messages({
      "string.pattern.base": "L'URL de l'avatar doit être une URL valide."
    }),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
      "string.max": "Le mot de passe ne peut pas dépasser 128 caractères.",
    }),
});

