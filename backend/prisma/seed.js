const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  
  // Clear tables to avoid duplicates
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.post.deleteMany({});

  console.log('Seeding database with Boga Vishnuvaradhan\'s real resume data...');

  // 1. Create Default Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('adminpassword', salt);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword
    }
  });
  console.log('Admin user verified/created (username: "admin", password: "adminpassword")');

  // 2. Create Initial Analytics Keys
  await prisma.analytics.upsert({
    where: { key: 'visitors' },
    update: {},
    create: { key: 'visitors', count: 1456 }
  });

  await prisma.analytics.upsert({
    where: { key: 'resume_downloads' },
    update: {},
    create: { key: 'resume_downloads', count: 23 }
  });
  console.log('Analytics keys initialized.');

  // 3. Create Real Skills
  const sampleSkills = [
    // Programming Languages
    { name: 'Python', category: 'Programming Languages', proficiency: 92 },
    { name: 'Java', category: 'Programming Languages', proficiency: 85 },
    { name: 'C', category: 'Programming Languages', proficiency: 80 },

    // Backend & Systems
    { name: 'FastAPI', category: 'Backend & Systems', proficiency: 95 },
    { name: 'Node.js', category: 'Backend & Systems', proficiency: 88 },
    { name: 'REST APIs', category: 'Backend & Systems', proficiency: 90 },

    // Frontend
    { name: 'React', category: 'Frontend', proficiency: 90 },
    { name: 'JavaScript', category: 'Frontend', proficiency: 92 },
    { name: 'HTML & CSS', category: 'Frontend', proficiency: 95 },

    // Databases
    { name: 'MongoDB', category: 'Databases', proficiency: 90 },
    { name: 'MySQL', category: 'Databases', proficiency: 85 },

    // Tools & Platforms
    { name: 'Git & GitHub', category: 'Tools & Platforms', proficiency: 90 },
    { name: 'Linux', category: 'Tools & Platforms', proficiency: 85 },
    { name: 'VS Code', category: 'Tools & Platforms', proficiency: 90 },

    // Core Concepts
    { name: 'Data Structures & Algorithms', category: 'Core Concepts', proficiency: 94 },
    { name: 'OOP', category: 'Core Concepts', proficiency: 90 },
    { name: 'Operating Systems', category: 'Core Concepts', proficiency: 85 },
    { name: 'DBMS', category: 'Core Concepts', proficiency: 88 },
    { name: 'System Design Basics', category: 'Core Concepts', proficiency: 80 },

    // Soft Skills
    { name: 'Problem Solving', category: 'Soft Skills', proficiency: 95 },
    { name: 'Analytical Thinking', category: 'Soft Skills', proficiency: 92 },
    { name: 'Communication', category: 'Soft Skills', proficiency: 90 },
    { name: 'Team Collaboration', category: 'Soft Skills', proficiency: 92 }
  ];

  for (const skill of sampleSkills) {
    await prisma.skill.create({ data: skill });
  }
  console.log('Real skills seeded.');

  // 4. Create Real Projects
  const sampleProjects = [
    {
      title: 'CipherNexus – Multi-Agent Cybersecurity SOC Simulation Platform',
      description: 'Developed a real-time SOC simulation system with a multi-agent architecture. Designed an event-driven pipeline for detection, response, and forensics. Implemented a WebSocket-based live dashboard with ML-based anomaly detection.',
      technologies: 'Python, FastAPI, MongoDB, React, WebSockets, Machine Learning, Anomaly Detection',
      githubLink: 'https://github.com/bvishnuvaradhan/CipherNexus',
      liveLink: 'https://cipher-nexus-zeta.vercel.app',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      featured: true,
      clicks: 120
    },
    {
      title: 'Aletheia Gate – LLM Hallucination Detection & Verification System',
      description: 'Developed a verification pipeline for LLM outputs using multi-model consensus and web evidence. Designed a trust scoring system combining AI agreement, semantic checks, and fact penalties. Implemented an audit layer with persistent, explainable outputs.',
      technologies: 'Python, FastAPI, MongoDB, LLM APIs, NLP',
      githubLink: 'https://github.com/bvishnuvaradhan/Alethenia-Gate',
      liveLink: 'https://aletheia-gate-teal-panda.reflex.run',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      featured: true,
      clicks: 95
    },
    {
      title: 'MongoArchitect – AI-Based MongoDB Schema Design System',
      description: 'Engineered an AI-driven MongoDB schema design system with versioned schema evolution. Implemented analysis modules for query performance, access patterns, and cost estimation. Designed a full-stack SaaS architecture with FastAPI, MongoDB, and LLM integration.',
      technologies: 'Python, FastAPI, MongoDB, React, LLM APIs',
      githubLink: 'https://github.com/bvishnuvaradhan/mongoarchitect-ai',
      liveLink: 'https://mongoarchitect-ai.vercel.app',
      imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      featured: true,
      clicks: 88
    },
    {
      title: 'Automated Wild Animal Intrusion Detection System (IoT)',
      description: 'Developed an IoT-based intrusion detection system for real-time monitoring of restricted areas. Implemented sensor-based detection logic and alert mechanisms for real-time response. Awarded 3rd Prize at INNOV-A-TECH 2025.',
      technologies: 'IoT Sensors, Embedded Systems',
      githubLink: '',
      liveLink: '',
      imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=80',
      featured: false,
      clicks: 42
    }
  ];

  for (const project of sampleProjects) {
    await prisma.project.create({ data: project });
  }
  console.log('Real projects seeded.');

  // 5. Create Real Experience / Internships
  const sampleExperiences = [
    {
      company: 'ServiceNow',
      role: 'Virtual Intern',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-06-30'),
      description: '• Learned workflow automation, service management, and system administration concepts.\n• Gained exposure to Agentic AI, flows, and automated testing frameworks (ATF).'
    },
    {
      company: 'Google Cloud Generative AI',
      role: 'Virtual Intern (Cohort 12)',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
      description: '• Learned Generative AI fundamentals, prompt engineering, and cloud-based AI workflows.\n• Completed hands-on labs aligned with real-world use cases.'
    },
    {
      company: 'Google AI-ML',
      role: 'Virtual Intern (Cohort 13)',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-11-30'),
      description: '• Gained exposure to machine learning fundamentals and model workflows.\n• Practiced data preprocessing and model evaluation techniques.'
    }
  ];

  for (const exp of sampleExperiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('Real experience/internships seeded.');

  // 6. Create Real Education History
  const sampleEducation = [
    {
      degree: 'Bachelor of Technology (B.Tech) – Computer Science and Engineering',
      institution: 'Koneru Lakshmaiah Education Foundation',
      period: 'July 2024 - May 2028',
      description: 'Hyderabad, India. Current CGPA: 9.48.'
    },
    {
      degree: 'MPC Intermediate',
      institution: 'Sri Chaitanya Junior College',
      period: 'June 2022 - March 2024',
      description: 'Hyderabad, India. Percentage: 81.4%.'
    },
    {
      degree: 'SSC School',
      institution: 'Sri Chaitanya School',
      period: 'June 2021 - May 2022',
      description: 'Hyderabad, India. CGPA: 9.3.'
    }
  ];

  for (const edu of sampleEducation) {
    await prisma.education.create({ data: edu });
  }
  console.log('Real education logs seeded.');

  // 7. Create Real Certifications
  const sampleCertificates = [
    {
      title: 'MongoDB Certified Associate Developer',
      issuer: 'MongoDB',
      link: 'https://credentials.mongodb.com'
    },
    {
      title: 'Advanced Automation Professional',
      issuer: 'Automation Anywhere',
      link: 'https://credentials.automationanywhere.com'
    }
  ];

  for (const cert of sampleCertificates) {
    await prisma.certification.create({ data: cert });
  }
  console.log('Real certificates seeded.');

  // 8. Create Real Achievements
  const sampleAchievements = [
    {
      title: '3rd Prize – INNOV-A-TECH 2025 Hackathon',
      description: 'Awarded 3rd prize for the development of IoT-based wild animal intrusion detection system.',
      link: ''
    },
    {
      title: 'Hackathon Finalist',
      description: 'Finalist in multiple university and college-level hackathons demonstrating rapid prototype building.',
      link: ''
    }
  ];

  for (const ach of sampleAchievements) {
    await prisma.achievement.create({ data: ach });
  }
  console.log('Real achievements seeded.');

  // 9. Create Real Blog Post
  await prisma.post.create({
    data: {
      title: 'Building Event-Driven Security Tools: A Deep Dive into SOC Simulation',
      content: `In cybersecurity, modern Security Operations Centers (SOCs) are moving toward automated event-driven pipelines.

When I developed **CipherNexus**, my goal was to build a multi-agent SOC simulation platform. In this post, I will break down:
      
1. **Multi-Agent Architectures**: How individual agents (Detector, Reporter, Forensics) interact to contain security breaches automatically.
2. **WebSocket Integrations**: Pushing event detection statistics to a React dashboard in real-time.
3. **ML-Based Anomalies**: Running simple clustering models on transaction histories to flag anomalies.
      
If you are building security SaaS applications, event-driven pipelines are the way to go!`,
      slug: 'event-driven-security-soc-simulations',
      published: true
    }
  });
  console.log('Real blog post seeded.');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
