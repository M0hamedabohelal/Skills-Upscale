"""
SkillUpscale Logo Processor
===========================
Advanced background removal, edge refinement, sharpening, color correction,
and multi-variant output for responsive web design.

Outputs:
  - logo-original.png      (transparent, original colors)
  - logo-white.png          (transparent, white version for dark backgrounds)
  - logo-dark.png           (transparent, dark version for light backgrounds)
  - logo-icon-only.png      (transparent, icon mark only)
"""

import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
from pathlib import Path
import sys

# ─── Configuration ────────────────────────────────────────────────────────────
INPUT_FILE = "1.jpeg"
OUTPUT_DIR = Path(__file__).parent / "logo"
QUALITY_PNG = True  # optimize PNG output

# Background color detection threshold
BG_TOLERANCE = 28          # how close a pixel must be to bg color to be removed
EDGE_FEATHER_RADIUS = 1.2  # sub-pixel edge feathering for anti-aliased edges
SHARPEN_AMOUNT = 1.15      # subtle sharpening factor
COLOR_SATURATION = 1.08    # subtle color boost
COLOR_CONTRAST = 1.05      # subtle contrast boost


def load_image(path: str) -> Image.Image:
    """Load the source logo image."""
    img = Image.open(path).convert("RGBA")
    print(f"  Loaded: {path} ({img.width}x{img.height})")
    return img


