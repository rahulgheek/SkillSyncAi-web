import { Navbar, Footer } from "@/components/landing";

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-white text-foreground font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Explore <span className="font-handwriting text-accent text-6xl md:text-8xl inline-block -rotate-2 -translate-y-2">Projects</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Discover interactive projects and brilliant minds. Join a team or start your own hackathon project today!
        </p>

        {/* Placeholder grid for explore content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-anti-gravity h-64 flex flex-col justify-end relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20 ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
              <h3 className="text-2xl font-bold mb-2">Project Idea {i + 1}</h3>
              <p className="text-muted-foreground font-medium">Looking for 2 frontend devs and 1 designer.</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
