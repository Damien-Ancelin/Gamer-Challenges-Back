import debug from "debug";

import type { NextFunction, Request, Response } from "express";

const errorHandlerDebug = debug("app:errorHandler");

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  errorHandlerDebug("❌ Error caught by global handler:", error);
  res.status(500).json({
    error: "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
  });
};