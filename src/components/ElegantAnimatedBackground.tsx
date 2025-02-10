import { ElegantShape } from "./ElegantShape"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === 'dark'

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background blur layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isDarkTheme 
          ? "from-indigo-500/10 via-transparent to-rose-500/10" 
          : "from-indigo-500/15 via-indigo-500/5 to-rose-500/15"
      } blur-[100px]`} />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient={isDarkTheme ? "from-indigo-500/20" : "from-indigo-500/30"}
          className="absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient={isDarkTheme ? "from-rose-500/20" : "from-rose-500/30"}
          className="absolute right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient={isDarkTheme ? "from-violet-500/20" : "from-violet-500/30"}
          className="absolute left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient={isDarkTheme ? "from-amber-500/20" : "from-amber-500/30"}
          className="absolute right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient={isDarkTheme ? "from-cyan-500/20" : "from-cyan-500/30"}
          className="absolute left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        isDarkTheme
          ? "from-[#030303] via-[#030303]/50 to-transparent"
          : "from-white/90 via-white/50 to-transparent"
      } pointer-events-none`} />
    </div>
  )
}