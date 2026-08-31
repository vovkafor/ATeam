"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEvent;
  properties?: AnalyticsProperties;
};

export function TrackLink({ event, properties, onClick, ...props }: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, properties);
        onClick?.(clickEvent);
      }}
    />
  );
}
