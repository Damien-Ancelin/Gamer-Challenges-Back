import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { participationReviewController } from 'controllers/participationReviewController';

export const participationReviewRouter = Router();
participationReviewRouter.get('/participation/:participation_id/review', controllerWrapper(participationReviewController.getParticipationReviewById));