import type { Request, Response } from "express";
import debug from "debug";

import {
  checkUserParticipationSchema,
  createUserParticipationSchema,
  deleteUserParticipationSchema,
} from "validations/participationValidations";
import { Participation } from "models/ParticipationModel";

const participationDebug = debug("app:participationController");

export const participationController = {
  async createUserParticipation(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: POST api/participations/create"
    );
    const errorMessage =
      "Une erreur est survenue lors de la création de la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = createUserParticipationSchema.validate(req.body, {
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

    const existingParticipation = await Participation.findOne({
      where: { userId, challengeId },
    });
    if (existingParticipation) {
      participationDebug(
        "❌ Participation already exists for this user and challenge"
      );
      res.status(400).json({
        success: false,
        message: "Vous participé déjà à ce challenge",
      });
      return;
    }

    const newParticipation = await Participation.create({
      userId,
      challengeId,
    });

    if (!newParticipation) {
      participationDebug("❌ Failed to create participation");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    participationDebug("✅ Participation created successfully");
    res.status(201).json({
      success: true,
      message: "Votre participation au challenge à bien été enregistré",
      challengeId: newParticipation.challengeId,
      isParticipated: true,
      participation: newParticipation,
    });
  },
  async deleteUserParticipation(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: DELETE api/participations/delete"
    );
    const errorMessage = "Une erreur est survenue lors de la suppression de la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = deleteUserParticipationSchema.validate(req.body, {
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
    if (!participation) {
      participationDebug("❌ Participation not found for this user and challenge");
      res.status(404).json({
        success: false,
        message: "Vous n'avez aucune participation a supprimer pour ce challenge",
      });
      return;
    }
    
    await participation.destroy();
    participationDebug("✅ Participation deleted successfully");

    res.status(204).json();
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
};
