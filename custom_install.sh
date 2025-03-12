#!/bin/bash

# Tool Kit Custom Installer for Arch Linux
# This script installs all dependencies and sets up Tool Kit as a desktop application

echo "=== Tool Kit Custom Installer for Arch Linux ==="
echo "This script will install all required dependencies and set up Tool Kit."
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "This script should NOT be run as root."
  echo "Please run it as a regular user."
  exit 1
fi

# Install required system packages
echo "Installing required system packages..."
sudo pacman -Sy --noconfirm python python-pip imagemagick icu

# Create installation directory
INSTALL_DIR="/opt/tool-kit"
echo "Creating installation directory at $INSTALL_DIR..."
sudo mkdir -p "$INSTALL_DIR"
sudo chown $USER:$USER "$INSTALL_DIR"

# Clone the repository
echo "Downloading Tool Kit..."
if command -v git >/dev/null 2>&1; then
  git clone https://github.com/Raadic/tool-kit-by-radic.git "$INSTALL_DIR"
else
  sudo pacman -Sy --noconfirm git
  git clone https://github.com/Raadic/tool-kit-by-radic.git "$INSTALL_DIR"
fi

# Navigate to the installation directory
cd "$INSTALL_DIR" || exit 1

# Check for Node.js compatibility
if ! node --version > /dev/null 2>&1; then
  echo "Warning: System Node.js is not compatible."
  
  # Check if nvm is installed
  if [ -d "$HOME/.nvm" ] && [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo "NVM detected, using NVM-installed Node.js"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Check if a Node.js version is installed
    if ! node --version > /dev/null 2>&1; then
      echo "Installing Node.js using NVM..."
      nvm install 20.11.1
    fi
  else
    echo "NVM not found. Installing NVM and Node.js..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20.11.1
  fi
fi

# Verify Node.js is working
if ! node --version > /dev/null 2>&1; then
  echo "Error: Failed to set up a working Node.js environment."
  exit 1
else
  echo "Using Node.js $(node --version)"
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Set up Python virtual environment and install rembg
echo "Setting up Python environment and installing rembg..."
python -m venv venv
source venv/bin/activate
pip install "rembg[cpu]"
deactivate

# Build the Electron application
echo "Building the desktop application..."

# Create dist directory if it doesn't exist
mkdir -p "$INSTALL_DIR/dist"

# Run the build command
npm run build

# If build fails, try the package command
if [ ! -f "$INSTALL_DIR/dist/"*.AppImage ]; then
  echo "Trying alternative build method..."
  npm run package
  sleep 10
fi

# Find the AppImage file
APPIMAGE_PATH=$(find "$INSTALL_DIR/dist" -name "*.AppImage" | head -n 1)

if [ -z "$APPIMAGE_PATH" ]; then
  echo "AppImage file not found in $INSTALL_DIR/dist"
  echo "Setting up fallback method..."
  
  # Create a desktop entry for the npm run electron command
  echo "Creating desktop entry..."
  sudo bash -c "cat > /usr/share/applications/tool-kit.desktop << EOF
[Desktop Entry]
Name=Tool Kit
Comment=A collection of useful tools
Exec=/usr/local/bin/tool-kit
Icon=$INSTALL_DIR/public/img/icon.png
Terminal=false
Type=Application
Categories=Utility;
EOF"

  # Create a shell script to run the application
  echo "Creating executable in /usr/local/bin..."
  sudo bash -c "cat > /usr/local/bin/tool-kit << EOF
#!/bin/bash

# Source nvm if available
if [ -d \"\$HOME/.nvm\" ] && [ -f \"\$HOME/.nvm/nvm.sh\" ]; then
  export NVM_DIR=\"\$HOME/.nvm\"
  [ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\"
fi

cd $INSTALL_DIR && npm run electron
EOF"

  # Set permissions
  echo "Setting permissions..."
  sudo chmod +x /usr/local/bin/tool-kit

  echo "Fallback installation complete. You can run the application with 'tool-kit' or from the application menu."
else
  # Create a desktop entry
  echo "Creating desktop entry..."
  sudo bash -c "cat > /usr/share/applications/tool-kit.desktop << EOF
[Desktop Entry]
Name=Tool Kit
Comment=A collection of useful tools
Exec=$APPIMAGE_PATH
Icon=$INSTALL_DIR/public/img/icon.png
Terminal=false
Type=Application
Categories=Utility;
EOF"

  # Create a symlink to the AppImage in /usr/local/bin
  echo "Creating executable in /usr/local/bin..."
  sudo ln -sf "$APPIMAGE_PATH" /usr/local/bin/tool-kit

  # Set permissions
  echo "Setting permissions..."
  sudo chmod +x "$APPIMAGE_PATH"
  sudo chmod +x /usr/local/bin/tool-kit
fi

echo ""
echo "=== Installation Complete ==="
echo "Tool Kit has been installed successfully!"
echo "You can start it from your application menu or by running 'tool-kit' in the terminal."
echo ""
