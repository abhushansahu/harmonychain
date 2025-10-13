import { Router, Request, Response } from 'express';
import { getPool } from '../config/database';
import { ipfsManager } from '../config/ipfs';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/tracks - Get all tracks with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const pool = getPool();
    let query = `
      SELECT t.*, a.name as artist_name, a.profile_image_hash
      FROM tracks t
      JOIN artists a ON t.artist_address = a.wallet_address
      WHERE t.is_active = true
    `;
    const params: any[] = [];

    if (genre) {
      query += ' AND t.genre = $' + (params.length + 1);
      params.push(genre);
    }

    if (search) {
      query += ' AND (t.title ILIKE $' + (params.length + 1) + ' OR a.name ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM tracks t JOIN artists a ON t.artist_address = a.wallet_address WHERE t.is_active = true';
    const countParams: any[] = [];
    let paramIndex = 1;

    if (genre) {
      countQuery += ' AND t.genre = $' + paramIndex;
      countParams.push(genre);
      paramIndex++;
    }

    if (search) {
      countQuery += ' AND (t.title ILIKE $' + paramIndex + ' OR a.name ILIKE $' + paramIndex + ')';
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        tracks: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching tracks:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch tracks' },
    });
  }
});

// GET /api/tracks/:id - Get specific track
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.query(`
      SELECT t.*, a.name as artist_name, a.bio as artist_bio, a.profile_image_hash
      FROM tracks t
      JOIN artists a ON t.artist_address = a.wallet_address
      WHERE t.id = $1 AND t.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Track not found' },
      });
    }

    const track = result.rows[0];

    // Get track metadata from IPFS if available
    if (track.metadata_hash) {
      try {
        const metadata = await ipfsManager.getJSON(track.metadata_hash);
        track.metadata = metadata;
      } catch (error) {
        logger.warn(`Failed to fetch metadata for track ${id}:`, error);
      }
    }

    res.json({
      success: true,
      data: { track },
    });
  } catch (error) {
    logger.error('Error fetching track:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch track' },
    });
  }
});

// POST /api/tracks - Upload new track
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      ipfsHash,
      title,
      genre,
      artistAddress,
      metadataHash,
    } = req.body;

    if (!ipfsHash || !title || !artistAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' },
      });
    }

    const pool = getPool();

    // Verify artist exists
    const artistResult = await pool.query(
      'SELECT id FROM artists WHERE wallet_address = $1',
      [artistAddress]
    );

    if (artistResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Artist not found' },
      });
    }

    // Insert track
    const result = await pool.query(`
      INSERT INTO tracks (ipfs_hash, title, genre, artist_address, metadata_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [ipfsHash, title, genre, artistAddress, metadataHash]);

    // Ensure content is pinned in IPFS
    await ipfsManager.ensureAvailability(ipfsHash);

    res.status(201).json({
      success: true,
      data: { track: result.rows[0] },
    });
  } catch (error) {
    logger.error('Error creating track:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create track' },
    });
  }
});

// GET /api/tracks/:id/stream - Get track streaming URL
router.get('/:id/stream', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.query(
      'SELECT ipfs_hash FROM tracks WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Track not found' },
      });
    }

    const ipfsHash = result.rows[0].ipfs_hash;
    const streamingUrl = ipfsManager.getOptimalGateway(ipfsHash);

    res.json({
      success: true,
      data: { streamingUrl },
    });
  } catch (error) {
    logger.error('Error getting streaming URL:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get streaming URL' },
    });
  }
});

export default router;
