import type { Request, Response } from "express";
import debug from "debug";
import { User } from "models/UserModel";

const accountDebug = debug("app:accountController");

export const accountController = {
  async getUser(req: Request, res: Response){
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
  async updateUser(req: Request, res: Response){
    accountDebug("🧔 accountController: PATCH api/account/update");

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

    accountDebug('🔍🔍🔍🔍🔍🔍🔍🔍🔍🔍',req.body);

    res.status(200).json({
      success: true,
      message: "En cours de modification",
    });

  },
  async deleteUser(_req: Request, _res: Response){
    accountDebug("🧔 accountController: DELETE api/account/update");
  },
}