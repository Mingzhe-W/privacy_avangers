import express from 'express';
const router = express.Router();

import { verifyWorldID } from '../controller/worldIDController.js';

// verify world 
router.post('/verifyWorldID', verifyWorldID);

export default router;