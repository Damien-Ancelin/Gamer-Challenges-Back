import debug from "debug";

import type { Request, Response } from "express";

import { Roles as aclRole } from "acl/aclRoles";
import { redisService } from "services/redisService";
import { tokenService } from "services/tokenService";
import { User } from "models/UserModel";

const checkUserMwDebug = debug("app:CheckUserMiddleware");

export async function checkUser(req: Request, res: Response) {
  try {
    checkUserMwDebug("👮‍♂️ CheckUserMiddleware");
    const errorMessage = "Vous n'êtes pas autorisé à accéder à cette ressource";
  
    const token = req.cookies.accessToken;
  
    if (!token) {
      checkUserMwDebug("❌ No access token provided");
      // res.status(403).json({
      //   success: false,
      //   message: errorMessage,
      // });
      const userError = {
        statusCode: 403,
        success: false,
        message: errorMessage,
      };
      return userError;
    };
  
    const decodedToken = tokenService.verifyAccessToken(token);
    if (!decodedToken) {
      checkUserMwDebug("❌ Invalid access token");
      const userError = {
        statusCode: 403,
        success: false,
        message: errorMessage,
      };
      return userError;
    };
    const isBlacklisted = await redisService.getTokenBlacklist(decodedToken.id);
    
    if (isBlacklisted) {
      checkUserMwDebug("❌ Access token is blacklisted");
      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
      };
      return userError;
    }
  
    const isWhitelisted = await redisService.getAccessWhitelist(decodedToken.id);
    
    if (!isWhitelisted) {
      checkUserMwDebug("❌ Refresh token is not whitelisted");
      const expirationInSeconds = decodedToken.exp - decodedToken.iat;
      await redisService.setTokenBlacklist(decodedToken.id, decodedToken.jti, expirationInSeconds);
      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
      };
      return userError;
    }
  
    const user = await User.findByPk(decodedToken.id);
  
    if (!user) {
      checkUserMwDebug("❌ User not found");
      const expirationInSeconds = decodedToken.exp - decodedToken.iat;
      await redisService.setTokenBlacklist(decodedToken.id, decodedToken.jti, expirationInSeconds);
      const userError = {
        statusCode: 401,
        success: false,
        message: errorMessage,
      };
      return userError;
    }
  
    req.user = {
      id: decodedToken.id,
      role: decodedToken.role as aclRole,
      username: decodedToken.username,
    }

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