import React, { useState, useEffect } from 'react';
import { FaImages, FaSearch, FaFilter, FaCircle } from 'react-icons/fa';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { imagesAPI } from '../services/api';
import toast from 'react-hot-toast';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [currentPage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await imagesAPI.getGallery(currentPage, 12);
      setImages(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load gallery');
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
    fetchImages();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="page-container text-center">
          <div className="animate-slide-up">
            <div className="bg-gradient-secondary inline-flex items-center justify-center mb-6" style={{
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}>
              <FaImages className="text-white text-4xl" />
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white" style={{letterSpacing: '-0.02em'}}>
              SnapX Gallery
            </h1>
            <p className="text-xl text-gray-light mb-10" style={{
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.6'
            }}>
              Discover amazing photography from our talented community. Every image is carefully curated for quality and creativity.
            </p>
            
            {/* Search Bar */}
            <div className="form-container" style={{width: '520px', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.8)'}}>
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by caption, description, or tags..."
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
                  {isSearching ? <FaCircle className="animate-spin" /> : (
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

      {/* Gallery Content */}
      <div className="container py-12">
        {/* Stats & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div style={{
            marginBottom: window.innerWidth < 640 ? '1rem' : 0
          }}>
            <h2 className="text-2xl font-bold" style={{color: '#1f2937'}}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Images'}
            </h2>
            <p style={{color: '#6b7280'}}>
              {pagination.totalImages ? `${pagination.totalImages} images found` : 'Loading...'}
            </p>
          </div>
          
          <div className="flex items-center" style={{gap: '1rem'}}>
            <button className="card flex items-center" style={{
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease'
            }}>
              <FaFilter className="text-blue" />
              <span style={{color: '#374151'}}>Filters</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" />
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <FaImages className="text-6xl mx-auto mb-4" style={{color: '#d1d5db'}} />
            <h3 className="text-2xl font-semibold mb-2" style={{color: '#4b5563'}}>
              {searchQuery ? 'No images found' : 'No images yet'}
            </h3>
            <p className="mb-6" style={{color: '#6b7280'}}>
              {searchQuery 
                ? 'Try adjusting your search terms or browse all images'
                : 'Be the first to upload and share your amazing photography!'
              }
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="btn-primary"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem'
                }}
              >
                Browse All Images
              </button>
            )}
          </div>
        )}

        {/* Images Grid */}
        {!loading && images.length > 0 && (
          <>
            <div className="grid mb-12" style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {images.map((image) => (
                <ImageCard
                  key={image._id}
                  image={image}
                  onClick={setSelectedImage}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center" style={{gap: '0.5rem'}}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    opacity: !pagination.hasPrev ? 0.5 : 1,
                    cursor: !pagination.hasPrev ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                
                <div className="flex" style={{gap: '0.25rem'}}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? 'btn-primary' : 'btn-secondary'}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          minWidth: '2.5rem'
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
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
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

export default Gallery;