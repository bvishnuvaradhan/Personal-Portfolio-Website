const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load routers explicitly with logging to debug ESM/bundling issues on Vercel
const routes = {
  auth: require('./routes/auth'),
  projects: require('./routes/projects'),
  skills: require('./routes/skills'),
  experience: require('./routes/experience'),
  education: require('./routes/education'),
  certifications: require('./routes/certifications'),
  achievements: require('./routes/achievements'),
  messages: require('./routes/messages'),
  blog: require('./routes/blog'),
  analytics: require('./routes/analytics'),
  uploads: require('./routes/uploads'),
  leetcode: require('./routes/leetcode'),
  profile: require('./routes/profile')
};

Object.entries(routes).forEach(([name, routerModule]) => {
  console.log(`[Router Load] ${name}: type=${typeof routerModule}`);
  app.use(`/api/${name}`, routerModule);
});

// Default API route test
app.get('/api', (req, res) => {
  res.json({ message: 'Personal Portfolio API is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
