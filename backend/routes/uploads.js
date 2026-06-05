const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

// Determine upload directory: Vercel serverless has a read-only filesystem except for /tmp
const uploadDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create upload directory, falling back to OS temp directory:', err.message);
}

// Multer Local Disk Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// @route   POST api/uploads
// @desc    Upload an image (Cloudinary with local disk fallback)
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const localFilePath = req.file.path;

    if (isCloudinaryConfigured) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: 'portfolio'
        });

        // Delete local file after successful Cloudinary upload
        fs.unlinkSync(localFilePath);

        return res.json({
          url: result.secure_url,
          source: 'cloudinary'
        });
      } catch (cloudErr) {
        console.error('Cloudinary upload error, falling back to local storage:', cloudErr);
        // If Cloudinary fails, return the local file url as fallback
      }
    }

    // Return local file path
    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      url: fileUrl,
      source: 'local'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'File upload failed' });
  }
});

module.exports = router;
