import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { participationController } from 'controllers/participationController';

export const participationRouter = Router();

participationRouter.get('/popular', controllerWrapper(participationController.getPopularParticipations));
participationRouter.post('/create', controllerWrapper(participationController.createUserParticipation));

participationRouter.delete('/delete', controllerWrapper(participationController.deleteUserParticipation));
participationRouter.post('/check/user', controllerWrapper(participationController.checkUserParticipation));
participationRouter.get('/:challenge_id/review', controllerWrapper(participationController.getParticipationReviewByChallengeId));

