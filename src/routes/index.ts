import { Router } from 'express';
import { testController } from '../controllers/testController';

export const router = Router();

router.get('/test', testController.getTest);
