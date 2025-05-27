import { Router } from 'express';
import upload from 'configs/multer';

import { controllerWrapper } from 'middlewares/controllerWrapper';
import { challengeController } from '../../controllers/challengeController';

export const challengeRouter = Router();

challengeRouter.get('/create', controllerWrapper(challengeController.getCreateChallenge));
challengeRouter.post('/create', upload.single("challengeImage"), controllerWrapper(challengeController.createChallenge));