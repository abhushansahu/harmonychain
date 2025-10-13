import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/artists - Get all artists
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Implement artist listing logic
    res.json({
      success: true,
      data: { artists: [] },
    });
  } catch (error) {
    logger.error('Error fetching artists:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch artists' },
    });
  }
});

export default router;
