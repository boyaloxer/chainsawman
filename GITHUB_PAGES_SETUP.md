# GitHub Pages Deployment Guide

## Current Status

✅ **Code is compatible** - Your HTML/CSS/JS works perfectly with GitHub Pages  
❌ **Size issue** - Repository is 1.8 GB (exceeds 1 GB limit)

---

## Quick Decision Guide

### Option A: Optimize Images (Recommended for simplicity)

**Best if:** You want everything on GitHub Pages, don't mind smaller file sizes

**Steps:**
1. Run `python optimize_images.py`
2. Review optimized images
3. Replace `manga/volumes` with `manga_optimized/volumes`
4. Deploy to GitHub Pages

**Result:** ~600-800 MB repository (within limits)

### Option B: External Image Hosting (Recommended for quality)

**Best if:** You want maximum image quality, don't mind external dependency

**Steps:**
1. Upload images to external hosting (Cloudflare R2, AWS S3, etc.)
2. Update image paths in `app.js`
3. Deploy code to GitHub Pages
4. Images load from external source

**Result:** Small repository (~5-10 MB), high-quality images

---

## Detailed Setup (Option A - Optimize Images)

### Step 1: Optimize Images

```bash
python optimize_images.py
```

This will:
- Create `manga_optimized/volumes/` directory
- Compress images to 85% quality
- Resize if over 2000px width
- Convert all to JPEG format
- Preserve original files

### Step 2: Review Results

Check the optimized images to ensure quality is acceptable:
```bash
# Compare sizes
du -sh manga/volumes
du -sh manga_optimized/volumes
```

### Step 3: Replace Original Files

```bash
# Backup original (optional)
mv manga/volumes manga/volumes_original

# Use optimized
mv manga_optimized/volumes manga/volumes
```

### Step 4: Commit and Push

```bash
git add .
git commit -m "Optimize images for GitHub Pages"
git push
```

### Step 5: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to Pages section
3. Select branch: `main` (or `master`)
4. Select folder: `/ (root)`
5. Click Save

Your site will be available at:
`https://[username].github.io/[repository-name]/`

---

## Detailed Setup (Option B - External Hosting)

### Step 1: Choose Image Hosting

**Recommended: Cloudflare R2**
- Free tier: 10 GB storage, 1M Class A operations
- Compatible with S3 API
- No egress fees

**Alternative: AWS S3**
- Free tier: 5 GB storage
- Pay per GB after

### Step 2: Upload Images

Upload all images from `manga/volumes/` to your hosting service.

### Step 3: Update JavaScript

Modify `app.js` to use external URLs:

```javascript
loadPage() {
    const volumeId = this.currentVolume.id;
    const chapterId = this.currentChapter.id;
    const pageNum = this.currentPage.toString().padStart(3, '0');
    
    const img = document.getElementById('manga-image');
    
    // Use external hosting URL
    const baseUrl = 'https://your-cdn-url.com/manga/volumes';
    const imagePathJpg = `${baseUrl}/${volumeId}/${chapterId}/${pageNum}.jpg`;
    const imagePathPng = `${baseUrl}/${volumeId}/${chapterId}/${pageNum}.png`;
    
    // ... rest of loading logic
}
```

### Step 4: Remove Images from Repository

```bash
# Remove large image directory
rm -rf manga/volumes

# Keep metadata
# manga/metadata/ stays
```

### Step 5: Deploy

```bash
git add .
git commit -m "Move images to external hosting"
git push
```

Then enable GitHub Pages as described in Option A.

---

## Verification Checklist

- [ ] `.nojekyll` file exists in root
- [ ] Repository size under 1 GB (if using Option A)
- [ ] All paths are relative (not absolute)
- [ ] `index.html` is in root directory
- [ ] Images load correctly (test locally first)
- [ ] GitHub Pages enabled in repository settings

---

## Troubleshooting

### Images Not Loading
- Check file paths are relative
- Verify case sensitivity (v01, ch001, etc.)
- Check browser console for errors
- Ensure `.nojekyll` file exists

### Site Not Updating
- GitHub Pages can take 1-10 minutes to rebuild
- Check Actions tab for build status
- Clear browser cache

### Size Still Too Large
- Further compress images (lower quality)
- Use external hosting instead
- Consider removing some chapters

---

## Current Files Status

✅ `index.html` - Ready  
✅ `styles.css` - Ready  
✅ `app.js` - Ready (may need path updates for Option B)  
✅ `.nojekyll` - Created  
✅ `manga/metadata/manga.json` - Ready  
⚠️  `manga/volumes/` - Needs optimization or external hosting (1.8 GB)

