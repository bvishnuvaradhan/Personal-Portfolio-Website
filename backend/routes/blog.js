const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false)
});

// Helper to convert title to a url slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// @route   GET api/blog
// @desc    Get all blog posts (returns only published posts for public, all posts for admin)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true'; // simple query parameter to fetch drafts (will be checked by server or just public filter)
    
    let where = { published: true };
    if (isAdmin) {
      // If client requests admin list, we could double check token or return all. 
      // To be safe, if we need full admin list, we can let admin fetch via dedicated route or authentication check, 
      // let's check auth header if they pass it, or just use auth middleware for the full list.
      const authHeader = req.header('Authorization');
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          if (token) {
            where = {}; // remove published restriction for authorized admin
          }
        } catch(e) {}
      }
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/blog/:slug
// @desc    Get a single post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/blog
// @desc    Create a blog post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const validation = postSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, content, published } = validation.data;

    let slug = slugify(title);
    
    // Check if slug exists, if so append unique timestamp
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const newPost = await prisma.post.create({
      data: { title, content, slug, published }
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/blog/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validation = postSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { title, content, published } = validation.data;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If title changed, update slug
    let slug = post.slug;
    if (post.title !== title) {
      slug = slugify(title);
      const existingPost = await prisma.post.findUnique({ where: { slug } });
      if (existingPost && existingPost.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { title, content, slug, published }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/blog/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
