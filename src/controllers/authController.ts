import type { Request, Response } from "express";
import debug from "debug";
import argon2 from "argon2";

import { loginSchema } from "../validations/userValidations";
import { User } from "models/UserModel";

const authDebug = debug("app:authController");

export const authController = {
  login: async (req: Request, res: Response) => {
    authDebug("🧔 authController: api/auth/login");
    const errorMessage = "Couple email/mot de passe incorrect";

    const { error } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      authDebug("Validation error:", validationErrors);

      return res
        .status(400)
        .json({
          sucess: false,
          message: errorMessage,
          error: validationErrors,
        });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }});

    if (!user) {
      authDebug("❌ User not found");
      return res.status(401).json({ success: false, message: errorMessage });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      authDebug("❌ Invalid password");
      return res.status(401).json({ success: false, message: errorMessage });
    }

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    authDebug("✔ User authenticated successfully");
    authDebug("Access Token:", AccessToken);
    authDebug("Refresh Token:", RefreshToken);

    
  },

  register: (_req: Request, _res: Response) => {
    authDebug("🧔 authController: api/auth/register");
  },
  logout: (_req: Request, _res: Response) => {
    authDebug("🧔 authController: api/auth/logout");
  },
  refresh: (_req: Request, _res: Response) => {
    authDebug("🔄 authController: api/auth/refresh");
  },
};
