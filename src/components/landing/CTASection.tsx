import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";
import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-background py-16 md:py-40 border-t border-border/60 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(167,93,67,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(167,93,67,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <SectionGlow position="center" color="burgundy" className="opacity-40" />
      <Reveal>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 text-foreground drop-shadow-sm">
            Ready to ignite your career?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto font-medium">
            Join the student collaboration platform built for high-achieving builders and creators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full px-4">
            <SpecularButton
              size="lg"
              onClick={() => navigate("/register")}
              autoAnimate
              proximity={500}
              lineColor="#A75D43"
              className="scale-100 sm:scale-110 hover:scale-105 sm:hover:scale-125 transition-transform duration-500 w-full sm:w-auto px-4 sm:px-10 font-bold"
            >
              <span className="flex items-center justify-center whitespace-nowrap w-full">
                Create Your Profile <ArrowRight className="ml-2 w-5 h-5 flex-shrink-0" />
              </span>
            </SpecularButton>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mt-8 md:mt-6 text-muted-foreground hover:text-primary text-sm font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </Reveal>
    </section>
  );
}
