import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaImage, FaUser, FaEnvelope, FaIdCard, FaTag, FaFileAlt, FaTimes, FaCheck, FaCamera } from 'react-icons/fa';
import { useImages } from '../context/ImageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatisticsDisplay from '../components/StatisticsDisplay';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const { addImage, statistics, refreshImages } = useImages();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new image data with preview as filePath
      const newImageData = {
        title: formData.caption.trim(),
        caption: formData.caption.trim(),
        filePath: preview, // Use the preview data URL as the image path
        uploaderName: formData.uploaderName.trim(),
        uploaderEmail: formData.uploaderEmail.trim(),
        studentId: formData.studentId.trim(),
        description: formData.description.trim(),
        tags: formData.tags.trim()
      };

      // ULTRA SIMPLE - Create the image object
      const uploadedImage = {
        _id: 'upload_' + Date.now(),
        title: formData.caption,
        caption: formData.caption,
        filePath: preview, // The image preview URL
        uploaderName: formData.uploaderName,
        uploaderEmail: formData.uploaderEmail,
        studentId: formData.studentId,
        description: formData.description,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        status: 'pending',
        reports: 0,
        likes: 0
      };

      // STEP 1: Clear existing data first (for testing)
      // localStorage.removeItem('snapx_images'); // Uncomment to reset
      
      // STEP 2: Get existing images
      const existingImages = JSON.parse(localStorage.getItem('snapx_images') || '[]');
      
      // STEP 3: Add new image at the beginning
      const allImages = [uploadedImage, ...existingImages];
      
      // STEP 4: Save back to localStorage
      localStorage.setItem('snapx_images', JSON.stringify(allImages));
      
      // STEP 5: Immediately verify it worked
      const check = JSON.parse(localStorage.getItem('snapx_images'));
      const pending = check.filter(img => img.status === 'pending');
      
      console.log('🚀 UPLOAD DEBUG:');
      console.log('Uploaded image:', uploadedImage);
      console.log('All images now:', check.length);
      console.log('Pending images now:', pending.length);
      console.log('localStorage content:', check);
      
      // Show popup for debugging\n      const message = `\n✅ UPLOAD SUCCESS!\n\nImage ID: ${uploadedImage._id}\nTotal Images: ${check.length}\nPending Images: ${pending.length}\n\nNow go to Admin Panel to see it!`;\n      alert(message);
      toast.success(`Image uploaded! ${pending.length} pending approval`);
      setUploadSuccess(true);
      
      // Reset form after delay to show success state
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setUploadSuccess(false);
        setFormData({
          uploaderName: '',
          uploaderEmail: '',
          studentId: '',
          caption: '',
          description: '',
          tags: ''
        });
      }, 3000);

      // Redirect to feed after a short delay
      setTimeout(() => {
        navigate('/feed');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header */}
      <div style={{
        padding: '60px 0 80px 0',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderRadius: '24px',
              zIndex: -1
            }}></div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '24px',
              marginBottom: '32px',
              boxShadow: '0 20px 50px rgba(34, 197, 94, 0.4)',
              position: 'relative'
            }}>
              <FaUpload style={{
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
              Upload Your Photo
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Share your amazing photography with our community. All images go through our approval process to ensure quality and safety.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
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
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }}>

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
              gap: '32px'
            }}>
            {/* File Upload Section */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaImage style={{ color: '#ffffff', fontSize: '20px' }} />
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#ffffff',
                    margin: 0
                  }}>Select Image</h2>
                </div>

                {!selectedFile ? (
                  <div
                    {...getRootProps()}
                    style={{
                      border: isDragActive ? '2px solid rgba(59, 130, 246, 0.6)' : '2px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      padding: '48px 32px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: isDragActive ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      if (!isDragActive) {
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isDragActive) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }
                    }}
                  >
                    <input {...getInputProps()} />
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px auto',
                      boxShadow: '0 12px 30px rgba(34, 197, 94, 0.3)'
                    }}>
                      <FaUpload style={{fontSize: '32px', color: '#ffffff'}} />
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '24px'
                    }}>or click to browse files</p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      marginBottom: '16px',
                      flexWrap: 'wrap'
                    }}>
                      {['JPG', 'PNG', 'GIF', 'WebP'].map(format => (
                        <span key={format} style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>{format}</span>
                      ))}
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>Max file size: 5MB</p>
                  </div>
                ) : (
                  <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '320px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                      }}
                    >
                      <FaTimes style={{ fontSize: '16px' }} />
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      maxWidth: 'calc(100% - 32px)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {selectedFile.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaCheck style={{ color: '#ffffff', fontSize: '14px' }} />
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#22c55e',
                    margin: 0
                  }}>Upload Guidelines</h3>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {[
                    'High-quality images are preferred',
                    'Appropriate content only',
                    'Original photography encouraged',
                    'Images will be reviewed before approval'
                  ].map((guideline, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 0'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        fontSize: '15px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.5'
                      }}>{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaUser style={{ color: '#ffffff', fontSize: '20px' }} />
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#ffffff',
                    margin: 0
                  }}>Image Details</h2>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  {/* Uploader Name */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>
                      Your Name <span style={{color: '#ef4444'}}>*</span>
                    </label>
                    <div style={{position: 'relative'}}>
                      <FaUser style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 10,
                        fontSize: '16px'
                      }} />
                      <input
                        type="text"
                        name="uploaderName"
                        value={formData.uploaderName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        style={{
                          width: '100%',
                          height: '50px',
                          padding: '0 16px 0 48px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '16px',
                          outline: 'none',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>Email Address</label>
                    <div style={{position: 'relative'}}>
                      <FaEnvelope style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 10,
                        fontSize: '16px'
                      }} />
                      <input
                        type="email"
                        name="uploaderEmail"
                        value={formData.uploaderEmail}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        style={{
                          width: '100%',
                          height: '50px',
                          padding: '0 16px 0 48px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '16px',
                          outline: 'none',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>Student ID</label>
                    <div style={{position: 'relative'}}>
                      <FaIdCard style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 10,
                        fontSize: '16px'
                      }} />
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="Your student ID (optional)"
                        style={{
                          width: '100%',
                          height: '50px',
                          padding: '0 16px 0 48px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '16px',
                          outline: 'none',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>
                      Image Caption <span style={{color: '#ef4444'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="caption"
                      value={formData.caption}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      placeholder="Write a catchy caption for your image"
                      style={{
                        width: '100%',
                        height: '50px',
                        padding: '0 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                      }}
                    />
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '6px'
                    }}>
                      {formData.caption.length}/200 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us more about your image (optional)"
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '16px',
                        outline: 'none',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                      }}
                    />
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '6px'
                    }}>
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}>Tags</label>
                    <div style={{position: 'relative'}}>
                      <FaTag style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 10,
                        fontSize: '16px'
                      }} />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="nature, photography, landscape (comma separated)"
                        style={{
                          width: '100%',
                          height: '50px',
                          padding: '0 16px 0 48px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '16px',
                          outline: 'none',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '6px'
                    }}>
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px 48px',
                background: (loading || !selectedFile) 
                  ? 'rgba(100, 116, 139, 0.5)' 
                  : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: (loading || !selectedFile) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: (loading || !selectedFile) 
                  ? 'none' 
                  : '0 12px 30px rgba(34, 197, 94, 0.4)',
                opacity: (loading || !selectedFile) ? 0.6 : 1,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                minWidth: '200px',
                height: '56px'
              }}
              onMouseEnter={(e) => {
                if (!loading && selectedFile) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 16px 40px rgba(34, 197, 94, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && selectedFile) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 12px 30px rgba(34, 197, 94, 0.4)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaUpload style={{ fontSize: '20px' }} />
                  <span>Upload Image</span>
                </>
              )}
            </button>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              Your image will be reviewed by our team before appearing in the gallery
            </p>
          </div>
          </form>
        </div>



        {/* Success Message */}
        {uploadSuccess && (
          <div style={{
            maxWidth: '600px',
            margin: '2rem auto',
            padding: '2rem',
            background: 'rgba(16, 185, 129, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <FaCheck style={{
              fontSize: '3rem',
              color: '#10b981',
              marginBottom: '1rem'
            }} />
            <h3 style={{
              color: '#10b981',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              Upload Successful!
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '2rem'
            }}>
              Your image has been submitted for review. You'll be redirected to the feed shortly.
            </p>
            
            {/* Updated Statistics */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{
                color: '#e2e8f0',
                fontSize: '1.1rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                📊 Platform Statistics Updated
              </h4>
              <StatisticsDisplay variant="compact" showTitle={false} />
            </div>
          </div>
        )}

        {/* Platform Statistics */}
        <div style={{
          maxWidth: '800px',
          margin: '3rem auto',
          padding: '0 1rem'
        }}>
          <StatisticsDisplay />
        </div>
      </div>
    </div>
  );
};

export default Upload;