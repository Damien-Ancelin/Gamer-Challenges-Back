import { Router } from 'express';

import { authRouter } from './api/authRouter';
import { accountRouter } from './api/accountRouter';
import { challengeRouter } from './api/challengeRouter';
import { participationRouter } from './api/participationRouter';
import { challengeReviewRouter } from './api/challengeReviewRouter';
import { participationReviewRouter } from './api/participationReviewRouter';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/account', accountRouter);
apiRouter.use('/challenges', challengeRouter);
apiRouter.use('/participations', participationRouter);
apiRouter.use('/challenge-reviews', challengeReviewRouter);
apiRouter.use('/participation-reviews', participationReviewRouter);
