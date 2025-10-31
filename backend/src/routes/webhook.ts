import express from 'express';
import { handleZoomWebhook } from '../services/zoomWebhook.js';

const router = express.Router();

// Zoom webhook endpoint
router.post('/zoom', handleZoomWebhook);

export default router;
