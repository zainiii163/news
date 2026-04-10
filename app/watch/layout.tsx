import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/watch-page.css";

export const metadata: Metadata = {
  title: "Watch | TG Calabria",
  description:
    "Video reports and clips from TG Calabria — regional news, Italy, and the world.",
};

export default function WatchLayout({ children }: { children: ReactNode }) {
  return children;
}
