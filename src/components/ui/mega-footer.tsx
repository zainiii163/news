"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCategories } from "@/lib/hooks/useCategories";
import { AdSlot } from "@/components/ads/ad-slot";
import { CategoryResponse } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";
import {
  categoriesFromApiResponse,
  getRootCategories,
} from "@/lib/helpers/category-helpers";
import { categorySectionHref } from "@/lib/helpers/category-routes";
import { FALLBACK_NAV_LINKS } from "@/lib/hooks/useNavCategoryLinks";

type FooterSubLink = { label: string; href: string };
type FooterSection = {
  key: string;
  title: string;
  href: string;
  subsections: FooterSubLink[];
};

function SocialIcon({ name, href }: { name: string; href?: string }) {
  if (!href) return null;

  const icon = () => {
    switch (name.toLowerCase()) {
      case "facebook":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
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
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "instagram":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "youtube":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
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
      className="text-white/70 transition-colors hover:text-white"
      aria-label={name}
    >
      {icon()}
    </a>
  );
}

const featureSection = (language: "en" | "it"): FooterSection => ({
  key: "section-services",
  title: language === "it" ? "Servizi" : "Services",
  href: "/",
  subsections: [
    {
      label: language === "it" ? "TV Live" : "Live TV",
      href: "/live-tv",
    },
    { label: language === "it" ? "Audio" : "Listen", href: "/audio" },
    { label: language === "it" ? "Guarda" : "Watch", href: "/watch" },
    { label: language === "it" ? "Video" : "Video", href: "/video" },
    { label: language === "it" ? "Podcast" : "Podcasts", href: "/podcasts" },
    {
      label: language === "it" ? "Newsletter" : "Newsletters",
      href: "/newsletters",
    },
    { label: language === "it" ? "Foto" : "Photos", href: "/photos" },
    {
      label: language === "it" ? "Trascrizioni" : "Transcripts",
      href: "/transcripts",
    },
  ],
});

const aboutSection = (language: "en" | "it"): FooterSection => ({
  key: "section-about",
  title: language === "it" ? "Informazioni" : "About",
  href: "/about",
  subsections: [
    { label: language === "it" ? "Chi siamo" : "About Us", href: "/about" },
    { label: language === "it" ? "Contatti" : "Contact", href: "/contact" },
    { label: language === "it" ? "Lavora con noi" : "Careers", href: "/careers" },
    { label: language === "it" ? "Sala stampa" : "Press Room", href: "/press" },
    { label: language === "it" ? "Pubblicità" : "Advertise", href: "/advertise" },
    { label: language === "it" ? "Mappa del sito" : "Sitemap", href: "/sitemap" },
  ],
});

export function MegaFooter() {
  const { language, t } = useLanguage();
  const lang = language === "it" ? "it" : "en";
  const { data: categoriesData } = useCategories(false);
  const [email, setEmail] = useState("");

  const socialLinks = {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
  };

  const categorySections = useMemo((): FooterSection[] => {
    const raw = categoriesFromApiResponse(
      categoriesData as ApiResponse<CategoryResponse> | undefined
    );
    let roots = getRootCategories(raw).filter((c) => c?.slug?.trim());
    roots = [...roots].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (!roots.length) {
      return [
        {
          key: "section-news-fallback",
          title: lang === "it" ? "Notizie" : "News",
          href: "/",
          subsections: FALLBACK_NAV_LINKS.map((l) => ({
            label: lang === "it" ? l.nameIt : l.nameEn,
            href: l.href,
          })),
        },
      ];
    }

    return roots.map((root) => {
      const title =
        lang === "it"
          ? root.nameIt?.trim() || root.nameEn
          : root.nameEn?.trim() || root.slug;
      const href = categorySectionHref(root.slug);
      const children = (root.children ?? [])
        .filter((c) => c?.slug?.trim())
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((c) => ({
          label:
            lang === "it"
              ? c.nameIt?.trim() || c.nameEn
              : c.nameEn?.trim() || c.slug,
          href: categorySectionHref(c.slug),
        }));
      return { key: `cat-${root.id}`, title, href, subsections: children };
    });
  }, [categoriesData, lang]);

  const allSections = useMemo(
    () => [...categorySections, featureSection(lang), aboutSection(lang)],
    [categorySections, lang]
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  const year = new Date().getFullYear();
  const searchPlaceholder =
    lang === "it" ? "Cerca su TG Calabria…" : "Search TG Calabria…";

  return (
    <div className="layout__bottom layout-no-rail__bottom bg-black text-white">
      <div className="cnn-container">
        <div className="border-b border-white/10 bg-neutral-950 py-4">
          <AdSlot slot="FOOTER" />
        </div>

        <footer
          id="pageFooter"
          className="footer border-t border-white/10 pb-10 pt-8"
          data-analytics-aggregate-events="true"
        >
          <div className="footer__inner mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            {/* Search (CNN-style) */}
            <div
              className="search-bar mb-6"
              data-footer-region="search"
            >
              <form
                action="/search"
                method="get"
                role="search"
                className="search-bar__form flex border border-white/25 bg-black"
              >
                <input
                  type="text"
                  name="q"
                  autoComplete="off"
                  placeholder={searchPlaceholder}
                  aria-label={t("nav.search")}
                  className="search-bar__input min-h-[48px] flex-1 border-0 bg-transparent px-4 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  title={t("nav.search")}
                  className="search-bar__submit flex w-12 shrink-0 items-center justify-center bg-[#cc0000] text-white transition-colors hover:bg-[#b30000]"
                  aria-label={t("nav.search")}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4.3-4.3" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile quick links (CNN: Live / Listen / Watch) */}
            <div className="mb-6 flex flex-col gap-3 md:hidden">
              <hr className="border-0 border-t border-white/15" />
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                <Link
                  href="/live-tv"
                  className="text-white/90 hover:text-white"
                >
                  {lang === "it" ? "TV Live" : "Live TV"}
                </Link>
                <Link href="/audio" className="text-white/90 hover:text-white">
                  {lang === "it" ? "Ascolta" : "Listen"}
                </Link>
                <Link href="/watch" className="text-white/90 hover:text-white">
                  {lang === "it" ? "Guarda" : "Watch"}
                </Link>
              </div>
              <hr className="border-0 border-t border-white/15" />
            </div>

            {/* Subnav grid (CNN multi-column) */}
            <nav
              className="subnav footer__subnav mb-8"
              aria-label={lang === "it" ? "Piè di pagina" : "Footer"}
            >
              <ul className="subnav__sections grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {allSections.map((section) => (
                  <li key={section.key} className="subnav__section">
                    <Link
                      href={section.href}
                      className="subnav__section-link mb-3 block text-sm font-bold text-white hover:text-white/90"
                    >
                      {section.title}
                    </Link>
                    {section.subsections.length > 0 ? (
                      <ul className="subnav__subsections space-y-2">
                        {section.subsections.map((sub) => (
                          <li key={sub.href + sub.label} className="subnav__subsection">
                            <Link
                              href={sub.href}
                              className="subnav__subsection-link text-xs leading-snug text-white/65 hover:text-white"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            <hr className="footer__divider mb-8 border-0 border-t border-white/15" />

            {/* Newsletter row */}
            <div className="mb-8 border-b border-white/15 pb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">
                {t("footer.newsletter.title")}
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletter.placeholder")}
                  required
                  className="min-h-[44px] flex-1 border border-white/25 bg-black px-4 text-sm text-white placeholder:text-white/45 focus:border-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[44px] bg-[#cc0000] px-6 text-sm font-bold text-white transition-colors hover:bg-[#b30000]"
                >
                  {t("footer.newsletter.subscribe")}
                </button>
              </form>
            </div>

            {/* Brand row + desktop media links + social + app (CNN-style) */}
            <div className="footer__row mb-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="footer__brand-logo shrink-0">
                <Link
                  href="/"
                  className="brand-logo__logo-link inline-block"
                  title="TG Calabria"
                >
                  <span className="brand-logo__logo text-2xl font-black tracking-tight text-white">
                    TG{" "}
                    <span className="text-[#cc0000]">CALABRIA</span>
                  </span>
                </Link>
                <p className="mt-2 max-w-xs text-xs text-white/55">
                  {t("footer.about.description")}
                </p>
              </div>

              <div className="footer__right flex min-w-0 flex-1 flex-col gap-6 lg:items-end">
                <div className="hidden flex-wrap items-center gap-4 text-sm font-semibold md:flex">
                  <Link
                    href="/watch"
                    className="text-white/90 hover:text-white"
                  >
                    {lang === "it" ? "Guarda" : "Watch"}
                  </Link>
                  <span className="hidden h-4 w-px bg-white/25 lg:inline" />
                  <Link
                    href="/audio"
                    className="text-white/90 hover:text-white"
                  >
                    {lang === "it" ? "Ascolta" : "Listen"}
                  </Link>
                  <span className="hidden h-4 w-px bg-white/25 lg:inline" />
                  <Link
                    href="/live-tv"
                    className="text-white/90 hover:text-white"
                  >
                    {lang === "it" ? "TV Live" : "Live TV"}
                  </Link>
                </div>

                <div className="footer__social-and-app flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-end lg:justify-end">
                  <div className="social-links">
                    <span className="social-links__copy mb-3 block text-xs font-bold uppercase tracking-wider text-white/70">
                      {t("footer.social.follow")}
                    </span>
                    <ul className="social-links__items flex flex-wrap gap-4">
                      {socialLinks.facebook && (
                        <li className="social-links__item">
                          <SocialIcon
                            name="facebook"
                            href={socialLinks.facebook}
                          />
                        </li>
                      )}
                      {socialLinks.twitter && (
                        <li className="social-links__item">
                          <SocialIcon
                            name="twitter"
                            href={socialLinks.twitter}
                          />
                        </li>
                      )}
                      {socialLinks.instagram && (
                        <li className="social-links__item">
                          <SocialIcon
                            name="instagram"
                            href={socialLinks.instagram}
                          />
                        </li>
                      )}
                      {socialLinks.youtube && (
                        <li className="social-links__item">
                          <SocialIcon
                            name="youtube"
                            href={socialLinks.youtube}
                          />
                        </li>
                      )}
                    </ul>
                  </div>

                  <span className="hidden h-10 w-px bg-white/25 sm:inline" />

                  <div className="footer__app-download">
                    <span className="footer__app-download-copy mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                      {lang === "it"
                        ? "Scarica l'app TG Calabria"
                        : "Download the TG Calabria app"}
                    </span>
                    <div className="footer__app-download-buttons flex flex-wrap gap-3">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__app-download-link inline-flex items-center gap-2 rounded border border-white/25 bg-black px-3 py-2 text-xs font-semibold text-white hover:border-white/40"
                        aria-label="App Store"
                      >
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        App Store
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__app-download-link inline-flex items-center gap-2 rounded border border-white/25 bg-black px-3 py-2 text-xs font-semibold text-white hover:border-white/40"
                        aria-label="Google Play"
                      >
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        Google Play
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="footer__divider mb-6 border-0 border-t border-white/15" />

            <nav
              className="footer__links mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center text-xs text-white/60"
              aria-label={lang === "it" ? "Legale" : "Legal"}
            >
              <Link href="/terms" className="hover:text-white">
                {t("footer.legal.termsOfUse")}
              </Link>
              <Link href="/privacy" className="hover:text-white">
                {t("footer.legal.privacyPolicy")}
              </Link>
              <Link href="/cookies" className="hover:text-white">
                {t("footer.legal.manageCookies")}
              </Link>
              <Link href="/advertise" className="hover:text-white">
                {t("footer.legal.adChoices")}
              </Link>
              <Link href="/accessibility" className="hover:text-white">
                {t("footer.legal.accessibility")}
              </Link>
              <Link href="/about" className="hover:text-white">
                {t("footer.legal.about")}
              </Link>
              <Link href="/newsletters" className="hover:text-white">
                {t("footer.legal.newsletters")}
              </Link>
              <Link href="/transcripts" className="hover:text-white">
                {t("footer.legal.transcripts")}
              </Link>
            </nav>

            <p className="footer__copyright-text text-center text-[11px] leading-relaxed text-white/45">
              © {year} TG Calabria. {t("footer.copyright.rightsReserved")}
              <br />
              {lang === "it"
                ? "TG Calabria — notizie dalla Calabria."
                : "TG Calabria — news from Calabria."}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
