import jwt from "jsonwebtoken";
import debug from "debug";
import { AccessToken, AccessTokenPayload, RefreshToken, RefreshTokenPayload } from "@types";

const jwtDebug = debug("service:jwtService");

const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || "defaultAccessSecret";
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret";
const JWT_ACCESS_EXPIRATION: string = process.env.JWT_ACCESS_EXPIRATION || "7m";
const JWT_REFRESH_EXPIRATION: string = process.env.JWT_REFRESH_EXPIRATION || "7d";

/**
 * Service for generating and verifying JWT tokens.
 * Handles both access and refresh tokens with configurable secrets and expiration times.
 * 
 * @module tokenService
 * @requires jsonwebtoken
 * @requires debug
 * @typedef {Object} AccessToken - Represents an access token.
 * @typedef {Object} AccessTokenPayload - Payload for the access token.
 * @typedef {Object} RefreshToken - Represents a refresh token.
 * @typedef {Object} RefreshTokenPayload - Payload for the refresh token.
 * @property {string} userId - The ID of the user.
 * @property {string} [email] - The email of the user (optional).
 * @property {string} [username] - The username of the user (optional).
 * @property {string} [role] - The role of the user (optional).
 * @property {string} [iat] - Issued at time (optional).
 * @property {string} [exp] - Expiration time (optional).
 * @property {string} [jti] - JWT ID (optional).
 */

/*
  Explain of this regex:
  This regex is used to validate UUIDs (Universally Unique Identifiers) in the format
  xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx, where:
  - [0-9a-f]{8} matches the first 8 hexadecimal characters.
  - [0-9a-f]{4} matches the next 4 hexadecimal characters.
  - [1-5][0-9a-f]{3} matches the next 4 hexadecimal characters, where the first character is between 1 and 5.
  - [89ab][0-9a-f]{3} matches the next 4 hexadecimal characters, where the first character is either 8, 9, a, or b.
  - [0-9a-f]{12} matches the last 12 hexadecimal characters.
  - The 'i' flag at the end makes the regex case-insensitive.
  This regex ensures that the UUID is in a valid format, which is crucial for ensuring the integrity and uniqueness of tokens.
*/
const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const tokenService = {
  generateAccessToken: (payload: AccessTokenPayload): string => {
    jwtDebug("Generating JWT Access token");
    if((payload.jti.length === 0) || ( !(regexUUID.test(payload.jti))) || (typeof payload.jti !== "string")) {
      throw new Error("Token generation failed");
    }
    try {
      return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRATION as jwt.SignOptions["expiresIn"],
      });
    } catch (error) {
      jwtDebug("❌ Error generating JWT token:", error);
      throw new Error("Token generation failed");
    }
  },

  verifyAccessToken: (token: string): AccessToken | null => {
    jwtDebug("Verifying JWT Access token");
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
