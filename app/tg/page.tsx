"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { VideoGrid } from "@/components/tg/video-grid";
import { useTGVideos } from "@/lib/hooks/useTG";
import { TGVideosResponse } from "@/lib/api/modules/tg.api";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";

// Lazy load heavy video components
const FeaturedVideoSection = dynamic(() => import("@/components/tg/featured-video-section").then((mod) => ({ default: mod.FeaturedVideoSection })), {
  loading: () => <Loading />,
  ssr: false,
});

const LatestVideosCarousel = dynamic(() => import("@/components/tg/latest-videos-carousel").then((mod) => ({ default: mod.LatestVideosCarousel })), {
  loading: () => <Loading />,
  ssr: false,
});

export default function TGPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTGVideos({ page, limit: 12 });

  const videosData = (data as TGVideosResponse | undefined)?.data;
  const videos = videosData?.videos || [];
  const meta = videosData?.meta;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">TG Calabria - Video News</h1>

        {error && <ErrorMessage error={error} className="mb-6" />}

        {/* Featured Video Section */}
        <FeaturedVideoSection />

        {/* Latest Videos Carousel */}
        <LatestVideosCarousel />

        {/* All Videos Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">All Videos</h2>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <VideoGrid videos={videos} />
              {meta && meta.totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}

