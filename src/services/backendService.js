// Backend-like service for SnapX
// This simulates backend functionality using localStorage

class BackendService {
  constructor() {
    this.STORAGE_KEY = 'snapx_images';
    this.USER_STORAGE_KEY = 'snapx_users';
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if no data exists
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialImages = [
        {
          _id: '1',
          title: 'Beautiful sunset over mountains',
          caption: 'Beautiful sunset over mountains',
          filePath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
          uploaderName: 'John Doe',
          uploaderEmail: 'john@example.com',
          studentId: 'STU001',
          description: 'A breathtaking view of the mountain sunset',
          tags: 'nature, sunset, mountains, landscape',
          createdAt: new Date().toISOString(),
          status: 'approved',
          reports: 0,
          likes: 45
        },
        {
          _id: '2', 
          title: 'City lights at night',
          caption: 'City lights at night',
          filePath: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&h=300&fit=crop',
          uploaderName: 'Jane Smith',
          uploaderEmail: 'jane@example.com',
          studentId: 'STU002',
          description: 'Urban photography capturing the night atmosphere',
          tags: 'city, night, lights, urban',
          createdAt: new Date().toISOString(),
          status: 'approved',
          reports: 0,
          likes: 32
        },
        {
          _id: '3',
          title: 'Forest pathway',
          caption: 'Forest pathway',
          filePath: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
          uploaderName: 'Mike Johnson',
          uploaderEmail: 'mike@example.com',
          studentId: 'STU003',
          description: 'A peaceful walk through the forest',
          tags: 'forest, nature, path, trees',
          createdAt: new Date().toISOString(),
          status: 'approved',
          reports: 0,
          likes: 28
        }
      ];
      this.saveImages(initialImages);
    }

    // Initialize users if needed
    if (!localStorage.getItem(this.USER_STORAGE_KEY)) {
      const initialUsers = [
        {
          _id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          studentId: 'STU001',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'admin1',
          name: 'Admin User',
          email: 'admin@snapx.com',
          studentId: 'ADMIN001',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveUsers(initialUsers);
    }
  }

  // Image Operations
  getAllImages() {
    try {
      const images = localStorage.getItem(this.STORAGE_KEY);
      return images ? JSON.parse(images) : [];
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  }

  saveImages(images) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
      return true;
    } catch (error) {
      console.error('Error saving images:', error);
      return false;
    }
  }

  addImage(imageData) {
    const images = this.getAllImages();
    const newImage = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...imageData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      reports: 0,
      likes: 0
    };
    
    images.unshift(newImage); // Add to beginning
    const saved = this.saveImages(images);
    
    if (!saved) {
      throw new Error('Failed to save image to storage');
    }
    
    // Verify the image was actually saved
    const verification = this.getAllImages();
    const imageExists = verification.find(img => img._id === newImage._id);
    
    if (!imageExists) {
      throw new Error('Image was not properly saved - verification failed');
    }
    
    console.log('Image added to backend:', newImage);
    console.log('Verification: Image exists in storage:', !!imageExists);
    console.log('Total images after save:', verification.length);
    
    return newImage;
  }

  updateImageStatus(imageId, status) {
    const images = this.getAllImages();
    const updatedImages = images.map(img => 
      img._id === imageId ? { ...img, status, updatedAt: new Date().toISOString() } : img
    );
    
    this.saveImages(updatedImages);
    console.log('Image status updated:', imageId, status);
    return updatedImages.find(img => img._id === imageId);
  }

  deleteImage(imageId) {
    const images = this.getAllImages();
    const filteredImages = images.filter(img => img._id !== imageId);
    this.saveImages(filteredImages);
    console.log('Image deleted:', imageId);
    return true;
  }

  getImagesByStatus(status) {
    const images = this.getAllImages();
    if (status === 'all') return images;
    return images.filter(img => img.status === status);
  }

  getApprovedImages() {
    return this.getImagesByStatus('approved');
  }

  getPendingImages() {
    return this.getImagesByStatus('pending');
  }

  searchImages(query) {
    const images = this.getAllImages();
    const searchTerm = query.toLowerCase();
    
    return images.filter(img => 
      (img.title && img.title.toLowerCase().includes(searchTerm)) ||
      (img.caption && img.caption.toLowerCase().includes(searchTerm)) ||
      (img.description && img.description.toLowerCase().includes(searchTerm)) ||
      (img.tags && img.tags.toLowerCase().includes(searchTerm)) ||
      (img.uploaderName && img.uploaderName.toLowerCase().includes(searchTerm))
    );
  }

  // User Operations
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.USER_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  addUser(userData) {
    const users = this.getAllUsers();
    const newUser = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date().toISOString(),
      role: userData.role || 'user'
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    console.log('User added to backend:', newUser);
    return newUser;
  }

  // Statistics
  getStats() {
    const images = this.getAllImages();
    const users = this.getAllUsers();
    
    return {
      totalImages: images.length,
      approvedImages: images.filter(img => img.status === 'approved').length,
      pendingImages: images.filter(img => img.status === 'pending').length,
      rejectedImages: images.filter(img => img.status === 'rejected').length,
      totalUsers: users.length,
      totalLikes: images.reduce((sum, img) => sum + (img.likes || 0), 0),
      totalReports: images.reduce((sum, img) => sum + (img.reports || 0), 0)
    };
  }

  // Reset data (for debugging)
  resetData() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.initializeData();
    console.log('Data reset to initial state');
  }

  // Export/Import functionality
  exportData() {
    return {
      images: this.getAllImages(),
      users: this.getAllUsers(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.images) {
      this.saveImages(data.images);
    }
    if (data.users) {
      this.saveUsers(data.users);
    }
    console.log('Data imported successfully');
  }
}

// Create singleton instance
const backendService = new BackendService();

export default backendService;