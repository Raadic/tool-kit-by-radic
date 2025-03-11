# Tool Kit

A web application that serves as an index for various micro tools for Arch Linux. The application features a dark, minimal UI with gradient text headings and rounded corners.

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

1. Clone this repository:
```
git clone <repository-url>
cd Tool\ Kit
```

2. Install Node.js dependencies:
```
npm install
```

3. Start the application:
```
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

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

## License

MIT
