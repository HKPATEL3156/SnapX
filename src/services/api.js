// Mock API for frontend-only development
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get images from localStorage (used by ImageContext)
const getImagesFromStorage = () => {
  try {
    const stored = localStorage.getItem('snapx_images');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Mock data - will be replaced by localStorage data
let MOCK_IMAGES = getImagesFromStorage();

// Mock API response format
const createMockResponse = (data) => ({
  data: { success: true, ...data }
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    await delay(500);
    return createMockResponse({
      message: 'Registration successful',
      user: { id: Date.now(), name: userData.name, email: userData.email, role: 'user' }
    });
  },
  login: async (credentials) => {
    await delay(500);
    return createMockResponse({
      message: 'Login successful',
      user: { id: 1, name: 'User', email: credentials.email, role: 'user' },
      token: 'mock-jwt-token'
    });
  },
  verify: async () => {
    await delay(300);
    return createMockResponse({ user: { id: 1, name: 'User', email: 'user@example.com', role: 'user' } });
  }
};

// Images API
export const imagesAPI = {
  upload: async (formData) => {
    await delay(1000);
    return createMockResponse({ message: 'Image uploaded successfully' });
  },
  getGallery: async (page = 1, limit = 12) => {
    await delay(500);
    return createMockResponse({
      images: MOCK_IMAGES.filter(img => img.status === 'approved'),
      pagination: { currentPage: page, totalPages: 1, total: MOCK_IMAGES.length }
    });
  },
  getById: async (id) => {
    await delay(300);
    const image = MOCK_IMAGES.find(img => img._id === id);
    return createMockResponse({ image });
  },
  search: async (query) => {
    await delay(500);
    const filteredImages = MOCK_IMAGES.filter(img => 
      img.caption.toLowerCase().includes(query.toLowerCase()) ||
      img.uploaderName.toLowerCase().includes(query.toLowerCase())
    );
    return createMockResponse({ 
      images: filteredImages, 
      pagination: { currentPage: 1, totalPages: 1, total: filteredImages.length } 
    });
  }
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    await delay(500);
    const approved = MOCK_IMAGES.filter(img => img.status === 'approved').length;
    const pending = MOCK_IMAGES.filter(img => img.status === 'pending').length;
    return createMockResponse({
      stats: { pending, approved, rejected: 0, totalUsers: 150 }
    });
  },
  getPending: async () => {
    await delay(500);
    const pendingImages = MOCK_IMAGES.filter(img => img.status === 'pending');
    return createMockResponse({ 
      images: pendingImages, 
      pagination: { currentPage: 1, totalPages: 1, total: pendingImages.length } 
    });
  },
  getImages: async (status = 'all') => {
    await delay(500);
    const images = status === 'all' ? MOCK_IMAGES : MOCK_IMAGES.filter(img => img.status === status);
    return createMockResponse({ 
      images, 
      pagination: { currentPage: 1, totalPages: 1, total: images.length } 
    });
  },
  approve: async (id) => {
    await delay(500);
    return createMockResponse({ message: 'Image approved successfully' });
  },
  reject: async (id, reason) => {
    await delay(500);
    return createMockResponse({ message: 'Image rejected successfully' });
  },
  delete: async (id) => {
    await delay(500);
    return createMockResponse({ message: 'Image deleted successfully' });
  },
  bulkAction: async (action, imageIds, reason = '') => {
    await delay(1000);
    return createMockResponse({ message: `Bulk ${action} completed successfully` });
  }
};

// Default export for general API usage
const mockApi = {
  get: async (url) => {
    await delay(300);
    return createMockResponse({ message: 'Mock GET response' });
  },
  post: async (url, data) => {
    await delay(500);
    return createMockResponse({ message: 'Mock POST response' });
  },
  delete: async (url) => {
    await delay(500);
    return createMockResponse({ message: 'Mock DELETE response' });
  }
};

export default mockApi;