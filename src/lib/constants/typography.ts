// CNN-style Typography Scale
// Consistent typography system for the news website

export const TYPOGRAPHY = {
  // Hero Headline
  HERO_HEADLINE: {
    fontSize: {
      xs: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl', // 24px - 40px - 48px
      className: 'font-black leading-tight tracking-tight'
    },
    fontWeight: 'font-black', // font-weight: 900
    lineHeight: 'leading-tight', // line-height: 1.1
  },

  // Article Titles
  ARTICLE_TITLE: {
    fontSize: {
      xs: 'text-xl sm:text-2xl lg:text-3xl', // 20px - 24px - 30px
      className: 'font-bold text-gray-900'
    },
    fontWeight: 'font-bold', // font-weight: 700
    lineHeight: 'leading-tight', // line-height: 1.2
  },

  // Sidebar News Titles
  SIDEBAR_TITLE: {
    fontSize: {
      xs: 'text-sm sm:text-base', // 14px - 16px
      className: 'font-medium text-gray-900'
    },
    fontWeight: 'font-medium', // font-weight: 500
    lineHeight: 'leading-tight', // line-height: 1.4
  },

  // Category Labels
  CATEGORY_LABEL: {
    fontSize: {
      xs: 'text-xs', // 12px
      className: 'font-black text-red-600 uppercase tracking-wider'
    },
    fontWeight: 'font-black', // font-weight: 800
    letterSpacing: 'tracking-wider', // letter-spacing: 0.5px
    textTransform: 'uppercase',
  },

  // Article Summary
  ARTICLE_SUMMARY: {
    fontSize: {
      xs: 'text-sm sm:text-base', // 14px - 16px
      className: 'text-gray-700'
    },
    fontWeight: 'font-normal', // font-weight: 400
    lineHeight: 'leading-relaxed', // line-height: 1.6
  },

  // Timestamps
  TIMESTAMP: {
    fontSize: {
      xs: 'text-xs', // 12px
      className: 'text-gray-500'
    },
    fontWeight: 'font-normal', // font-weight: 400
    lineHeight: 'leading-normal', // line-height: 1.5
  },

  // Navigation Items
  NAV_ITEM: {
    fontSize: {
      xs: 'text-base', // 16px
      className: 'font-semibold text-black'
    },
    fontWeight: 'font-semibold', // font-weight: 600
    lineHeight: 'leading-normal', // line-height: 1.5
  },

  // Breaking News Badge
  BREAKING_BADGE: {
    fontSize: {
      xs: 'text-xs', // 12px
      className: 'font-bold text-white uppercase tracking-wider'
    },
    fontWeight: 'font-bold', // font-weight: 700
    letterSpacing: 'tracking-wider', // letter-spacing: 0.5px
    textTransform: 'uppercase',
    backgroundColor: 'bg-red-600',
    color: 'text-white',
  },

  // Meta Information
  META_INFO: {
    fontSize: {
      xs: 'text-xs', // 12px
      className: 'text-gray-500'
    },
    fontWeight: 'font-normal', // font-weight: 400
    lineHeight: 'leading-normal', // line-height: 1.5
  },
} as const;

// Helper function to get typography classes
export const getTypographyClasses = (type: keyof typeof TYPOGRAPHY, additionalClasses = '') => {
  const typography = TYPOGRAPHY[type];
  return `${typography.fontSize.className} ${typography.fontWeight} ${additionalClasses}`;
};

// Helper function for responsive font sizes
export const getResponsiveFontSize = (baseSize: string, responsiveSizes: { xs?: string; sm?: string; lg?: string }) => {
  return `${baseSize} ${responsiveSizes.xs || ''} ${responsiveSizes.sm || ''} ${responsiveSizes.lg || ''}`;
};
