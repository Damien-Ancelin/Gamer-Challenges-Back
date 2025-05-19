import { Router } from 'express';

import { authRouter } from './authRouter';
import { testController } from 'controllers/testController';

export const apiRouter = Router();

// Auth routes
apiRouter.use('/auth', authRouter);

// ! Test route
apiRouter.get('/test', testController.getTest);