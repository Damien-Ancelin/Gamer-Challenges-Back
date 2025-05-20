import debug from "debug";

import type { NextFunction, Request, Response } from "express";

const notFoundHandlerDebug = debug("error:notFoundHandler");

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction) {
  notFoundHandlerDebug("❌ 404 Not Found");
  res.status(404).json({
    error: "Ressource non trouvée",
  });
}