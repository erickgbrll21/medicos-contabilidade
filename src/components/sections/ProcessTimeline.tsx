"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

type Step = { title: string; text: string };

/** Linha do tempo desenhada pelo scroll: a linha avança e cada etapa acende quando é alcançada. */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(v <= 0 ? 0 : Math.min(steps.length, Math.floor(v * (steps.length - 1) + 1.0001)));
  });

  const progress = reduce ? 1 : scrollYProgress;
  const isReached = (i: number) => reduce || i < reached;

  return (
    <div ref={ref} className="relative mt-16 sm:mt-20">
      {/* Trilho e progresso: vertical no mobile, horizontal no desktop. */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-white/15 lg:hidden">
        <motion.div className="h-full w-full origin-top bg-white" style={{ scaleY: progress }} />
      </div>
      <div aria-hidden="true" className="absolute top-[7px] right-0 left-0 hidden h-px bg-white/15 lg:block">
        <motion.div className="h-full w-full origin-left bg-white" style={{ scaleX: progress }} />
      </div>

      <ol className="grid gap-12 lg:grid-cols-4 lg:gap-8">
      {steps.map((step, i) => (
        <li key={step.title} className="relative pl-10 lg:pl-0 lg:pt-12 lg:pr-4">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-0 left-0 size-[15px] rounded-tl-[5px] border transition-colors duration-500",
              isReached(i) ? "border-white bg-white" : "border-white/40 bg-ink",
            )}
          />
          <p className="font-display text-sm tracking-[0.04em] text-white/50 tabular-nums">
            <span className="sr-only">Etapa </span>
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 text-[1.5rem] leading-tight tracking-[-0.015em]">{step.title}</h3>
          <p className="mt-3 max-w-[32ch] text-[1rem] leading-relaxed text-white/65">{step.text}</p>
        </li>
      ))}
      </ol>
    </div>
  );
}
