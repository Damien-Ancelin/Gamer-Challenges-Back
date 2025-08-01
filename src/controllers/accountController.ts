import type { Request, Response } from "express";
import debug from "debug";
import argon2 from "argon2";

import { User } from "models/UserModel";
import { updateUserSchema } from "validations/userValidations";
import { cloudinaryService } from "services/cloudinaryService";
import { redisService } from "services/redisService";

const accountDebug = debug("app:accountController");

export const accountController = {
  // * Get user
  async getUser(req: Request, res: Response) {
    accountDebug("🧔 accountController: GET api/account/user");

    const userTokenData = req.user;

    if (!userTokenData) {
      accountDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findByPk(userTokenData.id, {
      attributes: {
        exclude: ["id", "password", "createdAt", "updatedAt"],
      },
    });
    if (!user) {
      accountDebug("❌ User not found");
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Bienvenue sur votre midification de compte",
      user: user,
    });
  },

  // * Update user
  async updateUser(req: Request, res: Response) {
    accountDebug("🧔 accountController: PATCH api/account/update");
    const errorMessage = "Une erreur est survenue";

    const userTokenData = req.user;

    if (!userTokenData) {
      accountDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findByPk(userTokenData.id);
    if (!user) {
      accountDebug("❌ User not found");
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const { error } = updateUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      accountDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const avatar = req.file
      ? await cloudinaryService.uploadAvatar(req.file.path)
      : user.avatar;

    const { lastname, firstname, email, username, password } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        accountDebug("❌ Email already exists");
        res.status(409).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
        return;
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        accountDebug("❌ Username already exists");
        res.status(409).json({
          success: false,
          message: "Ce nom d'utilisateur est déjà utilisé",
        });
        return;
      }
    }

    const updatedUser = await user.update(
      {
        lastname: lastname || user.lastname,
        firstname: firstname || user.firstname,
        email: email || user.email,
        avatar: avatar || user.avatar,
        username: username || user.username,
        password: password ? await argon2.hash(password) : user.password,
      },
      {
        fields: [
          "lastname",
          "firstname",
          "email",
          "avatar",
          "username",
          "password",
        ],
        returning: true,
      }
    );
    accountDebug("✔ User updated successfully");

    res.status(200).json({
      success: true,
      message: "En cours de modification",
      user: updatedUser,
    });
  },

  // * Delete user
  async deleteUser(req: Request, res: Response) {
    accountDebug("🧔 accountController: DELETE api/account/update");
    const errorMessage =
      "Une erreur est survenue lors de la suppression du compte";

    const userTokenData = req.user;

    if (!userTokenData) {
      accountDebug("❌ User token data not found");
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findByPk(userTokenData.id);
    if (!user) {
      accountDebug("❌ User not found");
      res.status(404).json({
        success: false,
        message: errorMessage,
      });
      return;
    }

    await user.destroy();

    const blacklistAcessToken = await redisService.setAccessTokenBlacklist(
      user.id,
      userTokenData.jti,
      userTokenData.ttlToken
    );

    if (!blacklistAcessToken) {
      accountDebug("❌ Failed to blacklist access token");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }
    accountDebug("✔ Access token blacklisted successfully");

    const BlackListRefreshToken = await redisService.setRefreshTokenBlacklist(
      user.id,
      userTokenData.jti,
      userTokenData.ttlToken
    );
    if (!BlackListRefreshToken) {
      accountDebug("❌ Failed to blacklist refresh token");
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
      return;
    }
    accountDebug("✔ Refresh token blacklisted successfully");

    accountDebug("✔ User deleted successfully");
    res.status(204).json({
      success: true,
      message: "Votre compte a été supprimé avec succès",
    });
  },
};
