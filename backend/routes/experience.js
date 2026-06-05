const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.coerce.date({ required_error: 'Start Date is required' }),
  endDate: z.coerce.date().nullable().optional(),
  description: z.string().min(1, 'Description is required')
});

// @route   GET api/experience
// @desc    Get all experiences (sorted by start date descending)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' }
    });
    res.json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/experience
// @desc    Create an experience
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = experienceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { company, role, startDate, endDate, description } = validation.data;

    const newExperience = await prisma.experience.create({
      data: {
        company,
        role,
        startDate,
        endDate: endDate || null,
        description
      }
    });

    res.status(201).json(newExperience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/experience/:id
// @desc    Update an experience
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = experienceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { company, role, startDate, endDate, description } = validation.data;

    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        company,
        role,
        startDate,
        endDate: endDate || null,
        description
      }
    });

    res.json(updatedExperience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/experience/:id
// @desc    Delete an experience
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    await prisma.experience.delete({ where: { id } });
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
