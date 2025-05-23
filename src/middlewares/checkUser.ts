import debug from "debug";

import type { Request, Response } from "express";

import { Roles as aclRole } from "acl/aclRoles";
import { redisService } from "services/redisService";
import { tokenService } from "services/tokenService";
import { User } from "models/UserModel";
import { accessTokenSchema } from "validations/cookieValidations";

const checkUserMwDebug = debug("app:CheckUserMiddleware");

export async function checkUser(req: Request, res: Response) {
  try {
    checkUserMwDebug("👮‍♂️ CheckUserMiddleware");
    const errorMessage = "Vous n'êtes pas autorisé à accéder à cette ressource";

    // * Joi validation
    const { error } = accessTokenSchema.validate(req.cookies, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((ErrorDetail) => ({
        errorMessage: ErrorDetail.message,
      }));

      checkUserMwDebug("Validation error:", validationErrors);

      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
        validationErrors: validationErrors,
      };
      return userError;
    }

    // * Check if the access token is present in the cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      checkUserMwDebug("❌ No access token provided");
      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
      };
      return userError;
    }

    // * Check if the access token is valid
    const decodedToken = tokenService.verifyAccessToken(accessToken);
    if (!decodedToken) {
      checkUserMwDebug("❌ Invalid access token");
      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
      };
      return userError;
    }

    // * Check if the access token is blacklisted
    const isBlacklisted = await redisService.getAccessTokenBlacklist(decodedToken.id);
    if (isBlacklisted && isBlacklisted === decodedToken.jti) {
      checkUserMwDebug("❌ Access token is blacklisted");
      const userError = {
        statusCode: 403,
        success: false,
        message: errorMessage,
      };
      return userError;
    }

    // * Check if the access token is whitelisted
    const isWhitelisted = await redisService.getAccessWhitelist(
      decodedToken.id
    );

    if (
      (isWhitelisted && isWhitelisted !== decodedToken.jti) ||
      !isWhitelisted
    ) {
      checkUserMwDebug("❌ Access token is not whitelisted");
      const expirationInSeconds = decodedToken.exp - decodedToken.iat;
      await redisService.setAccessTokenBlacklist(
        decodedToken.id,
        decodedToken.jti,
        expirationInSeconds
      );
      const userError = {
        statusCode: 403,
        success: false,
        message: errorMessage,
      };
      return userError;
    }

    // * Check if the user exists in the database
    const user = await User.findByPk(decodedToken.id);

    if (!user) {
      checkUserMwDebug("❌ User not found");
      const expirationInSeconds = decodedToken.exp - decodedToken.iat;
      await redisService.setAccessTokenBlacklist(
        decodedToken.id,
        decodedToken.jti,
        expirationInSeconds
      );
      const userError = {
        statusCode: 403,
        success: false,
        message: errorMessage,
      };
      return userError;
    }

    // * Good at this point, the user is authorized
    const expirationInSeconds = decodedToken.exp - decodedToken.iat;

    req.user = {
      id: decodedToken.id,
      role: decodedToken.role as aclRole,
      username: decodedToken.username,
      jti: decodedToken.jti,
      ttlToken: expirationInSeconds,
    };

    const userError = {
      statusCode: 200,
      success: true,
      message: "User is authorized",
    };
    return userError;
    
  } catch (error) {
    checkUserMwDebug("❌ Error in CheckUserMiddleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
}
