import React, { useState, useEffect } from 'react';
import { FaImages, FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
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
        <div className="container text-center">
          <div className="animate-slide-up">
            <FaImages className="text-6xl mx-auto mb-6 animate-bounce-gentle" />
            <h1 className="text-5xl font-bold mb-4">
              SnapX Gallery
            </h1>
            <p className="text-xl mb-8" style={{
              color: '#dbeafe',
              maxWidth: '42rem',
              margin: '0 auto 2rem auto'
            }}>
              Discover amazing photography from our talented community. Every image is carefully curated for quality and creativity.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              maxWidth: '42rem',
              margin: '0 auto'
            }}>
              <div className="flex rounded-2xl p-2" style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)'
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by caption, description, or tags..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-secondary flex items-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '0.5rem',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  {isSearching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                  <span className="hidden sm:inline">Search</span>
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-white"
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      marginLeft: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.3)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
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