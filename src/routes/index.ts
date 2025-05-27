import { Router } from 'express';
import { authRouter } from './api/authRouter';
import { accountRouter } from './api/accountRouter';
import { challengeRouter } from './api/challengeRouter';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/account', accountRouter);
apiRouter.use('/challenges', challengeRouter);
