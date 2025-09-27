import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  FaUserShield, FaClock, FaCheck, FaTimes, FaTrash, FaEye, 
  FaImages, FaUsers, FaChartLine, FaFilter, FaSearch,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('pending');
  const [selectedImages, setSelectedImages] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'all') {
      fetchImages();
    }
  }, [activeTab, filter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      let response;
      
      if (activeTab === 'pending') {
        response = await adminAPI.getPending(page, 10);
      } else {
        response = await adminAPI.getImages(filter, page, 10);
      }
      
      setImages(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (imageId) => {
    try {
      await adminAPI.approve(imageId);
      toast.success('Image approved successfully');
      fetchImages();
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving image:', error);
      toast.error('Failed to approve image');
    }
  };

  const handleReject = async (imageId, reason = '') => {
    try {
      await adminAPI.reject(imageId, reason);
      toast.success('Image rejected');
      fetchImages();
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting image:', error);
      toast.error('Failed to reject image');
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      try {
        await adminAPI.delete(imageId);
        toast.success('Image deleted successfully');
        fetchImages();
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  const handleBulkAction = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select images first');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    if (bulkAction === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      return;
    }

    try {
      await adminAPI.bulkAction(bulkAction, selectedImages, rejectionReason);
      toast.success(`${selectedImages.length} images ${bulkAction}ed successfully`);
      setSelectedImages([]);
      setBulkAction('');
      setRejectionReason('');
      fetchImages();
      fetchDashboardData();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error(`Failed to ${bulkAction} images`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-success" />;
      case 'rejected':
        return <FaTimesCircle className="text-danger" />;
      case 'pending':
        return <FaExclamationCircle className="text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-danger bg-danger/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-warning to-danger p-3 rounded-xl">
                <FaUserShield className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage SnapX image gallery</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'dashboard', label: 'Overview', icon: FaChartLine },
            { id: 'pending', label: 'Pending Review', icon: FaClock },
            { id: 'all', label: 'All Images', icon: FaImages },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div
            className="space-y-8 animate-fade-in"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-warning">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning font-medium">Pending Review</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.pending || 0}</p>
                  </div>
                  <FaClock className="text-warning text-3xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-success">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-success font-medium">Approved</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.approved || 0}</p>
                  </div>
                  <FaCheckCircle className="text-success text-3xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-danger">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-danger font-medium">Rejected</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.rejected || 0}</p>
                  </div>
                  <FaTimesCircle className="text-danger text-3xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers || 0}</p>
                  </div>
                  <FaUsers className="text-primary-600 text-3xl" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('pending')}
                  className="flex items-center space-x-3 p-4 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                >
                  <FaClock />
                  <span>Review Pending ({stats.pending || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className="flex items-center space-x-3 p-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <FaImages />
                  <span>View All Images</span>
                </button>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="flex items-center space-x-3 p-4 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                >
                  <FaEye />
                  <span>View Public Gallery</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Images Management */}
        {(activeTab === 'pending' || activeTab === 'all') && (
          <div
            className="space-y-6 animate-fade-in"
          >
            {/* Filters and Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {activeTab === 'all' && (
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                  
                  {selectedImages.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Bulk Action</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="delete">Delete</option>
                      </select>
                      <button
                        onClick={handleBulkAction}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {selectedImages.length > 0 && (
                    <span>{selectedImages.length} selected • </span>
                  )}
                  {pagination.total || 0} total images
                </div>
              </div>
            </div>

            {/* Images List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="xl" />
              </div>
            ) : images.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
                <p className="text-gray-500">No images match your current filter.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedImages.length === images.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedImages(images.map(img => img._id));
                              } else {
                                setSelectedImages([]);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Details</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {images.map((image) => (
                        <tr key={image._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(image._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedImages([...selectedImages, image._id]);
                                } else {
                                  setSelectedImages(selectedImages.filter(id => id !== image._id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <img
                              src={`http://localhost:5000${image.filePath}`}
                              alt={image.caption}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">{image.caption}</p>
                              <p className="text-sm text-gray-600">by {image.uploaderName}</p>
                              <p className="text-xs text-gray-500">{image.fileName}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(image.status)}`}>
                              {getStatusIcon(image.status)}
                              <span className="capitalize">{image.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{formatDate(image.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {image.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(image._id)}
                                    className="p-2 bg-success text-white rounded-lg hover:bg-success-600 transition-colors"
                                    title="Approve"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() => handleReject(image._id, 'Quality does not meet standards')}
                                    className="p-2 bg-warning text-white rounded-lg hover:bg-warning-600 transition-colors"
                                    title="Reject"
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => window.open(`http://localhost:5000${image.filePath}`, '_blank')}
                                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                title="View Full Size"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleDelete(image._id)}
                                className="p-2 bg-danger text-white rounded-lg hover:bg-danger-600 transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchImages(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => fetchImages(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;