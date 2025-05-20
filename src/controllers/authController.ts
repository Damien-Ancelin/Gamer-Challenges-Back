import type { Request, Response } from "express";
import debug from "debug";
import argon2 from "argon2";

import { User } from "models/UserModel";
import { loginSchema } from "../validations/userValidations";
import { tokenService } from "services/tokenService";
import { redisService } from "services/redisService";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "configs/cookie";
import { refreshTokenSchema } from "validations/cookieValidations";

const authDebug = debug("app:authController");

export const authController = {
  async login(req: Request, res: Response){
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

    // ? Création des cookies
    res.cookie("accessToken", AccessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", RefreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Utilisateur connecté avec succès',
    });
  },

  async register(_req: Request, _res: Response){
    authDebug("🧔 authController: api/auth/register");
  },

  async logout(_req: Request, _res: Response){
    authDebug("🧔 authController: api/auth/logout");
  },

  async refresh(req: Request, res: Response){
    authDebug("🔄 authController: api/auth/refresh");
    const errorMessage = "Une erreur est survenue";

    const { error } = refreshTokenSchema.validate(req.cookies, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      authDebug("Validation error:", validationErrors);

      res.status(401).json({
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      });
      return;
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(accessToken) {
      const decodedAccessToken = tokenService.verifyAccessToken(accessToken);
      if (decodedAccessToken) {
        authDebug("✔ Access token is still valid");
        res.status(200).json({
          success: true,
          message: "Access token is valid",
        });
        return;
      }
    }

    if (!refreshToken) {
      authDebug("❌ No refresh token provided");
      res.status(401).json({ success: false, message: "Refresh token not provided" });
      return;
    }

    const decodedToken = tokenService.verifyRefreshToken(refreshToken);

    if (!decodedToken) {
      authDebug("❌ Invalid refresh token");
      res.status(401).json({ success: false, message: "Refresh token invalide" });
      return;
    }
    
    const isBlacklisted = await redisService.getTokenBlacklist(decodedToken.id);

    if (isBlacklisted) {
      authDebug("❌ Refresh token is blacklisted");
      res.status(401).json({ success: false, message: "Refresh token blacklisted" });
      return;
    }

    const isWhitelisted = await redisService.getRefreshWhitelist(decodedToken.id);

    if (!isWhitelisted) {
      authDebug("❌ Refresh token is not whitelisted");
      const expirationInSeconds = decodedToken.exp - decodedToken.iat;
      await redisService.setTokenBlacklist(decodedToken.id.toString(), decodedToken.jti, expirationInSeconds);
      res.status(401).json({ success: false, message: "Refresh token non whitelisted" });
      return;
    }

    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      authDebug("❌ User not found");

      res.status(401).json({ success: false, message: "User not found" });
      return 
    }

    const AccessToken = await user.generateAccessToken();

    res.cookie("accessToken", AccessToken, accessTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "access token régénéré",
    });
  }
};
