import { Router } from 'express';
import { authRouter } from './api/authRouter';
import { accountRouter } from './api/accountRouter';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/account', accountRouter);
