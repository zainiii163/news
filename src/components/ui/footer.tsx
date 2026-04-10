"use client";

import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category } from "@/types/category.types";
import { useState, useMemo } from "react";
import { categorySectionHref } from "@/lib/helpers/category-routes";

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
      className="text-gray-400 hover:text-white transition-colors duration-200"
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
  const [email, setEmail] = useState("");

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  return (
    <div className="layout__bottom layout-no-rail__bottom bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Ad Slot */}
        <div className="py-4 bg-gray-900">
          <AdSlot slot="FOOTER" />
        </div>

        <footer id="pageFooter" className="footer py-12" data-analytics-aggregate-events="true">
          <div className="footer__inner">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              
              {/* TG Calabria Brand */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <Link href="/" className="text-red-600 font-black text-2xl mb-2 block">
                    TG CALABRIA
                  </Link>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Report</p>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Your trusted source for news in Calabria. Stay informed with the latest updates from across the region.
                </p>
                
                {/* Social Media */}
                <div className="flex space-x-4">
                  {socialLinks.facebook && <SocialIcon name="facebook" href={socialLinks.facebook} />}
                  {socialLinks.twitter && <SocialIcon name="twitter" href={socialLinks.twitter} />}
                  {socialLinks.instagram && <SocialIcon name="instagram" href={socialLinks.instagram} />}
                  {socialLinks.youtube && <SocialIcon name="youtube" href={socialLinks.youtube} />}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><Link href={categorySectionHref("world")} className="text-gray-400 hover:text-white transition-colors text-sm">World</Link></li>
                  <li><Link href={categorySectionHref("politics")} className="text-gray-400 hover:text-white transition-colors text-sm">Politics</Link></li>
                  <li><Link href={categorySectionHref("business")} className="text-gray-400 hover:text-white transition-colors text-sm">Business</Link></li>
                  <li><Link href={categorySectionHref("sports")} className="text-gray-400 hover:text-white transition-colors text-sm">Sports</Link></li>
                  <li><Link href={categorySectionHref("entertainment")} className="text-gray-400 hover:text-white transition-colors text-sm">Entertainment</Link></li>
                  <li><Link href={categorySectionHref("technology")} className="text-gray-400 hover:text-white transition-colors text-sm">Technology</Link></li>
                  <li><Link href={categorySectionHref("health")} className="text-gray-400 hover:text-white transition-colors text-sm">Health</Link></li>
                  <li><Link href={categorySectionHref("style")} className="text-gray-400 hover:text-white transition-colors text-sm">Style</Link></li>
                  <li><Link href={categorySectionHref("travel")} className="text-gray-400 hover:text-white transition-colors text-sm">Travel</Link></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><Link href="/live-tv" className="text-gray-400 hover:text-white transition-colors text-sm">Live TV</Link></li>
                  <li><Link href="/audio" className="text-gray-400 hover:text-white transition-colors text-sm">Audio</Link></li>
                  <li><Link href="/watch" className="text-gray-400 hover:text-white transition-colors text-sm">Watch</Link></li>
                  <li><Link href="/newsletters" className="text-gray-400 hover:text-white transition-colors text-sm">Newsletters</Link></li>
                  <li><Link href="/transcripts" className="text-gray-400 hover:text-white transition-colors text-sm">Transcripts</Link></li>
                </ul>
              </div>

              {/* Newsletter Signup */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest news delivered to your inbox
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* App Download Section */}
            <div className="border-t border-gray-800 pt-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Download the TG Calabria App</h3>
                  <p className="text-gray-400 text-sm">Stay connected on the go</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-black hover:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="text-white text-sm">App Store</span>
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-black hover:bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <span className="text-white text-sm">Google Play</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="border-t border-gray-800 pt-8">
              <nav className="footer__links">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-gray-400">
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Use
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Manage Cookies
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/advertise" className="hover:text-white transition-colors">
                    Ad Choices
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/accessibility" className="hover:text-white transition-colors">
                    Accessibility & CC
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/newsletters" className="hover:text-white transition-colors">
                    Newsletters
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/transcripts" className="hover:text-white transition-colors">
                    Transcripts
                  </Link>
                </div>
              </nav>
            </div>

            {/* Copyright */}
            <div className="text-center pt-8 border-t border-gray-800">
              <p className="footer__copyright-text text-xs text-gray-500">
                © 2026 TG Calabria. All Rights Reserved. <br />
                TG Calabria Sans © 2026 TG Calabria.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
