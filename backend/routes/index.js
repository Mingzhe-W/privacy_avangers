import express from 'express';
const router = express.Router();

import worldIDAPI from './worldIdAPI.js';

router.use(worldIDAPI);

export default router;