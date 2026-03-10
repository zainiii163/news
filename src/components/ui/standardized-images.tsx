"use client";

import { OptimizedImage } from "@/components/ui/optimized-image";
import { cn } from "@/lib/helpers/cn";

interface StandardizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

// Hero Article Image - 16:9 ratio, full container width
export function HeroArticleImage({ 
  src, 
  alt, 
  className, 
  priority = true,
  sizes = "100vw",
  quality = 85 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-16 aspect-h-9">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// News Card Image - 4:3 ratio
export function NewsCardImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw",
  quality = 85 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-4 aspect-h-3">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// Sidebar Image - 1:1 ratio
export function SidebarImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "150px",
  quality = 75 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-1 aspect-h-1">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// Featured Article Image - 16:9 ratio
export function FeaturedArticleImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, 200px",
  quality = 85 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-16 aspect-h-9">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// Compact Card Image - 1:1 ratio for small thumbnails
export function CompactCardImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "80px",
  quality = 75 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-1 aspect-h-1">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// Horizontal Card Image - 16:9 ratio for horizontal layouts
export function HorizontalCardImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, 200px",
  quality = 75 
}: StandardizedImageProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-w-16 aspect-h-9">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
