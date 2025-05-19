import { Router } from 'express';
import { testController } from 'controllers/testController';
import { authRouter } from './api/authRouter';

export const apiRouter = Router();

apiRouter.get('/test', testController.getTest);
apiRouter.use('/auth', authRouter);


