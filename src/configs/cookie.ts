import { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  maxAge: 10 * 60 * 1000, // 10 minutes
  // ! Pensez a définir des routes !
  path: "/", // adapte si besoin
};

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  path: "/api/auth/",
};