const express = require('express');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints
app.post('/api/convert-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const outputFormat = req.body.format || 'jpeg';
    const outputPath = path.join(__dirname, 'uploads', `output-${Date.now()}.${outputFormat}`);
    
    await sharp(req.file.path)
      .toFormat(outputFormat)
      .toFile(outputPath);
      
    res.download(outputPath, `converted.${outputFormat}`, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      
      // Clean up files after download
      fs.unlink(req.file.path, () => {});
      fs.unlink(outputPath, () => {});
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Image conversion failed' });
  }
});

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
