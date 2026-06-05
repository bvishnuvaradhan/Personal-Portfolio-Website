const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  period: z.string().min(1, 'Period is required'), // e.g., "2020 - 2024"
  description: z.string().min(1, 'Description is required')
});

// @route   GET api/education
// @desc    Get all education entries
// @access  Public
router.get('/', async (req, res) => {
  try {
    const education = await prisma.education.findMany();
    res.json(education);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/education
// @desc    Create education entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = educationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { degree, institution, period, description } = validation.data;

    const newEducation = await prisma.education.create({
      data: { degree, institution, period, description }
    });

    res.status(201).json(newEducation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/education/:id
// @desc    Update education entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = educationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { degree, institution, period, description } = validation.data;

    const entry = await prisma.education.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    const updated = await prisma.education.update({
      where: { id },
      data: { degree, institution, period, description }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/education/:id
// @desc    Delete education entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entry = await prisma.education.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    await prisma.education.delete({ where: { id } });
    res.json({ message: 'Education entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
