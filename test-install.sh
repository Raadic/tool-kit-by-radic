#!/bin/bash

# This is a test script to simulate the one-line installer
# It will test the installation script without actually installing anything

echo "=== Testing Tool Kit Installer ==="
echo "This is a simulation of the one-line installer"
echo ""

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Clone the repository to the temporary directory
echo "Cloning repository to temporary directory..."
git clone --depth 1 https://github.com/Raadic/tool-kit-by-radic.git "$TEMP_DIR/tool-kit"

# Print the installation script
echo ""
echo "=== Installation Script Content ==="
cat "$TEMP_DIR/tool-kit/install.sh"
echo ""
echo "=== End of Installation Script ==="

# Clean up
echo ""
echo "Cleaning up temporary directory..."
rm -rf "$TEMP_DIR"

echo ""
echo "=== Test Complete ==="
echo "The one-line installer would run the above script with sudo."
echo "To install Tool Kit, run the following command:"
echo "curl -fsSL https://raw.githubusercontent.com/Raadic/tool-kit-by-radic/master/install.sh | bash"
echo ""
