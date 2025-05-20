import debug from "debug";

import type { NextFunction, Request, Response } from "express";

const wrapperDebug = debug("error:controllerWrapper");

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any;

export function controllerWrapper(mw: MiddlewareFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await mw(req, res, next);
    } catch (error) {
      wrapperDebug("❌ Error in controllerWrapper:", error);
      next(error);
    }
  };
}
