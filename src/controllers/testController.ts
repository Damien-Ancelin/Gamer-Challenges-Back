import type { Request, Response } from 'express';
import debug from "debug";

const testDebug = debug("app:testController");

export const testController = {
  getTest: (req: Request, res: Response) => {
    testDebug("testController:Display HomePage");
    testDebug(req);
    res.send('Bienvenue sur l\'API de Gamer Challenges !');
  }
};