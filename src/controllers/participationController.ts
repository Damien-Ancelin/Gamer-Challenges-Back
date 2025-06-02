import type { Request, Response } from "express";
import debug from "debug";
import sequelize from "configs/sequelize";

import {
  checkUserParticipationSchema,
  createUserParticipationSchema,
  deleteUserParticipationSchema,
  getParticipationByIdSchema,
  participationOwnerSchema,
  updateUserParticipationSchema,
} from "validations/participationValidations";

import { Participation } from "models/ParticipationModel";
import { Challenge } from "models/ChallengeModel";
import { Category } from "models/CategoryModel";
import { Level } from "models/LevelModel";
import { Game } from "models/GameModel";
import { User } from "models/UserModel";

const participationDebug = debug("app:participationController");

export const participationController = {
  async getParticipations(req: Request, res: Response) {
    participationDebug("🧩 participationController: GET api/participations");
    const errorMessage =
      "Une erreur est survenue lors de la récupération des participations";

    const limitMax: number = 20;

    if (req.query.limit && isNaN(Number(req.query.limit))) {
      participationDebug("❌ Invalid limit query parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const limit: number = Math.min(
      20,
      req.query.limit ? Number(req.query.limit) : limitMax
    );

    if (req.query.currentPage && isNaN(Number(req.query.currentPage))) {
      participationDebug("❌ Invalid currentPage query parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
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

    const participations = await Participation.findAll({
      limit: limit,
      offset: offset,
      order: [[order, orderDirection]],
      where: { isValidated: true },
      include: [
        {
          model: Challenge,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
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
        },
        {
          model: User,
          attributes: {
            exclude: [
              "id",
              "lastname",
              "firstname",
              "email",
              "avatar",
              "password",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      participations: participations,
      pagination: {
        currentPage: currentPage,
        limit: limit,
        totalPages: totalPages,
      },
    });
  },
  async getUserParticipations(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: GET api/participations/user"
    );
    const errorMessage =
      "Une erreur est survenue lors de la récupération des participations de l'utilisateur";

    const userTokenData = req.user;
    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const limitMax: number = 10;

    if (req.query.limit && isNaN(Number(req.query.limit))) {
      participationDebug("❌ Invalid limit query parameter");
      res.status(400).json({
        success: false,
        message: "Invalid limit query parameter",
      });
      return;
    }

    const howManyRows: number = await Participation.count({
      where: { userId: userTokenData.id },
    });

    if (howManyRows === 0 || typeof howManyRows !== "number") {
      participationDebug("❌ No challenges found for the user");
      res.status(200).json({
        success: true,
        message: "Aucunes participation trouvé pour l'utilisateur",
        participations: [],
        pagination: {
          currentPage: 1,
          limit: req.query.limit ? Number(req.query.limit) : limitMax,
          totalPages: 1,
        },
      });
      return;
    }

    const limit: number = Math.min(
      10,
      req.query.limit ? Number(req.query.limit) : limitMax
    );

    if (req.query.currentPage && isNaN(Number(req.query.currentPage))) {
      participationDebug("❌ Invalid currentPage query parameter");
      res.status(400).json({
        success: false,
        message: "Invalid currentPage query parameter",
      });
      return;
    }

    const order: string =
      typeof req.query.order === "string" ? req.query.order : "updatedAt";

    const orderDirection: string =
      typeof req.query.orderDirection === "string"
        ? req.query.orderDirection
        : "DESC";

    const totalPages: number = Math.ceil(howManyRows / limit);
    const currentPage: number = Math.min(
      totalPages,
      req.query.currentPage ? Number(req.query.currentPage) : 1
    );

    const offset: number = (currentPage - 1) * limit;

    const participations = await Participation.findAll({
      where: { userId: userTokenData.id },
      order: [[order, orderDirection]],
      limit: limit,
      offset: offset,
      include: [
        {
          model: Challenge,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
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
        },
      ],
    });

    if (!participations || participations.length === 0) {
      participationDebug("❌ No participations found for the user");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Mes participations récupérées avec succès",
      participations: participations,
      pagination: {
        currentPage: currentPage,
        limit: limit,
        totalPages: totalPages,
      },
    });
  },
  async getPopularParticipations(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: GET api/participations/popular"
    );

    const errorMessage =
      "Une erreur est survenue lors de la récupération des participations populaires";

    const limitMax: number = 20;

    if (req.query.limit && isNaN(Number(req.query.limit))) {
      participationDebug("❌ Invalid limit query parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const limit: number = Math.min(
      20,
      req.query.limit ? Number(req.query.limit) : limitMax
    );

    if (req.query.currentPage && isNaN(Number(req.query.currentPage))) {
      participationDebug("❌ Invalid currentPage query parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const howManyRows: number = await Challenge.count();
    const totalPages: number = Math.ceil(howManyRows / limit);
    const currentPage: number = Math.min(
      totalPages,
      req.query.currentPage ? Number(req.query.currentPage) : 1
    );

    const offset: number = (currentPage - 1) * limit;

    /* 
    select "participation"."challenge_id", COUNT("participation"."id") as "participation_count"
    from "participation"
    GROUP BY  "participation"."challenge_id"
    ORDER BY "participation_count" DESC
    limit = '5';
    */

    const [rows]: any[] = await sequelize.query(
      `
      SELECT 
      "participation"."challenge_id", 
      COUNT("participation"."id") AS "participation_count", 
      "challenge"."is_open"
      FROM "participation"
      INNER JOIN "challenge" ON "participation"."challenge_id" = "challenge"."id"
      WHERE "challenge"."is_open" = true
      GROUP BY "participation"."challenge_id", "challenge"."is_open"
      ORDER BY "participation_count" DESC
      LIMIT :limit
      OFFSET :offset
    `,
      {
        replacements: { limit, offset },
      }
    );

    const popularChallengesId = rows.map(
      (participation: { challenge_id: number }) => participation.challenge_id
    ) as number[];

    const challenges = await Challenge.findAll({
      where: { id: popularChallengesId },
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
      message: "Participations populaires récupérées avec succès",
      challenges: challenges,
      pagination: {
        currentPage: currentPage,
        limit: limit,
        totalPages: totalPages,
      },
    });
  },
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
      isParticipated: true,
      participation: newParticipation,
    });
  },
  async updateUserParticipation(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: PATCH api/participations/update"
    );
    const errorMessage =
      "Une erreur est survenue lors de la mise à jour de la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = updateUserParticipationSchema.validate(req.body, {
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

    const participationId = Number(req.body.id);
    if (isNaN(participationId)) {
      participationDebug("❌ Invalid participation_id provided");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const videoUrl: string | null = req.body.videoLink || null;
    const isValidated: boolean = videoUrl ? true : false;

    const participation = await Participation.findOne({
      where: {
        id: participationId,
        userId: userTokenData.id,
      },
    });

    if (!participation) {
      participationDebug("❌ Participation not found for this user");
      res.status(404).json({
        success: false,
        message: "Aucune participation trouvée pour l'identifiant fourni",
      });
      return;
    }

    const updatedParticipation = await participation.update(
      {
        videoLink: videoUrl || null,
        isValidated: isValidated || false,
      },
      {
        fields: ["videoLink", "isValidated"],
        returning: true,
      }
    );
    if (!updatedParticipation) {
      participationDebug("❌ Failed to update participation");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }
    participationDebug("✅ Participation updated successfully");
    res.status(200).json({
      success: true,
      message: "Votre participation au challenge a bien été mise à jour",
      participation: updatedParticipation,
    });
  },
  async deleteUserParticipation(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: DELETE api/participations/delete"
    );
    const errorMessage =
      "Une erreur est survenue lors de la suppression de la participation";

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
      participationDebug(
        "❌ Participation not found for this user and challenge"
      );
      res.status(404).json({
        success: false,
        message:
          "Vous n'avez aucune participation a supprimer pour ce challenge",
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
  async getParticipationOwner(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: POST api/participations/owner"
    );
    const errorMessage =
      "Une erreur est survenue lors de la récupération du propriétaire de la participation";

    const userTokenData = req.user;

    if (!userTokenData) {
      participationDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { error } = participationOwnerSchema.validate(req.body, {
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

    const participationId = Number(req.body.participation_id);
    if (isNaN(participationId)) {
      participationDebug("❌ Invalid challenge ID provided");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const participation = await Participation.findOne({
      where: {
        id: participationId,
        userId: userTokenData.id,
      },
    });

    const isOwner = participation ? true : false;

    participationDebug(`✅ Participation owner check completed: ${isOwner}`);

    res.status(200).json({
      success: true,
      isOwner: isOwner,
    });
  },
  async getParticipationReviewByChallengeId(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: GET /api/participations/challenge/:challenge_id/count"
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
  async getParticipationById(req: Request, res: Response) {
    participationDebug(
      "🧩 participationController: GET api/participations/:id"
    );

    const errorMessage =
      "Une erreur est survenue lors de la récupération de la participation";

    const { error } = getParticipationByIdSchema.validate(req.body, {
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

    const participationId = Number(req.params.id);

    if (isNaN(participationId)) {
      participationDebug("❌ Invalid id parameter");
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    const participation = await Participation.findByPk(participationId, {
      include: [
        {
          model: Challenge,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
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
        },
        {
          model: User,
          attributes: {
            exclude: [
              "id",
              "lastname",
              "firstname",
              "email",
              "avatar",
              "password",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      ],
    });

    if (!participation) {
      participationDebug("❌ Participation not found");
      res.status(404).json({
        success: false,
        message: "Aucune participation trouvée pour l'identifiant fourni",
      });
      return;
    }

    participationDebug("✅ Successfully retrieved participation by ID");

    res.status(200).json({
      success: true,
      participation,
    });
  },
};
