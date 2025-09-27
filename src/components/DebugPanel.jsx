import React from 'react';
import { useImages } from '../context/ImageContext';
import backendService from '../services/backendService';

const DebugPanel = () => {
  const { images, loading } = useImages();
  const stats = backendService.getStats();

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will clear all images and users.')) {
      backendService.resetData();
      window.location.reload();
    }
  };

  const addTestImage = () => {
    const testImage = {
      title: 'Test Upload',
      caption: 'Test Image from Debug Panel',
      filePath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300',
      uploaderName: 'Debug User',
      uploaderEmail: 'debug@test.com',
      studentId: 'DEBUG001',
      description: 'This is a test image uploaded from debug panel',
      tags: 'test, debug, sample'
    };
    
    backendService.addImage(testImage);
    window.location.reload();
  };

  const exportData = () => {
    const data = backendService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snapx-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      width: '300px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '12px',
      color: '#e2e8f0',
      zIndex: 1000,
      maxHeight: '60vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#60a5fa' }}>Debug Panel</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>System Status:</strong>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Backend Service: Active</div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong>Statistics:</strong>
        <div>Total Images: {stats.totalImages}</div>
        <div>✅ Approved: {stats.approvedImages}</div>
        <div>⏳ Pending: {stats.pendingImages}</div>
        <div>❌ Rejected: {stats.rejectedImages}</div>
        <div>👥 Users: {stats.totalUsers}</div>
        <div>❤️ Total Likes: {stats.totalLikes}</div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong>Context Images:</strong>
        <div>Count: {images.length}</div>
        <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '10px' }}>
          {images.map((img, index) => (
            <div key={img._id} style={{ 
              padding: '2px 0', 
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)' 
            }}>
              {index + 1}. {img.status} - {img.title?.slice(0, 20)}...
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '6px 12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Refresh Page
        </button>
        <button
          onClick={exportData}
          style={{
            padding: '6px 12px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Export Data
        </button>
        <button
          onClick={addTestImage}
          style={{
            padding: '6px 12px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Add Test Image
        </button>
        <button
          onClick={resetData}
          style={{
            padding: '6px 12px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;