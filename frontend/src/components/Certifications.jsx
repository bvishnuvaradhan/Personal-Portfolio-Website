import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, ExternalLink } from 'lucide-react';

export default function Certifications({ certifications = [], achievements = [] }) {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="credentials" style={{ padding: '60px 5%' }}>
      <div className="cert-ach-grid">
        {/* Left Column: Certifications */}
        <div>
          <h2 className="timeline-column-title" style={{ fontSize: '2rem' }}>
            <Award size={24} /> Certifications
          </h2>
          
          <motion.div 
            className="certs-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <motion.div 
                  key={cert.id} 
                  className="cert-card glass glass-hover"
                  variants={itemVariants}
                >
                  <div className="cert-card-header">
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '3px' }}>{cert.title}</h4>
                      <span className="cert-issuer">{cert.issuer}</span>
                    </div>
                    {cert.link && (
                      <a 
                        href={cert.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: 'var(--accent-primary)' }}
                        title="View Certificate"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No certifications posted yet.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column: Achievements */}
        <div>
          <h2 className="timeline-column-title" style={{ fontSize: '2rem' }}>
            <Trophy size={24} /> Achievements
          </h2>
          
          <motion.div 
            className="achievements-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <motion.div 
                  key={ach.id} 
                  className="achievement-card glass glass-hover"
                  variants={itemVariants}
                >
                  <div className="achievement-card-header">
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '5px' }}>{ach.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ach.description}</p>
                    </div>
                    {ach.link && (
                      <a 
                        href={ach.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: 'var(--accent-secondary)' }}
                        title="Learn More"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No achievements posted yet.</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
