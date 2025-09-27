import React, { useState } from 'react';
import { FaTimes, FaHeart, FaEye, FaCalendar, FaUser, FaTag, FaDownload, FaShare } from 'react-icons/fa';

const ImageModal = ({ image, isOpen, onClose }) => {
  const [isLoved, setIsLoved] = useState(false);

  if (!image) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${image.filePath}`;
    link.download = image.fileName;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.caption,
          text: image.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={onClose}
        >
          <div
            className="modal-content animate-slide-up"
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '80rem',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: window.innerWidth >= 1024 ? 'row' : 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div style={{
              position: 'relative',
              width: window.innerWidth >= 1024 ? '66.666667%' : '100%'
            }}>
              <img
                src={`http://localhost:5000${image.filePath}`}
                alt={image.caption}
                style={{
                  width: '100%',
                  height: window.innerWidth >= 1024 ? '600px' : '16rem',
                  objectFit: 'cover'
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
              >
                <FaTimes />
              </button>

              {/* Action Buttons */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setIsLoved(!isLoved)}
                  className={isLoved ? 'bg-red' : ''}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '9999px',
                    transition: 'all 0.2s ease',
                    background: isLoved ? '#ef4444' : 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoved) e.target.style.background = '#ef4444';
                  }}
                  onMouseOut={(e) => {
                    if (!isLoved) e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                  }}
                >
                  <FaHeart />
                </button>
                
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#3b82f6'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
                >
                  <FaDownload />
                </button>
                
                <button
                  onClick={handleShare}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#10b981'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
                >
                  <FaShare />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div style={{
              width: window.innerWidth >= 1024 ? '33.333333%' : '100%',
              padding: window.innerWidth >= 1024 ? '2rem' : '1.5rem',
              overflowY: 'auto'
            }}>
              {/* Header */}
              <div style={{marginBottom: '1.5rem'}}>
                <h2 className="font-bold mb-2" style={{
                  fontSize: '1.5rem',
                  color: '#1f2937'
                }}>
                  {image.caption}
                </h2>
                
                {/* Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <FaEye />
                    <span>{image.views || 0} views</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <FaHeart className={isLoved ? 'text-red' : ''} />
                    <span>24 likes</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {image.description && (
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 className="font-semibold mb-2" style={{
                    fontSize: '1.125rem',
                    color: '#1f2937'
                  }}>Description</h3>
                  <p style={{
                    color: '#4b5563',
                    lineHeight: '1.6'
                  }}>
                    {image.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 className="font-semibold mb-4" style={{
                    fontSize: '1.125rem',
                    color: '#1f2937'
                  }}>Tags</h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {image.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-blue text-sm font-medium rounded-xl"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: '#dbeafe',
                          padding: '0.5rem 0.75rem'
                        }}
                      >
                        <FaTag style={{fontSize: '0.75rem'}} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploader Info */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h3 className="font-semibold mb-4" style={{
                  fontSize: '1.125rem',
                  color: '#1f2937'
                }}>Uploaded by</h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div className="bg-gradient-primary" style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="text-white font-bold" style={{fontSize: '1.125rem'}}>
                      {image.uploaderName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{color: '#1f2937'}}>
                      {image.uploaderName}
                    </p>
                    {image.studentId && (
                      <p className="text-sm" style={{color: '#6b7280'}}>
                        ID: {image.studentId}
                      </p>
                    )}
                  </div>
                </div>

                {image.uploaderEmail && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    marginBottom: '0.5rem'
                  }}>
                    <FaUser style={{fontSize: '0.75rem'}} />
                    <span>{image.uploaderEmail}</span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  <FaCalendar style={{fontSize: '0.75rem'}} />
                  <span>Uploaded on {formatDate(image.createdAt)}</span>
                </div>
              </div>

              {/* Technical Details */}
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <p>
                  <span className="font-medium">File:</span> {image.fileName}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {image.mimeType}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {(image.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;