import type { Request, Response } from "express";
import debug from "debug";

import { cloudinaryService } from "services/cloudinaryService";
import { createChallengeSchema } from "validations/challengeValidations";

import { Category } from "models/CategoryModel";
import { Level } from "models/LevelModel";
import { Game } from "models/GameModel";
import { Challenge } from "models/ChallengeModel";

const challengeDebug = debug("app:challengeController");

export const challengeController = {
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
    const errorMessage = "Une erreur est survenue";

    console.log("req.body", req.body);
    console.log("req.file", req.file);

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
    if (isNaN(gameIdNumber) || isNaN(categoryIdNumber) || isNaN(levelIdNumber) ) {
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
