import React from 'react';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter, FaCameraRetro } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="container p-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div style={{gridColumn: 'span 2'}}>
            <div className="flex items-center mb-4" style={{gap: '0.75rem'}}>
              <div className="bg-gradient rounded-xl p-4">
                <FaCameraRetro className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue">
                  SnapX
                </h1>
                <p className="text-sm" style={{color: '#9ca3af'}}>Image Gallery Platform</p>
              </div>
            </div>
            <p className="mb-6" style={{color: '#d1d5db', maxWidth: '28rem', lineHeight: '1.6'}}>
              A beautiful, moderated gallery platform where students can upload and share their amazing photography. 
              Every image goes through our approval process to ensure quality and safety.
            </p>
            <div className="flex" style={{gap: '1rem'}}>
              <a href="#" style={{color: '#9ca3af', transition: 'color 0.3s ease'}} 
                 onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                 onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                <FaGithub size={20} />
              </a>
              <a href="#" style={{color: '#9ca3af', transition: 'color 0.3s ease'}}
                 onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                 onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                <FaLinkedin size={20} />
              </a>
              <a href="#" style={{color: '#9ca3af', transition: 'color 0.3s ease'}}
                 onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                 onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow">Quick Links</h3>
            <ul style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <li>
                <a href="/" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Gallery
                </a>
              </li>
              <li>
                <a href="/upload" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Upload Image
                </a>
              </li>
              <li>
                <a href="/login" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Sign In
                </a>
              </li>
              <li>
                <a href="/register" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green">Support</h3>
            <ul style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <li>
                <a href="#" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Upload Guidelines
                </a>
              </li>
              <li>
                <a href="#" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" style={{color: '#d1d5db', textDecoration: 'none', transition: 'color 0.3s ease'}}
                   onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                   onMouseOut={(e) => e.target.style.color = '#d1d5db'}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{borderTop: '1px solid #374151'}}>
        <div className="container p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm" style={{gap: '0.5rem', color: '#9ca3af'}}>
              <span>© {currentYear} SnapX. Made with</span>
              <FaHeart className="text-red" style={{animation: 'pulse 2s infinite'}} />
              <span>for the hackathon</span>
            </div>
            <div className="text-sm mt-4" style={{color: '#9ca3af', marginTop: '1rem'}}>
              <span className="text-blue">Moderated Gallery Platform</span> - Quality & Safety First
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;