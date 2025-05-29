import { Router } from 'express';
import upload from 'configs/multer';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { challengeController } from '../../controllers/challengeController';

export const challengeRouter = Router();

challengeRouter.get('/', controllerWrapper(challengeController.getChallenges));
challengeRouter.get('/create', controllerWrapper(challengeController.getCreateChallenge));
challengeRouter.post('/create', upload.single("challengeImage"), controllerWrapper(challengeController.createChallenge));
challengeRouter.post('/owner', controllerWrapper(challengeController.getChallengeOwner));
challengeRouter.get('/:id', controllerWrapper(challengeController.getChallengeById));