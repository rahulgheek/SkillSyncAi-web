import React from "react";
import { motion } from "framer-motion";

interface InfiniteSliderProps {
  items: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function InfiniteSlider({
  items,
  speed = 40,
  direction = "left",
  className = "",
}: InfiniteSliderProps) {
  return (
    <div className={`overflow-hidden relative flex w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        <div className="flex gap-8 px-4 items-center justify-center">
          {items.map((item, index) => (
            <div key={`item-1-${index}`} className="flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
        <div className="flex gap-8 px-4 items-center justify-center">
          {items.map((item, index) => (
            <div key={`item-2-${index}`} className="flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
