import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function Projects({ projects = [], setView, viewMode = 'featured' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Extract all unique tags/technologies from projects
  const allTags = ['All', ...new Set(
    projects
      .flatMap(p => p.technologies ? p.technologies.split(',').map(t => t.trim()) : [])
      .filter(t => t.length > 0)
  )];

  // Order of featured projects keywords
  const orderKeywords = ["CivicWatch", "HyFD", "MongoArchitect", "Aletheia Gate", "CipherNexus"];

  useEffect(() => {
    if (viewMode === 'featured') {
      // Find and order the 5 specific projects
      const ordered = [];
      orderKeywords.forEach(keyword => {
        const matched = projects.find(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
        if (matched) {
          ordered.push(matched);
        }
      });
      // Fallback to first 5 projects if none match keyword (safety check)
      setFilteredProjects(ordered.length > 0 ? ordered : projects.slice(0, 5));
    } else {
      let result = [...projects];

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

  if (viewMode === 'featured') {
    return (
      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        
        {/* Horizontal Scroll Container */}
        <div className="featured-scroll-container">
          {filteredProjects.map((project, index) => (
            <div key={project.id || index} style={{ minWidth: '350px', flexShrink: 0 }}>
              <ProjectCard 
                project={project} 
                onTagClick={null} /* disable filtering trigger on home page */
              />
            </div>
          ))}

          {/* View More Card */}
          <div 
            className="project-card glass glass-hover more-projects-card" 
            onClick={() => setView && setView('projects')}
            style={{
              minWidth: '300px',
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
    </section>
  );
}
