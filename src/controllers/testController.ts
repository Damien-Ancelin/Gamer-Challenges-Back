import type { Request, Response } from 'express';
import debug from "debug";

const testDebug = debug("app:testController");

export const testController = {
  getTest: (_req: Request, res: Response) => {
    testDebug("testController:Display HomePage");
    res.send('Bienvenue sur l\'API de Gamer Challenges !');
  }
};