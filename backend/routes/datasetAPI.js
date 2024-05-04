import express from 'express';
const router = express.Router();

import { getData } from '../controller/datasetController.js';

//get data
router.get('/getData', getData);

export default router;