def detect_background_color(img: Image.Image) -> tuple:
    """
    Detect the dominant background color by sampling corners and edges.
    More robust than single-pixel sampling.
    """
    arr = np.array(img)
    h, w = arr.shape[:2]
    
    # Sample from multiple edge/corner regions
    samples = []
    margin = max(5, min(h, w) // 20)
    
    # Four corners
    for y_slice, x_slice in [
        (slice(0, margin), slice(0, margin)),           # top-left
        (slice(0, margin), slice(w - margin, w)),       # top-right
        (slice(h - margin, h), slice(0, margin)),       # bottom-left
        (slice(h - margin, h), slice(w - margin, w)),   # bottom-right
    ]:
        region = arr[y_slice, x_slice, :3]
        samples.append(region.reshape(-1, 3))
    
    # Top and bottom strips
    for y_slice in [slice(0, margin), slice(h - margin, h)]:
        region = arr[y_slice, :, :3]
        samples.append(region.reshape(-1, 3))
    
    all_samples = np.concatenate(samples, axis=0)
    bg_color = tuple(int(x) for x in np.median(all_samples, axis=0))
    print(f"  Detected background color: RGB{bg_color}")
    return bg_color


def create_alpha_mask(img: Image.Image, bg_color: tuple, tolerance: int) -> Image.Image:
    """
    Create a precise alpha mask using color distance from background.
    Uses Euclidean distance in RGB space with smooth falloff for anti-aliased edges.
    """
    arr = np.array(img)[:, :, :3].astype(np.float64)
    bg = np.array(bg_color, dtype=np.float64)
    
    # Euclidean distance from background color
    dist = np.sqrt(np.sum((arr - bg) ** 2, axis=2))
    
    # Create smooth alpha:
    #   - distance < tolerance * 0.6  → fully transparent (background)
    #   - distance > tolerance        → fully opaque (foreground)
    #   - in between                  → smooth gradient (anti-aliased edge)
    inner_threshold = tolerance * 0.55
    outer_threshold = tolerance * 1.0
    
    alpha = np.clip((dist - inner_threshold) / (outer_threshold - inner_threshold), 0, 1)
    alpha = (alpha * 255).astype(np.uint8)
    
    mask = Image.fromarray(alpha, mode="L")
    return mask


def refine_edges(mask: Image.Image, feather: float) -> Image.Image:
    """
    Refine mask edges to remove halos and artifacts.
    Uses morphological operations and controlled Gaussian blur.
    """
    arr = np.array(mask).astype(np.float64)
    
    # Step 1: Slight erosion to pull edges inward and remove halo fringe
    # We simulate erosion via minimum filter on the mask
    from PIL import ImageFilter
    eroded = mask.filter(ImageFilter.MinFilter(size=3))
    
    # Step 2: Gentle feathering with Gaussian blur for smooth edges
    feathered = eroded.filter(ImageFilter.GaussianBlur(radius=feather))
    
    # Step 3: Re-sharpen the mask to keep edges crisp but smooth
    feathered_arr = np.array(feathered).astype(np.float64)
    
    # Contrast stretch the edge region to reduce semi-transparent fringe
    # Pixels close to 0 or 255 get pushed further toward those extremes
    feathered_arr = np.where(feathered_arr < 30, 0, feathered_arr)
    feathered_arr = np.where(feathered_arr > 225, 255, feathered_arr)
    
    # Smooth mid-range values with a sigmoid-like curve for clean transitions
    mid_mask = (feathered_arr >= 30) & (feathered_arr <= 225)
    if np.any(mid_mask):
        normalized = (feathered_arr[mid_mask] - 30) / (225 - 30)
        # Sigmoid steepening for crisper edges
        steepened = 1.0 / (1.0 + np.exp(-8 * (normalized - 0.5)))
        feathered_arr[mid_mask] = steepened * 255
    
    return Image.fromarray(feathered_arr.astype(np.uint8), mode="L")


def apply_sharpening(img: Image.Image, amount: float) -> Image.Image:
    """Apply subtle unsharp masking for improved clarity."""
    enhancer = ImageEnhance.Sharpness(img)
    return enhancer.enhance(amount)


def apply_color_correction(img: Image.Image, saturation: float, contrast: float) -> Image.Image:
    """Apply subtle color and contrast enhancement for better visibility."""
    img = ImageEnhance.Color(img).enhance(saturation)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    return img


def crop_to_content(img: Image.Image, padding: int = 10) -> Image.Image:
    """
    Crop image tightly to the logo content with uniform padding.
    Ensures pixel-perfect alignment.
    """
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox is None:
        return img
    
    x1, y1, x2, y2 = bbox
    
    # Add padding
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(img.width, x2 + padding)
    y2 = min(img.height, y2 + padding)
    
    cropped = img.crop((x1, y1, x2, y2))
    print(f"  Cropped to content: {cropped.width}x{cropped.height} (from {img.width}x{img.height})")
    return cropped


def create_white_version(img: Image.Image) -> Image.Image:
    """
    Create an all-white version of the logo for dark backgrounds.
    Preserves alpha channel perfectly.
    """
    arr = np.array(img)
    result = arr.copy()
    # Set all RGB to white, keep alpha
    result[:, :, 0] = 255
    result[:, :, 1] = 255
    result[:, :, 2] = 255
    return Image.fromarray(result, mode="RGBA")


def create_dark_version(img: Image.Image) -> Image.Image:
    """
    Create a dark version of the logo for light backgrounds.
    Maps the teal/cyan gradient to dark navy/charcoal tones.
    Preserves alpha channel and relative luminance relationships.
    """
    arr = np.array(img).astype(np.float64)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    
    # Convert to grayscale luminance
    luminance = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    
    # Map to dark color palette: dark navy (#1a2332) to charcoal (#2d3748)
    # Dark base: RGB(26, 35, 50) → RGB(45, 55, 72)
    dark_low = np.array([20, 28, 42])
    dark_high = np.array([50, 60, 78])
    
    # Normalize luminance
    lum_min = luminance[alpha > 128].min() if np.any(alpha > 128) else 0
    lum_max = luminance[alpha > 128].max() if np.any(alpha > 128) else 255
    
    if lum_max > lum_min:
        norm_lum = np.clip((luminance - lum_min) / (lum_max - lum_min), 0, 1)
    else:
        norm_lum = np.zeros_like(luminance)
    
    # Invert so darker areas in original become lighter in dark version (better contrast)
    norm_lum_inv = 1.0 - norm_lum
    
    result = np.zeros_like(arr)
    for c in range(3):
        result[:, :, c] = dark_low[c] + norm_lum_inv * (dark_high[c] - dark_low[c])
    result[:, :, 3] = alpha
    
    return Image.fromarray(result.astype(np.uint8), mode="RGBA")


def extract_icon(img: Image.Image) -> Image.Image:
    """
    Extract just the circular icon mark (without the text).
    Uses connected component analysis based on horizontal gap detection.
    """
    arr = np.array(img)
    alpha = arr[:, :, 3]
    
    # Find columns with significant content
    col_content = np.sum(alpha > 128, axis=0)
    
    # Find the gap between icon and text
    # The icon and text are separated by a horizontal gap
    threshold = max(1, alpha.shape[0] * 0.02)
    content_cols = col_content > threshold
    
    # Find runs of empty columns (gap)
    in_content = False
    gap_start = -1
    best_gap = (0, 0, 0)  # (start, end, width)
    
    for i, has_content in enumerate(content_cols):
        if has_content:
            if gap_start >= 0 and in_content:
                gap_width = i - gap_start
                if gap_width > best_gap[2] and gap_start > img.width * 0.15:
                    best_gap = (gap_start, i, gap_width)
            in_content = True
            gap_start = -1
        else:
            if in_content and gap_start < 0:
                gap_start = i
    
    if best_gap[2] > 5:
        # Crop to just the icon part (left of the gap)
        icon_end_x = best_gap[0]
        icon_img = img.crop((0, 0, icon_end_x, img.height))
        icon_img = crop_to_content(icon_img, padding=5)
        print(f"  Icon extracted: {icon_img.width}x{icon_img.height}")
        return icon_img
    else:
        print("  Warning: Could not isolate icon, returning full logo")
        return img


def optimize_and_save(img: Image.Image, path: Path):
    """Save as optimized PNG for web performance."""
    img.save(
        path,
        format="PNG",
        optimize=True,
    )
    size_kb = path.stat().st_size / 1024
    print(f"  Saved: {path.name} ({img.width}x{img.height}, {size_kb:.1f} KB)")


def main():
    print("=" * 60)
    print("  SkillUpscale Logo Processor")
    print("=" * 60)
    
    # Setup output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    input_path = Path(__file__).parent / INPUT_FILE
    
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)
    
    # Step 1: Load image
    print("\n[1/8] Loading source image...")
    img = load_image(str(input_path))
    
    # Step 2: Detect background
    print("\n[2/8] Detecting background color...")
    bg_color = detect_background_color(img)
    
    # Step 3: Create alpha mask
    print("\n[3/8] Creating alpha mask with edge detection...")
    alpha_mask = create_alpha_mask(img, bg_color, BG_TOLERANCE)
    
    # Step 4: Refine edges
    print("\n[4/8] Refining edges (feathering + halo removal)...")
    refined_mask = refine_edges(alpha_mask, EDGE_FEATHER_RADIUS)
    
    # Step 5: Apply mask to create transparent image
    print("\n[5/8] Applying alpha mask...")
    result = img.copy()
    result.putalpha(refined_mask)
    
    # Step 6: Color correction and sharpening
    print("\n[6/8] Applying color correction and sharpening...")
    result = apply_color_correction(result, COLOR_SATURATION, COLOR_CONTRAST)
    result = apply_sharpening(result, SHARPEN_AMOUNT)
    
    # Step 7: Crop to content
    print("\n[7/8] Cropping to content bounds...")
    result = crop_to_content(result, padding=15)
    
    # Step 8: Generate all variants
    print("\n[8/8] Generating logo variants...")
    
    # Original (transparent background)
    print("\n  -> Original variant:")
    optimize_and_save(result, OUTPUT_DIR / "logo-original.png")
    
    # White version (for dark backgrounds)
    print("\n  -> White variant:")
    white = create_white_version(result)
    optimize_and_save(white, OUTPUT_DIR / "logo-white.png")
    
    # Dark version (for light backgrounds)
    print("\n  -> Dark variant:")
    dark = create_dark_version(result)
    optimize_and_save(dark, OUTPUT_DIR / "logo-dark.png")
    
    # Icon-only version
    print("\n  -> Icon-only variant:")
    icon = extract_icon(result)
    optimize_and_save(icon, OUTPUT_DIR / "logo-icon-only.png")
    
    # White icon
    print("\n  -> White icon variant:")
    white_icon = create_white_version(icon)
    optimize_and_save(white_icon, OUTPUT_DIR / "logo-icon-white.png")
    
    # Dark icon
    print("\n  -> Dark icon variant:")
    dark_icon = create_dark_version(icon)
    optimize_and_save(dark_icon, OUTPUT_DIR / "logo-icon-dark.png")
    
    print("\n" + "=" * 60)
    print("  [OK] All logo variants generated successfully!")
    print(f"  Output directory: {OUTPUT_DIR}")
    print("=" * 60)
    
    # Summary
    print("\n  Files generated:")
    for f in sorted(OUTPUT_DIR.glob("*.png")):
        size_kb = f.stat().st_size / 1024
        img_check = Image.open(f)
        print(f"    • {f.name:30s} {img_check.width:4d}x{img_check.height:<4d}  {size_kb:6.1f} KB")


if __name__ == "__main__":
    main()
