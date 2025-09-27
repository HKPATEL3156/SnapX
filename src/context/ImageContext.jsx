import React, { createContext, useContext, useState, useEffect } from 'react';
import backendService from '../services/backendService';

const ImageContext = createContext();

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};


export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalImages: 0,
    approvedImages: 0,
    pendingImages: 0,
    rejectedImages: 0,
    totalUsers: 0,
    totalLikes: 0,
    totalReports: 0
  });

  // Load images from backend service on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    setLoading(true);
    try {
      const allImages = backendService.getAllImages();
      setImages(allImages);
      const newStats = backendService.getStats();
      setStatistics(newStats);
      console.log('Loaded images from backend service:', allImages.length);
      console.log('Statistics updated:', newStats);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = (imageData) => {
    setLoading(true);
    try {
      console.log('=== ImageContext.addImage ===');
      console.log('Adding image:', imageData);
      
      const newImage = backendService.addImage(imageData);
      console.log('Backend returned:', newImage);
      
      // Reload all images and statistics to ensure consistency
      const allImages = backendService.getAllImages();
      const newStats = backendService.getStats();
      
      console.log('All images after add:', allImages.length);
      console.log('Pending images:', allImages.filter(img => img.status === 'pending').length);
      
      // Force state update with new references to trigger re-renders\n      setImages([...allImages]); // Create new array reference\n      setStatistics({...newStats}); // Create new object reference\n      \n      // Force a complete refresh after a short delay\n      setTimeout(() => {\n        const refreshedImages = backendService.getAllImages();\n        const refreshedStats = backendService.getStats();\n        setImages([...refreshedImages]);\n        setStatistics({...refreshedStats});\n        console.log('Forced refresh completed:', refreshedImages.length, 'images');\n      }, 50);\n      \n      console.log('Image added successfully:', newImage);\n      console.log('Statistics updated after upload:', newStats);\n      return newImage;
    } catch (error) {
      console.error('Error adding image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateImageStatus = (imageId, status) => {
    setLoading(true);
    try {
      const updatedImage = backendService.updateImageStatus(imageId, status);
      // Reload all images and statistics to ensure consistency
      const allImages = backendService.getAllImages();
      const newStats = backendService.getStats();
      setImages(allImages);
      setStatistics(newStats);
      console.log('Image status updated:', updatedImage);
      console.log('Statistics updated after status change:', newStats);
      return updatedImage;
    } catch (error) {
      console.error('Error updating image status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = (imageId) => {
    setLoading(true);
    try {
      backendService.deleteImage(imageId);
      // Reload all images to ensure consistency
      const allImages = backendService.getAllImages();
      setImages(allImages);
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getImagesByStatus = (status) => {
    return backendService.getImagesByStatus(status);
  };

  const getPendingImages = () => {
    return backendService.getPendingImages();
  };

  const getApprovedImages = () => {
    return backendService.getApprovedImages();
  };

  const searchImages = (query) => {
    return backendService.searchImages(query);
  };

  const getStats = () => {
    return backendService.getStats();
  };

  const refreshImages = () => {
    loadImages();
  };

  const value = {
    images,
    loading,
    statistics,
    setLoading,
    addImage,
    updateImageStatus,
    deleteImage,
    getImagesByStatus,
    getPendingImages,
    getApprovedImages,
    searchImages,
    getStats,
    refreshImages,
    loadImages
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};