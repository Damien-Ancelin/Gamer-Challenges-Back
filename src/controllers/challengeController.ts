import type { Request, Response } from "express";
import debug from "debug";

const challengeDebug = debug("app:challengeController");

export const challengeController = {
  async getCreateChallenge(_req: Request, _res: Response){
    challengeDebug("🧩 challengeController: GET api/challenges/create");
  },
  async createChallenge(_req: Request, _res: Response) {
    challengeDebug("🧩 challengeController: POST api/challenges/create");
  }
};