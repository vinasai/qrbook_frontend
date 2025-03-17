"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function FloatingPaths({ position }: { position: number }) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768; // Adjust this breakpoint as needed

  const pathCount = isMobile ? 18 : 36;
  const baseWidth = isMobile ? 0.3 : 0.5;

  const paths = Array.from({ length: pathCount }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={baseWidth + path.id * (isMobile ? 0.02 : 0.03)}
            strokeOpacity={0.1 + path.id * (isMobile ? 0.02 : 0.03)}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1],
            }}
            transition={{
              duration:
                (isMobile ? 15 : 20) + Math.random() * (isMobile ? 5 : 10),
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
