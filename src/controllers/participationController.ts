import type { Request, Response } from "express";
import debug from "debug";

import { checkUserParticipationSchema } from "validations/participationValidations";
import { Participation } from "models/ParticipationModel";

const participationDebug = debug("app:participationController");

export const participationController = {
  async getParticipationReviewByChallengeId(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: GET api/participations/:challengeId/review"
    );

    const errorMessage =
      "Une erreur est survenue lors de la récupération des participations du challenge";

    if (!req.params.challenge_id) {
      participationDebug("❌ challenge_id parameter is missing");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const challengeId = Number(req.params.challenge_id);

    if (isNaN(challengeId)) {
      participationDebug("❌ Invalid challenge_id parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const participations = await Participation.findAndCountAll({
      where: { challengeId },
      attributes: ["challengeId"],
    });

    participationDebug("✅ Successfully retrieved participation reviews");

    res.status(200).json({
      success: true,
      participationReview: {
        participationCounts: participations.count,
      },
    });
  },
  async checkUserParticipation(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: POST api/participations/check/user"
    );
    const errorMessage =
      "Une erreur est survenue lors de la vérification de la participation de l'utilisateur";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = checkUserParticipationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      participationDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const challengeId = Number(req.body.challenge_id);
    const userId = userTokenData.id;

    const participation = await Participation.findOne({
      where: { userId, challengeId },
    });

    const isParticipated = participation ? true : false;

    participationDebug(
      `✅ User participation check completed: ${isParticipated}`
    );

    res.status(200).json({
      success: true,
      isParticipated,
    });
  },
};
