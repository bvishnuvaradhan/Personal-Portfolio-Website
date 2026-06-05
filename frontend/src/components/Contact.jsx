import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field-specific error
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.content.trim()) tempErrors.content = 'Message content is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      // Send form data to Express backend
      await api.messages.submit(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        content: ''
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <h2 className="section-title">Get In Touch</h2>

      <div className="contact-grid">
        {/* Info Cards */}
        <div className="contact-info">
          <div className="contact-info-card glass glass-hover">
            <div className="contact-icon-wrapper">
              <Mail size={24} />
            </div>
            <div>
              <span className="contact-label">Email Me</span>
              <div className="contact-value">vishnuvaradhan.boga@gmail.com</div>
            </div>
          </div>

          <div className="contact-info-card glass glass-hover">
            <div className="contact-icon-wrapper">
              <MapPin size={24} />
            </div>
            <div>
              <span className="contact-label">Location</span>
              <div className="contact-value">Hyderabad, Telangana, India</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card glass">
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <CheckCircle2 size={20} />
              <span>Thank you! Your message has been sent successfully. I will get back to you shortly.</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                className="form-input" 
                value={formData.subject}
                onChange={handleChange}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">Message</label>
              <textarea 
                id="content" 
                name="content" 
                className="form-textarea" 
                value={formData.content}
                onChange={handleChange}
              ></textarea>
              {errors.content && <span className="form-error">{errors.content}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Sending Message...' : 'Send Message'} <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
