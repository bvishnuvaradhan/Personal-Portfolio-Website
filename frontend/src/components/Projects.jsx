import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, X, ExternalLink, Github } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function Projects({ projects = [], setView, viewMode = 'featured' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const displayableProjects = viewMode === 'featured' 
    ? projects.filter(p => p.featured)
    : projects;

  // Extract all unique tags/technologies from displayable projects
  const allTags = ['All', ...new Set(
    displayableProjects
      .flatMap(p => p.technologies ? p.technologies.split(',').map(t => t.trim()) : [])
      .filter(t => t.length > 0)
  )];

  useEffect(() => {
    if (viewMode === 'featured') {
      setFilteredProjects(displayableProjects);
    } else {
      let result = [...displayableProjects];

      // Filter by tag
      if (selectedTag !== 'All') {
        result = result.filter(project => 
          project.technologies && 
          project.technologies.split(',').map(t => t.trim().toLowerCase()).includes(selectedTag.toLowerCase())
        );
      }

      // Filter by search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        result = result.filter(project => 
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          (project.technologies && project.technologies.toLowerCase().includes(term))
        );
      }

      setFilteredProjects(result);
    }
  }, [projects, selectedTag, searchTerm, viewMode]);

  const renderProjectModal = () => (
    <AnimatePresence>
      {selectedProject && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedProject(null)}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            cursor: 'pointer'
          }}
        >
          <motion.div 
            className="modal-content glass"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              maxWidth: '650px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              padding: '30px',
              border: '1px solid var(--border-glass-hover)',
              boxShadow: 'var(--shadow-glass), var(--shadow-glow)',
              cursor: 'default',
              borderRadius: 'var(--border-radius-md)'
            }}
          >
            {/* Header Close button */}
            <button 
              className="theme-toggle" 
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 10,
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--border-glass)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <X size={18} />
            </button>

            {/* Project Title */}
            <h3 
              className="gradient-text" 
              style={{ 
                fontSize: '1.8rem', 
                marginBottom: '20px', 
                paddingRight: '40px',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {selectedProject.title}
            </h3>

            {/* Project Image */}
            <div 
              className="project-image-wrapper" 
              style={{ 
                height: '300px', 
                borderRadius: 'var(--border-radius-md)', 
                marginBottom: '25px',
                backgroundColor: 'var(--bg-primary)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--border-glass)'
              }}
            >
              <img 
                src={selectedProject.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'} 
                alt={selectedProject.title} 
                className="project-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Description */}
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Project Description</h4>
            <p 
              style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: '1.7', 
                fontSize: '0.95rem', 
                marginBottom: '25px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {selectedProject.description}
            </p>

            {/* Technologies */}
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Technologies Used</h4>
            <div className="project-tags" style={{ marginBottom: '30px' }}>
              {selectedProject.technologies && selectedProject.technologies.split(',').map((tag, idx) => (
                <span key={idx} className="project-tag" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  #{tag.trim()}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="project-links">
              {selectedProject.githubLink && (
                <a 
                  href={selectedProject.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary project-link" 
                  style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  <Github size={18} /> Source Code
                </a>
              )}
              {selectedProject.liveLink && (
                <a 
                  href={selectedProject.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary project-link" 
                  style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (viewMode === 'featured') {
    return (
      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        
        {/* Horizontal Scroll Container */}
        <div className="featured-scroll-container">
          {filteredProjects.map((project, index) => (
            <div key={project.id || index} style={{ width: '320px', flexShrink: 0 }}>
              <ProjectCard 
                project={project} 
                onTagClick={null} /* disable filtering trigger on home page */
                onCardClick={setSelectedProject}
              />
            </div>
          ))}

          {/* View More Card */}
          <div 
            className="project-card glass glass-hover more-projects-card" 
            onClick={() => window.location.hash = '#/projects'}
            style={{
              width: '320px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '40px 20px',
              border: '2px dashed var(--accent-primary)',
              borderRadius: 'var(--border-radius-md)',
              background: 'var(--accent-gradient-glow)',
              transition: 'var(--transition-smooth)',
              height: 'auto',
              minHeight: '400px'
            }}
          >
            <ArrowRight size={48} style={{ color: 'var(--accent-primary)', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>More Projects</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              View all of my competitive coding, web development, and IoT projects
            </p>
          </div>
        </div>
        {renderProjectModal()}
      </section>
    );
  }

  // All Projects View
  return (
    <section id="all-projects" style={{ minHeight: '60vh', padding: '40px 0' }}>
      <h2 className="section-title">All Projects</h2>
      
      {/* Search & Filter Header */}
      <div className="projects-header-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by name or technology..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tag Filters */}
        <div className="skills-filter">
          {allTags.slice(0, 10).map((tag, idx) => ( // show up to 10 tags
            <button
              key={idx}
              className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      <motion.div 
        className="projects-grid"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onTagClick={(tag) => setSelectedTag(tag)}
                onCardClick={setSelectedProject}
              />
            ))
          ) : (
            <motion.div 
              style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No projects match your search criteria.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {renderProjectModal()}
    </section>
  );
}
