"use client";

import { useState, useMemo } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";

interface ImageGalleryProps {
  content: string;
  mainImage?: string;
  className?: string;
}

/**
 * Normalize URLs for comparison by removing protocol, trailing slashes, and query params
 */
function normalizeUrlForComparison(url: string): string {
  try {
    // Remove protocol, trailing slashes, and query parameters for comparison
    let normalized = url.toLowerCase().trim();
    
    // Remove protocol
    normalized = normalized.replace(/^https?:\/\//, '');
    
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    
    // Remove query parameters and fragments
    normalized = normalized.split('?')[0].split('#')[0];
    
    // Extract just the path for relative URLs
    if (normalized.includes('/')) {
      const pathMatch = normalized.match(/\/(.+)$/);
      if (pathMatch) {
        return pathMatch[1];
      }
    }
    
    return normalized;
  } catch {
    // Fallback: just lowercase and trim
    return url.toLowerCase().trim();
  }
}

/**
 * Check if two URLs point to the same image
 */
function isSameImage(url1: string, url2: string): boolean {
  if (!url1 || !url2) return false;
  
  // Normalize both URLs
  const normalized1 = normalizeUrlForComparison(url1);
  const normalized2 = normalizeUrlForComparison(url2);
  
  // Direct match
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (handles different URL formats)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    // Extract filename/path from both
    const path1 = normalized1.split('/').pop() || normalized1;
    const path2 = normalized2.split('/').pop() || normalized2;
    return path1 === path2;
  }
  
  return false;
}

export function ImageGallery({ content, mainImage, className = "" }: ImageGalleryProps) {
  const images = useMemo(() => {
    const extractedImages: string[] = [];
    const normalizedMainImage = mainImage ? getImageUrl(mainImage) : null;
    
    // Extract images from HTML content first
    // Use regex for server-side compatibility (DOMParser is browser-only and causes build errors)
    if (content) {
      // Always use regex for server-side rendering (during static generation)
      // This regex matches <img> tags with src attribute
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const src = match[1];
        if (src) {
          // Convert to full URL
          const fullUrl = getImageUrl(src);
          
          // Check if this is the main image - if so, skip it (main image is displayed separately)
          if (normalizedMainImage && isSameImage(fullUrl, normalizedMainImage)) {
            continue; // Skip main image if it appears in content
          }
          
          // Avoid duplicates
          const isDuplicate = extractedImages.some(img => isSameImage(img, fullUrl));
          if (!isDuplicate) {
            extractedImages.push(fullUrl);
          }
        }
      }
      
      // In browser, optionally use DOMParser for more accurate parsing (but regex is primary)
      // This is only for client-side hydration improvements, not required
      if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, "text/html");
          const imgElements = doc.querySelectorAll("img");
          
          // Add any additional images found by DOMParser that regex might have missed
          imgElements.forEach((img) => {
            const src = img.getAttribute("src");
            if (src) {
              const fullUrl = getImageUrl(src);
              
              // Check if this is the main image - if so, skip it
              if (normalizedMainImage && isSameImage(fullUrl, normalizedMainImage)) {
                return; // Skip main image if it appears in content
              }
              
              // Avoid duplicates
              const isDuplicate = extractedImages.some(img => isSameImage(img, fullUrl));
              if (!isDuplicate) {
                extractedImages.push(fullUrl);
              }
            }
          });
        } catch {
          // Ignore DOMParser errors - regex is the primary method
        }
      }
    }

    // Don't add main image to gallery - it's already displayed separately above the gallery
    // The gallery should only contain images from the content itself
    // This prevents duplicate display of the main image

    return extractedImages;
  }, [content, mainImage]);
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Don't show gallery if there are no images from content
  // (Main image is displayed separately, so we only show gallery for content images)
  if (images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;
    
    if (direction === "prev") {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
    } else {
      setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
        {images.slice(0, 6).map((img, index) => 
          img && img.trim() !== "" ? (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-video overflow-hidden rounded hover:opacity-90 transition"
            >
              <OptimizedImage
                src={img}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                quality={85}
                loading="lazy"
              />
              {index === 5 && images.length > 6 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                  +{images.length - 6}
                </div>
              )}
            </button>
          ) : null
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative max-w-7xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            {images[selectedIndex] && images[selectedIndex].trim() !== "" && (
              <OptimizedImage
                src={images[selectedIndex]}
                alt={`Gallery image ${selectedIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[90vh] w-auto"
                quality={90}
                priority
              />
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

