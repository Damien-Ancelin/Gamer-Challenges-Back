import { Router } from 'express';

export const accountRouter = Router();
import upload from "../../configs/multer";
import { accountController } from '../../controllers/accountController';
import { controllerWrapper } from 'middlewares/controllerWrapper';

accountRouter.get('/user', controllerWrapper(accountController.getUser));
accountRouter.patch('/update', upload.single("avatar"), controllerWrapper(accountController.updateUser));
accountRouter.delete('/delete', controllerWrapper(accountController.deleteUser));