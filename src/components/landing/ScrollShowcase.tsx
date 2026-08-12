import { useNavigate } from "react-router-dom";
import ScrollExpand from "@/components/ui/react-bits/ScrollExpand";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";
import { Reveal } from "./Reveal";

export function ScrollShowcase() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-background py-12 md:py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">See the big picture.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Immersive dashboards designed to keep you focused on what matters most: shipping great projects.
            </p>
          </div>
        </Reveal>

        <div
          style={{ height: "70vh" }}
          className="rounded-3xl overflow-hidden border border-border/40 shadow-xl relative"
        >
          <ScrollExpand
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
            alt="Team Collaboration"
            title="Built to scale"
            scrollHint="Scroll to expand"
            mediaZoom={1.2}
            useWindowScroll
          >
            <div className="bg-card/20 backdrop-blur-2xl p-10 rounded-2xl border border-white/10 max-w-2xl text-left shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h2 className="text-4xl font-bold text-foreground mb-4 drop-shadow-md">Every pixel, everywhere</h2>
              <p className="text-xl text-foreground/90 font-medium">
                SkillSync orchestrates your talent pool perfectly across all devices and platforms. Never lose track
                of a candidate again.
              </p>
              <SpecularButton size="md" className="mt-8" onClick={() => navigate("/register")} lineColor="#06B6D4">
                Join the Network
              </SpecularButton>
            </div>
          </ScrollExpand>
        </div>
      </div>
    </section>
  );
}