import type { Request, Response } from "express";
import debug from "debug";

import { cloudinaryService } from "services/cloudinaryService";
import { createChallengeSchema } from "validations/challengeValidations";

import { Category } from "models/CategoryModel";
import { Level } from "models/LevelModel";
import { Game } from "models/GameModel";
import { Challenge } from "models/ChallengeModel";
import { ChallengeReview } from "models/ChallengeReviewModel";

const challengeDebug = debug("app:challengeController");

export const challengeController = {
  async getChallenges(req: Request, res: Response) {
    challengeDebug("🧩 challengeController: GET api/challenges");

    const limitMax: number = 20;

    if (req.query.limit && isNaN(Number(req.query.limit))) {
      challengeDebug("❌ Invalid limit query parameter");
      res.status(400).json({
        success: false,
        message: "Invalid limit query parameter",
      });
      return;
    }

    const limit: number = Math.min(
      20,
      req.query.limit ? Number(req.query.limit) : limitMax
    );

    if (req.query.currentPage && isNaN(Number(req.query.currentPage))) {
      challengeDebug("❌ Invalid currentPage query parameter");
      res.status(400).json({
        success: false,
        message: "Invalid currentPage query parameter",
      });
      return;
    }

    const order: string =
      typeof req.query.order === "string" ? req.query.order : "createdAt";

    const orderDirection: string =
      typeof req.query.orderDirection === "string"
        ? req.query.orderDirection
        : "DESC";

    const howManyRows: number = await Challenge.count();
    const totalPages: number = Math.ceil(howManyRows / limit);
    const currentPage: number = Math.min(
      totalPages,
      req.query.currentPage ? Number(req.query.currentPage) : 1
    );

    const offset: number = (currentPage - 1) * limit;

    const challenges = await Challenge.findAll({
      order: [[order, orderDirection]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Level,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Game,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Bienvenue sur la page des challenges",
      challenges: challenges,
      pagination: {
        currentPage: currentPage,
        limit: limit,
        totalPages: totalPages,
      },
    });
  },
  async getChallengeById(_req: Request, res: Response) {
    challengeDebug("🧩 challengeController: GET api/challenges/:id");
    res.status(501).json({
      success: false,
      message: "Cette fonctionnalité n'est pas encore implémentée",
    });
  },
  async getChallengeReviewById(req: Request, res: Response) {
    challengeDebug("🧩 challengeController: GET api/challenges/:id/ratings");
    const errorMessage =
      "Une erreur est survenue lors de la récupération des notes du challenge";

    if (!req.params.id) {
      challengeDebug("❌ id parameter is missing");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const challengeId = Number(req.params.id);

    if (isNaN(challengeId)) {
      challengeDebug("❌ Invalid id parameter");
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

    challengeDebug("✅ Successfully retrieved challenge reviews");

    res.status(200).json({
      success: true,
      challengeReview: {
        ratingCounts,
        averageRating,
      },
    });
  },
  async getCreateChallenge(req: Request, res: Response) {
    challengeDebug("🧩 challengeController: GET api/challenges/create");

    const userTokenData = req.user;

    if (!userTokenData) {
      challengeDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const categories = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    const levels = await Level.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    const getGames = await Game.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "ASC"]],
    });

    const games = getGames.map((game) => ({
      id: game.id,
      name: game.name,
    }));

    res.status(200).json({
      success: true,
      message: "Bienvenue sur la page de création de challenge",
      dataValues: {
        categories: categories,
        levels: levels,
        games: games,
      },
    });
  },
  async createChallenge(req: Request, res: Response) {
    challengeDebug("🧩 challengeController: POST api/challenges/create");
    const errorMessage =
      "Une erreur est survenue lors de la création du challenge";

    const userTokenData = req.user;

    if (!userTokenData) {
      challengeDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = createChallengeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      challengeDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const { name, description, rules, gameId, categoryId, levelId } = req.body;

    const gameIdNumber = parseInt(gameId, 10);
    const categoryIdNumber = parseInt(categoryId, 10);
    const levelIdNumber = parseInt(levelId, 10);
    if (
      isNaN(gameIdNumber) ||
      isNaN(categoryIdNumber) ||
      isNaN(levelIdNumber)
    ) {
      challengeDebug("❌ Invalid IDs provided");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const challengeImage = req.file
      ? await cloudinaryService.uploadChallengeImage(req.file.path)
      : null;

    const newChallenge = await Challenge.create({
      name: name,
      challengeImage: challengeImage,
      description: description,
      rules: rules,
      userId: userTokenData.id,
      categoryId: categoryIdNumber,
      levelId: levelIdNumber,
      gameId: gameIdNumber,
    });

    res.status(201).json({
      success: true,
      message: "le challenge à été créer avec succès",
      challengeId: newChallenge.id,
    });
  },
};
