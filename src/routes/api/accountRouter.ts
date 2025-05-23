import { Router } from 'express';

export const accountRouter = Router();

import { accountController } from '../../controllers/accountController';
import { controllerWrapper } from 'middlewares/controllerWrapper';

accountRouter.get('/user', controllerWrapper(accountController.getUser));
accountRouter.patch('/update', controllerWrapper(accountController.updateUser));
accountRouter.delete('/delete', controllerWrapper(accountController.deleteUser));