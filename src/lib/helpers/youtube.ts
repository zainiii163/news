/**
 * YouTube URL Helper Functions
 * Converts various YouTube URL formats to embed URLs
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * @param url - YouTube URL in any format
 * @returns Video ID or null if invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Pattern 2: youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^&\s?#]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Pattern 3: youtube.com/v/VIDEO_ID
  const vMatch = url.match(/youtube\.com\/v\/([^&\s?#]+)/);
  if (vMatch && vMatch[1]) {
    return vMatch[1];
  }

  return null;
}

/**
 * Check if a URL is a YouTube URL
 * @param url - URL to check
 * @returns true if it's a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

/**
 * Convert YouTube URL to embed URL
 * @param url - YouTube URL in any format
 * @returns Embed URL or original URL if not a YouTube URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get YouTube thumbnail URL
 * @param url - YouTube URL
 * @param quality - Thumbnail quality: 'default', 'medium', 'high', 'maxres'
 * @returns Thumbnail URL or null
 */
export function getYouTubeThumbnail(url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}
