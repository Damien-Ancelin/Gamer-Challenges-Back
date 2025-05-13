import type { Request, Response } from 'express';

export const testController = {
  getTest: (_req: Request, res: Response) => {
    res.send('Hello, woOoOrld!');
  }
};