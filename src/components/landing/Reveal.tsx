import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export const Reveal = ({ 
  children, 
  width = "100%",
  delay = 0.2,
  direction = "up",
  className = ""
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // Handle directions
  const getHiddenVariant = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 0, x: 0, rotate: -2, scale: 0.98 };
      case "down": return { opacity: 0, y: -75, x: 0 };
      case "left": return { opacity: 0, x: 75, y: 0 };
      case "right": return { opacity: 0, x: -75, y: 0 };
      case "none": return { opacity: 0, y: 0, x: 0 };
      default: return { opacity: 0, y: 0, x: 0, rotate: -2, scale: 0.98 };
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={{
          hidden: getHiddenVariant(),
          visible: { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};
