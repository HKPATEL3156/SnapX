import React from 'react';
import { FaImages, FaCheck, FaClock, FaTimes, FaHeart, FaUsers, FaFlag } from 'react-icons/fa';
import { useImages } from '../context/ImageContext';

const StatisticsDisplay = ({ showTitle = true, variant = 'card' }) => {
  const { statistics, loading } = useImages();

  if (loading && statistics.totalImages === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: '#94a3b8'
      }}>
        Loading statistics...
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Images',
      value: statistics.totalImages,
      icon: FaImages,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      label: 'Approved',
      value: statistics.approvedImages,
      icon: FaCheck,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    {
      label: 'Pending Review',
      value: statistics.pendingImages,
      icon: FaClock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    {
      label: 'Rejected',
      value: statistics.rejectedImages,
      icon: FaTimes,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)'
    },
    {
      label: 'Total Likes',
      value: statistics.totalLikes,
      icon: FaHeart,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)'
    },
    {
      label: 'Users',
      value: statistics.totalUsers,
      icon: FaUsers,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)'
    }
  ];

  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {stats.slice(0, 4).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: stat.bg,
                borderRadius: '0.75rem',
                color: stat.color,
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              <Icon />
              <span>{stat.value}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '1rem',
      padding: '1.5rem'
    }}>
      {showTitle && (
        <h3 style={{
          margin: '0 0 1.5rem 0',
          color: '#e2e8f0',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          Platform Statistics
        </h3>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <Icon />
                </div>
                <div>
                  <div style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: '#e2e8f0',
                    lineHeight: '1'
                  }}>
                    {stat.value.toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time indicator */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#64748b',
        fontSize: '0.75rem'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#10b981',
          animation: 'pulse 2s infinite'
        }}></div>
        Real-time statistics • Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatisticsDisplay;