const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

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
  await prisma.analytics.deleteMany({});

  console.log('Checking for local seed data configuration...');

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
    create: { key: 'visitors', count: 0 }
  });

  await prisma.analytics.upsert({
    where: { key: 'resume_downloads' },
    update: {},
    create: { key: 'resume_downloads', count: 0 }
  });
  console.log('Analytics keys initialized.');

  // Check if seedData.json exists
  const seedDataPath = path.join(__dirname, 'seedData.json');
  let data;

  if (fs.existsSync(seedDataPath)) {
    console.log('Loading private seed data from seedData.json...');
    const rawData = fs.readFileSync(seedDataPath, 'utf8');
    data = JSON.parse(rawData);
  } else {
    console.log('No seedData.json found. Seeding generic template data...');
    data = {
      skills: [
        { name: 'JavaScript', category: 'Programming Languages', proficiency: 90 },
        { name: 'Node.js', category: 'Backend & Systems', proficiency: 85 },
        { name: 'React', category: 'Frontend', proficiency: 85 },
        { name: 'MongoDB', category: 'Databases', proficiency: 80 }
      ],
      projects: [
        {
          title: 'Template Featured Project 1',
          description: 'This is a description for a premium featured project showing technologies and clean user experiences.',
          technologies: 'React, Node.js, MongoDB',
          githubLink: 'https://github.com',
          liveLink: 'https://google.com',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
          featured: true,
          clicks: 0
        },
        {
          title: 'Template Project 2',
          description: 'This is a description for another clean portfolio project.',
          technologies: 'JavaScript, CSS',
          githubLink: 'https://github.com',
          liveLink: 'https://google.com',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
          featured: false,
          clicks: 0
        }
      ],
      experiences: [
        {
          company: 'Sample Tech Corp',
          role: 'Software Developer Intern',
          startDate: '2025-01-01T00:00:00.000Z',
          endDate: '2025-06-01T00:00:00.000Z',
          description: 'Developed scalable workflow endpoints and optimized SQL/NoSQL databases.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'State University',
          period: '2021 - 2025',
          description: 'GPA: 3.8 / 4.0. Active coding competitor.'
        }
      ],
      certifications: [
        {
          title: 'Example Developer Certification',
          issuer: 'Tech Academy',
          link: 'https://google.com'
        }
      ],
      achievements: [
        {
          title: '1st Place Hackathon Winner',
          description: 'Designed and built a smart utility prototype under 24 hours.',
          link: ''
        }
      ],
      blog: {
        title: 'Building Scalable Web Applications',
        content: 'Scaling web applications requires an optimization of queries, indexes, and network request logic. In this post we explore best practices.',
        slug: 'building-scalable-web-applications',
        published: true
      }
    };
  }

  // 3. Create Skills
  for (const skill of data.skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`Seeded ${data.skills.length} skills.`);

  // 4. Create Projects
  for (const project of data.projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`Seeded ${data.projects.length} projects.`);

  // 5. Create Experience / Internships
  for (const exp of data.experiences) {
    await prisma.experience.create({
      data: {
        company: exp.company,
        role: exp.role,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        description: exp.description
      }
    });
  }
  console.log(`Seeded ${data.experiences.length} experience/internship logs.`);

  // 6. Create Education History
  for (const edu of data.education) {
    await prisma.education.create({ data: edu });
  }
  console.log(`Seeded ${data.education.length} education logs.`);

  // 7. Create Certifications
  for (const cert of data.certifications) {
    await prisma.certification.create({ data: cert });
  }
  console.log(`Seeded ${data.certifications.length} certificates.`);

  // 8. Create Achievements
  for (const ach of data.achievements) {
    await prisma.achievement.create({ data: ach });
  }
  console.log(`Seeded ${data.achievements.length} achievements.`);

  // 9. Create Blog Post
  const blogPost = data.blog;
  if (blogPost) {
    await prisma.post.create({
      data: {
        title: blogPost.title,
        content: blogPost.content,
        slug: blogPost.slug,
        published: blogPost.published
      }
    });
    console.log('Seeded blog post.');
  }

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
