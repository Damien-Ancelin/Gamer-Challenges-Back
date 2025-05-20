import type { Request, Response } from 'express';
import debug from "debug";

const testDebug = debug("app:testController");

export const testController = {
  async getTest(_req: Request, res: Response){
    testDebug("testController:Display HomePage");
    res.send('Bienvenue sur l\'API de Gamer Challenges !');
    // const user = await User.findOne({ where: { email: "test@mail.io" } });
    // testDebug("User found:", user);
  }
};