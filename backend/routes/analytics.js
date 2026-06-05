const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Helper to increment analytic key
async function incrementMetric(key) {
  try {
    const record = await prisma.analytics.findUnique({
      where: { key }
    });

    if (!record) {
      return await prisma.analytics.create({
        data: { key, count: 1 }
      });
    }

    return await prisma.analytics.update({
      where: { key },
      data: { count: record.count + 1 }
    });
  } catch (err) {
    console.error(`Error incrementing metric ${key}:`, err);
  }
}

// @route   POST api/analytics/visit
// @desc    Track visitor views
// @access  Public
router.post('/visit', async (req, res) => {
  const updated = await incrementMetric('visitors');
  res.json({ success: true, count: updated ? updated.count : 0 });
});

// @route   POST api/analytics/resume
// @desc    Track resume downloads
// @access  Public
router.post('/resume', async (req, res) => {
  const updated = await incrementMetric('resume_downloads');
  res.json({ success: true, count: updated ? updated.count : 0 });
});

// @route   GET api/analytics
// @desc    Get dashboard metrics (visitors, projects, messages, downloads)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const visitors = await prisma.analytics.findUnique({ where: { key: 'visitors' } });
    const downloads = await prisma.analytics.findUnique({ where: { key: 'resume_downloads' } });
    
    const projectsCount = await prisma.project.count();
    const messagesCount = await prisma.message.count();
    const skillsCount = await prisma.skill.count();
    
    // Get total project clicks
    const projects = await prisma.project.findMany({
      select: { clicks: true }
    });
    const totalProjectClicks = projects.reduce((sum, p) => sum + p.clicks, 0);

    res.json({
      visitors: visitors ? visitors.count : 0,
      resumeDownloads: downloads ? downloads.count : 0,
      projectsCount,
      messagesCount,
      skillsCount,
      totalProjectClicks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
