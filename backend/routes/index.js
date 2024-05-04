import express from 'express';
const router = express.Router();

import worldIDAPI from './worldIdAPI.js';
import verifyZkpAPI from './zkpVerificationAPI.js';

router.use(worldIDAPI);
router.use(verifyZkpAPI)

export default router;