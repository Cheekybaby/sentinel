import express from "express";
import { verifySignin, verifySignup } from '../controllers/verify.controller.js';
const router = express.Router();

router.post('/signup', verifySignup);
router.post('/signin', verifySignin);


export default router;