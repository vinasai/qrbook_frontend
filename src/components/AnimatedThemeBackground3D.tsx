import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Particles from "./Particles"; // Adjust the path as necessary

export default function AnimatedThemeBackground3D() {
  const [theme, setTheme] = useState("light");

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={theme === "dark" ? 0.5 : 1} />

        <Particles theme={theme} />
        <Environment preset={theme === "dark" ? "night" : "dawn"} />
      </Canvas>
    </div>
  );
}
