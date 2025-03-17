import { ElegantShape } from "./ElegantShape";

export function DarkAnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 blur-[100px]" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/20"
          className="absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/20"
          className="absolute right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/20"
          className="absolute left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/20"
          className="absolute right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/20"
          className="absolute left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/50 to-transparent pointer-events-none" />
    </div>
  );
}
