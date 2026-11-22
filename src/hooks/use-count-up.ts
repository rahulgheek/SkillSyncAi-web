import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpResult {
  ref: RefObject<HTMLSpanElement | null>;
  display: string;
}

/**
 * Animates the numeric part of a display value once it scrolls into view.
 * Non-numeric prefixes and suffixes (%, x, k+) are preserved.
 */
export function useCountUp(value: string, duration = 1500): CountUpResult {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  const match = value.match(/([\d.]+)/);
  const numericText = match?.[1] ?? "";
  const target = numericText ? Number.parseFloat(numericText) : 0;
  const prefix = match ? value.slice(0, match.index) : value;
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : "";
  const hasDecimals = numericText.includes(".");

  const format = (current: number) =>
    hasDecimals ? current.toFixed(1) : Math.round(current).toString();

  const [current, setCurrent] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!numericText) return;

    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    if (!isInView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, numericText, prefersReducedMotion, target]);

  return {
    ref,
    display: `${prefix}${format(current)}${suffix}`,
  };
}
