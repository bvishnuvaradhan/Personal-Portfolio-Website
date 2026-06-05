import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="footer-content">
        <div className="footer-logo gradient-text">
          Boga.Dev
        </div>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Boga Vishnuvaradhan. All rights reserved.
        </p>
        <div className="footer-socials">
          <a href="https://github.com/bvishnuvaradhan" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Primary)">
            <Github size={18} />
          </a>
          <a href="https://github.com/Vishnuvaradhan142" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Secondary)">
            <Github size={18} style={{ opacity: 0.7 }} />
          </a>
          <a href="https://www.linkedin.com/in/boga-vishnuvaradhan/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href="mailto:vishnuvaradhan.boga@gmail.com" className="footer-social-link">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
