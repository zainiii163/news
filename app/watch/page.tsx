import { fetchNews } from "@/lib/api/server-api";
import { filterVideoNews } from "@/lib/helpers/video-news";
import { WatchClient } from "./watch-client";

export const revalidate = 60;

export default async function WatchPage() {
  const res = await fetchNews({
    limit: 80,
    status: "PUBLISHED",
  });

  const list = res.success && res.data?.news ? res.data.news : [];
  const videos = filterVideoNews(list);

  return <WatchClient initialVideos={videos} />;
}
