"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
}

/** Botão flutuante. Aparece após a primeira dobra para não competir com os CTAs do hero. */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "accepted");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <WhatsAppLink
      trackingId="flutuante"
      aria-label="Conversar com a Fechou Tributo no WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed right-4 z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-accent pr-5 pl-4 text-ink shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)] ring-1 ring-white/15 transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-accent-bright sm:right-6 sm:bottom-6",
        consent ? "bottom-[max(1rem,env(safe-area-inset-bottom))]" : "bottom-[max(13rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <WhatsAppIcon className="size-6" />
      <span className="text-[0.9375rem] font-medium">WhatsApp</span>
    </WhatsAppLink>
  );
}
