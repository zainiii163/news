"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";

const footerSections = [
  {
    title: "News",
    titleIt: "Notizie",
    links: [
      { name: "World", nameIt: "Mondo", href: "/category/world" },
      { name: "Politics", nameIt: "Politica", href: "/category/politics" },
      { name: "Business", nameIt: "Economia", href: "/category/business" },
      { name: "Health", nameIt: "Salute", href: "/category/health" },
      { name: "Entertainment", nameIt: "Intrattenimento", href: "/category/entertainment" },
      { name: "Style", nameIt: "Stile", href: "/category/style" },
      { name: "Travel", nameIt: "Viaggi", href: "/category/travel" },
      { name: "Sports", nameIt: "Sport", href: "/category/sport" },
    ]
  },
  {
    title: "Features",
    titleIt: "Caratteristiche",
    links: [
      { name: "Video", nameIt: "Video", href: "/video" },
      { name: "Live TV", nameIt: "TV Live", href: "/live" },
      { name: "Podcasts", nameIt: "Podcast", href: "/podcasts" },
      { name: "Newsletters", nameIt: "Newsletter", href: "/newsletters" },
      { name: "Photos", nameIt: "Foto", href: "/photos" },
    ]
  },
  {
    title: "About",
    titleIt: "Informazioni",
    links: [
      { name: "About Us", nameIt: "Chi Siamo", href: "/about" },
      { name: "Contact", nameIt: "Contatti", href: "/contact" },
      { name: "Careers", nameIt: "Lavora con noi", href: "/careers" },
      { name: "Press Room", nameIt: "Sala Stampa", href: "/press" },
      { name: "Advertise", nameIt: "Pubblicità", href: "/advertise" },
    ]
  },
  {
    title: "Legal",
    titleIt: "Legale",
    links: [
      { name: "Terms of Service", nameIt: "Termini di Servizio", href: "/terms" },
      { name: "Privacy Policy", nameIt: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", nameIt: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", nameIt: "Accessibilità", href: "/accessibility" },
      { name: "Sitemap", nameIt: "Mappa del Sito", href: "/sitemap" },
    ]
  },
  {
    title: "Connect",
    titleIt: "Connettiti",
    links: [
      { name: "Facebook", nameIt: "Facebook", href: "https://facebook.com/tgcalabria" },
      { name: "Twitter", nameIt: "Twitter", href: "https://twitter.com/tgcalabria" },
      { name: "Instagram", nameIt: "Instagram", href: "https://instagram.com/tgcalabria" },
      { name: "YouTube", nameIt: "YouTube", href: "https://youtube.com/tgcalabria" },
      { name: "LinkedIn", nameIt: "LinkedIn", href: "https://linkedin.com/tgcalabria" },
    ]
  }
];

export function MegaFooter() {
  const { language } = useLanguage();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="cnn-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white/90">
                {language === "it" ? section.titleIt : section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {language === "it" ? link.nameIt : link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="max-w-md">
            <h3 className="text-lg font-black mb-4">
              {language === "it" ? "Iscriviti alla Newsletter" : "Newsletter Signup"}
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {language === "it" 
                ? "Ricevi le ultime notizie direttamente nella tua casella di posta."
                : "Get the latest news delivered directly to your inbox."
              }
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={language === "it" ? "La tua email" : "Your email"}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              />
              <button className="px-6 py-2 bg-red-600 text-white font-black rounded hover:bg-red-700 transition-colors duration-200">
                {language === "it" ? "Iscriviti" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-black mb-2">
                {language === "it" ? "Scarica la nostra App" : "Download Our App"}
              </h3>
              <p className="text-sm text-white/70">
                {language === "it" 
                  ? "Disponibile su iOS e Android"
                  : "Available on iOS and Android"
                }
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-sm font-medium">App Store</span>
                </div>
              </button>
              <button className="px-4 py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h14c.83 0 1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5h-14c-.83 0-1.5-.67-1.5-1.5zm1.5-.5h14v-17h-14v17z"/>
                    <path d="M6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"/>
                  </svg>
                  <span className="text-sm font-medium">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="cnn-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="bg-red-600 text-white px-3 py-1 text-xs font-black rounded">
                TG CALABRIA
              </div>
              <span className="text-sm text-white/50">
                © 2024 TG Calabria. {language === "it" ? "Tutti i diritti riservati." : "All rights reserved."}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/50">
              <span>{language === "it" ? "Parte della rete CNN" : "Part of CNN Network"}</span>
              <div className="flex items-center gap-2">
                <span>{language === "it" ? "Lingua:" : "Language:"}</span>
                <button className="text-white/70 hover:text-white transition-colors">
                  {language === "it" ? "IT" : "EN"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
