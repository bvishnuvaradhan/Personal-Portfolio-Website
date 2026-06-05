const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Link must be a valid URL').optional().or(z.literal(''))
});

// @route   GET api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.json(achievements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/achievements
// @desc    Create an achievement
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = achievementSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, description, link } = validation.data;

    const newAchievement = await prisma.achievement.create({
      data: {
        title,
        description,
        link: link || null
      }
    });

    res.status(201).json(newAchievement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/achievements/:id
// @desc    Update an achievement
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = achievementSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, description, link } = validation.data;

    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        title,
        description,
        link: link || null
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/achievements/:id
// @desc    Delete an achievement
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await prisma.achievement.delete({ where: { id } });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
