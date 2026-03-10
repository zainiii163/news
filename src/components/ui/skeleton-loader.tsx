"use client";

interface SkeletonLoaderProps {
  variant?: "card" | "hero" | "horizontal" | "vertical";
  className?: string;
}

export function SkeletonLoader({ variant = "card", className = "" }: SkeletonLoaderProps) {
  // Card Skeleton
  if (variant === "card") {
    return (
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}>
        <div className="relative w-full h-48 sm:h-52 md:h-56 bg-gray-200 animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Hero Skeleton
  if (variant === "hero") {
    return (
      <div className={`relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gray-200 overflow-hidden rounded-lg ${className}`}>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Card Skeleton
  if (variant === "horizontal") {
    return (
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 ${className}`}>
        <div className="flex gap-4 p-4">
          <div className="relative flex-shrink-0 overflow-hidden">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-200 animate-pulse"
              style={{ position: 'relative' }}
            >
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Vertical List Skeleton
  if (variant === "vertical") {
    return (
      <div className={`space-y-0 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index} 
            className="py-3 border-b border-gray-100"
            style={{ 
              borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}
