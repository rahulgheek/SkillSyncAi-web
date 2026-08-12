import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import { PLATFORM_FEATURES } from "./data";
import { SectionGlow } from "./SectionGlow";
import { Reveal } from "./Reveal";
import { InfiniteSlider } from "./InfiniteSlider";

export function FeatureStack() {
  return (
    <section className="bg-background w-full py-12 md:py-32 relative">
      <SectionGlow position="top-left" color="indigo" />
      <div className="mt-10 w-full max-w-5xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build the perfect team.</p>
          </div>
        </Reveal>

        {/* Desktop View: Interactive Scroll Stack */}
        <div className="hidden md:block">
          <ScrollStack
            itemDistance={120}
            itemScale={0.03}
            itemStackDistance={35}
            stackPosition="15%"
            scaleEndPosition="5%"
            baseScale={0.85}
            scaleDuration={0.6}
            rotationAmount={2}
            blurAmount={0}
            useWindowScroll
          >
            {PLATFORM_FEATURES.map((feature) => (
              <ScrollStackItem
                key={feature.title}
                itemClassName="bg-card/20 backdrop-blur-2xl border border-white/10 !p-12 !rounded-[2rem] flex flex-col justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <feature.icon className="h-16 w-16 mb-8 text-accent drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                <h3 className="text-3xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">{feature.description}</p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

        {/* Mobile View: Infinite Slider */}
        <div className="block md:hidden mt-8">
          <Reveal>
            <div className="overflow-hidden">
              <InfiniteSlider
                speed={45}
                items={PLATFORM_FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-card/20 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-center shadow-lg w-[300px] h-[350px] mx-4"
                  >
                    <feature.icon className="h-12 w-12 mb-6 text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <h3 className="text-2xl font-bold mb-3 text-foreground whitespace-normal">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-normal">{feature.description}</p>
                  </div>
                ))}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}