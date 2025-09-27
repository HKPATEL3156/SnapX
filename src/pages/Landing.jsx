import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaSignInAlt, FaCamera, FaHeart, FaShare, FaStar, FaUsers, FaImage, FaLock } from 'react-icons/fa';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: FaCamera,
      title: 'Share Your Moments',
      description: 'Upload and share your best photos with a community that appreciates great photography.'
    },
    {
      icon: FaUsers,
      title: 'Connect with Others',
      description: 'Follow photographers, discover new talent, and build meaningful connections.'
    },
    {
      icon: FaHeart,
      title: 'Get Inspired',
      description: 'Browse through curated feeds of amazing photography from around the world.'
    },
    {
      icon: FaLock,
      title: 'Safe Community',
      description: 'Our moderation system ensures a safe and welcoming environment for everyone.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Photos Shared' },
    { number: '100K+', label: 'Likes Given' },
    { number: '5K+', label: 'Daily Uploads' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Capture, Share, and Discover
              <span className="hero-highlight">Amazing Photography</span>
            </h1>
            <p className="hero-description">
              Join SnapX, the premier photo sharing platform where photographers of all levels 
              come together to share their passion, discover inspiration, and build a community 
              around visual storytelling.
            </p>
            
            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                <FaUserPlus />
                <span>Join SnapX</span>
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-avatar">
                  <FaCamera />
                </div>
                <div>
                  <h3>Featured Photo</h3>
                  <p>by @photographer</p>
                </div>
              </div>
              <div className="hero-image">
                <div className="placeholder-image">
                  <FaImage style={{fontSize: '3rem', color: '#64748b'}} />
                  <p>Beautiful landscape photography</p>
                </div>
              </div>
              <div className="hero-card-actions">
                <button className="action-btn">
                  <FaHeart style={{color: '#ef4444'}} />
                  <span>1.2K</span>
                </button>
                <button className="action-btn">
                  <FaShare style={{color: '#3b82f6'}} />
                  <span>Share</span>
                </button>
                <button className="action-btn">
                  <FaStar style={{color: '#f59e0b'}} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>Discover Amazing Photography</h2>
          <p>Search through thousands of photos by tags, categories, or photographers</p>
          
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for photos, photographers, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>

          <div className="popular-tags">
            <span>Popular tags:</span>
            {['landscape', 'portrait', 'nature', 'street', 'architecture', 'wildlife'].map((tag) => (
              <button key={tag} className="tag-btn">#{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose SnapX?</h2>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <h2>Join Our Growing Community</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Share Your Story?</h2>
          <p>Join thousands of photographers who trust SnapX to showcase their work</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary">
              <FaUserPlus />
              <span>Get Started Free</span>
            </Link>
            <Link to="/login" className="btn btn-outline">
              <FaSignInAlt />
              <span>Already have an account?</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;