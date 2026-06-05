import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { api } from '../utils/api';

export default function Hero() {
  const userName = import.meta.env.VITE_USER_NAME || 'Your Name';
  const email = import.meta.env.VITE_USER_EMAIL || 'contact@example.com';
  const githubPrimary = import.meta.env.VITE_GITHUB_PRIMARY;
  const githubSecondary = import.meta.env.VITE_GITHUB_SECONDARY;
  const linkedin = import.meta.env.VITE_LINKEDIN;
  const resumeFile = import.meta.env.VITE_RESUME_FILE || 'Resume.pdf';

  // Calculate initials dynamically
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleDownloadResume = async () => {
    try {
      // Trigger API call to increment resume downloads in analytics
      await api.analytics.trackResumeDownload();
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = `/${resumeFile}`;
      link.download = resumeFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error tracking resume download:', err);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-container">
      <div className="hero-glow"></div>
      
      {/* Left side: Intro Text */}
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span className="hero-subtitle">Welcome to my universe</span>
        <h1 className="hero-title">
          Hey, I'm <br />
          <span className="gradient-text">{userName}</span>
        </h1>
        <p className="hero-description">
          A passionate Full-Stack Software Engineer and AI Enthusiast. I craft high-performance, visually stunning web applications with robust backends and clean code architectures.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
            View Projects <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadResume}>
            Download Resume <Download size={16} />
          </button>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          {githubPrimary && (
            <a href={`https://github.com/${githubPrimary}`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Primary)">
              <Github size={20} />
            </a>
          )}
          {githubSecondary && (
            <a href={`https://github.com/${githubSecondary}`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Secondary)">
              <Github size={20} style={{ opacity: 0.7 }} />
            </a>
          )}
          {linkedin && (
            <a href={`https://www.linkedin.com/in/${linkedin}/`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
              <Linkedin size={20} />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="footer-social-link" title="Email">
              <Mail size={20} />
            </a>
          )}
        </div>
      </motion.div>

      {/* Right side: visual profile */}
      <motion.div 
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      >
        <div className="hero-profile-container">
          <div className="hero-profile-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '5rem', fontWeight: 800, userSelect: 'none', border: '4px solid var(--bg-primary)', width: '100%', height: '100%', borderRadius: '50%' }}>
            {initials}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
