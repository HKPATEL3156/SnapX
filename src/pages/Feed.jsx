import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaImages, FaSearch, FaFilter, FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { imagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchImages();
  }, [currentPage, activeFilter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await imagesAPI.getGallery(currentPage, 12, activeFilter);
      setImages(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchImages();
      return;
    }

    try {
      setIsSearching(true);
      const response = await imagesAPI.search(searchQuery.trim(), 1, 12);
      setImages(response.data.images);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalImages: response.data.total
      });
      setCurrentPage(1);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setActiveFilter('all');
    fetchImages();
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
      <div className="bg-gradient-primary" style={{padding: '3rem 0'}}>
        <div className="container-dark text-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xl text-gray-light mb-8 max-w-2xl mx-auto">
              Discover amazing photography from our creative community. Share your vision and get inspired.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{maxWidth: '42rem', margin: '0 auto'}}>
              <div className="glass-effect rounded-2xl p-2 flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos, photographers, tags..."
                  className="form-input"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'white'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-secondary flex items-center"
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    marginLeft: '0.5rem'
                  }}
                >
                  {isSearching ? <LoadingSpinner size="sm" color="white" /> : <FaSearch />}
                  <span className="hidden sm:inline ml-2">Search</span>
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="btn-danger"
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      marginLeft: '0.5rem'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
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
        {!loading && images.length === 0 && (
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
        {!loading && images.length > 0 && (
          <>
            <div className="grid gap-6 mb-12" style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
            }}>
              {images.map((image) => (
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