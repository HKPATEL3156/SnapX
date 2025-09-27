import React, { useState } from 'react';
import { FaCheck, FaTimes, FaUser, FaTrash, FaEye, FaUserShield, FaCamera, FaHeart, FaFlag, FaCrown } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approval');

  // Mock data
  const [pendingImages] = useState([
    {
      id: 1,
      url: '/api/placeholder/300/200',
      title: 'Mountain Landscape',
      username: 'photographer1',
      uploadDate: '2024-01-15T10:30:00Z',
      likes: 0,
      reports: 0
    },
    {
      id: 2,
      url: '/api/placeholder/300/200',
      title: 'City Streets',
      username: 'urbanshot',
      uploadDate: '2024-01-15T11:15:00Z',
      likes: 0,
      reports: 1
    },
    {
      id: 3,
      url: '/api/placeholder/300/200',
      title: 'Portrait Session',
      username: 'portraitpro',
      uploadDate: '2024-01-15T12:00:00Z',
      likes: 0,
      reports: 0
    }
  ]);

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
    console.log(`Image ${imageId} ${approved ? 'approved' : 'rejected'}`);
    // Handle image approval logic
  };

  const handleUserAction = (userId, action) => {
    console.log(`User ${userId} action: ${action}`);
    // Handle user management logic
  };

  const renderApprovalSection = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Image Approval Queue</h3>
        <div className="admin-stats">
          <span className="stat-badge pending">{pendingImages.length} Pending</span>
        </div>
      </div>

      <div className="approval-grid">
        {pendingImages.map((image) => (
          <div key={image.id} className="approval-card">
            <div className="approval-image">
              <div className="placeholder-image">
                <FaCamera style={{fontSize: '2rem', color: '#64748b'}} />
              </div>
              {image.reports > 0 && (
                <div className="report-badge">
                  <FaFlag />
                  <span>{image.reports}</span>
                </div>
              )}
            </div>
            
            <div className="approval-content">
              <h4>{image.title}</h4>
              <div className="approval-meta">
                <span className="username">@{image.username}</span>
                <span className="date">
                  {new Date(image.uploadDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="approval-actions">
              <button 
                className="btn btn-success"
                onClick={() => handleImageApproval(image.id, true)}
              >
                <FaCheck />
                <span>Approve</span>
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleImageApproval(image.id, false)}
              >
                <FaTimes />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingImages.length === 0 && (
        <div className="empty-state">
          <FaCheck style={{fontSize: '3rem', color: '#22c55e', marginBottom: '1rem'}} />
          <h3>All caught up!</h3>
          <p>No images pending approval at the moment.</p>
        </div>
      )}
    </div>
  );

  const renderUserManagement = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>User Management</h3>
        <div className="admin-stats">
          <span className="stat-badge active">{users.filter(u => u.status === 'active').length} Active</span>
          <span className="stat-badge suspended">{users.filter(u => u.status === 'suspended').length} Suspended</span>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">User</div>
            <div className="table-cell">Role</div>
            <div className="table-cell">Posts</div>
            <div className="table-cell">Likes</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>

        <div className="table-body">
          {users.map((user) => (
            <div key={user.id} className="table-row">
              <div className="table-cell">
                <div className="user-info">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              </div>
              <div className="table-cell">
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' && <FaCrown />}
                  {user.role}
                </span>
              </div>
              <div className="table-cell">{user.postsCount}</div>
              <div className="table-cell">
                <div className="likes-count">
                  <FaHeart style={{color: '#ef4444'}} />
                  {user.likesReceived}
                </div>
              </div>
              <div className="table-cell">
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>
              <div className="table-cell">
                <div className="user-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => handleUserAction(user.id, 'view')}
                    title="View Profile"
                  >
                    <FaEye />
                  </button>
                  {user.status === 'active' ? (
                    <button 
                      className="action-btn suspend"
                      onClick={() => handleUserAction(user.id, 'suspend')}
                      title="Suspend User"
                    >
                      <FaTimes />
                    </button>
                  ) : (
                    <button 
                      className="action-btn activate"
                      onClick={() => handleUserAction(user.id, 'activate')}
                      title="Activate User"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => handleUserAction(user.id, 'delete')}
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminProfile = () => (
    <div className="admin-section">
      <div className="admin-section-header">
        <h3>Admin Profile</h3>
      </div>

      <div className="admin-profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUserShield style={{fontSize: '2rem', color: '#8b5cf6'}} />
            </div>
            <div className="profile-info">
              <h2>Admin User</h2>
              <p className="profile-role">System Administrator</p>
              <p className="profile-email">admin@snapx.com</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{pendingImages.length}</div>
              <div className="stat-label">Pending Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Images Approved Today</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary">
              <FaUser />
              <span>Edit Profile</span>
            </button>
            <button className="btn btn-secondary">
              <FaUserShield />
              <span>Admin Settings</span>
            </button>
          </div>
        </div>

        <div className="admin-info">
          <h4>Admin Responsibilities</h4>
          <ul>
            <li>Review and approve/reject submitted images</li>
            <li>Manage user accounts and permissions</li>
            <li>Monitor community guidelines compliance</li>
            <li>Handle user reports and disputes</li>
            <li>Maintain platform safety and quality</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'approval', label: 'Image Approval', icon: FaCamera },
    { id: 'users', label: 'User Management', icon: FaUser },
    { id: 'profile', label: 'Admin Profile', icon: FaUserShield }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>SnapX Admin Dashboard</h1>
          <p>Manage content and users</p>
        </div>

        <div className="admin-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="admin-content">
          {activeTab === 'approval' && renderApprovalSection()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'profile' && renderAdminProfile()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;