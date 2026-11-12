"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

export function Header({ logo }: { logo: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "surface-dark fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-white/10" : "border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <a href="#inicio" className="shrink-0 rounded-sm" aria-label="BC Consultores — voltar ao início" onClick={close}>
          {logo}
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.9375rem] text-white/70 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaLink trackingId="header" className={buttonClasses("inverse", "md")}>
              Fale com um especialista
            </CtaLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex size-12 items-center justify-center rounded-sm text-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="surface-dark h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 lg:hidden"
      >
        <nav aria-label="Menu" className="container-page flex h-full flex-col pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ul className="divide-y divide-white/10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close} className="font-display block py-5 text-[1.75rem] tracking-[-0.02em]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-10">
            <CtaLink trackingId="menu_mobile" onClick={close} className={buttonClasses("inverse", "lg")}>
              Fale com um especialista
            </CtaLink>
            <WhatsAppLink trackingId="menu_mobile" onClick={close} className={buttonClasses("outline-light", "lg")}>
              <WhatsAppIcon className="size-5" />
              Conversar no WhatsApp
            </WhatsAppLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
