# Tool Kit

A desktop application that serves as an index for various micro tools for Arch Linux. The application features a dark, minimal UI with gradient text headings and rounded corners.

## Features

- Dark, minimal UI design with gradient font color headings
- Responsive layout with a searchable sidebar
- Card-based tool listing
- Currently includes:
  - Image Converter (convert between PNG, JPG, WEBP, and other formats)
  - Background Remover (remove backgrounds from images using AI)
  - Markdown Editor (create and edit Markdown documents with live preview)

## Requirements

- Node.js and npm
- Specific dependencies for each tool (listed in each tool's description)

## Installation

### One-Line Installation (Recommended)

You can install Tool Kit on Arch Linux using one of these methods:

**Method 1: Download and run the script (recommended)**
```bash
curl -fsSL https://raw.githubusercontent.com/Raadic/tool-kit-by-radic/master/install.sh -o install.sh
sudo bash install.sh
```

**Method 2: Direct pipe to bash (may require manual sudo)**
```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/Raadic/tool-kit-by-radic/master/install.sh)"
```

This will install all dependencies, set up the application, and create a desktop shortcut.

### Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/Raadic/tool-kit-by-radic.git
cd Tool\ Kit
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Run as a desktop application:
```bash
npm run electron
```

4. Or run as a web application:
```bash
npm start
```
Then open your browser and navigate to `http://localhost:3000`

### Building the Desktop Application

To build the desktop application as an AppImage or Pacman package:

```bash
npm run package
```

The built packages will be available in the `dist` directory.

## Tool-specific Dependencies

### Image Converter
On Arch Linux, install the required dependencies with:
```
sudo pacman -S imagemagick sharp nodejs npm
```

### Background Remover
On Arch Linux, install the required dependencies with:
```
sudo pacman -S python python-pip
python -m venv venv
source venv/bin/activate
pip install "rembg[cpu]"
```

### Markdown Editor
On Arch Linux, install the required dependencies with:
```
sudo pacman -S nodejs npm
```

## Adding New Tools

To add new tools to the application, edit the `public/js/app.js` file and add new tool definitions to the `tools` array.

## Troubleshooting

### Node.js ICU Library Compatibility Issues

If you encounter errors related to ICU libraries such as:
```
node: error while loading shared libraries: libicui18n.so.76: cannot open shared object file: No such file or directory
```
or
```
node: symbol lookup error: node: undefined symbol: _ZN6icu_768ByteSink15GetAppendBufferEiiPciPi
```

This indicates a compatibility issue between the installed Node.js version and your system's ICU libraries. The updated install script should automatically detect and use a compatible Node.js version if available. If you still encounter issues, you can manually install a compatible version using Node Version Manager (nvm):

1. Install Node Version Manager (nvm):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

2. Close and reopen your terminal, or source your profile:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

3. Install a compatible version of Node.js:
```bash
nvm install 20.11.1
```

4. Run the installation script again:
```bash
sudo bash install.sh
```

The install script has been updated to automatically detect and use the nvm-installed Node.js if the system version is incompatible.

## License

MIT
