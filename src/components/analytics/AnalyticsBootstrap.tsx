"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";

export function AnalyticsBootstrap() {
  useEffect(() => {
    captureAttribution();
    track("page_view", { page_location: window.location.href, page_title: document.title });
  }, []);
  return null;
}
