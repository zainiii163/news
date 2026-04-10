import type { News } from "@/types/news.types";
import { isYouTubeUrl } from "@/lib/helpers/youtube";

/** True if the story is treated as video (YouTube or direct video file on mainImage). */
export function isNewsVideo(n: News): boolean {
  if (n.youtubeUrl?.trim() && isYouTubeUrl(n.youtubeUrl)) return true;
  const m = n.mainImage?.trim();
  if (!m) return false;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(m);
}

/** Published video stories, newest first. */
export function filterVideoNews(news: News[]): News[] {
  return news.filter(isNewsVideo).sort((a, b) => {
    const ta = new Date(a.publishedAt || a.createdAt).getTime();
    const tb = new Date(b.publishedAt || b.createdAt).getTime();
    return tb - ta;
  });
}
