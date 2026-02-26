"use client";

import { ActivityTimeline } from "@/components/admin/charts/activity-timeline";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ActivityTimelineSectionProps {
  activities: ActivityItem[];
}

export function ActivityTimelineSection({ activities }: ActivityTimelineSectionProps) {
  // Ensure activities is an array
  const activitiesArray = Array.isArray(activities) ? activities : [];

  return (
    <div className="bg-white rounded-none shadow-none p-4">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">Recent Activity (Last 24 Hours)</h3>
      <ActivityTimeline activities={activitiesArray} />
    </div>
  );
}

