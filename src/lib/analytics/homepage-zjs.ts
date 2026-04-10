/**
 * Zion-style data-zjs attributes for homepage editorial links (CNN DOM parity).
 * Safe to spread onto Next.js <Link> — forwarded to the underlying <a>.
 */
export function homepageStoryLinkZjs(
  title: string,
  href: string,
  zone: string
): Record<string, string> {
  const text = title.length > 200 ? `${title.slice(0, 197)}...` : title;
  return {
    "data-zjs": "click",
    "data-zjs-component_type": "link",
    "data-zjs-component_id": href,
    "data-zjs-component_text": text,
    "data-zjs-container_id": `cms.local/_components/homepage/${zone}/instances/main@published`,
    "data-zjs-container_type": "homepage",
    "data-zjs-destination_url": href,
    "data-zjs-page_type": "section",
    "data-zjs-page_variant": "landing_homepage",
  };
}
