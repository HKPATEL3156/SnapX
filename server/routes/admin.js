import express from 'express';
import jwt from 'jsonwebtoken';
import Image from '../models/Image.js';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware for admin routes
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Get admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const pendingCount = await Image.countDocuments({ status: 'pending' });
    const approvedCount = await Image.countDocuments({ status: 'approved' });
    const rejectedCount = await Image.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments({ role: 'student' });

    const recentImages = await Image.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fileName caption status createdAt uploaderName');

    res.json({
      stats: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalUsers
      },
      recentImages
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// Get pending images for approval
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const images = await Image.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments({ status: 'pending' });

    res.json({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Pending images error:', error);
    res.status(500).json({ message: 'Server error fetching pending images' });
  }
});

// Get all images with filters
router.get('/images', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Image.countDocuments(query);

    res.json({
      images,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Images fetch error:', error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
});

// Approve image
router.post('/approve/:id', adminAuth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.status !== 'pending') {
      return res.status(400).json({ message: 'Image is not pending approval' });
    }

    image.status = 'approved';
    image.approvedBy = req.user._id;
    image.approvedAt = new Date();
    
    await image.save();

    res.json({ 
      message: 'Image approved successfully',
      image: {
        id: image._id,
        status: image.status,
        approvedAt: image.approvedAt
      }
    });

  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: 'Server error approving image' });
  }
});

// Reject image
router.post('/reject/:id', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.status !== 'pending') {
      return res.status(400).json({ message: 'Image is not pending approval' });
    }

    image.status = 'rejected';
    image.rejectionReason = reason || 'No reason provided';
    
    await image.save();

    res.json({ 
      message: 'Image rejected successfully',
      image: {
        id: image._id,
        status: image.status,
        rejectionReason: image.rejectionReason
      }
    });

  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ message: 'Server error rejecting image' });
  }
});

// Delete image
router.delete('/delete/:id', adminAuth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error deleting image' });
  }
});

// Bulk actions
router.post('/bulk-action', adminAuth, async (req, res) => {
  try {
    const { action, imageIds, reason } = req.body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ message: 'No images selected' });
    }

    let updateData = {};
    
    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          approvedBy: req.user._id,
          approvedAt: new Date()
        };
        break;
      case 'reject':
        updateData = {
          status: 'rejected',
          rejectionReason: reason || 'Bulk rejection'
        };
        break;
      case 'delete':
        await Image.deleteMany({ _id: { $in: imageIds } });
        return res.json({ message: `${imageIds.length} images deleted successfully` });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await Image.updateMany(
      { _id: { $in: imageIds }, status: 'pending' },
      updateData
    );

    res.json({ 
      message: `${result.modifiedCount} images ${action}ed successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({ message: 'Server error performing bulk action' });
  }
});

export default router;