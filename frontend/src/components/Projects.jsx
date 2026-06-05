import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function Projects({ projects = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Extract all unique tags/technologies from projects
  const allTags = ['All', ...new Set(
    projects
      .flatMap(p => p.technologies ? p.technologies.split(',').map(t => t.trim()) : [])
      .filter(t => t.length > 0)
  )];

  useEffect(() => {
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
  }, [projects, selectedTag, searchTerm]);

  return (
    <section id="projects">
      <h2 className="section-title">Featured Projects</h2>
      
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
          {allTags.slice(0, 7).map((tag, idx) => ( // limit to top 7 tags to avoid clutter
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
