import { Router } from 'express';
import { controllerWrapper } from 'middlewares/controllerWrapper';
import { challengeController } from '../../controllers/challengeController';

export const challengeRouter = Router();

challengeRouter.get('/create', controllerWrapper(challengeController.getCreateChallenge));
challengeRouter.post('/create', controllerWrapper(challengeController.createChallenge));