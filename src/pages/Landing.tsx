import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Trophy, Code2 } from "lucide-react";
import { ALL_LEVELS, SECTIONS } from "@/curriculum/data";
import { useProgress } from "@/hooks/useProgress";

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { completedCount, percent } = useProgress();
  const firstLevel = ALL_LEVELS[0].level.id;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // clearProps ensures elements end with no inline opacity/transform left behind,
      // so even if anything aborts the tween mid-flight the content stays visible.
      gsap.from(".hero-title > span", { y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out", clearProps: "all" });
      gsap.from(".hero-sub", { y: 16, opacity: 0, delay: 0.3, duration: 0.5, clearProps: "all" });
      gsap.from(".hero-cta", { y: 16, opacity: 0, delay: 0.5, duration: 0.5, clearProps: "all" });
      gsap.to(".float-emoji", { y: -16, repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut", stagger: 0.2 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen">
      <Helmet>
        <title>JS Quest — Learn JS with Fun Game | Interactive Vanilla JavaScript Course</title>
        <meta name="description" content="Master vanilla JavaScript through 80+ interactive, gamified challenges. Learn variables, DOM, events, async, and OOP by writing real code in a sandboxed playground." />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="JS Quest — Learn JS with Fun Game" />
        <meta property="og:description" content="Gamified, hands-on vanilla JavaScript challenges from beginner to advanced." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "JS Quest — Learn JavaScript with Fun Game",
          "description": "Interactive, gamified vanilla JavaScript curriculum.",
          "provider": { "@type": "Organization", "name": "JS Quest" }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 pt-24 pb-20 relative">
          <div className="flex justify-center gap-6 mb-8 text-6xl">
            <span className="float-emoji">🐸</span>
            <span className="float-emoji">⚡</span>
            <span className="float-emoji">🟨</span>
            <span className="float-emoji">🎯</span>
            <span className="float-emoji">🚀</span>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-black text-center leading-[1.05] max-w-4xl mx-auto">
            <span className="inline-block">Learn </span>{" "}
            <span className="inline-block gradient-text">JavaScript</span>{" "}
            <span className="inline-block">with </span>{" "}
            <span className="inline-block">a </span>{" "}
            <span className="inline-block">Fun </span>{" "}
            <span className="inline-block gradient-text">Game</span>
          </h1>
          <p className="hero-sub text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            80+ bite-sized, gamified challenges. Pure vanilla JS — no frameworks, no fluff.
            Write real code, watch frogs jump, balls bounce, grids glow.
          </p>
          <div className="hero-cta flex flex-wrap items-center justify-center gap-3 mt-10">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary text-base h-12 px-6">
              <Link to={`/learn/${firstLevel}`}>
                {completedCount > 0 ? "Continue your quest" : "Start playing"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6">
              <a href="#sections">Browse curriculum</a>
            </Button>
          </div>
          {completedCount > 0 && (
            <div className="text-center mt-6 text-xs font-mono text-muted-foreground">
              You're {percent}% through • {completedCount}/{ALL_LEVELS.length} levels cleared
            </div>
          )}
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Code2, title: "Pure Vanilla JS", body: "Every challenge teaches plain JS — no React, no jQuery, no shortcuts." },
          { icon: Zap, title: "Instant Feedback", body: "Sandboxed iframe runs your code on every Run. Multi-step grader points to exactly what failed." },
          { icon: Trophy, title: "Earn Stars", body: "1–3 stars per level based on attempts. Confetti, progress, and unlockable sections." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass rounded-xl p-5 hover:border-primary/40 transition-colors">
            <Icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-bold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      {/* Sections grid */}
      <section id="sections" className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Curriculum
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/learn/${s.levels[0].id}`}
              className="group glass rounded-xl p-5 hover:border-primary/60 hover:shadow-glow-primary transition-all"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{s.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{s.blurb}</p>
              <div className="text-xs font-mono text-primary">{s.levels.length} levels →</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 mt-16 py-8 text-center text-xs text-muted-foreground font-mono">
        Built with vanilla JS love. No frameworks were harmed in your learning.
      </footer>
    </div>
  );
}
