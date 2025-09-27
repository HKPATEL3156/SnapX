import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaImage, FaUser, FaEnvelope, FaIdCard, FaTag, FaFileAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { imagesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    uploaderName: '',
    uploaderEmail: '',
    studentId: '',
    caption: '',
    description: '',
    tags: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }

    if (!formData.uploaderName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.caption.trim()) {
      toast.error('Please add a caption for your image');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', selectedFile);
      uploadData.append('uploaderName', formData.uploaderName.trim());
      uploadData.append('uploaderEmail', formData.uploaderEmail.trim());
      uploadData.append('studentId', formData.studentId.trim());
      uploadData.append('caption', formData.caption.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('tags', formData.tags.trim());

      const response = await imagesAPI.upload(uploadData);
      
      toast.success('Image uploaded successfully! Waiting for admin approval.');
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setFormData({
        uploaderName: '',
        uploaderEmail: '',
        studentId: '',
        caption: '',
        description: '',
        tags: ''
      });

      // Redirect to gallery after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Failed to upload image';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light py-12">
      <div className="container" style={{maxWidth: '64rem'}}>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="bg-gradient-success inline-block mb-4" style={{
            padding: '1rem',
            borderRadius: '1rem'
          }}>
            <FaCloudUploadAlt className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{color: '#1f2937'}}>Upload Your Photo</h1>
          <p style={{
            color: '#6b7280',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Share your amazing photography with our community. All images go through our approval process to ensure quality and safety.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div className="grid" style={{
            gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
            gap: '2rem'
          }}>
            {/* File Upload Section */}
            <div className="animate-slide-up" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center" style={{color: '#1f2937'}}>
                  <FaImage className="text-blue mr-3" />
                  Select Image
                </h2>

                {!selectedFile ? (
                  <div
                    {...getRootProps()}
                    style={{
                      border: '2px dashed',
                      borderColor: isDragActive ? '#3b82f6' : '#d1d5db',
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: isDragActive ? '#eff6ff' : 'transparent'
                    }}
                    onMouseOver={(e) => {
                      if (!isDragActive) {
                        e.currentTarget.style.borderColor = '#60a5fa';
                        e.currentTarget.style.background = '#eff6ff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDragActive) {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt className="text-5xl mx-auto mb-4" style={{color: '#9ca3af'}} />
                    <p className="text-lg font-medium mb-2" style={{color: '#374151'}}>
                      {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                    </p>
                    <p className="mb-4" style={{color: '#6b7280'}}>or click to browse files</p>
                    <div className="flex justify-center text-sm" style={{gap: '1rem', color: '#6b7280'}}>
                      <span>JPG</span>
                      <span>PNG</span>
                      <span>GIF</span>
                      <span>WebP</span>
                    </div>
                    <p className="text-xs mt-2" style={{color: '#9ca3af'}}>Max file size: 5MB</p>
                  </div>
                ) : (
                  <div style={{position: 'relative'}}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '16rem',
                        objectFit: 'cover',
                        borderRadius: '0.75rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="bg-red text-white"
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#dc2626'}
                      onMouseOut={(e) => e.target.style.background = '#ef4444'}
                    >
                      <FaTimes />
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      left: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}>
                      {selectedFile.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              <div style={{
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h3 className="font-semibold text-green mb-3">Upload Guidelines</h3>
                <ul style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#374151'}}>
                  <li className="flex items-start">
                    <FaCheck className="text-green" style={{marginTop: '0.125rem', marginRight: '0.5rem', flexShrink: 0}} />
                    <span>High-quality images are preferred</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green" style={{marginTop: '0.125rem', marginRight: '0.5rem', flexShrink: 0}} />
                    <span>Appropriate content only</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green" style={{marginTop: '0.125rem', marginRight: '0.5rem', flexShrink: 0}} />
                    <span>Original photography encouraged</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-green" style={{marginTop: '0.125rem', marginRight: '0.5rem', flexShrink: 0}} />
                    <span>Images will be reviewed before approval</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form Section */}
            <div className="animate-slide-up" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              animationDelay: '0.2s'
            }}>
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center" style={{color: '#1f2937'}}>
                  <FaUser className="text-blue mr-3" />
                  Image Details
                </h2>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {/* Uploader Name */}
                  <div>
                    <label className="form-label">
                      Your Name <span className="text-red">*</span>
                    </label>
                    <div style={{position: 'relative'}}>
                      <FaUser style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} />
                      <input
                        type="text"
                        name="uploaderName"
                        value={formData.uploaderName}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        style={{paddingLeft: '2.5rem'}}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="form-label">
                      Email Address
                    </label>
                    <div style={{position: 'relative'}}>
                      <FaEnvelope style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} />
                      <input
                        type="email"
                        name="uploaderEmail"
                        value={formData.uploaderEmail}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{paddingLeft: '2.5rem'}}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="form-label">
                      Student ID
                    </label>
                    <div style={{position: 'relative'}}>
                      <FaIdCard style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} />
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{paddingLeft: '2.5rem'}}
                        placeholder="Your student ID (optional)"
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="form-label">
                      Image Caption <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="caption"
                      value={formData.caption}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      className="form-input"
                      placeholder="Write a catchy caption for your image"
                    />
                    <p className="text-xs mt-1" style={{color: '#6b7280'}}>
                      {formData.caption.length}/200 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      maxLength={500}
                      className="form-input"
                      style={{resize: 'none'}}
                      placeholder="Tell us more about your image (optional)"
                    />
                    <p className="text-xs mt-1" style={{color: '#6b7280'}}>
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="form-label">
                      Tags
                    </label>
                    <div style={{position: 'relative'}}>
                      <FaTag style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="form-input"
                        style={{paddingLeft: '2.5rem'}}
                        placeholder="nature, photography, landscape (comma separated)"
                      />
                    </div>
                    <p className="text-xs mt-1" style={{color: '#6b7280'}}>
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="btn-primary font-semibold text-lg flex items-center mx-auto"
              style={{
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                gap: '0.75rem',
                opacity: (loading || !selectedFile) ? 0.5 : 1,
                cursor: (loading || !selectedFile) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <FaCloudUploadAlt className="text-xl" />
              )}
              <span>{loading ? 'Uploading...' : 'Upload Image'}</span>
            </button>
            
            <p className="text-sm mt-3" style={{color: '#6b7280'}}>
              Your image will be reviewed by our team before appearing in the gallery
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;