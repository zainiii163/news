"use client";

import dynamic from "next/dynamic";

// Dynamically import ad components to avoid SSR issues and chunk loading errors
// Only one ad above the topbar: StickyHeaderAd (TOP_BANNER). SliderAd is rendered
// inside the homepage/hero so we do not duplicate it here.
const StickyHeaderAd = dynamic(() => import("./sticky-header-ad").then(mod => ({ default: mod.StickyHeaderAd })), { ssr: false });
const StickyAd = dynamic(() => import("./sticky-ad").then(mod => ({ default: mod.StickyAd })), { ssr: false });
const PopupAd = dynamic(() => import("./popup-ad").then(mod => ({ default: mod.PopupAd })), { ssr: false });

export function AdsWrapper() {
  return (
    <>
      <StickyHeaderAd />
      <StickyAd />
      <PopupAd />
    </>
  );
}

