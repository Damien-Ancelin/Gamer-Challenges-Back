import { Router } from 'express';
import { testController } from '../Controllers/testController';

import type { Request, Response } from 'express';

export const router = Router();

router.get('/', testController.getTest);