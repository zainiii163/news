"use client";

import dynamic from "next/dynamic";

// TOP_BANNER is rendered inside CNNHeaderExact with the nav (single CNN-style sticky stack).
const StickyAd = dynamic(() => import("./sticky-ad").then(mod => ({ default: mod.StickyAd })), { ssr: false });
const PopupAd = dynamic(() => import("./popup-ad").then(mod => ({ default: mod.PopupAd })), { ssr: false });

export function AdsWrapper() {
  return (
    <>
      <StickyAd />
      <PopupAd />
    </>
  );
}

