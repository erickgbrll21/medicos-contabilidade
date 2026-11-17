"use client";

import { useEffect } from "react";
import { loadAnalyticsScripts } from "@/components/analytics/Analytics";
import { captureAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/events";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

let started = false;

function startMeasurement() {
  if (started || readConsent() !== "accepted") return;
  started = true;
  loadAnalyticsScripts();
  captureAttribution();
  track("page_view", { page_location: window.location.href, page_title: document.title });
}

export function AnalyticsBootstrap() {
  useEffect(() => {
    startMeasurement();
    window.addEventListener(CONSENT_EVENT, startMeasurement);
    return () => window.removeEventListener(CONSENT_EVENT, startMeasurement);
  }, []);
  return null;
}
