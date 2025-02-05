import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Color } from "three"
import { Environment } from "@react-three/drei"

function Particles() {
  const count = 2000
  const mesh = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1
    mesh.current.rotation.x = Math.cos(t / 4)
    mesh.current.rotation.y = Math.sin(t / 2)
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.01} color={new Color("#4299e1")} transparent opacity={0.6} />
    </points>
  )
}

export default function AnimatedBackground3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <Particles />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}

