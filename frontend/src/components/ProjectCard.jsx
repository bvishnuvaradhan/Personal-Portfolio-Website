import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { api } from '../utils/api';

export default function ProjectCard({ project, onTagClick }) {
  // Format technologies list from comma-separated string to array
  const tags = project.technologies 
    ? project.technologies.split(',').map(tag => tag.trim()) 
    : [];

  const handleLinkClick = async () => {
    try {
      // Increment clicks analytics counter for the project
      await api.projects.trackClick(project.id);
    } catch (err) {
      console.error('Error tracking project click:', err);
    }
  };

  return (
    <motion.div 
      className="project-card glass glass-hover"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <div className="project-image-wrapper">
        <img 
          src={project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'} 
          alt={project.title} 
          className="project-image"
          loading="lazy"
        />
        {project.featured && (
          <span className="project-featured-badge">Featured</span>
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        
        {/* Technologies/Tags */}
        <div className="project-tags">
          {tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="project-tag"
              onClick={() => onTagClick && onTagClick(tag)}
              style={{ cursor: onTagClick ? 'pointer' : 'default' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Project Links */}
        <div className="project-links">
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary project-link" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={handleLinkClick}
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.liveLink && (
            <a 
              href={project.liveLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary project-link" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={handleLinkClick}
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
