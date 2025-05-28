import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { challengeReviewController } from 'controllers/challengeReviewController';

export const challengeReviewRouter = Router();

challengeReviewRouter.post('/create', controllerWrapper(challengeReviewController.createChallengeReview));
challengeReviewRouter.post('/check/user', controllerWrapper(challengeReviewController.checkUserChallengeReview));