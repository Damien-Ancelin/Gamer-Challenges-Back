import Joi from "joi";

export const createChallengeReviewSchema = Joi.object({
  challenge_id: Joi.number().required().messages({
      "any.required": "Le champ 'challenge_id' est requis.",
      "number.base": "Le champ 'challenge_id' doit être un nombre.",
    }),
  rating: Joi.number().min(1).max(5).required().messages({
    "any.required": "Le champ 'rating' est requis.",
    "number.base": "Le champ 'rating' doit être un nombre.",
    "number.min": "Le champ 'rating' doit être supérieur ou égal à 1.",
    "number.max": "Le champ 'rating' doit être inférieur ou égal à 5.",
  }),
})