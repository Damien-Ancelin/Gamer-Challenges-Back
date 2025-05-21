import { Router } from 'express';

export const authRouter = Router();

import { authController } from '../../controllers/authController';
import { controllerWrapper } from 'middlewares/controllerWrapper';

authRouter.post('/login', controllerWrapper(authController.login));
authRouter.post('/register', controllerWrapper(authController.register));
authRouter.post('/logout', controllerWrapper(authController.logout));
authRouter.post('/refresh-token', controllerWrapper(authController.refresh));