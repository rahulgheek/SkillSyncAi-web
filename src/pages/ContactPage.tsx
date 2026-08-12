import { Navbar, Footer } from "@/components/landing";
import { Button } from "@/components/ui/button";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-foreground font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-24 w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center">
          Get in <span className="font-handwriting text-primary text-6xl md:text-8xl inline-block -rotate-2 -translate-y-2">touch</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 text-center leading-relaxed font-medium">
          Have a question or want to partner with us for your next hackathon? Drop us a message below!
        </p>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-border shadow-[0_8px_40px_rgb(0,0,0,0.08)] relative">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-foreground">Name</label>
              <input type="text" className="h-14 rounded-2xl border border-border px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" placeholder="Your name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-foreground">Email</label>
              <input type="email" className="h-14 rounded-2xl border border-border px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" placeholder="your@email.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-foreground">Message</label>
              <textarea className="h-32 rounded-2xl border border-border p-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" placeholder="How can we help you?" />
            </div>
            
            <Button size="lg" className="h-14 mt-4 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg w-full md:w-auto md:px-12 shadow-lg shadow-primary/30">
              Send Message
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
