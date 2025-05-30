import { Router } from 'express';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { participationController } from 'controllers/participationController';

export const participationRouter = Router();

participationRouter.get('/', controllerWrapper(participationController.getParticipations));
participationRouter.get('/popular', controllerWrapper(participationController.getPopularParticipations));
participationRouter.post('/create', controllerWrapper(participationController.createUserParticipation));
participationRouter.patch('/update', controllerWrapper(participationController.updateUserParticipation));
participationRouter.delete('/delete', controllerWrapper(participationController.deleteUserParticipation));
participationRouter.post('/check/user', controllerWrapper(participationController.checkUserParticipation));
participationRouter.post('/owner', controllerWrapper(participationController.getParticipationOwner));
participationRouter.get('/challenge/:challenge_id/count', controllerWrapper(participationController.getParticipationReviewByChallengeId));
participationRouter.get('/:id', controllerWrapper(participationController.getParticipationById));

