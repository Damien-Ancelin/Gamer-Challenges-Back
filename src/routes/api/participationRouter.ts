import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { participationController } from 'controllers/participationController';

export const participationRouter = Router();

participationRouter.get('/:challenge_id/review', controllerWrapper(participationController.getParticipationReviewByChallengeId));
participationRouter.post('/check/user', controllerWrapper(participationController.checkUserParticipation));

