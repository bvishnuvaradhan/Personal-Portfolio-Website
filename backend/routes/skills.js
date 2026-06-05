const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'), // Frontend, Backend, AI/ML, Languages, etc.
  proficiency: z.number().min(0).max(100, 'Proficiency must be between 0 and 100')
});

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/skills
// @desc    Create a skill
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = skillSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, category, proficiency } = validation.data;

    const newSkill = await prisma.skill.create({
      data: { name, category, proficiency }
    });

    res.status(201).json(newSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = skillSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, category, proficiency } = validation.data;

    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: { name, category, proficiency }
    });

    res.json(updatedSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await prisma.skill.delete({ where: { id } });
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
