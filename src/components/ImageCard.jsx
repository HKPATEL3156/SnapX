import React from 'react';
import { FaHeart, FaEye, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

const ImageCard = ({ image, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="card cursor-pointer animate-fade-in"
      onClick={() => onClick(image)}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '1',
        backgroundColor: '#f3f4f6'
      }}>
        <img
          src={image.filePath.startsWith('http') || image.filePath.startsWith('data:') 
            ? image.filePath 
            : `http://localhost:5000${image.filePath}`}
          alt={image.caption}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          loading="lazy"
          onError={(e) => {
            console.error('Image load error:', e.target.src);
            e.target.style.background = '#f3f4f6';
            e.target.alt = 'Image not available';
          }}
        />
        
        {/* Overlay on hover */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%, transparent 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1rem'
        }}
        onMouseOver={(e) => e.target.style.opacity = 1}
        onMouseOut={(e) => e.target.style.opacity = 0}>
          <p className="text-white text-sm font-medium" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {image.caption}
          </p>
        </div>

        {/* Status Badge */}
        <div style={{position: 'absolute', top: '0.75rem', right: '0.75rem'}}>
          <span className="bg-green text-white text-xs rounded-xl" style={{
            padding: '0.25rem 0.5rem',
            fontWeight: 500
          }}>
            Approved
          </span>
        </div>

        {/* Views Counter */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          fontSize: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px'
        }}>
          <FaEye />
          <span>{image.views || 0}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Caption */}
        <h3 className="font-semibold mb-2" style={{
          color: '#1f2937',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {image.caption}
        </h3>

        {/* Description */}
        {image.description && (
          <p className="text-sm mb-4" style={{
            color: '#6b7280',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {image.description}
          </p>
        )}

        {/* Tags */}
        {image.tags && image.tags.trim() && (
          <div className="mb-4" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem'
          }}>
            {image.tags.split(',').map(tag => tag.trim()).filter(tag => tag).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-blue rounded-xl"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: '#dbeafe',
                  padding: '0.25rem 0.5rem'
                }}
              >
                <FaTag style={{fontSize: '0.7rem'}} />
                <span>{tag}</span>
              </span>
            ))}
            {image.tags.split(',').length > 3 && (
              <span className="text-xs" style={{color: '#6b7280'}}>
                +{image.tags.split(',').length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-sm" style={{
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '0.75rem'
        }}>
          <div className="flex items-center" style={{gap: '0.25rem'}}>
            <FaUser style={{fontSize: '0.75rem'}} />
            <span className="font-medium text-purple">
              {image.uploaderName}
            </span>
          </div>
          
          <div className="flex items-center" style={{gap: '0.25rem'}}>
            <FaCalendar style={{fontSize: '0.75rem'}} />
            <span>{formatDate(image.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;