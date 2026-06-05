import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react';

export default function Blog({ posts = [] }) {
  const [activePost, setActivePost] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handlePostClick = (post) => {
    setActivePost(post);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setActivePost(null);
  };

  return (
    <section id="blog">
      <AnimatePresence mode="wait">
        {activePost ? (
          /* Single Blog Post View */
          <motion.div
            key="single-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <button className="btn btn-secondary" onClick={handleBackToList} style={{ marginBottom: '30px', display: 'inline-flex', gap: '5px' }}>
              <ArrowLeft size={16} /> Back to Articles
            </button>
            
            <span className="timeline-date" style={{ display: 'block', marginBottom: '10px' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
              {formatDate(activePost.createdAt)}
            </span>
            
            <h1 className="gradient-text" style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '25px', fontFamily: 'var(--font-heading)' }}>
              {activePost.title}
            </h1>
            
            <div 
              style={{ 
                fontSize: '1.15rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.8', 
                whiteSpace: 'pre-wrap' 
              }}
            >
              {activePost.content}
            </div>
          </motion.div>
        ) : (
          /* Blog Posts List View */
          <motion.div
            key="posts-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Technical Blog & Insights</h2>
            
            <div className="blog-grid">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    className="blog-card glass glass-hover"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <span className="blog-date">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '5px' }} />
                      {formatDate(post.createdAt)}
                    </span>
                    <h3 className="blog-title" onClick={() => handlePostClick(post)}>
                      {post.title}
                    </h3>
                    <p className="blog-excerpt">
                      {post.content.length > 180 
                        ? `${post.content.substring(0, 180)}...` 
                        : post.content}
                    </p>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'fit-content', display: 'flex', gap: '5px' }}
                      onClick={() => handlePostClick(post)}
                    >
                      <BookOpen size={14} /> Read Article
                    </button>
                  </motion.div>
                ))
              ) : (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>No articles published yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
