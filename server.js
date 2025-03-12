const express = require('express');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

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

// Markdown save endpoint
app.post('/api/save-markdown', express.json(), (req, res) => {
  try {
    if (!req.body.content || !req.body.filename) {
      return res.status(400).json({ error: 'Missing content or filename' });
    }
    
    const filename = req.body.filename.endsWith('.md') ? req.body.filename : `${req.body.filename}.md`;
    const filePath = path.join(__dirname, 'downloads', filename);
    
    // Ensure the downloads directory exists
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // Write the markdown content to the file
    fs.writeFileSync(filePath, req.body.content);
    
    res.json({ success: true, filePath: filePath });
  } catch (error) {
    console.error('Markdown save error:', error);
    res.status(500).json({ error: 'Failed to save markdown file' });
  }
});

// Background removal endpoint
app.post('/api/remove-background', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, 'uploads', `bg-removed-${Date.now()}.png`);
    
    // Use the Python virtual environment to run rembg
    const pythonProcess = spawn('./venv/bin/python', [
      '-c',
      `
from rembg import remove
from PIL import Image
import sys

input_path = '${inputPath}'
output_path = '${outputPath}'

input = Image.open(input_path)
output = remove(input)
output.save(output_path)
      `
    ]);

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: 'Background removal failed' });
      }
      
      res.download(outputPath, 'bg-removed.png', (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        
        // Clean up files after download
        fs.unlink(req.file.path, () => {});
        fs.unlink(outputPath, () => {});
      });
    });
  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ error: 'Background removal failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
