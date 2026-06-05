import React, { useState } from 'react';
import { Sun, Moon, Lock, ShieldAlert, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setView, 
  isDark, 
  toggleTheme, 
  isAdminLoggedIn, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    if (window.location.hash === `#${sectionId}`) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.hash = `#${sectionId}`;
    }
    setMobileMenuOpen(false);
  };

  const navigateTo = (viewName) => {
    if (viewName === 'home') {
      window.location.hash = '#/';
    } else if (viewName === 'projects') {
      window.location.hash = '#/projects';
    } else if (viewName === 'admin') {
      window.location.hash = '#/admin';
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar glass">
      <div className="nav-logo gradient-text" onClick={() => navigateTo('home')}>
        Boga.Dev
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        {currentView === 'home' ? (
          <>
            <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>Home</a>
            <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
            <a href="#skills" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('skills'); }}>Skills</a>
            <a href="#experience" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('experience'); }}>Experience</a>
            <a href="#projects" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('projects'); }}>Projects</a>
            <a href="#blog" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }}>Blog</a>
            <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
          </>
        ) : (
          <button className="btn btn-secondary nav-link" style={{ padding: '6px 12px', display: 'flex', gap: '5px' }} onClick={() => navigateTo('home')}>
            <ArrowLeft size={16} /> Back to Portfolio
          </button>
        )}
      </div>

      <div className="nav-actions">
        {/* Theme Toggler */}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Admin Navigation */}
        {isAdminLoggedIn ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="admin-btn active" onClick={() => navigateTo('admin')} title="Admin Dashboard">
              <Lock size={18} />
            </button>
            <button className="admin-btn" onClick={onLogout} title="Logout" style={{ borderColor: 'var(--accent-tertiary)' }}>
              <LogOut size={18} style={{ color: 'var(--accent-tertiary)' }} />
            </button>
          </div>
        ) : (
          <button className="admin-btn" onClick={() => navigateTo('admin')} title="Admin Login">
            <Lock size={18} />
          </button>
        )}

        {/* Mobile Menu Icon */}
        <button className="burger-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
