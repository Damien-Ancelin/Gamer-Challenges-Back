import type { Request, Response } from "express";
import debug from "debug";
import { Participation } from "models/ParticipationModel";

const participationDebug = debug("app:participationController");

export const participationController = {
  async getParticipationReviewByChallengeId(req: Request, res: Response) {
    participationDebug("🧩 participationController: GET api/participations/:challengeId/review");

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
      }
    });
  },
};