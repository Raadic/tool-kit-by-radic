document.addEventListener('DOMContentLoaded', () => {
  // Tool definitions with Arch Linux install commands
  const tools = [
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert images between different formats (PNG, JPG, WEBP, etc.)',
      icon: '🖼️',
      install: 'sudo pacman -S imagemagick sharp nodejs npm',
      template: `
        <div class="tool-header">
          <h2 class="gradient-text">Image Converter</h2>
          <p>Convert your images between different formats</p>
        </div>
        
        <form id="imageConverterForm">
          <div class="form-group">
            <label for="imageFile">Select an image file:</label>
            <input type="file" id="imageFile" name="image" accept="image/*" required>
          </div>
          
          <div class="form-group">
            <label for="formatSelect">Convert to:</label>
            <select id="formatSelect" name="format" required>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="avif">AVIF</option>
              <option value="tiff">TIFF</option>
            </select>
          </div>
          
          <button type="submit" id="convertBtn">Convert Image</button>
        </form>
        
        <div id="conversionSuccess" class="success-message">
          Image successfully converted! Downloading...
        </div>
        
        <div id="loadingIndicator" class="loading" style="display: none;"></div>
        
        <div class="install-info">
          <h3>Installation on Arch Linux:</h3>
          <code>sudo pacman -S imagemagick sharp nodejs npm</code>
          <p>After installation, run this app with:</p>
          <code>npm install && npm start</code>
        </div>
      `
    },
    {
      id: 'background-remover',
      name: 'Background Remover',
      description: 'Remove backgrounds from images using AI',
      icon: '✂️',
      install: 'sudo pacman -S python python-pip && python -m venv venv && source venv/bin/activate && pip install "rembg[cpu]"',
      template: `
        <div class="tool-header">
          <h2 class="gradient-text">Background Remover</h2>
          <p>Remove backgrounds from images using AI</p>
        </div>
        
        <form id="backgroundRemoverForm">
          <div class="form-group">
            <label for="bgImageFile">Select an image file:</label>
            <input type="file" id="bgImageFile" name="image" accept="image/*" required>
          </div>
          
          <button type="submit" id="removeBtn">Remove Background</button>
        </form>
        
        <div id="bgRemovalSuccess" class="success-message">
          Background successfully removed! Downloading...
        </div>
        
        <div id="bgLoadingIndicator" class="loading" style="display: none;"></div>
        
        <div class="install-info">
          <h3>Installation on Arch Linux:</h3>
          <code>sudo pacman -S python python-pip && python -m venv venv && source venv/bin/activate && pip install "rembg[cpu]"</code>
          <p>After installation, run this app with:</p>
          <code>npm install && npm start</code>
        </div>
      `
    },
    {
      id: 'markdown-editor',
      name: 'Markdown Editor',
      description: 'Create and edit Markdown documents with live preview',
      icon: '📝',
      install: 'sudo pacman -S nodejs npm',
      template: `
        <div class="tool-header">
          <h2 class="gradient-text">Markdown Editor</h2>
          <p>Create and edit Markdown documents with live preview</p>
        </div>
        
        <div class="markdown-container">
          <div class="markdown-toolbar">
            <button type="button" data-md="**" data-md-end="**" title="Bold">B</button>
            <button type="button" data-md="*" data-md-end="*" title="Italic">I</button>
            <button type="button" data-md="# " title="Heading 1">H1</button>
            <button type="button" data-md="## " title="Heading 2">H2</button>
            <button type="button" data-md="### " title="Heading 3">H3</button>
            <button type="button" data-md="[" data-md-end="](url)" title="Link">🔗</button>
            <button type="button" data-md="![alt text](" data-md-end=")" title="Image">🖼️</button>
            <button type="button" data-md="- " title="List Item">•</button>
            <button type="button" data-md="1. " title="Numbered List">1.</button>
            <button type="button" data-md="> " title="Blockquote">"</button>
            <button type="button" data-md="\`\`\`\n" data-md-end="\n\`\`\`" title="Code Block">{ }</button>
            <button type="button" data-md="\`" data-md-end="\`" title="Inline Code">\`</button>
            <button type="button" data-md="---\n" title="Horizontal Rule">—</button>
          </div>
          
          <div class="markdown-editor-container">
            <div class="markdown-editor">
              <textarea id="markdownInput" placeholder="Type your Markdown here..."></textarea>
            </div>
            <div class="markdown-preview">
              <div id="markdownPreview"></div>
            </div>
          </div>
          
          <div class="markdown-actions">
            <input type="text" id="markdownFilename" placeholder="Filename (without extension)" />
            <button id="saveMarkdownBtn">Save as .md</button>
            <div id="markdownSaveSuccess" class="success-message" style="display: none;">
              Markdown file saved successfully!
            </div>
          </div>
        </div>
        
        <div class="install-info">
          <h3>Installation on Arch Linux:</h3>
          <code>sudo pacman -S nodejs npm</code>
          <p>After installation, run this app with:</p>
          <code>npm install && npm start</code>
        </div>
      `
    }
    // Additional tools can be added here in the future
  ];

  const toolsList = document.getElementById('toolsList');
  const toolContent = document.getElementById('toolContent');
  const searchInput = document.getElementById('search');

  // Render tool cards
  function renderToolCards() {
    toolsList.innerHTML = '';
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) || 
      tool.description.toLowerCase().includes(searchTerm)
    );
    
    filteredTools.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.dataset.id = tool.id;
      
      card.innerHTML = `
        <h3>${tool.icon} ${tool.name}</h3>
        <p>${tool.description}</p>
      `;
      
      card.addEventListener('click', () => {
        // Remove active class from all cards
        document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
        // Add active class to clicked card
        card.classList.add('active');
        // Show tool content
        showTool(tool);
      });
      
      toolsList.appendChild(card);
    });
  }

  // Show specific tool content
  function showTool(tool) {
    toolContent.innerHTML = tool.template;
    
    // Add event listeners for tool-specific functionality
    if (tool.id === 'image-converter') {
      const form = document.getElementById('imageConverterForm');
      const loadingIndicator = document.getElementById('loadingIndicator');
      const successMessage = document.getElementById('conversionSuccess');
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        loadingIndicator.style.display = 'flex';
        
        try {
          const response = await fetch('/api/convert-image', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Conversion failed');
          }
          
          // Trigger file download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `converted.${formData.get('format')}`;
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Show success message
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 3000);
        } catch (error) {
          console.error('Error:', error);
          alert('Image conversion failed. Please try again.');
        } finally {
          loadingIndicator.style.display = 'none';
        }
      });
    } else if (tool.id === 'background-remover') {
      const form = document.getElementById('backgroundRemoverForm');
      const loadingIndicator = document.getElementById('bgLoadingIndicator');
      const successMessage = document.getElementById('bgRemovalSuccess');
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        loadingIndicator.style.display = 'flex';
        
        try {
          const response = await fetch('/api/remove-background', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Background removal failed');
          }
          
          // Trigger file download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'bg-removed.png';
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Show success message
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 3000);
        } catch (error) {
          console.error('Error:', error);
          alert('Background removal failed. Please try again.');
        } finally {
          loadingIndicator.style.display = 'none';
        }
      });
    } else if (tool.id === 'markdown-editor') {
      // Load marked.js library for Markdown parsing
      if (!window.marked) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(script);
        
        script.onload = initMarkdownEditor;
      } else {
        initMarkdownEditor();
      }
      
      function initMarkdownEditor() {
        const markdownInput = document.getElementById('markdownInput');
        const markdownPreview = document.getElementById('markdownPreview');
        const saveButton = document.getElementById('saveMarkdownBtn');
        const filenameInput = document.getElementById('markdownFilename');
        const successMessage = document.getElementById('markdownSaveSuccess');
        const toolbarButtons = document.querySelectorAll('.markdown-toolbar button');
        
        // Initialize with some example content
        markdownInput.value = `# Welcome to the Markdown Editor

This is a **live preview** editor. Type on the left and see the rendered result on the right.

## Features

- **Bold** and *italic* text
- Lists and numbered lists
- [Links](https://example.com)
- Images ![alt text](https://via.placeholder.com/150)
- And much more!

> Try the toolbar buttons above to quickly format your text.
`;
        
        // Initial render
        renderMarkdown();
        
        // Setup event listeners
        markdownInput.addEventListener('input', renderMarkdown);
        
        // Toolbar buttons
        toolbarButtons.forEach(button => {
          button.addEventListener('click', () => {
            const startTag = button.getAttribute('data-md');
            const endTag = button.getAttribute('data-md-end') || '';
            
            // Get selection
            const start = markdownInput.selectionStart;
            const end = markdownInput.selectionEnd;
            const selectedText = markdownInput.value.substring(start, end);
            
            // Insert markdown tags
            const newText = startTag + selectedText + endTag;
            markdownInput.value = markdownInput.value.substring(0, start) + newText + markdownInput.value.substring(end);
            
            // Update preview
            renderMarkdown();
            
            // Focus back on textarea
            markdownInput.focus();
            
            // Set cursor position after insertion
            if (selectedText.length > 0) {
              markdownInput.selectionStart = start + startTag.length;
              markdownInput.selectionEnd = end + startTag.length;
            } else {
              const cursorPos = start + startTag.length;
              markdownInput.selectionStart = cursorPos;
              markdownInput.selectionEnd = cursorPos;
            }
          });
        });
        
        // Save button
        saveButton.addEventListener('click', async () => {
          if (!filenameInput.value.trim()) {
            alert('Please enter a filename');
            return;
          }
          
          try {
            const response = await fetch('/api/save-markdown', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: markdownInput.value,
                filename: filenameInput.value.trim()
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to save markdown');
            }
            
            const result = await response.json();
            
            if (result.success) {
              successMessage.style.display = 'block';
              setTimeout(() => {
                successMessage.style.display = 'none';
              }, 3000);
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Failed to save markdown. Please try again.');
          }
        });
        
        function renderMarkdown() {
          // Use marked.js to render markdown
          markdownPreview.innerHTML = marked.parse(markdownInput.value);
        }
      }
    }
  }

  // Initialize the app
  renderToolCards();
  
  // Set up search functionality
  searchInput.addEventListener('input', renderToolCards);
});
