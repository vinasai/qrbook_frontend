import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color } from "three";
import { Environment } from "@react-three/drei";

export default function Particles({ theme }) {
  const count = 1000; // Number of particles
  const mesh = useRef();

  // Generate particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // Spread particles horizontally
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // Spread particles vertically
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Spread particles in depth
    }
    return pos;
  }, []);

  // Animate particles
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1;
    mesh.current.rotation.x = Math.cos(t / 4);
    mesh.current.rotation.y = Math.sin(t / 2);
  });

  // Set particle color based on theme
  const particleColor =
    theme === "dark" ? new Color("#4299e1") : new Color("#1a365d");

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05} // Size of particles
        color={particleColor} // Color based on theme
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}
