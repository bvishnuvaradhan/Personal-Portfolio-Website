import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function Skills({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredSkills, setFilteredSkills] = useState([]);

  // Categories list
  const categories = ['All', 'Programming Languages', 'Frontend', 'Backend & Systems', 'Databases', 'Tools & Platforms', 'Core Concepts', 'Soft Skills'];

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredSkills(skills);
    } else {
      setFilteredSkills(skills.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase()));
    }
  }, [skills, activeCategory]);

  return (
    <section id="skills">
      <h2 className="section-title">Technical Expertise</h2>

      <div className="skills-container">
        {/* Categories Toggles */}
        <div className="skills-filter">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div 
          className="skills-grid"
          layout
        >
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <motion.div 
                key={skill.id || index}
                className="skill-card glass glass-hover"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="skill-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  <span className="skill-percent">{skill.proficiency}%</span>
                </div>
                
                {/* Visual Skill Bar */}
                <div className="skill-bar-bg">
                  <motion.div 
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  ></motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>No skills seeded in this category.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
