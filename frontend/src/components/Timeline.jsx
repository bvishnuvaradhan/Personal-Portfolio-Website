import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

export default function Timeline({ experiences = [], education = [] }) {
  // Helper to format Date to nice month and year
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section id="experience" className="glass" style={{ padding: '80px 5%', margin: '60px auto', borderLeft: 'none', borderRight: 'none' }}>
      <h2 className="section-title">Experience & Education</h2>

      <div className="timeline-section-grid">
        {/* Experience Column */}
        <div>
          <h3 className="timeline-column-title">
            <Briefcase size={24} /> Experience
          </h3>

          <motion.div 
            className="timeline-wrapper"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <motion.div key={exp.id || index} className="timeline-item" variants={itemVariants}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">
                    <Calendar size={12} style={{ marginRight: '5px', display: 'inline' }} />
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </div>
                  <div className="timeline-card glass glass-hover">
                    <h4 className="timeline-title">{exp.role}</h4>
                    <div className="timeline-subtitle">{exp.company}</div>
                    {exp.description && (exp.description.includes('\n') || exp.description.includes('•')) ? (
                      <ul style={{ paddingLeft: '20px', marginTop: '10px', listStyleType: 'disc', color: 'var(--text-secondary)', textAlign: 'left' }}>
                        {exp.description
                          .split(/[\n•]+/)
                          .map(line => line.trim())
                          .filter(line => line.length > 0)
                          .map((line, idx) => (
                            <li key={idx} style={{ marginBottom: '6px', fontSize: '0.95rem' }}>{line}</li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className="timeline-desc">{exp.description}</p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No experience items posted yet.</p>
            )}
          </motion.div>
        </div>

        {/* Education Column */}
        <div>
          <h3 className="timeline-column-title">
            <GraduationCap size={24} /> Education
          </h3>

          <motion.div 
            className="timeline-wrapper"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {education.length > 0 ? (
              education.map((edu, index) => (
                <motion.div key={edu.id || index} className="timeline-item" variants={itemVariants}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-date">
                    <Calendar size={12} style={{ marginRight: '5px', display: 'inline' }} />
                    {edu.period}
                  </div>
                  <div className="timeline-card glass glass-hover">
                    <h4 className="timeline-title">{edu.degree}</h4>
                    <div className="timeline-subtitle">{edu.institution}</div>
                    <p className="timeline-desc">{edu.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No education history posted yet.</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
