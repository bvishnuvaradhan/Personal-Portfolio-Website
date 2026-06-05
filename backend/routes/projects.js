const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.string().min(1, 'Technologies are required (comma separated)'),
  githubLink: z.string().url('GitHub Link must be a valid URL').optional().or(z.literal('')),
  liveLink: z.string().url('Live Demo Link must be a valid URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Image must be a valid URL'),
  featured: z.boolean().default(false)
});

// @route   GET api/projects
// @desc    Get all projects (with filtering and sorting)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;

    let where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { technologies: { contains: search } }
      ];
    }

    if (tag) {
      where.technologies = { contains: tag };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/projects/:id
// @desc    Get a single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = projectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, description, technologies, githubLink, liveLink, imageUrl, featured } = validation.data;

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        technologies,
        githubLink: githubLink || null,
        liveLink: liveLink || null,
        imageUrl,
        featured
      }
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = projectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, description, technologies, githubLink, liveLink, imageUrl, featured } = validation.data;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        technologies,
        githubLink: githubLink || null,
        liveLink: liveLink || null,
        imageUrl,
        featured
      }
    });

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/projects/:id/click
// @desc    Track click analytics on project
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { clicks: project.clicks + 1 }
    });

    res.json({ id: updated.id, clicks: updated.clicks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
