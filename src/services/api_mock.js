// Mock API for frontend-only development
// This replaces the backend API calls with mock data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const MOCK_IMAGES = [
  {
    _id: '1',
    caption: 'Beautiful sunset over mountains',
    filePath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    uploaderName: 'John Doe',
    createdAt: new Date().toISOString(),
    status: 'approved'
  },
  {
    _id: '2', 
    caption: 'City lights at night',
    filePath: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&h=300&fit=crop',
    uploaderName: 'Jane Smith',
    createdAt: new Date().toISOString(),
    status: 'approved'
  },
  {
    _id: '3',
    caption: 'Forest pathway',
    filePath: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
    uploaderName: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    status: 'pending'
  },
  {
    _id: '4',
    caption: 'Ocean waves',
    filePath: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=300&fit=crop',
    uploaderName: 'Sarah Wilson',
    createdAt: new Date().toISOString(),
    status: 'approved'
  },
  {
    _id: '5',
    caption: 'Mountain lake reflection',
    filePath: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=300&fit=crop',
    uploaderName: 'Alex Brown',
    createdAt: new Date().toISOString(),
    status: 'approved'
  },
  {
    _id: '6',
    caption: 'Desert landscape',
    filePath: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=300&fit=crop',
    uploaderName: 'Emma Davis',
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
];

// Mock API response format
const createMockResponse = (data) => ({
  data: {
    success: true,
    ...data
  }
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    await delay(500);
    return createMockResponse({
      message: 'Registration successful',
      user: {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      }
    });
  },
  
  login: async (credentials) => {
    await delay(500);
    // Mock login success
    return createMockResponse({
      message: 'Login successful',
      user: {
        id: 1,
        name: 'John Doe',
        email: credentials.email,
        role: credentials.email === 'admin@snapx.com' ? 'admin' : 'user'
      },
      token: 'mock-jwt-token'
    });
  },
  
  verify: async () => {
    await delay(300);
    return createMockResponse({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'user@example.com',
        role: 'user'
      }
    });
  }
};

// Images API
export const imagesAPI = {
  upload: async (formData) => {
    await delay(1000);
    const newImage = {
      _id: Date.now().toString(),
      caption: formData.get('caption') || 'New upload',
      filePath: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=300&fit=crop',
      uploaderName: 'Current User',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    MOCK_IMAGES.push(newImage);
    return createMockResponse({
      message: 'Image uploaded successfully',
      image: newImage
    });
  },
  
  getGallery: async (page = 1, limit = 12) => {
    await delay(500);
    const approvedImages = MOCK_IMAGES.filter(img => img.status === 'approved');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const images = approvedImages.slice(startIndex, endIndex);
    
    return createMockResponse({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(approvedImages.length / limit),
        total: approvedImages.length
      }
    });
  },
  
  getById: async (id) => {
    await delay(300);
    const image = MOCK_IMAGES.find(img => img._id === id);
    return createMockResponse({ image });
  },
  
  search: async (query, page = 1, limit = 12) => {
    await delay(500);
    const filteredImages = MOCK_IMAGES.filter(img => 
      img.status === 'approved' && 
      (img.caption.toLowerCase().includes(query.toLowerCase()) ||
       img.uploaderName.toLowerCase().includes(query.toLowerCase()))
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const images = filteredImages.slice(startIndex, endIndex);
    
    return createMockResponse({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredImages.length / limit),
        total: filteredImages.length
      }
    });
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    await delay(500);
    return createMockResponse({
      stats: {
        pending: MOCK_IMAGES.filter(img => img.status === 'pending').length,
        approved: MOCK_IMAGES.filter(img => img.status === 'approved').length,
        rejected: MOCK_IMAGES.filter(img => img.status === 'rejected').length,
        totalUsers: 150
      }
    });
  },
  
  getPending: async (page = 1, limit = 10) => {
    await delay(500);
    const pendingImages = MOCK_IMAGES.filter(img => img.status === 'pending');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const images = pendingImages.slice(startIndex, endIndex);
    
    return createMockResponse({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(pendingImages.length / limit),
        total: pendingImages.length
      }
    });
  },
  
  getImages: async (status = 'all', page = 1, limit = 10) => {
    await delay(500);
    let filteredImages = MOCK_IMAGES;
    if (status !== 'all') {
      filteredImages = MOCK_IMAGES.filter(img => img.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const images = filteredImages.slice(startIndex, endIndex);
    
    return createMockResponse({
      images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredImages.length / limit),
        total: filteredImages.length
      }
    });
  },
  
  approve: async (id) => {
    await delay(500);
    const image = MOCK_IMAGES.find(img => img._id === id);
    if (image) {
      image.status = 'approved';
    }
    return createMockResponse({
      message: 'Image approved successfully'
    });
  },
  
  reject: async (id, reason) => {
    await delay(500);
    const image = MOCK_IMAGES.find(img => img._id === id);
    if (image) {
      image.status = 'rejected';
      image.rejectionReason = reason;
    }
    return createMockResponse({
      message: 'Image rejected successfully'
    });
  },
  
  delete: async (id) => {
    await delay(500);
    const index = MOCK_IMAGES.findIndex(img => img._id === id);
    if (index > -1) {
      MOCK_IMAGES.splice(index, 1);
    }
    return createMockResponse({
      message: 'Image deleted successfully'
    });
  },
  
  bulkAction: async (action, imageIds, reason = '') => {
    await delay(1000);
    imageIds.forEach(id => {
      const image = MOCK_IMAGES.find(img => img._id === id);
      if (image) {
        if (action === 'approve') {
          image.status = 'approved';
        } else if (action === 'reject') {
          image.status = 'rejected';
          image.rejectionReason = reason;
        } else if (action === 'delete') {
          const index = MOCK_IMAGES.findIndex(img => img._id === id);
          if (index > -1) {
            MOCK_IMAGES.splice(index, 1);
          }
        }
      }
    });
    
    return createMockResponse({
      message: `Bulk ${action} completed successfully`
    });
  }
};

// Default export (mock axios instance)
const mockApi = {
  get: async (url) => {
    console.log('Mock API GET:', url);
    return createMockResponse({ message: 'Mock GET response' });
  },
  post: async (url, data) => {
    console.log('Mock API POST:', url, data);
    return createMockResponse({ message: 'Mock POST response' });
  },
  delete: async (url) => {
    console.log('Mock API DELETE:', url);
    return createMockResponse({ message: 'Mock DELETE response' });
  }
};

export default mockApi;