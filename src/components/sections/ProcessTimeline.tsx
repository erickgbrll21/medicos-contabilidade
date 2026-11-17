"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

type Step = { title: string; text: string };

function progressToReached(v: number, total: number) {
  return v <= 0 ? 0 : Math.min(total, Math.floor(v * (total - 1) + 1.0001));
}

/** Linha do tempo desenhada pelo scroll: a linha avança e cada etapa acende quando é alcançada. */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const [reached, setReached] = useState(0);

  // SSR e 1º paint do cliente iguais; Motion/scroll só depois do mount (evita hydration mismatch).
  useEffect(() => {
    setMounted(true);
    setReached(progressToReached(scrollYProgress.get(), steps.length));
  }, [scrollYProgress, steps.length]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(progressToReached(v, steps.length));
  });

  const reduce = mounted && !!reduceMotion;
  const progress = reduce ? 1 : scrollYProgress;
  const isReached = (i: number) => reduce || (mounted && i < reached);

  return (
    <div ref={ref} className="relative mt-16 sm:mt-20">
      {/* Trilho e progresso: vertical no mobile, horizontal no desktop. */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-white/15 lg:hidden">
        {mounted ? (
          <motion.div className="h-full w-full origin-top bg-accent-bright" style={{ scaleY: progress }} />
        ) : (
          <div className="h-full w-full origin-top scale-y-0 bg-accent-bright" />
        )}
      </div>
      <div aria-hidden="true" className="absolute top-[7px] right-0 left-0 hidden h-px bg-white/15 lg:block">
        {mounted ? (
          <motion.div className="h-full w-full origin-left bg-accent-bright" style={{ scaleX: progress }} />
        ) : (
          <div className="h-full w-full origin-left scale-x-0 bg-accent-bright" />
        )}
      </div>

      <ol className="grid gap-6 lg:grid-cols-4 lg:gap-5">
        {steps.map((step, i) => (
          <li key={step.title} className="relative pl-10 lg:pl-0 lg:pt-12">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 left-0 size-[15px] rounded-full border transition-[background-color,border-color,box-shadow] duration-500",
                isReached(i)
                  ? "border-accent-bright bg-accent-bright shadow-[0_0_0_6px_rgb(149_204_28/0.18)]"
                  : "border-white/40 bg-ink",
              )}
            />
            <div
              className={cn(
                "h-full rounded-3xl border p-6 backdrop-blur-sm transition-[background-color,border-color] duration-500",
                isReached(i) ? "border-white/15 bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02]",
              )}
            >
              <p
                className={cn(
                  "font-display inline-flex rounded-full px-3 py-1 text-sm tracking-[0.04em] tabular-nums transition-colors duration-500",
                  isReached(i) ? "bg-accent-bright text-ink" : "bg-white/10 text-white/60",
                )}
              >
                <span className="sr-only">Etapa </span>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-[1.5rem] leading-tight tracking-[-0.015em]">{step.title}</h3>
              <p className="mt-3 max-w-[32ch] text-[1rem] leading-relaxed text-white/65">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
