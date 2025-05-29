import type { Request, Response } from "express";
import debug from "debug";

import { ParticipationReview } from "models/ParticipationReviewModel";
import {
  checkUserParticipationReviewSchema,
  createParticipationReviewSchema,
} from "validations/participationReviewValidations";

const participationReviewDebug = debug("app:participationReviewController");

export const participationReviewController = {
  async createParticipationReview(req: Request, res: Response) {
    participationReviewDebug(
      "🧩 participationReviewController: POST api/participation-reviews/create"
    );
    const errorMessage =
      "Une erreur est survenue lors de la création de l'avis sur la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationReviewDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = createParticipationReviewSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      participationReviewDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const participationId = Number(req.body.participation_id);
    const rating = Number(req.body.rating);
    const userId = userTokenData.id;

    const existingParticipationReview = await ParticipationReview.findOne({
      where: { userId, participationId },
    });

    if (existingParticipationReview) {
      participationReviewDebug("❌ Participation review already exists");
      res.status(400).json({
        success: false,
        message: "Vous avez déjà laissé un avis pour cette participation.",
      });
      return;
    }

    participationReviewDebug(
      `Creating participation review for user ${userId} on participation ${participationId} with rating ${rating}`
    );

    const newParticipationReview = await ParticipationReview.create({
      userId,
      participationId,
      rating,
    });

    if (!newParticipationReview) {
      participationReviewDebug("❌ Failed to create participation review");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const isVoted = newParticipationReview ? true : false;

    participationReviewDebug("✅ Successfully created participation review");

    res.status(201).json({
      success: true,
      message: "Note sur la participation créé avec succès",
      isVoted: isVoted,
      participationReview: newParticipationReview,
    });
  },
  async checkUserParticipationReview(req: Request, res: Response) {
    participationReviewDebug(
      "🧩 participationReviewController: POST api/participation-reviews/check/user"
    );
    const errorMessage =
      "Une erreur est survenue lors de la vérification de l'avis sur la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationReviewDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = checkUserParticipationReviewSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      participationReviewDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const participationId = Number(req.body.participation_id);
    const userId = userTokenData.id;

    const participationReview = await ParticipationReview.findOne({
      where: { userId, participationId },
    });

    const isReviewed = participationReview ? true : false;

    res.status(200).json({
      success: true,
      isReviewed: isReviewed,
    });
  },
  async getParticipationReviewById(req: Request, res: Response) {
    participationReviewDebug(
      "🧩 participationReviewController: GET api/participation-reviews/participation/:participation_id/review"
    );
    const errorMessage =
      "Une erreur est survenue lors de la récupération de la participation";

    if (!req.params.participation_id) {
      participationReviewDebug("❌ id parameter is missing");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const participationId = Number(req.params.participation_id);

    if (isNaN(participationId)) {
      participationReviewDebug("❌ Invalid id parameter");
      res.status(400).json({
        success: false,
        message: "Invalid id parameter",
      });
      return;
    }

    const participationReviews = await ParticipationReview.findAndCountAll({
      where: { participationId },
      attributes: ["rating"],
    });

    participationReviewDebug(
      `Found ${participationReviews.count} reviews for participation ID ${participationId}`
    );

    const ratingCounts = participationReviews.count;
    const sumRatings = participationReviews.rows.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      ratingCounts > 0 ? parseFloat((sumRatings / ratingCounts).toFixed(1)) : 0;

    participationReviewDebug(
      "✅ Successfully retrieved participation review by ID"
    );
    res.status(200).json({
      success: true,
      participationReview: {
        ratingCounts,
        averageRating,
      },
    });
  },
};
