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
    } catch (err) {
      console.error('Error fetching public portfolio data:', err);
    }
  };

  // Fetch GitHub Stats
  const fetchGithubStats = async () => {
    try {
      // Query public GitHub API
      const username = 'bvishnuvaradhan';
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        
        // Fetch repositories to calculate stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        let starCount = 0;
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          starCount = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        }

        setGithubStats({
          repos: userData.public_repos || 12, // fallback
          stars: starCount || 5, // fallback
          followers: userData.followers || 15
        });
      }
    } catch (err) {
      console.error('GitHub stats fetch error, using mockup data:', err);
      // set mockup data for demo purposes
      setGithubStats({ repos: 15, stars: 8, followers: 24 });
    }
  };

  // Fetch LeetCode Stats via backend GraphQL Proxy
  const fetchLeetcodeStats = async () => {
    try {
      // Query our backend proxy with user's actual username
      const stats = await api.leetcode.getStats('eqqPSQRrkF');
      setLeetcodeStats(stats);
      setLeetcodeError(false);
    } catch (err) {
      console.error('LeetCode proxy error:', err);
      setLeetcodeError(true);
    }
  };

  // Fetch Codeforces Stats
  const fetchCodeforcesStats = async () => {
    try {
      const res = await fetch('https://codeforces.com/api/user.info?handles=bvishnu_2509');
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

    // 4. Get integration stats
    fetchGithubStats();
    fetchLeetcodeStats();
    fetchCodeforcesStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdminLoggedIn(false);
    setView('home');
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
      />

      {currentView === 'home' ? (
        /* HOME PORTFOLIO VIEW */
        <div>
          <Hero />
          
          {/* About Me Details Section */}
          <section id="about">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <div className="about-details">
                <p>
                  I am a Computer Science undergraduate at Koneru Lakshmaiah Education Foundation (KL University), Hyderabad, with a strong foundation in data structures, systems, and backend development.
                </p>
                <p>
                  I specialize in building real-time, AI-driven, and distributed applications, including multi-agent SOC architectures, LLM fact-checking systems, and schema generators. I am currently seeking a Summer 2026 internship in software engineering or quantitative technology roles where I can apply my experience in Python, FastAPI, React, and robust database design.
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
                    <a href="https://github.com/bvishnuvaradhan" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }} title="Primary GitHub">
                      bvishnu
                    </a>
                    <span style={{ color: 'var(--text-secondary)' }}>|</span>
                    <a href="https://github.com/Vishnuvaradhan142" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }} title="Secondary GitHub">
                      vishnu142
                    </a>
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
                  <a href="https://leetcode.com/u/eqqPSQRrkF/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
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
                  <a href="https://codeforces.com/profile/bvishnu_2509" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
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
                      <div className="stat-box-value" style={{ fontSize: '0.95rem', marginTop: '6px' }}>bvishnu_2509</div>
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
                  <a href="https://www.codechef.com/users/bvishnu_2509" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
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
          
          <Contact />
          
          <Footer />
        </div>
      ) : currentView === 'projects' ? (
        /* ALL PROJECTS VIEW */
        <div style={{ marginTop: '70px', padding: '40px 5%' }}>
          <Projects projects={projects} setView={setView} viewMode="all" />
          <Footer />
        </div>
      ) : (
        /* ADMIN DASHBOARD WORKSPACE VIEW */
        <AdminDashboard 
          isAdminLoggedIn={isAdminLoggedIn}
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
