// Custom image loader to handle timeout issues
export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's an external image, add timeout and fallback handling
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // For development, use unoptimized to avoid timeout issues
    if (process.env.NODE_ENV === 'development') {
      return src;
    }
    
    // In production, you might want to use a CDN or proxy
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  // For local images, use default behavior
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
