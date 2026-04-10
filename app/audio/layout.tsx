import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Listen | TG Calabria",
  description:
    "TG Calabria audio briefings and shows — regional news, Italy & world, sport, and culture.",
};

export default function AudioLayout({ children }: { children: ReactNode }) {
  return children;
}
