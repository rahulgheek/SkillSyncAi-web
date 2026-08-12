import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "Learning with Games? Why not!",
    desc: "Embrace the joy of games to enhance your team's learning experience!",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "10 Learning Game Ideas",
    desc: "10 ideas for learning with your team to have fun while building.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Fun Activities for Teams",
    desc: "Want to do something outside the laptop? Here are our recommendations.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
  }
];

export function BlogSection() {
  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <Reveal>
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Read our <span className="font-handwriting text-primary text-5xl md:text-6xl inline-block -rotate-2 -translate-y-1 ml-2">blog</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.15} direction="up">
              <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border group cursor-pointer h-full flex flex-col transition-transform hover:-translate-y-2">
                <div className="h-48 overflow-hidden p-4 pb-0">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3">{post.title}</h3>
                  <p className="text-muted-foreground font-medium mb-6 flex-1">{post.desc}</p>
                  <div className="flex items-center text-primary font-bold text-sm">
                    Read More 
                    <div className="ml-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
