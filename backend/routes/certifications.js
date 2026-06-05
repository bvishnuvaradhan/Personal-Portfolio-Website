const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  link: z.string().url('Certificate Link must be a valid URL')
});

// @route   GET api/certifications
// @desc    Get all certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const certifications = await prisma.certification.findMany();
    res.json(certifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/certifications
// @desc    Create a certification
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = certificationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, issuer, link } = validation.data;

    const newCert = await prisma.certification.create({
      data: { name, issuer, link }
    });

    res.status(201).json(newCert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/certifications/:id
// @desc    Update a certification
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = certificationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, issuer, link } = validation.data;

    const cert = await prisma.certification.findUnique({ where: { id } });
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const updated = await prisma.certification.update({
      where: { id },
      data: { name, issuer, link }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/certifications/:id
// @desc    Delete a certification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cert = await prisma.certification.findUnique({ where: { id } });
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    await prisma.certification.delete({ where: { id } });
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
