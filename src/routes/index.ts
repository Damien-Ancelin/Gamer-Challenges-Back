import { Router } from 'express';
import { apiRouter } from './apiRouter';

export const router = Router();

router.use('/api', apiRouter);


