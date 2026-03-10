"use client";

import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category } from "@/types/category.types";
import { useState, useMemo } from "react";

// Social Media Icons Component
function SocialIcon({ name, href }: { name: string; href?: string }) {
  if (!href) return null;

  const iconContent = () => {
    switch (name.toLowerCase()) {
      case "facebook":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "twitter":
      case "x":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "instagram":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "youtube":
        return (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#999999] hover:text-[#FFFFFF] transition-colors duration-200"
      aria-label={name}
    >
      {iconContent()}
    </a>
  );
}

// Flatten categories for sitemap
const flattenCategories = (cats: Category[] | null | undefined): Category[] => {
  const result: Category[] = [];
  if (!Array.isArray(cats) || cats.length === 0) return result;
  for (const cat of cats) {
    if (!cat) continue;
    result.push(cat);
    if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
      const flattenedChildren = flattenCategories(cat.children);
      if (Array.isArray(flattenedChildren) && flattenedChildren.length > 0) {
        result.push(...flattenedChildren);
      }
    }
  }
  return result;
};

export function Footer() {
  const { data: categoriesData, isLoading, error } = useCategories(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize categories processing to prevent unnecessary recalculations
  const allCategories = useMemo(() => {
    try {
      // Handle different possible data structures
      let categories: Category[] | undefined;

      // Try different data paths based on API response structure
      if (categoriesData && typeof categoriesData === "object" && categoriesData !== null) {
        const data = categoriesData as { data?: unknown };
        
        // Path 1: ApiResponse<CategoryResponse> -> categoriesData.data.data
        if (data.data && typeof data.data === "object" && data.data !== null) {
          const nestedData = data.data as { data?: Category[] };
          if (nestedData.data && Array.isArray(nestedData.data)) {
            categories = nestedData.data;
          }
        }
        
        // Path 2: Direct CategoryResponse -> categoriesData.data
        if (!categories && data.data && Array.isArray(data.data)) {
          categories = data.data as Category[];
        }
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        // Provide fallback categories for development
        if (process.env.NODE_ENV === "development") {
          console.warn("Footer - No valid categories found in data structure, using fallback");
          return [
            { id: "1", nameEn: "US", nameIt: "USA", slug: "us", order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "2", nameEn: "World", nameIt: "Mondo", slug: "world", order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "3", nameEn: "Politics", nameIt: "Politica", slug: "politics", order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "4", nameEn: "Business", nameIt: "Economia", slug: "business", order: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "5", nameEn: "Technology", nameIt: "Tecnologia", slug: "technology", order: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: "6", nameEn: "Sports", nameIt: "Sport", slug: "sports", order: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ] as Category[];
        }
        return [];
      }

      return flattenCategories(categories);
    } catch (error) {
      console.error("Error flattening categories:", error);
      return [];
    }
  }, [categoriesData, isLoading, error]);

  // Social media links from env vars
  const socialLinks = {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
  };

  return (
    <footer className="bg-[#0D0D0D] text-white mt-20">
      {/* Footer Ad Slot - min height so 2 stacked ads show on mobile */}
      <div className="cnn-container py-4 bg-[#1a1a1a] min-h-0 overflow-visible">
        <AdSlot slot="FOOTER" />
      </div>

      <div className="footer__inner">
        {/* Search Bar */}
        <div className="search-bar max-w-2xl mx-auto px-4 py-6">
          <form 
            action="/search" 
            className="search-bar__form relative bg-white rounded-lg overflow-hidden"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
          >
            <input 
              placeholder="Search CNN..." 
              aria-label="Search" 
              className="search-bar__input w-full px-4 py-3 pr-12 text-black outline-none"
              type="text" 
              autoComplete="off" 
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="search-bar__submit absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors p-1"
              title="Search"
              aria-label="Search"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Mobile Subscribe Button */}
        <div className="px-4 py-4 md:hidden">
          <button className="footer__subscribe-button w-full bg-[#c70000] hover:bg-[#ff0000] text-white py-3 px-6 font-bold rounded-lg transition-colors">
            Subscribe
          </button>
        </div>

        <hr className="border-gray-700 my-0" />

        {/* User Account Navigation */}
        <div className="px-4 py-4">
          <div className="user-account-nav flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="user-account-nav__icon-button text-white hover:text-[#c70000] transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-.941 7.773-.307-.486-.765-.912-1.382-1.27-.912-.53-2.054-.922-3.303-1.155a4.642 4.642 0 001.89-4.755 4.567 4.567 0 00-3.745-3.62 4.648 4.648 0 00-5.442 4.574c0 1.571.787 2.96 1.986 3.8-1.258.235-2.407.63-3.323 1.167-.536.314-.953.674-1.256 1.076A8.617 8.617 0 013.326 12c0-5.821 5.765-10.322 11.885-8.093m.112-1.368A10.052 10.052 0 002.539 15.321a9.611 9.611 0 006.138 6.14A10.052 10.052 0 0021.461 8.679a9.611 9.611 0 00-6.138-6.14"/>
                </svg>
              </button>
              <button className="user-account-nav__text-button text-white hover:text-[#c70000] transition-colors font-medium">
                Sign in
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-0" />

        {/* Live TV, Audio, Video Links */}
        <div className="px-4 py-4 flex flex-wrap gap-4 md:hidden">
          <a href="/live-tv" className="footer__live-tv-link text-white hover:text-[#c70000] transition-colors font-medium">
            Live TV
          </a>
          <a href="/audio" className="footer__audio-link text-white hover:text-[#c70000] transition-colors font-medium">
            Listen
          </a>
          <a href="/watch" className="footer__video-link text-white hover:text-[#c70000] transition-colors font-medium">
            Watch
          </a>
        </div>

        <hr className="border-gray-700 my-0 md:hidden" />

        {/* Footer Subnav - Categories */}
        <div className="footer__subnav px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and Description Section */}
            <div className="flex flex-col lg:col-span-1">
              <div className="mb-4">
                <Link href="/" className="text-[#c70000] font-black text-2xl">
                  TG CALABRIA
                </Link>
                <p className="text-[#999999] text-xs mt-1">Report</p>
              </div>
              <p className="text-[#999999] text-xs mb-4">
                Your trusted source for news in Calabria. Stay informed with the latest updates.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col">
              <h4 className="font-black mb-4 text-[#FFFFFF] text-sm uppercase tracking-wide">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Home</Link></li>
                <li><Link href="/weather" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Weather</Link></li>
                <li><Link href="/horoscope" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Horoscope</Link></li>
                <li><Link href="/category/sport" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Sports</Link></li>
                <li><Link href="/transport" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Transport</Link></li>
                <li><Link href="/tg-calabria" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">TG Calabria</Link></li>
                <li><Link href="/search" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Search</Link></li>
                <li><Link href="/bookmarks" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Bookmarks</Link></li>
                <li><Link href="/report" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Report</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="flex flex-col">
              <h4 className="font-black mb-4 text-[#FFFFFF] text-sm uppercase tracking-wide">
                Categories
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/category/italy" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Italy | World</Link></li>
                <li><Link href="/category/news" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">News</Link></li>
                <li><Link href="/category/politics" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Politics</Link></li>
                <li><Link href="/category/sport" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Sport</Link></li>
                <li><Link href="/category/business" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Business</Link></li>
                <li><Link href="/category/entertainment" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Entertainment</Link></li>
                <li><Link href="/category/culture-lifestyle" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Culture and Lifestyle</Link></li>
                <li><Link href="/category/health-science" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Health and Science</Link></li>
                <li><Link href="/category/technology" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Technology and Digital Media</Link></li>
              </ul>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <h4 className="font-black mb-4 text-[#FFFFFF] text-sm uppercase tracking-wide">
                Content
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/latest-news" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Latest News</Link></li>
                <li><Link href="/breaking-news" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Breaking News</Link></li>
                <li><Link href="/videos" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Videos</Link></li>
              </ul>
            </div>

            {/* Regional Services */}
            <div className="flex flex-col">
              <h4 className="font-black mb-4 text-[#FFFFFF] text-sm uppercase tracking-wide">
                Regional Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/weather" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Weather</Link></li>
                <li><Link href="/horoscope" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Horoscope</Link></li>
                <li><Link href="/transport" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">Transport</Link></li>
                <li><Link href="/tg-videos" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">TG Videos</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social and App Download Section */}
        <div className="footer__social-and-app px-4 py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Social Links */}
            <div>
              <span className="social-links__copy block text-white font-bold mb-4 text-sm uppercase tracking-wide">
                Calabria
              </span>
              <div className="social-links__items flex gap-4">
                {socialLinks.facebook && (
                  <SocialIcon name="facebook" href={socialLinks.facebook} />
                )}
                {socialLinks.twitter && (
                  <SocialIcon name="twitter" href={socialLinks.twitter} />
                )}
                {socialLinks.instagram && (
                  <SocialIcon name="instagram" href={socialLinks.instagram} />
                )}
                {socialLinks.youtube && (
                  <SocialIcon name="youtube" href={socialLinks.youtube} />
                )}
              </div>
            </div>

            {/* App Download */}
            <div className="footer__app-download text-center md:text-right">
              <span className="footer__app-download-copy block text-white font-bold mb-4 text-sm uppercase tracking-wide">
                Download the calabria app
              </span>
              <div className="footer__app-download-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
                <a 
                  href="https://cnn.onelink.me/PVpf/q9j1odhf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__app-download-link inline-block"
                >
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="black"/>
                    <text x="10" y="25" fill="white" fontSize="12" fontWeight="bold">Download on</text>
                    <text x="10" y="35" fill="white" fontSize="16" fontWeight="bold">App Store</text>
                  </svg>
                </a>
                <a 
                  href="https://cnn.onelink.me/PVpf/43qg6lsp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__app-download-link inline-block"
                >
                  <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="black"/>
                    <text x="10" y="25" fill="white" fontSize="12" fontWeight="bold">Get it on</text>
                    <text x="10" y="35" fill="white" fontSize="16" fontWeight="bold">Google Play</text>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile App Download Section */}
        <div className="footer__app-download-section footer__app-download-section--mobile px-4 py-6 border-t border-gray-800 md:hidden">
          <div className="footer__app-download text-center">
            <span className="footer__app-download-copy block text-white font-bold mb-4 text-sm uppercase tracking-wide">
              Download calabria app
            </span>
            <div className="footer__app-download-buttons flex flex-col gap-4">
              <a 
                href="https://cnn.onelink.me/PVpf/q9j1odhf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__app-download-link inline-block"
              >
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  <rect width="120" height="40" rx="8" fill="black"/>
                  <text x="10" y="25" fill="white" fontSize="12" fontWeight="bold">Download on</text>
                  <text x="10" y="35" fill="white" fontSize="16" fontWeight="bold">App Store</text>
                </svg>
              </a>
              <a 
                href="https://cnn.onelink.me/PVpf/43qg6lsp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__app-download-link inline-block"
              >
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  <rect width="120" height="40" rx="8" fill="black"/>
                  <text x="10" y="25" fill="white" fontSize="12" fontWeight="bold">Get it on</text>
                  <text x="10" y="35" fill="white" fontSize="16" fontWeight="bold">Google Play</text>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-0" />

        {/* Legal Links */}
        <nav className="footer__links px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
            <Link href="/terms" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Terms of Use
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/privacy" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/data-deletion" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Data Deletion
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/cookies" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Manage Cookies
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/advertise" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Ad Choices
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/accessibility" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Accessibility & CC
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/about" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              About
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/newsletters" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Newsletters
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/transcripts" className="text-[#999999] hover:text-[#FFFFFF] transition-colors">
              Transcripts
            </Link>
          </div>
        </nav>

        {/* Copyright */}
        <div className="px-4 py-6 text-center">
          <p className="footer__copyright-text text-xs text-[#999999] mb-2">
            © 2026 Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved.
          </p>
          <p className="text-xs text-[#666666]">
            CNN Sans ™ & © 2016 Cable News Network.
          </p>
        </div>
      </div>
    </footer>
  );
}
