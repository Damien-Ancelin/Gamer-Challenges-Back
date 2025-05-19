import jwt from "jsonwebtoken";
import debug from "debug";
import { AccessToken, AccessTokenPayload, RefreshToken, RefreshTokenPayload } from "@types";

const jwtDebug = debug("service:jwtService");

const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || "defaultAccessSecret";
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret";
const JWT_ACCESS_EXPIRATION: string = process.env.JWT_ACCESS_EXPIRATION || "7m";
const JWT_REFRESH_EXPIRATION: string = process.env.JWT_REFRESH_EXPIRATION || "7d";

export const tokenService = {
  generateToken: (payload: AccessTokenPayload): string => {
    jwtDebug("Generating JWT token");
    try {
      return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRATION as jwt.SignOptions["expiresIn"],
      });
    } catch (error) {
      jwtDebug("❌ Error generating JWT token:", error);
      throw new Error("Token generation failed");
    }
  },

  verifyToken: (token: string): AccessToken | null => {
    jwtDebug("Verifying JWT token");
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

      if (typeof decoded === "object" && decoded !== null) {
        jwtDebug("✔ Access Token verified successfully");
        return decoded as AccessToken;
      }

      jwtDebug("❌ Invalid token payload");
      return null; // Token payload is not an object
    } catch (error) {
      jwtDebug("❌ Access Token verification failed:", error);
      return null; // Token invalide ou expiré
    }
  },

  generateRefreshToken: (payload: RefreshTokenPayload): string => {
    jwtDebug("Generating JWT refresh token");
    try {
      return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRATION as jwt.SignOptions["expiresIn"],
      });
    } catch (error) {
      jwtDebug("❌ Error generating refresh token:", error);
      throw new Error("Refresh token generation failed");
    }
  },

  verifyRefreshToken: (token: string): RefreshToken | null => {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

      if (typeof decoded === "object" && decoded !== null) {
        jwtDebug("✔ Refresh Token verified successfully");
        return decoded as RefreshToken;
      }

      jwtDebug("❌ Invalid token payload");
      return null; // Token payload is not an object
    } catch (error) {
      jwtDebug("❌ Refresh token verification failed:", error);
      return null; // Token invalide ou expiré
    }
  },
};
