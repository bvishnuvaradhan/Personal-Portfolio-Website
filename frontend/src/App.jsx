import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Code2, Award, Star, BookOpen, Heart, Globe, Terminal, Activity } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Blog from './components/Blog';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { api } from './utils/api';
import './App.css';

export default function App() {
  const [currentView, setView] = useState('home'); // 'home', 'admin'
  const [isDark, setIsDark] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Database lists
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [posts, setPosts] = useState([]);
  // Profile Data State
  const [profile, setProfile] = useState({
    name: 'Your Name',
    email: 'contact@example.com',
    bio: 'A passionate developer.',
    githubPrimary: 'github_username_1',
    githubSecondary: '',
    linkedin: 'linkedin_username',
    codeforces: 'codeforces_username',
    codechef: 'codechef_username',
    leetcode: 'leetcode_username',
    resumeUrl: 'Resume.pdf'
  });

  // GitHub, LeetCode & Codeforces Stats
  const [githubStats, setGithubStats] = useState({ repos: 0, stars: 0, followers: 0 });
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [leetcodeError, setLeetcodeError] = useState(false);
  const [codeforcesStats, setCodeforcesStats] = useState(null);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('light-theme');
  };

  // Check login state
  const checkLogin = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.auth.me();
        setIsAdminLoggedIn(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAdminLoggedIn(false);
      }
    }
  };

  // Fetch Public Portfolio Data
  const fetchPortfolioData = async () => {
    try {
      // Fetch Profile Details
      let prof = null;
      try {
        prof = await api.profile.get();
        if (prof) setProfile(prof);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }

      const pData = await api.projects.getAll();
      setProjects(pData);

      const sData = await api.skills.getAll();
      setSkills(sData);

      const expData = await api.experience.getAll();
      setExperiences(expData);

      const eduData = await api.education.getAll();
      setEducation(eduData);

      const certData = await api.certifications.getAll();
      setCertifications(certData);

      const achData = await api.achievements.getAll();
      setAchievements(achData);

      const blogData = await api.blog.getAll();
      setPosts(blogData);

      // Trigger stats fetches using profile keys
      const p = prof || { githubPrimary: '', githubSecondary: '', leetcode: '', codeforces: '' };
      fetchGithubStats(p.githubPrimary, p.githubSecondary);
      fetchLeetcodeStats(p.leetcode);
      fetchCodeforcesStats(p.codeforces);
    } catch (err) {
      console.error('Error fetching public portfolio data:', err);
    }
  };

  // Fetch GitHub Stats for both accounts and combine them
  const fetchGithubStats = async (githubPrimary, githubSecondary) => {
    try {
      const user1 = githubPrimary || 'github_user_1';
      const user2 = githubSecondary || '';

      let repos = 0;
      let stars = 0;
      let followers = 0;

      // Account 1 (Primary)
      const res1 = await fetch(`https://api.github.com/users/${user1}`);
      if (res1.ok) {
        const data1 = await res1.json();
        repos += data1.public_repos || 0;
        followers += data1.followers || 0;
        
        const reposRes1 = await fetch(`https://api.github.com/users/${user1}/repos?per_page=100`);
        if (reposRes1.ok) {
          const reposData1 = await reposRes1.json();
          stars += reposData1.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        }
      }

      // Account 2 (Secondary, if configured)
      if (user2) {
        const res2 = await fetch(`https://api.github.com/users/${user2}`);
        if (res2.ok) {
          const data2 = await res2.json();
          repos += data2.public_repos || 0;
          followers += data2.followers || 0;
          
          const reposRes2 = await fetch(`https://api.github.com/users/${user2}/repos?per_page=100`);
          if (reposRes2.ok) {
            const reposData2 = await reposRes2.json();
            stars += reposData2.reduce((sum, repo) => sum + repo.stargazers_count, 0);
          }
        }
      }

      // If both API calls failed or returned zero, set reasonable fallback mockup
      if (repos === 0 && followers === 0) {
        setGithubStats({ repos: 22, stars: 10, followers: 32 });
      } else {
        setGithubStats({ repos, stars, followers });
      }
    } catch (err) {
      console.error('GitHub stats fetch error, using mockup data:', err);
      setGithubStats({ repos: 22, stars: 10, followers: 32 });
    }
  };

  // Fetch LeetCode Stats via backend GraphQL Proxy
  const fetchLeetcodeStats = async (leetcodeHandle) => {
    try {
      const handle = leetcodeHandle || 'leetcode_handle';
      // Query our backend proxy with user's actual username
      const stats = await api.leetcode.getStats(handle);
      setLeetcodeStats(stats);
      setLeetcodeError(false);
    } catch (err) {
      console.error('LeetCode proxy error:', err);
      setLeetcodeError(true);
    }
  };

  // Fetch Codeforces Stats
  const fetchCodeforcesStats = async (codeforcesHandle) => {
    try {
      const handle = codeforcesHandle || 'codeforces_handle';
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && data.result.length > 0) {
          setCodeforcesStats(data.result[0]);
        }
      }
    } catch (err) {
      console.error('Codeforces fetch error:', err);
    }
  };

  // Page initialization
  useEffect(() => {
    // 1. Check if token exists
    checkLogin();
    
    // 2. Increment visitor count
    api.analytics.trackVisit().catch(err => console.error('Visit track error:', err));
    
    // 3. Get portfolio database contents
    fetchPortfolioData();
  }, []);

  // Listen to hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/projects') {
        setView('projects');
        window.scrollTo(0, 0);
      } else if (hash === '#/admin') {
        setView('admin');
        window.scrollTo(0, 0);
      } else {
        setView('home');
        // Handle scrolling if hash is a specific section (e.g. #about, #skills, #experience, #projects, #blog, #contact)
        if (hash && !hash.startsWith('#/')) {
          const sectionId = hash.substring(1);
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    // Run on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdminLoggedIn(false);
    window.location.hash = '#/';
  };

  return (
    <div>
      {/* Navbar navigation header */}
      <Navbar 
        currentView={currentView}
        setView={setView}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        profile={profile}
      />

      {currentView === 'home' ? (
        /* HOME PORTFOLIO VIEW */
        <div>
          <Hero profile={profile} />
          
          {/* About Me Details Section */}
          <section id="about">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <div className="about-details">
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {profile.bio || "Welcome to my portfolio website. Here you can see my projects, skills, education, and credentials."}
                </p>
              </div>

              {/* Highlighting Stats Cards */}
              <div className="about-stats">
                <div className="stat-item glass">
                  <div className="stat-number">9.48</div>
                  <div className="stat-label">B.Tech CGPA</div>
                </div>
                <div className="stat-item glass">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Projects Built</div>
                </div>
                <div className="stat-item glass">
                  <div className="stat-number">450+</div>
                  <div className="stat-label">LeetCode Solved</div>
                </div>
              </div>
            </div>
          </section>

          <Skills skills={skills} />
          
          <Timeline experiences={experiences} education={education} />
          
          <Projects projects={projects} setView={setView} viewMode="featured" />
          
          <Certifications certifications={certifications} achievements={achievements} />
          
          {/* GitHub & LeetCode Integrations display */}
          <section id="integrations" style={{ padding: '40px 5%' }}>
            <h2 className="section-title">Coding Profiles</h2>
            <div className="integrations-grid">
              
              {/* GitHub Stats Card */}
              <div className="github-card glass">
                <div className="github-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Github size={24} style={{ color: 'var(--text-primary)' }} />
                    <h3 style={{ fontSize: '1.25rem' }}>GitHub</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {profile.githubPrimary && (
                      <a href={`https://github.com/${profile.githubPrimary}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }} title="Primary GitHub">
                        {profile.githubPrimary}
                      </a>
                    )}
                    {profile.githubSecondary && (
                      <>
                        <span style={{ color: 'var(--text-secondary)' }}>|</span>
                        <a href={`https://github.com/${profile.githubSecondary}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }} title="Secondary GitHub">
                          {profile.githubSecondary}
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-box-title">Repositories</div>
                    <div className="stat-box-value">{githubStats.repos}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-title">Total Stars</div>
                    <div className="stat-box-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> {githubStats.stars}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-title">Followers</div>
                    <div className="stat-box-value">{githubStats.followers}</div>
                  </div>
                </div>
              </div>

              {/* LeetCode Stats Card */}
              <div className="leetcode-card glass">
                <div className="leetcode-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code2 size={24} style={{ color: '#ffa116' }} />
                    <h3 style={{ fontSize: '1.25rem' }}>LeetCode</h3>
                  </div>
                  <a href={`https://leetcode.com/u/${profile.leetcode || 'leetcode_handle'}/`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Profile
                  </a>
                </div>
                {!leetcodeError && leetcodeStats ? (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-box-title">Solved</div>
                      <div className="stat-box-value">{leetcodeStats.solved.All}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Easy/Med/Hard</div>
                      <div className="stat-box-value" style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                        <span className="easy">{leetcodeStats.solved.Easy}</span>/
                        <span className="medium">{leetcodeStats.solved.Medium}</span>/
                        <span className="hard">{leetcodeStats.solved.Hard}</span>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Global Rank</div>
                      <div className="stat-box-value" style={{ fontSize: '0.95rem', marginTop: '6px' }}>
                        #{leetcodeStats.ranking?.toLocaleString() || '150,000'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-box-title">Solved</div>
                      <div className="stat-box-value">450+</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Easy/Med/Hard</div>
                      <div className="stat-box-value" style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                        <span className="easy">150</span>/<span className="medium">250</span>/<span className="hard">50</span>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Rating</div>
                      <div className="stat-box-value">1,850</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Codeforces Stats Card */}
              <div className="leetcode-card glass">
                <div className="leetcode-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={24} style={{ color: '#3182ce' }} />
                    <h3 style={{ fontSize: '1.25rem' }}>Codeforces</h3>
                  </div>
                  <a href={`https://codeforces.com/profile/${profile.codeforces || 'codeforces_handle'}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Profile
                  </a>
                </div>
                {codeforcesStats ? (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-box-title">Rating</div>
                      <div className="stat-box-value">{codeforcesStats.rating || 'N/A'}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Max Rating</div>
                      <div className="stat-box-value" style={{ color: 'var(--accent-secondary)' }}>
                        {codeforcesStats.maxRating || 'N/A'}
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Rank</div>
                      <div className="stat-box-value" style={{ fontSize: '0.9rem', textTransform: 'capitalize', marginTop: '6px' }}>
                        {codeforcesStats.rank || 'N/A'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-box-title">User</div>
                      <div className="stat-box-value" style={{ fontSize: '0.95rem', marginTop: '6px' }}>{profile.codeforces || 'codeforces_handle'}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Rank</div>
                      <div className="stat-box-value" style={{ fontSize: '0.95rem', marginTop: '6px' }}>Pupil</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-box-title">Rating</div>
                      <div className="stat-box-value">1200+</div>
                    </div>
                  </div>
                )}
              </div>

              {/* CodeChef Stats Card */}
              <div className="leetcode-card glass">
                <div className="leetcode-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={24} style={{ color: '#a855f7' }} />
                    <h3 style={{ fontSize: '1.25rem' }}>CodeChef</h3>
                  </div>
                  <a href={`https://www.codechef.com/users/${profile.codechef || 'codechef_handle'}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Profile
                  </a>
                </div>
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-box-title">Rating</div>
                    <div className="stat-box-value">1610</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-title">Division</div>
                    <div className="stat-box-value" style={{ fontSize: '1.1rem', marginTop: '6px' }}>Div 2</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-title">Stars</div>
                    <div className="stat-box-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> 3 ★
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <Blog posts={posts} />
          
          <Contact profile={profile} />
          
          <Footer profile={profile} />
        </div>
      ) : currentView === 'projects' ? (
        /* ALL PROJECTS VIEW */
        <div style={{ marginTop: '70px', padding: '40px 5%' }}>
          <Projects projects={projects} setView={setView} viewMode="all" />
          <Footer profile={profile} />
        </div>
      ) : (
        /* ADMIN DASHBOARD WORKSPACE VIEW */
        <AdminDashboard 
          isAdminLoggedIn={isAdminLoggedIn}
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onLogout={handleLogout}
          profile={profile}
          setProfile={setProfile}
        />
      )}
    </div>
  );
}
