"""
Image optimization script to reduce repository size for GitHub Pages.
Reduces file sizes while maintaining good quality for reading.
"""
import os
from pathlib import Path
from PIL import Image
import sys

def optimize_image(input_path, output_path, quality=75, max_width=1600):
    """Optimize a single image"""
    try:
        img = Image.open(input_path)
        
        # Convert RGBA/LA/P to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if too large (maintain aspect ratio)
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save as JPEG with optimization
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
        return True
    except Exception as e:
        print(f"Error optimizing {input_path}: {e}")
        return False

def optimize_chapter(chapter_path, output_path, quality=75, max_width=1600):
    """Optimize all images in a chapter"""
    chapter_path = Path(chapter_path)
    output_path = Path(output_path)
    output_path.mkdir(parents=True, exist_ok=True)
    
    images = sorted(chapter_path.glob("*.jpg")) + sorted(chapter_path.glob("*.png"))
    
    optimized = 0
    total_size_before = 0
    total_size_after = 0
    
    for img_file in images:
        output_file = output_path / f"{img_file.stem}.jpg"
        
        size_before = img_file.stat().st_size
        total_size_before += size_before
        
        if optimize_image(img_file, output_file, quality, max_width):
            size_after = output_file.stat().st_size
            total_size_after += size_after
            optimized += 1
            reduction = ((size_before - size_after) / size_before) * 100
            print(f"  {img_file.name}: {size_before/1024:.1f}KB -> {size_after/1024:.1f}KB ({reduction:.1f}% reduction)")
    
    return optimized, total_size_before, total_size_after

def main():
    source_dir = Path("manga/volumes")
    output_dir = Path("manga_optimized/volumes")
    
    if not source_dir.exists():
        print(f"Source directory not found: {source_dir}")
        return
    
    print("=" * 80)
    print("Image Optimization for GitHub Pages")
    print("=" * 80)
    print()
    print(f"Source: {source_dir}")
    print(f"Output: {output_dir}")
    print()
    print("Settings:")
    print("  - Quality: 75% (aggressive optimization for GitHub Pages)")
    print("  - Max width: 1600px")
    print("  - Format: JPEG")
    print()
    
    # Non-interactive mode - user explicitly requested optimization
    print("Starting optimization (non-interactive mode)...")
    
    print()
    print("Optimizing images...")
    print("=" * 80)
    
    total_images = 0
    total_before = 0
    total_after = 0
    
    # Process all volumes and chapters
    for vol_dir in sorted(source_dir.iterdir()):
        if not vol_dir.is_dir():
            continue
        
        vol_output = output_dir / vol_dir.name
        print(f"\n{vol_dir.name}:")
        
        for ch_dir in sorted(vol_dir.iterdir()):
            if not ch_dir.is_dir():
                continue
            
            ch_output = vol_output / ch_dir.name
            print(f"  {ch_dir.name}...", end=" ")
            
            optimized, before, after = optimize_chapter(ch_dir, ch_output)
            total_images += optimized
            total_before += before
            total_after += after
            
            reduction = ((before - after) / before) * 100 if before > 0 else 0
            print(f"  Total: {before/1024/1024:.2f}MB -> {after/1024/1024:.2f}MB ({reduction:.1f}% reduction)")
    
    print()
    print("=" * 80)
    print("Optimization Complete!")
    print(f"Total images: {total_images}")
    print(f"Total size before: {total_before/1024/1024:.2f} MB")
    print(f"Total size after: {total_after/1024/1024:.2f} MB")
    reduction = ((total_before - total_after) / total_before) * 100 if total_before > 0 else 0
    print(f"Total reduction: {reduction:.1f}%")
    print()
    print(f"Optimized images saved to: {output_dir}")
    print()
    print("Next steps:")
    print("1. Review the optimized images")
    print("2. If satisfied, replace manga/volumes with manga_optimized/volumes")
    print("3. Commit and push to GitHub Pages")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        sys.exit(1)

