import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaSearch, FaFilter, FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import StatisticsDisplay from '../components/StatisticsDisplay';
import { useImages } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const { images, getApprovedImages, searchImages } = useImages();
  const [displayImages, setDisplayImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalImages: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false
  });

  useEffect(() => {
    // Get approved images from context
    console.log('All images:', images);
    const approvedImages = getApprovedImages();
    console.log('Approved images:', approvedImages);
    
    setDisplayImages(approvedImages);
    setPagination({
      totalImages: approvedImages.length,
      totalPages: Math.ceil(approvedImages.length / 10),
      hasPrev: currentPage > 1,
      hasNext: currentPage < Math.ceil(approvedImages.length / 10)
    });
    setLoading(false);
  }, [images, getApprovedImages, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      const approvedImages = getApprovedImages();
      setDisplayImages(approvedImages);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = searchImages(searchQuery.trim()).filter(img => img.status === 'approved');
    setDisplayImages(results);
    setPagination({
      totalImages: results.length,
      totalPages: Math.ceil(results.length / 10),
      hasPrev: false,
      hasNext: false
    });
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    const approvedImages = getApprovedImages();
    setDisplayImages(approvedImages);
    setPagination({
      totalImages: approvedImages.length,
      totalPages: Math.ceil(approvedImages.length / 10),
      hasPrev: false,
      hasNext: false
    });
    setIsSearching(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterOptions = [
    { key: 'all', label: 'All Posts', icon: FaImages },
    { key: 'recent', label: 'Recent', icon: FaImages },
    { key: 'popular', label: 'Popular', icon: FaHeart },
    { key: 'following', label: 'Following', icon: FaBookmark }
  ];

  return (
    <div className="min-h-screen section-dark">
      {/* Header Section */}
      <div className="bg-gradient-primary" style={{padding: '4rem 0'}}>
        <div className="page-container text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold text-white mb-6" style={{letterSpacing: '-0.02em'}}>
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-gray-light mb-10" style={{maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
              Discover amazing photography from our creative community. Share your vision and get inspired.
            </p>
            
            {/* Search Bar */}
            <div className="form-container" style={{width: '520px', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.8)'}}>
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos, photographers, tags..."
                  className="form-input-large"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px solid rgba(148, 163, 184, 0.3)',
                    color: 'white'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary"
                  style={{
                    width: '120px',
                    height: '60px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  {isSearching ? <LoadingSpinner size="sm" color="white" /> : (
                    <>
                      <FaSearch />
                      <span>Search</span>
                    </>
                  )}
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="btn-secondary"
                    style={{
                      width: '80px',
                      height: '60px',
                      borderRadius: '12px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="container-dark" style={{padding: '3rem 0'}}>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveFilter(filter.key);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeFilter === filter.key
                      ? 'bg-gradient-primary text-white'
                      : 'card-light text-gray-light hover:text-white'
                  }`}
                >
                  <Icon />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center text-gray">
            <FaImages className="mr-2" />
            <span>
              {pagination.totalImages ? `${pagination.totalImages} photos` : 'Loading...'}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" color="primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && displayImages.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <FaImages className="text-6xl text-gray mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-light mb-2">
              {searchQuery ? 'No photos found' : 'No photos yet'}
            </h3>
            <p className="text-gray mb-6">
              {searchQuery 
                ? 'Try different search terms or browse all photos'
                : 'Start following photographers or upload your first photo!'
              }
            </p>
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              <p><strong>Debug Info:</strong></p>
              <p>Total images in context: {images ? images.length : 'Loading...'}</p>
              <p>Approved images: {getApprovedImages().length}</p>
              <p>Display images: {displayImages.length}</p>
              <p>Search query: {searchQuery || 'None'}</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('snapx_images');
                  window.location.reload();
                }}
                style={{ 
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reset & Reload Images
              </button>
            </div>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="btn-primary"
              >
                Browse All Photos
              </button>
            ) : (
              <Link
                to="/upload"
                className="btn-primary"
              >
                Upload Your First Photo
              </Link>
            )}
          </div>
        )}

        {/* Images Grid */}
        {!loading && displayImages.length > 0 && (
          <>
            <div className="grid gap-6 mb-12" style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
            }}>
              {displayImages.map((image) => (
                <div key={image._id} className="hover-lift">
                  <ImageCard
                    image={image}
                    onClick={setSelectedImage}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary"
                  style={{
                    opacity: !pagination.hasPrev ? 0.5 : 1,
                    cursor: !pagination.hasPrev ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? 'btn-primary' : 'btn-secondary'}
                        style={{
                          minWidth: '2.5rem',
                          padding: '0.5rem 0.75rem'
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-secondary"
                  style={{
                    opacity: !pagination.hasNext ? 0.5 : 1,
                    cursor: !pagination.hasNext ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Platform Statistics */}
      {displayImages.length > 0 && (
        <div style={{ padding: '3rem 0' }}>
          <div className="page-container">
            <StatisticsDisplay />
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default Feed;