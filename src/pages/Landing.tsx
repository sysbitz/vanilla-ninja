import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Trophy, Code2 } from "lucide-react";
import { ALL_LEVELS, SECTIONS } from "@/curriculum/data";
import { useProgress } from "@/hooks/useProgress";
import shurikenHero from "@/assets/hero-shuriken.png";
import { SectionIcon } from "@/components/SectionIcon";

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { completedCount, percent } = useProgress();
  const firstLevel = ALL_LEVELS[0].level.id;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title > span", { y: 40, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out", clearProps: "all" });
      gsap.from(".hero-sub", { y: 16, opacity: 0, delay: 0.3, duration: 0.5, clearProps: "all" });
      gsap.from(".hero-cta", { y: 16, opacity: 0, delay: 0.5, duration: 0.5, clearProps: "all" });
      gsap.from(".hero-shuriken", { scale: 0.6, opacity: 0, duration: 1.1, ease: "back.out(1.7)", clearProps: "all" });
      gsap.to(".hero-shuriken", { rotate: 360, duration: 14, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".hero-shuriken", { y: -18, repeat: -1, yoyo: true, duration: 3.2, ease: "sine.inOut" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen">
      <Helmet>
        <title>Vanilla Ninja — Unlock Your Superpower with HTML, CSS & JavaScript</title>
        <meta
          name="description"
          content="Vanilla Ninja: master HTML, CSS and vanilla JavaScript through 100+ gamified, interactive challenges. Hop frogs with Flexbox, water plots with Grid, animate boxes with keyframes — all in your browser."
        />
        <meta
          name="keywords"
          content="vanilla ninja, learn html, learn css, learn javascript, flexbox game, grid garden, css animation tutorial, vanilla js course, interactive coding, web development"
        />
        <link rel="canonical" href="https://js-gamified.lovable.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vanilla Ninja — Unlock Your Superpower with HTML, CSS & JavaScript" />
        <meta
          property="og:description"
          content="Hands-on web-dev dojo: HTML, CSS, Flexbox, Grid, animations and vanilla JavaScript. Write real code, see it run instantly, earn stars."
        />
        <meta property="og:url" content="https://js-gamified.lovable.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vanilla Ninja — Unlock Your Superpower with HTML, CSS & JavaScript" />
        <meta
          name="twitter:description"
          content="100+ visual, gamified challenges covering HTML, CSS, Flexbox, Grid, animations and vanilla JS."
        />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Vanilla Ninja — Unlock Your Superpower with HTML, CSS & JavaScript",
          "description":
            "An interactive, gamified curriculum covering HTML semantics, modern CSS (Flexbox, Grid, animations) and vanilla JavaScript from variables to async, OOP and patterns.",
          "provider": { "@type": "Organization", "name": "Vanilla Ninja", "url": "https://js-gamified.lovable.app/" },
          "educationalLevel": "Beginner to Advanced",
          "teaches": ["HTML", "CSS", "Flexbox", "CSS Grid", "CSS Animations", "JavaScript", "DOM", "Async/Await", "OOP"],
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "inLanguage": "en"
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        {/* radial cyan/blue glow behind shuriken */}
        <div
          className="absolute left-1/2 top-32 -translate-x-1/2 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.45), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 pt-20 pb-20 relative">
          {/* Interactive 3D shuriken — spins continuously, reacts to hover */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              aria-label="Spin the ninja shuriken"
              onClick={(e) => {
                const el = e.currentTarget.querySelector(".hero-shuriken") as HTMLImageElement | null;
                if (!el) return;
                gsap.to(el, { rotate: "+=720", duration: 1.2, ease: "power3.out" });
              }}
              className="group relative h-56 w-56 md:h-72 md:w-72 outline-none"
            >
              <img
                src={shurikenHero}
                alt="Vanilla Ninja glowing 3D shuriken — symbol of front-end mastery"
                width={1024}
                height={1024}
                className="hero-shuriken h-full w-full object-contain drop-shadow-[0_0_60px_hsl(var(--primary)/0.55)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
              />
            </button>
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-black text-center leading-[1.05] max-w-4xl mx-auto">
            <span className="inline-block">Vanilla </span>{" "}
            <span className="inline-block gradient-text">Ninja</span>
            <span className="block text-2xl md:text-4xl font-bold mt-4 text-foreground/90">
              <span className="inline-block">Unlock your </span>{" "}
              <span className="inline-block gradient-text">superpower</span>
            </span>
          </h1>
          <p className="hero-sub text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Train in the dojo of the web. {ALL_LEVELS.length}+ bite-sized HTML, CSS
            and vanilla JavaScript challenges — hop frogs with Flexbox, water plots
            with Grid, animate with keyframes, then ship real JS. No frameworks, no fluff.
          </p>
          <div className="hero-cta flex flex-wrap items-center justify-center gap-3 mt-10">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary text-base h-12 px-6">
              <Link to={`/learn/${firstLevel}`} aria-label={completedCount > 0 ? "Continue training" : "Start training"}>
                {completedCount > 0 ? "Continue training" : "Start training"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6">
              <Link to="/register">Create free account</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 px-6">
              <Link to="/login">Log in</Link>
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
      <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-4" aria-labelledby="why-heading">
        <h2 id="why-heading" className="sr-only">Why Vanilla Ninja</h2>
        {[
          { icon: Code2, title: "Full Front-end Stack", body: "HTML semantics, modern CSS (Flexbox, Grid, animations) and vanilla JavaScript — taught the same way." },
          { icon: Zap, title: "Instant Visual Feedback", body: "Each challenge runs in a sandboxed iframe. See frogs hop, plots water and boxes spin the moment you hit Run." },
          { icon: Trophy, title: "Earn Stars & XP", body: "1–3 stars per level based on attempts. Sign in to sync progress, level up your profile and pick up where you left off." },
        ].map(({ icon: Icon, title, body }) => (
          <article key={title} className="glass rounded-xl p-5 hover:border-primary/40 transition-colors">
            <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-bold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      {/* Sections grid */}
      <section id="sections" className="container mx-auto px-6 py-12" aria-labelledby="curriculum-heading">
        <h2 id="curriculum-heading" className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" /> Curriculum
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          {SECTIONS.length} sections, {ALL_LEVELS.length} levels — start with markup &amp; styling,
          then graduate into the deep end of JavaScript.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/learn/${s.levels[0].id}`}
              className="group glass rounded-xl p-5 hover:border-primary/60 hover:shadow-glow-primary transition-all"
              aria-label={`Start ${s.title}`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">{s.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{s.blurb}</p>
              <div className="text-xs font-mono text-primary">{s.levels.length} levels →</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 mt-16 py-8 text-center text-xs text-muted-foreground font-mono">
        Built with vanilla HTML, CSS &amp; JS. Train hard. Ship harder. 忍
      </footer>
    </div>
  );
}
