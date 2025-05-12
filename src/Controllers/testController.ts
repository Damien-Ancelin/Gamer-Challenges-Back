import type { Request, Response } from 'express';

export const testController = {
  getTest: (req: Request, res: Response) => {
    res.send('Hello, woOoOrld!');
  }
};