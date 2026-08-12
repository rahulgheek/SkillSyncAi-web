import { Navbar, Footer } from "@/components/landing";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-foreground font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full flex flex-col items-center text-center">
        
        <div className="relative mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 relative z-10">
            About <span className="font-handwriting text-primary text-6xl md:text-8xl inline-block rotate-2 -translate-y-2">SkillSync</span>
          </h1>
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-16 font-medium">
          We believe that assembling the perfect team shouldn't be a game of chance. Our AI analyzes your skills and matches you with the exact people you need to build the next big thing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl text-left">
          <div className="bg-secondary rounded-[3rem] p-10 relative overflow-hidden hover-anti-gravity">
            <h3 className="text-3xl font-bold text-primary mb-4">Our Mission</h3>
            <p className="text-primary/80 font-semibold text-lg leading-relaxed">
              To empower students and creators with intelligent matching, eliminating friction and maximizing creative output at hackathons worldwide.
            </p>
          </div>
          <div className="bg-accent rounded-[3rem] p-10 relative overflow-hidden hover-anti-gravity">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-foreground/80 font-semibold text-lg leading-relaxed">
              A world where every brilliant idea immediately finds the collaborative spark it needs to become reality.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
