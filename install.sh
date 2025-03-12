#!/bin/bash

# Tool Kit Installer for Arch Linux
# This script installs all dependencies and sets up Tool Kit as a desktop application

echo "=== Tool Kit Installer for Arch Linux ==="
echo "This script will install all required dependencies and set up Tool Kit."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "This script requires root privileges."
  echo "Please run the command with sudo: sudo bash install.sh"
  exit 1
fi

# Save the original user for later use with npm commands
ORIGINAL_USER=$(logname || echo ${SUDO_USER})
ORIGINAL_HOME=$(eval echo ~${ORIGINAL_USER})

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install required packages
echo "Installing required packages..."
pacman -Sy --noconfirm nodejs npm python python-pip imagemagick icu

# Check for Node.js compatibility and set NODE_BIN
# First try to use the original user's environment
echo "Checking for Node.js in the original user's environment..."

# Try to detect nvm in the original user's environment
if [ -d "$ORIGINAL_HOME/.nvm" ] && [ -f "$ORIGINAL_HOME/.nvm/nvm.sh" ]; then
  echo "NVM detected in user's home directory, checking for compatible Node.js version..."
  
  # Find the latest installed Node.js version in nvm
  NVM_NODE=$(find "$ORIGINAL_HOME/.nvm/versions/node" -maxdepth 1 -type d | sort -Vr | head -n 1)
  
  if [ -n "$NVM_NODE" ] && [ -x "$NVM_NODE/bin/node" ]; then
    NODE_BIN="$NVM_NODE/bin/node"
    echo "Using NVM-installed Node.js: $($NODE_BIN --version 2>/dev/null || echo 'version check failed')"
  else
    echo "No compatible Node.js version found in NVM, trying system Node.js..."
    if node --version > /dev/null 2>&1; then
      NODE_BIN="node"
      echo "Using system Node.js: $(node --version)"
    else
      echo "Error: No compatible Node.js version found."
      echo "Please install Node.js manually or via NVM."
      echo "You can install NVM with: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
      exit 1
    fi
  fi
else
  # Try system Node.js
  if node --version > /dev/null 2>&1; then
    NODE_BIN="node"
    echo "Using system Node.js: $(node --version)"
  else
    echo "Error: No compatible Node.js version found."
    echo "Please install Node.js manually or via NVM."
    echo "You can install NVM with: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    exit 1
  fi
fi

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
# Get the npm path corresponding to our Node.js version
NPM_BIN="$(dirname "$NODE_BIN")/npm"

# Run npm as the original user
su - "$ORIGINAL_USER" -c "cd $INSTALL_DIR && $NPM_BIN install"

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

# Run the build command as the original user
su - "$ORIGINAL_USER" -c "cd $INSTALL_DIR && $NPM_BIN run build"

# If build fails, try the package command
if [ ! -f "$INSTALL_DIR/dist/"*.AppImage ]; then
  echo "Trying alternative build method..."
  su - "$ORIGINAL_USER" -c "cd $INSTALL_DIR && $NPM_BIN run package"
  sleep 10
fi

# Find the AppImage file
APPIMAGE_PATH=$(find "$INSTALL_DIR/dist" -name "*.AppImage" | head -n 1)

if [ -z "$APPIMAGE_PATH" ]; then
  echo "AppImage file not found in $INSTALL_DIR/dist"
  echo "Setting up fallback method..."
  
  # Create a desktop entry for the npm run electron command
  echo "Creating desktop entry..."
  cat > /usr/share/applications/tool-kit.desktop << EOF
[Desktop Entry]
Name=Tool Kit
Comment=A collection of useful tools
Exec=bash -c "cd $INSTALL_DIR && $(dirname "$NODE_BIN")/npm run electron"
Icon=$INSTALL_DIR/public/img/icon.png
Terminal=false
Type=Application
Categories=Utility;
EOF

  # Create a shell script to run the application
  echo "Creating executable in /usr/local/bin..."
  cat > /usr/local/bin/tool-kit << EOF
#!/bin/bash

# Use the compatible Node.js version
NODE_PATH="$NODE_BIN"
NPM_PATH="$(dirname "$NODE_BIN")/npm"

cd $INSTALL_DIR && "$NPM_PATH" run electron
EOF

  # Set permissions
  echo "Setting permissions..."
  chmod +x /usr/local/bin/tool-kit

  echo "Fallback installation complete. You can run the application with 'tool-kit' or from the application menu."
else
  # Create a desktop entry
  echo "Creating desktop entry..."
  cat > /usr/share/applications/tool-kit.desktop << EOF
[Desktop Entry]
Name=Tool Kit
Comment=A collection of useful tools
Exec=$APPIMAGE_PATH
Icon=$INSTALL_DIR/public/img/icon.png
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
