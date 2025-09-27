import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaUser, FaTrash, FaEye, FaUserCog, FaCamera, FaHeart, FaFlag, FaStar } from 'react-icons/fa';
import { useImages } from '../context/ImageContext';
import StatisticsDisplay from '../components/StatisticsDisplay';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approval');
  const { images, getPendingImages, updateImageStatus, deleteImage, getApprovedImages, refreshImages, statistics } = useImages();
  const [pendingImages, setPendingImages] = useState([]);
  const [approvedImages, setApprovedImages] = useState([]);

  // MOUNT: Load images when admin panel opens
  useEffect(() => {
    console.log('🚀 AdminDashboard MOUNTED - Loading...');
    loadImagesFromStorage();
  }, []);
  
  // AUTO-REFRESH: Check for new uploads every 3 seconds
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      console.log('⏰ Auto-refresh checking for new uploads...');
      loadImagesFromStorage();
    }, 3000);
    
    return () => clearInterval(refreshTimer);
  }, []);

  // ULTRA SIMPLE - Just read from localStorage and show
  const loadImagesFromStorage = () => {
    console.log('🔍 AdminDashboard: Loading images from localStorage...');
    
    // Read directly from localStorage
    const stored = localStorage.getItem('snapx_images');
    console.log('Raw localStorage:', stored);
    
    if (!stored) {
      console.log('No images in localStorage');
      setPendingImages([]);
      setApprovedImages([]);
      return { total: 0, pending: 0, approved: 0 };
    }
    
    const allImages = JSON.parse(stored);
    console.log('Parsed images:', allImages);
    
    const pending = allImages.filter(img => img.status === 'pending');
    const approved = allImages.filter(img => img.status === 'approved');
    
    console.log('✅ Found:', {
      total: allImages.length,
      pending: pending.length,
      approved: approved.length,
      pendingImages: pending
    });
    
    // Force update state
    setPendingImages(pending);
    setApprovedImages(approved);
    
    return { total: allImages.length, pending: pending.length, approved: approved.length };
  };
  
  // Update local state when images change OR load directly from localStorage
  useEffect(() => {
    loadImagesFromStorage();
  }, [images]);

  // Simple auto-refresh to catch new uploads

  const [users] = useState([
    {
      id: 1,
      name: 'John Photographer',
      email: 'john@example.com',
      role: 'user',
      joinDate: '2024-01-01',
      postsCount: 25,
      likesReceived: 340,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Visual',
      email: 'sarah@example.com',
      role: 'user',
      joinDate: '2024-01-05',
      postsCount: 18,
      likesReceived: 220,
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Creative',
      email: 'mike@example.com',
      role: 'user',
      joinDate: '2024-01-10',
      postsCount: 12,
      likesReceived: 180,
      status: 'suspended'
    }
  ]);

  const handleImageApproval = (imageId, approved) => {
    console.log('🔄 Approval action:', imageId, approved ? 'APPROVE' : 'REJECT');
    
    try {
      // Get images from localStorage
      const stored = localStorage.getItem('snapx_images');
      if (!stored) {
        toast.error('No images found!');
        return;
      }
      
      const allImages = JSON.parse(stored);
      
      // Update the specific image
      const updatedImages = allImages.map(img => {
        if (img._id === imageId) {
          return {
            ...img,
            status: approved ? 'approved' : 'rejected',
            updatedAt: new Date().toISOString()
          };
        }
        return img;
      });
      
      // Save back to localStorage
      localStorage.setItem('snapx_images', JSON.stringify(updatedImages));
      
      // Reload from localStorage to update UI
      loadImagesFromStorage();
      
      // Success message
      const action = approved ? 'approved' : 'rejected';
      toast.success(`✅ Image ${action} successfully!`);
      
      console.log('✅ Approval completed:', action);
      
    } catch (error) {
      console.error('❌ Approval failed:', error);
      toast.error('Failed to update image status');
    }
  };

  const handleUserAction = (userId, action) => {
    console.log(`User ${userId} action: ${action}`);
    // Handle user management logic
  };

  const renderApprovalSection = () => (
    <div>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Image Approval Queue</h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px'
          }}>Review and manage submitted content</p>
          <div style={{
            marginTop: '8px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {pendingImages.length} images awaiting review
          </div>
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '12px 20px',
          color: '#f59e0b',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#f59e0b',
            animation: 'pulse 2s infinite'
          }}></div>
          {pendingImages.length} Pending Review
        </div>
      </div>

      {/* Approval Grid */
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {pendingImages.map((image) => (
          <div key={image._id} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '24px',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Card Hover Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
              borderRadius: '20px',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: 0
            }}></div>

            {/* Image Preview */}
            <div style={{
              width: '100%',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden'
            }}>
              {image.filePath ? (
                <img 
                  src={image.filePath} 
                  alt={image.caption}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '14px'
                  }}
                />
              ) : (
                <FaCamera style={{
                  fontSize: '48px',
                  color: 'rgba(255, 255, 255, 0.4)'
                }} />
              )}
              
              {image.reports > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}>
                  <FaFlag style={{ fontSize: '10px' }} />
                  {image.reports} Report{image.reports > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div style={{ marginBottom: '20px', zIndex: 1, position: 'relative' }}>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>{image.title || image.caption}</h4>
              
              {image.description && (
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>{image.description}</p>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(59, 130, 246, 0.8)',
                  fontWeight: '500'
                }}>
                  <FaUser style={{ fontSize: '12px' }} />
                  {image.uploaderName}
                </div>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '13px'
                }}>
                  {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '12px',
              zIndex: 1,
              position: 'relative'
            }}>
              <button 
                onClick={() => handleImageApproval(image._id, true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                <FaCheck style={{ fontSize: '14px' }} />
                Approve
              </button>
              
              <button 
                onClick={() => handleImageApproval(image._id, false)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                <FaTimes style={{ fontSize: '14px' }} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      }

      {/* Empty State */}
      {pendingImages.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
          }}>
            <FaCheck style={{ fontSize: '36px', color: '#ffffff' }} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '12px'
          }}>All caught up!</h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            No images pending approval at the moment. Great job keeping the platform clean and safe!
          </p>
        </div>
      )}
    </div>
  );

  const renderUserManagement = () => (
    <div>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>User Management</h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '16px'
          }}>Monitor and manage platform users</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '8px 16px',
            color: '#10b981',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981'
            }}></div>
            {users.filter(u => u.status === 'active').length} Active
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '8px 16px',
            color: '#ef4444',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444'
            }}></div>
            {users.filter(u => u.status === 'suspended').length} Suspended
          </div>
        </div>
      </div>

      {/* Modern Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
          gap: '16px',
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '14px',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.8)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <div>User</div>
          <div>Role</div>
          <div>Posts</div>
          <div>Likes</div>
          <div>Status</div>
          <div style={{ textAlign: 'center' }}>Actions</div>
        </div>

        {/* Table Body */}
        <div>
          {users.map((user, index) => (
            <div key={user.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
              gap: '16px',
              padding: '20px 24px',
              borderBottom: index < users.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            >
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  <FaUser style={{ color: '#ffffff', fontSize: '18px' }} />
                </div>
                <div>
                  <div style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '4px'
                  }}>{user.name}</div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px'
                  }}>{user.email}</div>
                </div>
              </div>

              {/* Role */}
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: user.role === 'admin' 
                    ? 'rgba(139, 92, 246, 0.1)' 
                    : 'rgba(59, 130, 246, 0.1)',
                  color: user.role === 'admin' ? '#8b5cf6' : '#3b82f6',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  border: `1px solid ${user.role === 'admin' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                }}>
                  {user.role === 'admin' && <FaStar style={{ fontSize: '10px' }} />}
                  {user.role}
                </span>
              </div>

              {/* Posts Count */}
              <div style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                {user.postsCount}
              </div>

              {/* Likes */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ef4444',
                fontWeight: '600'
              }}>
                <FaHeart style={{ fontSize: '14px' }} />
                {user.likesReceived}
              </div>

              {/* Status */}
              <div>
                <span style={{
                  display: 'inline-block',
                  background: user.status === 'active' 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  color: user.status === 'active' ? '#10b981' : '#ef4444',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  border: `1px solid ${user.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  {user.status}
                </span>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px'
              }}>
                {[
                  { icon: FaEye, action: 'view', color: '#3b82f6', title: 'View Profile' },
                  { 
                    icon: user.status === 'active' ? FaTimes : FaCheck, 
                    action: user.status === 'active' ? 'suspend' : 'activate', 
                    color: user.status === 'active' ? '#ef4444' : '#10b981',
                    title: user.status === 'active' ? 'Suspend User' : 'Activate User'
                  },
                  { icon: FaTrash, action: 'delete', color: '#f59e0b', title: 'Delete User' }
                ].map((btn, btnIndex) => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btnIndex}
                      onClick={() => handleUserAction(user.id, btn.action)}
                      title={btn.title}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: 'none',
                        background: `rgba(${btn.color === '#3b82f6' ? '59, 130, 246' : btn.color === '#ef4444' ? '239, 68, 68' : btn.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`,
                        color: btn.color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = `rgba(${btn.color === '#3b82f6' ? '59, 130, 246' : btn.color === '#ef4444' ? '239, 68, 68' : btn.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.2)`;
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = `rgba(${btn.color === '#3b82f6' ? '59, 130, 246' : btn.color === '#ef4444' ? '239, 68, 68' : btn.color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.1)`;
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <Icon />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminProfile = () => (
    <div>
      {/* Section Header */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Admin Profile</h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '16px'
        }}>Manage your administrative account and settings</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        {/* Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Card Background Gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '24px',
            zIndex: -1
          }}></div>

          {/* Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(139, 92, 246, 0.4)',
              position: 'relative'
            }}>
              <FaUserCog style={{
                fontSize: '36px',
                color: '#ffffff'
              }} />
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.1)'
              }}></div>
            </div>
            
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '4px'
              }}>Admin User</h2>
              <p style={{
                color: '#8b5cf6',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>System Administrator</p>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px'
              }}>admin@snapx.com</p>
            </div>
          </div>

          {/* Profile Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[
              { value: pendingImages.length, label: 'Pending Reviews', color: '#f59e0b' },
              { value: users.length, label: 'Total Users', color: '#3b82f6' },
              { value: '50+', label: 'Approved Today', color: '#10b981' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Profile Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}
            >
              <FaUser style={{ fontSize: '14px' }} />
              Edit Profile
            </button>
            
            <button style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.12)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              <FaUserCog style={{ fontSize: '14px' }} />
              Settings
            </button>
          </div>
        </div>

        {/* Responsibilities Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaCheck style={{ color: '#ffffff', fontSize: '20px' }} />
            </div>
            <h4 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0
            }}>Admin Responsibilities</h4>
          </div>

          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            {[
              'Review and approve/reject submitted images',
              'Manage user accounts and permissions',
              'Monitor community guidelines compliance',
              'Handle user reports and disputes',
              'Maintain platform safety and quality'
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  flexShrink: 0
                }}></div>
                <span style={{ fontSize: '15px' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Activity Status */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Currently Online • Last activity: Just now
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>Platform Statistics</h3>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>Real-time analytics and platform insights</p>
        </div>
      </div>

      {/* Statistics Display */}
      <StatisticsDisplay />

      {/* Additional Analytics */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Activity */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <h4 style={{
            color: '#e2e8f0',
            fontSize: '1.25rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>Recent Activity</h4>
          <div style={{ color: '#94a3b8' }}>
            <p>✅ {statistics.approvedImages} images approved today</p>
            <p>⏳ {statistics.pendingImages} awaiting review</p>
            <p>👥 {statistics.totalUsers} registered users</p>
            <p>❤️ {statistics.totalLikes} total engagement</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          <h4 style={{
            color: '#e2e8f0',
            fontSize: '1.25rem',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>Approval Rate</h4>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '0.5rem'
          }}>
            {statistics.totalImages > 0 ? 
              Math.round((statistics.approvedImages / statistics.totalImages) * 100)
              : 0
            }%
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Images approved vs total submissions
          </p>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'approval', label: 'Image Approval', icon: FaCamera },
    { id: 'statistics', label: 'Statistics', icon: FaStar },
    { id: 'users', label: 'User Management', icon: FaUser },
    { id: 'profile', label: 'Admin Profile', icon: FaUserCog }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      {/* Admin Header */}
      <div style={{
        padding: '60px 0 80px 0',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Card Background Gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              borderRadius: '24px',
              zIndex: -1
            }}></div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '24px',
              marginBottom: '32px',
              boxShadow: '0 20px 50px rgba(59, 130, 246, 0.4)',
              position: 'relative'
            }}>
              <FaStar style={{
                fontSize: '48px',
                color: '#ffffff'
              }} />
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                borderRadius: '24px',
                zIndex: -1
              }}></div>
            </div>
            
            <h1 style={{
              fontSize: '56px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SnapX Admin Dashboard
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6'
            }}>
              Manage content, users, and oversee the community platform with advanced administrative tools
            </p>

            {/* Quick Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'Pending Reviews', value: pendingImages.length, color: '#f59e0b' },
                { label: 'Total Users', value: users.length, color: '#3b82f6' },
                { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: '#10b981' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '20px 32px',
                  textAlign: 'center',
                  minWidth: '140px'
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '4px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          marginTop: '-40px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }}>

        {/* Modern Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px',
          borderRadius: '16px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 8px 25px rgba(59, 130, 246, 0.3)' : 'none',
                  flex: 1,
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                <Icon style={{ fontSize: '18px' }} />
                <span>{tab.label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    zIndex: -1
                  }}></div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '32px' }}>
          {activeTab === 'approval' && renderApprovalSection()}
          {activeTab === 'statistics' && renderStatistics()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'profile' && renderAdminProfile()}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;