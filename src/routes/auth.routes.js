import express from 'express';
import { signup, signin, signout, check } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/me', protectRoute, check);
export default router;