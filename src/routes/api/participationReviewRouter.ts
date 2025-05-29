import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { participationReviewController } from 'controllers/participationReviewController';

export const participationReviewRouter = Router();
participationReviewRouter.post('/create', controllerWrapper(participationReviewController.createParticipationReview));
participationReviewRouter.post('/check/user', controllerWrapper(participationReviewController.checkUserParticipationReview));
participationReviewRouter.get('/participation/:participation_id/review', controllerWrapper(participationReviewController.getParticipationReviewById));