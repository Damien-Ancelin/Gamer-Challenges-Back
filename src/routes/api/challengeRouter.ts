import { Router } from 'express';
import upload from 'configs/multer';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { challengeController } from '../../controllers/challengeController';

export const challengeRouter = Router();

challengeRouter.get('/', controllerWrapper(challengeController.getChallenges));
challengeRouter.post('/user', controllerWrapper(challengeController.getUserChallenges));
challengeRouter.get('/create', controllerWrapper(challengeController.getCreateChallenge));
challengeRouter.post('/create', upload.single("challengeImage"), controllerWrapper(challengeController.createChallenge));
challengeRouter.delete('/delete', controllerWrapper(challengeController.deleteChallenge));
challengeRouter.post('/owner', controllerWrapper(challengeController.getChallengeOwner));
challengeRouter.patch('/:id/update', upload.single("challengeImage"), controllerWrapper(challengeController.updateChallenge));
challengeRouter.get('/:id', controllerWrapper(challengeController.getChallengeById));