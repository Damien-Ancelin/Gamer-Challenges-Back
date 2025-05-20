import type { Request, Response } from "express";
import debug from "debug";
import argon2 from "argon2";

import { loginSchema } from "../validations/userValidations";
import { User } from "models/UserModel";

const authDebug = debug("app:authController");

export const authController = {
  async login(req: Request, res: Response){
    authDebug("🧔 authController: api/auth/login");
    const errorMessage = "Couple email/mot de passe incorrect";
    console.log("req.body", req.body);
    console.log("req.cookies", req.cookies);

    const { error } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      authDebug("Validation error:", validationErrors);

      res.status(400).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      authDebug("❌ User not found");
      res.status(401).json({ success: false, message: errorMessage });
      return;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      authDebug("❌ Invalid password");
      res.status(401).json({ success: false, message: errorMessage });
      return;
    }
    
    authDebug("✔ User authenticated successfully");
    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    res.cookie("accessToken", AccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
      // ! Pensez a définir des routes !
      path: "/",
    });

    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // Token send to the client but usable only on api/auth/refresh-token and no visible in the browser
      path: "/api/auth/refresh-token",
    });

    res.status(200).json({
      success: true,
      message: 'Utilisateur connecté avec succès',
    });
  },

  register: (_req: Request, _res: Response) => {
    authDebug("🧔 authController: api/auth/register");
  },
  logout: (_req: Request, _res: Response) => {
    authDebug("🧔 authController: api/auth/logout");
  },
  refresh: (req: Request, _res: Response) => {
    authDebug("🔄 authController: api/auth/refresh");
    authDebug(req.cookies);
  },
};
