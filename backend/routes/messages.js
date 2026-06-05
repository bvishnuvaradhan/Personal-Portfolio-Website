const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { Resend } = require('resend');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const messageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required')
});

const statusSchema = z.object({
  status: z.enum(['New', 'Read', 'Replied'])
});

// @route   POST api/messages
// @desc    Submit a message from contact form & trigger email notification
// @access  Public
router.post('/', async (req, res) => {
  try {
    const validation = messageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, email, subject, content } = validation.data;

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject,
        content,
        status: 'New'
      }
    });

    // Handle Email Notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== 're_your_api_key') {
      try {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const toEmail = process.env.RESEND_TO_EMAIL || email; // fallbacks

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Portfolio Contact: ${subject}`,
          html: `<p>You have a new message from your portfolio website contact form:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Subject:</strong> ${subject}</p>
                 <p><strong>Message:</strong></p>
                 <p>${content.replace(/\n/g, '<br>')}</p>`
        });
        console.log(`[Email Sent] Successful notification for message ID: ${newMessage.id}`);
      } catch (emailErr) {
        console.error('Resend email error:', emailErr);
      }
    } else {
      console.log('----------------------------------------------------');
      console.log('RESEND_API_KEY not set. Email logging fallback:');
      console.log(`To: ${process.env.RESEND_TO_EMAIL || 'Admin'}`);
      console.log(`Subject: Portfolio Contact: ${subject}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Content:\n${content}`);
      console.log('----------------------------------------------------');
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/messages
// @desc    Get all contact messages
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/messages/:id
// @desc    Update a message status (New/Read/Replied)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = statusSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { status } = validation.data;

    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await prisma.message.delete({ where: { id } });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
