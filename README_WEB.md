# Chainsaw Man Manga Web Reader

A web-based manga reader for Chainsaw Man with a clean, modern interface.

## File Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # Stylesheet
├── app.js                  # JavaScript application logic
├── manga/
│   ├── volumes/           # Reorganized manga files
│   │   ├── v01/
│   │   │   ├── ch001/
│   │   │   │   ├── 001.jpg
│   │   │   │   ├── 002.jpg
│   │   │   │   └── ...
│   │   │   └── ch002/
│   │   └── ...
│   └── metadata/
│       └── manga.json     # Chapter metadata
```

## Features

- **Volume Browser**: Browse all 11 volumes
- **Chapter Browser**: View chapters within each volume
- **Image Reader**: Read manga pages with navigation
- **Keyboard Controls**: 
  - Arrow Left / A: Previous page
  - Arrow Right / D: Next page
  - Escape: Back to chapter list

## Setup

1. The files have been reorganized into the clean structure
2. Simply open `index.html` in a web browser
3. For best experience, serve via a local web server:

### Using Python
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Then open the URL shown
```

### Using PHP
```bash
php -S localhost:8000
```

## Usage

1. Click on a volume to see its chapters
2. Click on a chapter to start reading
3. Use navigation buttons or keyboard to move between pages
4. Press Escape or click "Back to Chapters" to return

## File Organization

Files have been reorganized from the original structure:
- **Before**: `Chainsaw Man (Digitally Colored)/Chainsaw Man - Digital Colored Comics v01 (2022) (Colored Council)/Chapter 1 - Dog & Chainsaw/01.jpg`
- **After**: `manga/volumes/v01/ch001/001.jpg`

This provides:
- Clean URLs (no encoding needed)
- Shorter paths (74% shorter)
- Correct sorting (ch001, ch002, ch010)
- Easy programmatic access

## Original Files

Original files are preserved in: `Chainsaw Man (Digitally Colored)/`

