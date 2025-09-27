import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
import Image from '../models/Image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `snapx-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload image
router.post('/upload', upload.single('image'), [
  body('uploaderName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('caption').trim().isLength({ min: 1, max: 200 }).withMessage('Caption is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { uploaderName, uploaderEmail, studentId, caption, description, tags } = req.body;

    // Create new image record
    const image = new Image({
      uploaderName,
      uploaderEmail: uploaderEmail || '',
      studentId: studentId || '',
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      caption,
      description: description || '',
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'pending'
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploaded successfully! Waiting for admin approval.',
      image: {
        id: image._id,
        fileName: image.fileName,
        caption: image.caption,
        status: image.status,
        createdAt: image.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Get public gallery (approved images only)
router.get('/gallery', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const images = await Image.find({ status: 'approved' })
      .sort({ approvedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-rejectionReason');

    const total = await Image.countDocuments({ status: 'approved' });
    const totalPages = Math.ceil(total / limit);

    res.json({
      images,
      pagination: {
        currentPage: page,
        totalPages,
        totalImages: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ message: 'Server error fetching gallery' });
  }
});

// Get image by ID (increment view count)
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Only show approved images in public view
    if (image.status !== 'approved') {
      return res.status(404).json({ message: 'Image not available' });
    }

    // Increment view count
    image.views += 1;
    await image.save();

    res.json(image);

  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ message: 'Server error fetching image' });
  }
});

// Search images
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');

    const images = await Image.find({
      status: 'approved',
      $or: [
        { caption: searchRegex },
        { description: searchRegex },
        { uploaderName: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    })
    .sort({ approvedAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Image.countDocuments({
      status: 'approved',
      $or: [
        { caption: searchRegex },
        { description: searchRegex },
        { uploaderName: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    });

    res.json({
      images,
      query,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

export default router;