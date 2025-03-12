#!/bin/bash

# Tool Kit Installer for Arch Linux
# This script installs all dependencies and sets up Tool Kit as a desktop application

echo "=== Tool Kit Installer for Arch Linux ==="
echo "This script will install all required dependencies and set up Tool Kit."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (with sudo)."
  exit 1
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install required packages
echo "Installing required packages..."
pacman -Sy --noconfirm nodejs npm python python-pip imagemagick

# Create installation directory
INSTALL_DIR="/opt/tool-kit"
echo "Creating installation directory at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"

# Clone the repository
echo "Downloading Tool Kit..."
if command_exists git; then
  git clone https://github.com/Raadic/tool-kit-by-radic.git "$INSTALL_DIR"
else
  pacman -Sy --noconfirm git
  git clone https://github.com/Raadic/tool-kit-by-radic.git "$INSTALL_DIR"
fi

# Navigate to the installation directory
cd "$INSTALL_DIR" || exit 1

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
npm run package

# Wait for the build to complete
echo "Waiting for build to complete..."
sleep 5

# Find the AppImage file
APPIMAGE_PATH=$(find "$INSTALL_DIR/dist" -name "*.AppImage" | head -n 1)

if [ -z "$APPIMAGE_PATH" ]; then
  echo "Error: AppImage file not found in $INSTALL_DIR/dist"
  echo "You can still run the application with 'npm run electron' in $INSTALL_DIR"
else
  # Create a desktop entry
  echo "Creating desktop entry..."
  cat > /usr/share/applications/tool-kit.desktop << EOF
[Desktop Entry]
Name=Tool Kit
Comment=A collection of useful tools
Exec=$APPIMAGE_PATH
Icon=/opt/tool-kit/public/img/icon.png
Terminal=false
Type=Application
Categories=Utility;
EOF

  # Create a symlink to the AppImage in /usr/local/bin
  echo "Creating executable in /usr/local/bin..."
  ln -sf "$APPIMAGE_PATH" /usr/local/bin/tool-kit

  # Set permissions
  echo "Setting permissions..."
  chmod +x "$APPIMAGE_PATH"
  chmod +x /usr/local/bin/tool-kit
fi

echo ""
echo "=== Installation Complete ==="
echo "Tool Kit has been installed successfully!"
echo "You can start it from your application menu or by running 'tool-kit' in the terminal."
echo ""
