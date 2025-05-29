import type { Request, Response } from "express";
import debug from "debug";

import {
  checkUserChallengeReviewSchema,
  createChallengeReviewSchema,
} from "validations/challengeReviewValidations";

import { ChallengeReview } from "models/ChallengeReviewModel";

const challengeReviewDebug = debug("app:challengeReviewController");

export const challengeReviewController = {
  async createChallengeReview(req: Request, res: Response) {
    challengeReviewDebug(
      "🧩 challengeReviewController: POST api/challenge/review/create"
    );
    const errorMessage =
      "Une erreur est survenue lors de la création de l'avis sur le challenge";

    const userTokenData = req.user;

    if (!userTokenData) {
      challengeReviewDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = createChallengeReviewSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      challengeReviewDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const challengeId = Number(req.body.challenge_id);
    const rating = Number(req.body.rating);
    const userId = userTokenData.id;

    const existingChallengeReview = await ChallengeReview.findOne({
      where: { userId, challengeId },
    });

    if (existingChallengeReview) {
      challengeReviewDebug(
        "❌ Challenge review already exists for this user and challenge"
      );
      res.status(400).json({
        success: false,
        message: "Vous avez déjà laissé un avis pour ce challenge.",
      });
      return;
    }

    challengeReviewDebug(
      `Creating challenge review for user ${userId} on challenge ${challengeId} with rating ${rating}`
    );

    const newChallengeReview = await ChallengeReview.create({
      challengeId,
      userId,
      rating,
    });

    if (!newChallengeReview) {
      challengeReviewDebug("❌ Failed to create challenge review");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const isVoted = newChallengeReview ? true : false;

    challengeReviewDebug("✅ Challenge review created successfully");

    res.status(201).json({
      success: true,
      message: "Note du challenge créé avec succès",
      isVoted: isVoted,
      challengeReview: newChallengeReview,
    });
  },
  async checkUserChallengeReview(req: Request, res: Response) {
    challengeReviewDebug(
      "🧩 challengeReviewController: POST api/challenge/review/check/user"
    );
    const errorMessage =
      "Une erreur est survenue lors de la vérification de l'avis sur le challenge";

    const userTokenData = req.user;

    if (!userTokenData) {
      challengeReviewDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = checkUserChallengeReviewSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      challengeReviewDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const challengeId = Number(req.body.challenge_id);
    const userId = userTokenData.id;

    const challengeReview = await ChallengeReview.findOne({
      where: { userId, challengeId },
    });

    const isReviewed = challengeReview ? true : false;

    res.status(200).json({
      success: true,
      isReviewed,
    });
  },
  async getChallengeReviewById(req: Request, res: Response) {
    challengeReviewDebug(
      "🧩 challengeReviewController: GET api/challenge/review/challenge/:challenge_id/review"
    );
    const errorMessage =
      "Une erreur est survenue lors de la récupération des notes du challenge";

    if (!req.params.challenge_id) {
      challengeReviewDebug("❌ challenge_id parameter is missing");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const challengeId = Number(req.params.challenge_id);

    if (isNaN(challengeId)) {
      challengeReviewDebug("❌ Invalid id parameter");
      res.status(400).json({
        success: false,
        message: "Invalid id parameter",
      });
      return;
    }

    const challengeReviews = await ChallengeReview.findAndCountAll({
      where: { challengeId },
      attributes: ["rating"],
    });

    // Calculer le ratio
    const ratingCounts = challengeReviews.count;
    const sumRatings = challengeReviews.rows.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      ratingCounts > 0 ? parseFloat((sumRatings / ratingCounts).toFixed(1)) : 0;

    challengeReviewDebug("✅ Successfully retrieved challenge reviews");

    res.status(200).json({
      success: true,
      challengeReview: {
        ratingCounts,
        averageRating,
      },
    });
  },
};
