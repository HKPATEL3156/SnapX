import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import imageRoutes from './routes/images.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'SnapX Server is running!', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Create default admin user
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Create default admin user
async function createDefaultAdmin() {
  try {
    const User = (await import('./models/User.js')).default;
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@snapx.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Default admin created: admin@snapx.com / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SnapX Server running on port ${PORT}`);
  console.log(`📸 Upload endpoint: http://localhost:${PORT}/api/images/upload`);
  console.log(`🖼️ Gallery endpoint: http://localhost:${PORT}/api/images/gallery`);
  console.log(`👑 Admin panel: http://localhost:${PORT}/api/admin/pending`);
});

export default app;