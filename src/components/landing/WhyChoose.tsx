import { Reveal } from "./Reveal";
import { ChevronLeft, ChevronRight, Brain, FileText, Search, TrendingUp } from "lucide-react";

const PLATFORM_BENEFITS = [
  {
    title: "AI-Powered Matching",
    icon: Brain,
    desc: "No more endless scrolling. Our AI instantly pairs you with teammates whose skills perfectly complement yours.",
    color: "bg-accent",
    textColor: "text-foreground"
  },
  {
    title: "Smart Profiles",
    icon: FileText,
    desc: "Upload your resume and we automatically extract your skills to build a comprehensive developer profile.",
    color: "bg-white",
    textColor: "text-primary"
  },
  {
    title: "Project Discovery",
    icon: Search,
    desc: "Browse innovative hackathon ideas and find the exact developers and designers needed to build them.",
    color: "bg-secondary",
    textColor: "text-primary"
  },
  {
    title: "Career Growth",
    icon: TrendingUp,
    desc: "Turn your hackathon experience into real career growth with personalized AI learning paths.",
    color: "bg-[#7DD3FC]",
    textColor: "text-primary"
  }
];

export function WhyChoose() {
  return (
    <section className="bg-primary py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">

        {/* Floating background graphics */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-accent rounded-full opacity-90 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-10 left-10 opacity-50">
          {/* Sunburst icon */}
          <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" className="text-accent">
            <path d="M50 0 L 55 35 L 90 25 L 65 50 L 90 75 L 55 65 L 50 100 L 45 65 L 10 75 L 35 50 L 10 25 L 45 35 Z" />
          </svg>
        </div>

        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-16 leading-tight max-w-4xl mx-auto">
            We aim to help students <br className="hidden md:block" />
            <span className="font-handwriting text-accent text-5xl md:text-6xl lg:text-[70px] inline-block -rotate-2 -translate-y-2 leading-none mx-2 drop-shadow-md">
              discover the joy of seamless
            </span><br className="hidden md:block" />
            hackathons and grow into top <br /> developers.
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {PLATFORM_BENEFITS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} direction="up" className="w-full max-w-[280px]">
              <div className="flex flex-col items-center group cursor-default h-full">
                <div className={`w-full h-48 md:w-56 md:h-56 rounded-[2rem] ${item.color} p-6 flex flex-col items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 shadow-xl`}>
                  <item.icon className={`w-12 h-12 md:w-16 md:h-16 ${item.textColor} mb-4`} />
                  <h3 className={`text-xl md:text-2xl font-extrabold ${item.textColor} leading-tight px-2 text-center`}>{item.title}</h3>
                </div>
                <p className="text-white/90 font-medium text-center text-sm md:text-base max-w-[240px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}