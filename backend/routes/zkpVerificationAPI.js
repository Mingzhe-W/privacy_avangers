import express from 'express';
const router = express.Router();

import { verifyZkp } from '../controller/zkpVerificationController.js';

// verify world 
router.post('/verifyZkp', verifyZkp);

export default router;