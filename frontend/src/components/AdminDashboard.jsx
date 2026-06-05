import React, { useState, useEffect } from 'react';
import { 
  BarChart3, FolderGit, Cpu, Calendar, Award, 
  BookOpen, Mail, LogOut, Plus, Trash2, Edit, Check, Eye, User 
} from 'lucide-react';
import { api } from '../utils/api';

export default function AdminDashboard({ isAdminLoggedIn, onLoginSuccess, onLogout, profile, setProfile }) {
  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Metrics Data State
  const [metrics, setMetrics] = useState({
    visitors: 0,
    resumeDownloads: 0,
    projectsCount: 0,
    messagesCount: 0,
    skillsCount: 0,
    totalProjectClicks: 0
  });

  // Database lists
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'project', 'skill', 'experience', 'education', 'cert', 'achievement', 'post'
  const [editItem, setEditItem] = useState(null); // Item to edit (null for adding new)
  const [formData, setFormData] = useState({});

  // Image Uploading State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Profile Settings States
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Fetch all dashboard content
  const fetchDashboardData = async () => {
    if (!isAdminLoggedIn) return;

    try {
      // 1. Fetch metrics
      const metricsData = await api.analytics.getMetrics();
      setMetrics(metricsData);

      // 2. Fetch list items
      const pData = await api.projects.getAll();
      setProjects(pData);

      const sData = await api.skills.getAll();
      setSkills(sData);

      const expData = await api.experience.getAll();
      setExperiences(expData);

      const eduData = await api.education.getAll();
      setEducation(eduData);

      const certsData = await api.certifications.getAll();
      setCertifications(certsData);

      const achData = await api.achievements.getAll();
      setAchievements(achData);

      const blogData = await api.blog.getAll(true); // get drafts too
      setPosts(blogData);

      const msgData = await api.messages.getAll();
      setMessages(msgData);

    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdminLoggedIn]);

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await api.auth.login(username, password);
      localStorage.setItem('token', res.token);
      onLoginSuccess();
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Profile Settings Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    try {
      const updated = await api.profile.update(profile);
      setProfile(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile settings:', err);
      alert(err.message || 'Failed to update profile settings');
    } finally {
      setProfileSaving(false);
    }
  };

  // Image File Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const result = await api.uploads.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: result.url
      }));
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Image upload failed. Try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Add/Edit Modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setUploadError('');
    setUploadingImage(false);

    if (item) {
      // populate form
      if (type === 'experience') {
        setFormData({
          ...item,
          startDate: item.startDate ? item.startDate.split('T')[0] : '',
          endDate: item.endDate ? item.endDate.split('T')[0] : ''
        });
      } else {
        setFormData({ ...item });
      }
    } else {
      // clear form
      setFormData({});
    }
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setFormData({});
  };

  // Handle Input Changes in Modals
  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save Add/Edit Item
  const handleSaveItem = async (e) => {
    e.preventDefault();

    try {
      const isEdit = !!editItem;

      if (modalType === 'project') {
        const payload = {
          ...formData,
          featured: !!formData.featured
        };
        if (isEdit) {
          await api.projects.update(editItem.id, payload);
        } else {
          await api.projects.create(payload);
        }
      } else if (modalType === 'skill') {
        const payload = {
          ...formData,
          proficiency: parseInt(formData.proficiency)
        };
        if (isEdit) {
          await api.skills.update(editItem.id, payload);
        } else {
          await api.skills.create(payload);
        }
      } else if (modalType === 'experience') {
        const payload = {
          ...formData,
          endDate: formData.endDate || null
        };
        if (isEdit) {
          await api.experience.update(editItem.id, payload);
        } else {
          await api.experience.create(payload);
        }
      } else if (modalType === 'education') {
        if (isEdit) {
          await api.education.update(editItem.id, formData);
        } else {
          await api.education.create(formData);
        }
      } else if (modalType === 'cert') {
        if (isEdit) {
          await api.certifications.update(editItem.id, formData);
        } else {
          await api.certifications.create(formData);
        }
      } else if (modalType === 'achievement') {
        if (isEdit) {
          await api.achievements.update(editItem.id, formData);
        } else {
          await api.achievements.create(formData);
        }
      } else if (modalType === 'post') {
        const payload = {
          ...formData,
          published: !!formData.published
        };
        if (isEdit) {
          await api.blog.update(editItem.id, payload);
        } else {
          await api.blog.create(payload);
        }
      }

      closeModal();
      fetchDashboardData(); // Refresh list
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  // Delete Item
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (type === 'project') await api.projects.delete(id);
      else if (type === 'skill') await api.skills.delete(id);
      else if (type === 'experience') await api.experience.delete(id);
      else if (type === 'education') await api.education.delete(id);
      else if (type === 'cert') await api.certifications.delete(id);
      else if (type === 'achievement') await api.achievements.delete(id);
      else if (type === 'post') await api.blog.delete(id);
      else if (type === 'message') await api.messages.delete(id);

      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  // Update Message Status
  const handleUpdateMessageStatus = async (id, status) => {
    try {
      await api.messages.updateStatus(id, status);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  // Format Dates for display
  const displayDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Render Login Panel if not logged in
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card glass">
          <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '10px' }} className="gradient-text">Admin Login</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem' }}>
            Authenticate to manage portfolio databases.
          </p>

          {loginError && (
            <div style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '15px' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              disabled={loginLoading}
            >
              {loginLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard panel once logged in
  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar glass">
        <div className="admin-nav-item logo gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800, paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
          Dashboard
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <BarChart3 size={18} /> Overview
          </div>
          <div className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <FolderGit size={18} /> Projects
          </div>
          <div className={`admin-nav-item ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Cpu size={18} /> Skills
          </div>
          <div className={`admin-nav-item ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
            <Calendar size={18} /> Timeline
          </div>
          <div className={`admin-nav-item ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
            <Award size={18} /> Credentials
          </div>
          <div className={`admin-nav-item ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
            <BookOpen size={18} /> Blog Posts
          </div>
          <div className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <Mail size={18} /> Messages
          </div>
          <div className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={18} /> Profile Settings
          </div>
        </div>

        <button 
          onClick={onLogout} 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '50px', display: 'flex', gap: '8px', justifyContent: 'center', borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <>
            <h2 style={{ fontSize: '1.8rem' }} className="gradient-text">Portfolio Analytics</h2>
            
            <div className="admin-metrics-grid">
              <div 
                className="metric-card glass clickable-metric" 
                onClick={() => window.open('https://vercel.com/bvishnuvaradhan/personal-portfolio-website/analytics', '_blank', 'noopener,noreferrer')}
                title="Click to view live Vercel Web Analytics"
              >
                <div className="metric-info">
                  <h4>Total Visitors</h4>
                  <p className="metric-value-special">View on Vercel ↗</p>
                  <span className="metric-note">Live Vercel Web Analytics</span>
                </div>
                <BarChart3 className="metric-icon" size={24} />
              </div>

              <div className="metric-card glass">
                <div className="metric-info">
                  <h4>Resume Downloads</h4>
                  <p>{metrics.resumeDownloads}</p>
                </div>
                <Calendar className="metric-icon" size={24} />
              </div>



              <div className="metric-card glass">
                <div className="metric-info">
                  <h4>Total Messages</h4>
                  <p>{metrics.messagesCount}</p>
                </div>
                <Mail className="metric-icon" size={24} />
              </div>
            </div>

            {/* Quick Messages List */}
            <div className="glass" style={{ padding: '25px' }}>
              <h3 style={{ marginBottom: '15px' }}>Recent Messages</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 5).map(msg => (
                      <tr key={msg.id}>
                        <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                        <td>{msg.name} ({msg.email})</td>
                        <td>{msg.subject}</td>
                        <td>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            padding: '3px 8px', 
                            borderRadius: '4px',
                            fontWeight: 600,
                            background: msg.status === 'New' ? 'rgba(244,63,94,0.1)' : msg.status === 'Read' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                            color: msg.status === 'New' ? '#f43f5e' : msg.status === 'Read' ? '#6366f1' : '#10b981'
                          }}>
                            {msg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No messages received yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="glass" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Manage Projects</h3>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('project')}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Featured</th>
                    <th>Technologies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td>{p.featured ? 'Yes' : 'No'}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.technologies}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="theme-toggle" onClick={() => openModal('project', p)} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('project', p.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS */}
        {activeTab === 'skills' && (
          <div className="glass" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Manage Skills</h3>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('skill')}>
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Proficiency</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.category}</td>
                      <td>{s.proficiency}%</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="theme-toggle" onClick={() => openModal('skill', s)} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('skill', s.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE (EXPERIENCE & EDUCATION) */}
        {activeTab === 'timeline' && (
          <>
            {/* Experience Sub-Panel */}
            <div className="glass" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Work Experience & Internships</h3>
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('experience')}>
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Company</th>
                      <th>Dates</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.map(exp => (
                      <tr key={exp.id}>
                        <td style={{ fontWeight: 600 }}>{exp.role}</td>
                        <td>{exp.company}</td>
                        <td>{displayDate(exp.startDate)} - {displayDate(exp.endDate)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="theme-toggle" onClick={() => openModal('experience', exp)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('experience', exp.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Education Sub-Panel */}
            <div className="glass" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Education History</h3>
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('education')}>
                  <Plus size={16} /> Add Education
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Degree</th>
                      <th>Institution</th>
                      <th>Period</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {education.map(edu => (
                      <tr key={edu.id}>
                        <td style={{ fontWeight: 600 }}>{edu.degree}</td>
                        <td>{edu.institution}</td>
                        <td>{edu.period}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="theme-toggle" onClick={() => openModal('education', edu)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('education', edu.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 5: CREDENTIALS */}
        {activeTab === 'credentials' && (
          <>
            {/* Certifications Sub-Panel */}
            <div className="glass" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Certifications</h3>
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('cert')}>
                  <Plus size={16} /> Add Certification
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Issuer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certifications.map(cert => (
                      <tr key={cert.id}>
                        <td style={{ fontWeight: 600 }}>{cert.title}</td>
                        <td>{cert.issuer}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="theme-toggle" onClick={() => openModal('cert', cert)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('cert', cert.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Achievements Sub-Panel */}
            <div className="glass" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Achievements</h3>
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('achievement')}>
                  <Plus size={16} /> Add Achievement
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map(ach => (
                      <tr key={ach.id}>
                        <td style={{ fontWeight: 600 }}>{ach.title}</td>
                        <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ach.description}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="theme-toggle" onClick={() => openModal('achievement', ach)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('achievement', ach.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 6: BLOG POSTS */}
        {activeTab === 'blog' && (
          <div className="glass" style={{ padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Blog Articles</h3>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openModal('post')}>
                <Plus size={16} /> Write Post
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 600 }}>{post.title}</td>
                      <td>{post.slug}</td>
                      <td>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                          color: post.published ? '#10b981' : '#f43f5e'
                        }}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="theme-toggle" onClick={() => openModal('post', post)} title="Edit">
                            <Edit size={14} />
                          </button>
                          <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('post', post.id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="glass" style={{ padding: '25px' }}>
            <h3>Inbound Messages</h3>
            <div style={{ marginTop: '20px' }} className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sender Info</th>
                    <th>Subject & Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg.id} style={{ opacity: msg.status === 'Replied' ? 0.7 : 1 }}>
                      <td style={{ whiteSpace: 'nowrap' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{msg.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{msg.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, marginBottom: '5px' }}>{msg.subject}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>{msg.content}</div>
                      </td>
                      <td>
                        <select 
                          value={msg.status} 
                          onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          <option value="New" style={{ background: 'var(--bg-secondary)', color: '#f43f5e' }}>New</option>
                          <option value="Read" style={{ background: 'var(--bg-secondary)', color: '#6366f1' }}>Read</option>
                          <option value="Replied" style={{ background: 'var(--bg-secondary)', color: '#10b981' }}>Replied</option>
                        </select>
                      </td>
                      <td>
                        <button className="theme-toggle" style={{ borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }} onClick={() => handleDeleteItem('message', msg.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No messages in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: PROFILE SETTINGS */}
        {activeTab === 'profile' && profile && (
          <div className="glass" style={{ padding: '25px' }}>
            <h3>Profile Settings</h3>
            {profileSuccess && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', margin: '20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> Profile updated successfully!
              </div>
            )}
            <form onSubmit={handleProfileSubmit} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.name || ''} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input 
                  type="email" 
                  className="admin-input" 
                  value={profile.email || ''} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                  required 
                />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bio / Description</label>
                <textarea 
                  rows={4}
                  className="admin-input" 
                  value={profile.bio || ''} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Primary GitHub Username</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.githubPrimary || ''} 
                  onChange={(e) => setProfile({ ...profile, githubPrimary: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Secondary GitHub Username</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.githubSecondary || ''} 
                  onChange={(e) => setProfile({ ...profile, githubSecondary: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>LinkedIn Profile Slug</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.linkedin || ''} 
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>LeetCode Username</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.leetcode || ''} 
                  onChange={(e) => setProfile({ ...profile, leetcode: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Codeforces Handle</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.codeforces || ''} 
                  onChange={(e) => setProfile({ ...profile, codeforces: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CodeChef Handle</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.codechef || ''} 
                  onChange={(e) => setProfile({ ...profile, codechef: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>B.Tech CGPA</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.cgpa || ''} 
                  onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Projects Built Count (e.g. 10+)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.projectsCount || ''} 
                  onChange={(e) => setProfile({ ...profile, projectsCount: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>LeetCode Solved Fallback (e.g. 450+)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.leetcodeSolved || ''} 
                  onChange={(e) => setProfile({ ...profile, leetcodeSolved: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CodeChef Rating (e.g. 1610)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.codechefRating || ''} 
                  onChange={(e) => setProfile({ ...profile, codechefRating: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CodeChef Division (e.g. Div 2)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.codechefDiv || ''} 
                  onChange={(e) => setProfile({ ...profile, codechefDiv: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CodeChef Stars (e.g. 3 ★)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.codechefStars || ''} 
                  onChange={(e) => setProfile({ ...profile, codechefStars: e.target.value })} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resume File Name (PDF in public folder)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={profile.resumeUrl || ''} 
                  onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })} 
                />
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={profileSaving}
                  style={{ width: '150px' }}
                >
                  {profileSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* CRUD POPUP MODALS */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '25px', display: 'flex', gap: '8px', alignItems: 'center' }} className="gradient-text">
              {editItem ? <Edit size={20} /> : <Plus size={20} />} 
              {editItem ? 'Edit' : 'Add New'} {modalType.toUpperCase()}
            </h3>

            <form onSubmit={handleSaveItem}>

              {/* PROJECT FORM FIELDS */}
              {modalType === 'project' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-textarea" value={formData.description || ''} onChange={handleFormInputChange} required></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technologies (comma separated)</label>
                    <input type="text" name="technologies" className="form-input" placeholder="React, Node, Prisma" value={formData.technologies || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub Link URL</label>
                    <input type="url" name="githubLink" className="form-input" value={formData.githubLink || ''} onChange={handleFormInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Demo URL</label>
                    <input type="url" name="liveLink" className="form-input" value={formData.liveLink || ''} onChange={handleFormInputChange} />
                  </div>
                  
                  {/* Cloudinary Image Upload Section */}
                  <div className="form-group">
                    <label className="form-label">Project Image</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                        id="project-image-file" 
                      />
                      <label htmlFor="project-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '8px 16px' }}>
                        {uploadingImage ? 'Uploading Image...' : 'Choose Image'}
                      </label>
                      
                      <input 
                        type="url" 
                        name="imageUrl" 
                        placeholder="Or paste image URL"
                        className="form-input" 
                        value={formData.imageUrl || ''} 
                        onChange={handleFormInputChange}
                        required 
                        style={{ flexGrow: 1 }}
                      />
                    </div>
                    {uploadError && <span className="form-error">{uploadError}</span>}
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '10px', display: 'block' }} />
                    )}
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input type="checkbox" id="featured-chk" name="featured" checked={!!formData.featured} onChange={handleFormInputChange} />
                    <label htmlFor="featured-chk" className="form-label" style={{ marginBottom: 0 }}>Featured Project (Shown first)</label>
                  </div>
                </>
              )}

              {/* SKILL FORM FIELDS */}
              {modalType === 'skill' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Skill Name</label>
                    <input type="text" name="name" className="form-input" value={formData.name || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-input" value={formData.category || 'Frontend'} onChange={handleFormInputChange} required>
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proficiency Percentage (0-100)</label>
                    <input type="number" name="proficiency" min="0" max="100" className="form-input" value={formData.proficiency || 80} onChange={handleFormInputChange} required />
                  </div>
                </>
              )}

              {/* EXPERIENCE FORM FIELDS */}
              {modalType === 'experience' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Role Title</label>
                    <input type="text" name="role" className="form-input" value={formData.role || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" name="company" className="form-input" value={formData.company || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" name="startDate" className="form-input" value={formData.startDate || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date (Leave blank if currently working here)</label>
                    <input type="date" name="endDate" className="form-input" value={formData.endDate || ''} onChange={handleFormInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Key Responsibilities / Description</label>
                    <textarea name="description" className="form-textarea" value={formData.description || ''} onChange={handleFormInputChange} required></textarea>
                  </div>
                </>
              )}

              {/* EDUCATION FORM FIELDS */}
              {modalType === 'education' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Degree / Title</label>
                    <input type="text" name="degree" className="form-input" value={formData.degree || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution Name</label>
                    <input type="text" name="institution" className="form-input" value={formData.institution || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Period (e.g. 2022 - 2026)</label>
                    <input type="text" name="period" className="form-input" placeholder="2022 - 2026" value={formData.period || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grade / Achievements / Description</label>
                    <textarea name="description" className="form-textarea" value={formData.description || ''} onChange={handleFormInputChange} required></textarea>
                  </div>
                </>
              )}

              {/* CERTIFICATION FORM FIELDS */}
              {modalType === 'cert' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Certificate Title</label>
                    <input type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuing Organization</label>
                    <input type="text" name="issuer" className="form-input" value={formData.issuer || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credential Verification URL</label>
                    <input type="url" name="link" className="form-input" value={formData.link || ''} onChange={handleFormInputChange} required />
                  </div>
                </>
              )}

              {/* ACHIEVEMENT FORM FIELDS */}
              {modalType === 'achievement' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Achievement Title</label>
                    <input type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-textarea" value={formData.description || ''} onChange={handleFormInputChange} required></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Verification Link URL (Optional)</label>
                    <input type="url" name="link" className="form-input" value={formData.link || ''} onChange={handleFormInputChange} />
                  </div>
                </>
              )}

              {/* BLOG POST FORM FIELDS */}
              {modalType === 'post' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleFormInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Article Link URL (Optional - Redirects directly when clicked)</label>
                    <input type="url" name="link" className="form-input" placeholder="https://example.com/blog" value={formData.link || ''} onChange={handleFormInputChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Markdown / Text Content</label>
                    <textarea name="content" className="form-textarea" style={{ minHeight: '250px' }} value={formData.content || ''} onChange={handleFormInputChange} required></textarea>
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <input type="checkbox" id="published-chk" name="published" checked={!!formData.published} onChange={handleFormInputChange} />
                    <label htmlFor="published-chk" className="form-label" style={{ marginBottom: 0 }}>Publish Immediately (visible in blog list)</label>
                  </div>
                </>
              )}

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploadingImage}>
                  {uploadingImage ? 'Uploading Image...' : 'Save Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
