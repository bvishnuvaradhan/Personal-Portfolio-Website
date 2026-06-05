import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { api } from '../utils/api';

export default function Hero() {
  const handleDownloadResume = async () => {
    try {
      // Trigger API call to increment resume downloads in analytics
      await api.analytics.trackResumeDownload();
      
      // Simulate file download (or open path)
      // We will create a dummy resume file in public folder or link a mockup
      const link = document.createElement('a');
      link.href = '/Boga_Vishnuvaradhan_Resume.pdf';
      link.download = 'Boga_Vishnuvaradhan_Resume.pdf';
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
          <span className="gradient-text">Boga Vishnuvaradhan</span>
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
          <a href="https://github.com/bvishnuvaradhan" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Primary)">
            <Github size={20} />
          </a>
          <a href="https://github.com/Vishnuvaradhan142" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Secondary)">
            <Github size={20} style={{ opacity: 0.7 }} />
          </a>
          <a href="https://www.linkedin.com/in/boga-vishnuvaradhan/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="mailto:vishnuvaradhan.boga@gmail.com" className="footer-social-link" title="Email">
            <Mail size={20} />
          </a>
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
            BV
          </div>
        </div>
      </motion.div>
    </section>
  );
}
