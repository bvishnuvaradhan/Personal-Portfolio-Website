import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const brandName = import.meta.env.VITE_BRAND_NAME || 'Portfolio.Dev';
  const userName = import.meta.env.VITE_USER_NAME || 'Your Name';
  const email = import.meta.env.VITE_USER_EMAIL || 'contact@example.com';
  const githubPrimary = import.meta.env.VITE_GITHUB_PRIMARY;
  const githubSecondary = import.meta.env.VITE_GITHUB_SECONDARY;
  const linkedin = import.meta.env.VITE_LINKEDIN;

  return (
    <footer className="footer glass">
      <div className="footer-content">
        <div className="footer-logo gradient-text">
          {brandName}
        </div>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} {userName}. All rights reserved.
        </p>
        <div className="footer-socials">
          {githubPrimary && (
            <a href={`https://github.com/${githubPrimary}`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Primary)">
              <Github size={18} />
            </a>
          )}
          {githubSecondary && (
            <a href={`https://github.com/${githubSecondary}`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub (Secondary)">
              <Github size={18} style={{ opacity: 0.7 }} />
            </a>
          )}
          {linkedin && (
            <a href={`https://www.linkedin.com/in/${linkedin}/`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="footer-social-link" title="Email">
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
