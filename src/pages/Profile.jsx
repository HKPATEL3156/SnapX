import React, { useState, useEffect } from 'react';
import { FaUser, FaCamera, FaHeart, FaEye, FaEdit, FaUpload, FaCalendar, FaEnvelope, FaIdCard } from 'react-icons/fa';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { imagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalViews: 0,
    totalLikes: 0,
    approvedImages: 0,
    pendingImages: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // This would need to be implemented in the backend
      const response = await imagesAPI.getUserImages(user.id);
      setUserImages(response.data.images);
      
      // Calculate stats
      const totalImages = response.data.images.length;
      const approvedImages = response.data.images.filter(img => img.status === 'approved').length;
      const pendingImages = response.data.images.filter(img => img.status === 'pending').length;
      const totalViews = response.data.images.reduce((sum, img) => sum + (img.views || 0), 0);
      const totalLikes = response.data.images.reduce((sum, img) => sum + (img.likes || 0), 0);
      
      setStats({
        totalImages,
        totalViews,
        totalLikes,
        approvedImages,
        pendingImages
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // This would need to be implemented in the backend
      // await userAPI.updateProfile(editForm);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen section-dark flex items-center justify-center">
        <div className="text-center">
          <FaUser className="text-6xl text-gray mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-light mb-2">Please sign in</h2>
          <p className="text-gray">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-dark">
      {/* Profile Header */}
      <div className="bg-gradient-primary" style={{padding: '4rem 0'}}>
        <div className="page-container">
          <div className="content-card" style={{textAlign: 'center', padding: '3rem'}}>
            {/* Profile Picture */}
            <div style={{marginBottom: '2rem'}}>
              <div className="bg-gradient-secondary glow-blue" style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: 'white',
                border: '4px solid rgba(59, 130, 246, 0.4)',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* Profile Info */}
            <div style={{marginBottom: '2.5rem'}}>
              <h1 className="text-5xl font-bold text-white mb-4" style={{letterSpacing: '-0.02em'}}>
                {user.name}
              </h1>
              <div className="flex justify-center items-center gap-6 text-gray-light text-lg">
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  <span>{user.email}</span>
                </div>
                {user.studentId && (
                  <div className="flex items-center gap-2">
                    <FaIdCard />
                    <span>ID: {user.studentId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>Joined {formatJoinDate(user.createdAt || new Date())}</span>
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary"
                style={{
                  width: '160px',
                  height: '50px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginTop: '1.5rem'
                }}
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-5 gap-8" style={{marginTop: '3rem'}}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.totalImages}</div>
                <div className="text-sm text-gray-light uppercase tracking-wider">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green mb-2">{stats.approvedImages}</div>
                <div className="text-sm text-gray-light uppercase tracking-wider">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow mb-2">{stats.pendingImages}</div>
                <div className="text-sm text-gray-light uppercase tracking-wider">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue mb-2">{stats.totalViews}</div>
                <div className="text-sm text-gray-light uppercase tracking-wider">Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink mb-2">{stats.totalLikes}</div>
                <div className="text-sm text-gray-light uppercase tracking-wider">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Edit Profile Form */}
      {isEditing && (
        <div className="container-dark" style={{padding: '2rem 0'}}>
          <div className="card-light max-w-2xl mx-auto" style={{padding: '2rem'}}>
            <h2 className="text-2xl font-semibold text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="form-input"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="form-input"
                  placeholder="Where are you based?"
                />
              </div>
              
              <div className="flex gap-4 pt-4 justify-center">
                <button type="submit" className="btn-primary" style={{width: '140px'}}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary" style={{width: '140px'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* User Photos */}
        <div className="container-dark" style={{padding: '3rem 0'}}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">My Photos</h2>
          <a href="/upload" className="btn-primary">
            <FaUpload />
            <span>Upload New Photo</span>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="xl" color="primary" />
          </div>
        ) : userImages.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <FaCamera className="text-6xl text-gray mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-light mb-2">No photos yet</h3>
            <p className="text-gray mb-6">
              Start your photography journey by uploading your first photo!
            </p>
            <a href="/upload" className="btn-primary">
              <FaUpload />
              <span>Upload Your First Photo</span>
            </a>
          </div>
        ) : (
          <div className="grid gap-6" style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {userImages.map((image) => (
              <div key={image._id} className="hover-lift">
                <ImageCard
                  image={image}
                  onClick={setSelectedImage}
                />
                {/* Status indicator */}
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    image.status === 'approved' ? 'bg-green text-white' :
                    image.status === 'rejected' ? 'bg-red text-white' :
                    'bg-yellow text-dark'
                  }`}>
                    {image.status?.charAt(0).toUpperCase() + image.status?.slice(1) || 'Pending'}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray">
                    <div className="flex items-center gap-1">
                      <FaEye />
                      <span>{image.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHeart />
                      <span>{image.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default Profile;