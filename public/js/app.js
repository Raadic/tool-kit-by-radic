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
    }
  }

  // Initialize the app
  renderToolCards();
  
  // Set up search functionality
  searchInput.addEventListener('input', renderToolCards);
});
