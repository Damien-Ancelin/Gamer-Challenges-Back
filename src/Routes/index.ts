import { Router } from 'express';
import { testController } from '../Controllers/testController';

export const router = Router();

router.get('/', testController.getTest);
