import type { Request, Response } from "express";
import debug from "debug";

import { ParticipationReview } from "models/ParticipationReviewModel";

const participationReviewDebug = debug("app:participationReviewController");

export const participationReviewController = {
  async getParticipationReviewById(req: Request, res: Response) {
    participationReviewDebug(
      "🧩 participationReviewController: GET api/participation-reviews/participation/:participation_id/review"
    );
      const errorMessage = "Une erreur est survenue lors de la récupération de la participation";
  
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
  
      participationReviewDebug("✅ Successfully retrieved participation review by ID");
      res.status(200).json({
        success: true,
        participationReview: {
          ratingCounts,
          averageRating,
        },
      });
    },
}