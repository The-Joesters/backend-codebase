import express from 'express';
import { getAllItems } from 'src/controllers/itemsController';
const router = express.Router();

router.get('/items', getAllItems);

export default router;