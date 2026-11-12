"use client";

import { track } from "@/lib/analytics/events";
import { whatsappUrl } from "@/lib/whatsapp/integration";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  trackingId: string;
  message?: string;
};

export function WhatsAppLink({ trackingId, message, onClick, children, ...props }: Props) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        track("click_whatsapp", { origin: trackingId });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
      <span className="sr-only"> (abre o WhatsApp em uma nova aba)</span>
    </a>
  );
}
