"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/events";

/** Dispara view_services quando a seção de serviços fica visível. */
export function ServicesViewTracker() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("view_services");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} hidden />;
}
