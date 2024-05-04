import express from 'express';
const router = express.Router();

import worldIDAPI from './worldIdAPI.js';
import datasetAPI from './datasetAPI.js';

router.use(worldIDAPI);
router.use(datasetAPI)

export default router;