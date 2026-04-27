// 3D section icons — eagerly imported so Vite bundles & hashes them.
import htmlBasics from "@/assets/icons/html-basics.png";
import cssBasics from "@/assets/icons/css-basics.png";
import flexboxFrogger from "@/assets/icons/flexbox-frogger.png";
import gridGarden from "@/assets/icons/grid-garden.png";
import cssAnimations from "@/assets/icons/css-animations.png";
import basics from "@/assets/icons/basics.png";
import conditionals from "@/assets/icons/conditionals.png";
import loops from "@/assets/icons/loops.png";
import dom from "@/assets/icons/dom.png";
import events from "@/assets/icons/events.png";
import functions from "@/assets/icons/functions.png";
import functional from "@/assets/icons/functional.png";
import arrays from "@/assets/icons/arrays.png";
import strings from "@/assets/icons/strings.png";
import advancedRegex from "@/assets/icons/advanced-regex.png";
import domAdvanced from "@/assets/icons/dom-advanced.png";
import observers from "@/assets/icons/observers.png";
import errors from "@/assets/icons/errors.png";
import async from "@/assets/icons/async.png";
import fetchIcon from "@/assets/icons/fetch.png";
import prototypes from "@/assets/icons/prototypes.png";
import oop from "@/assets/icons/oop.png";
import solid from "@/assets/icons/solid.png";
import dataStructures from "@/assets/icons/data-structures.png";
import algorithms from "@/assets/icons/algorithms.png";
import modules from "@/assets/icons/modules.png";
import concurrency from "@/assets/icons/concurrency.png";
import patterns from "@/assets/icons/patterns.png";
import performance from "@/assets/icons/performance.png";
import tdd from "@/assets/icons/tdd.png";
import { cn } from "@/lib/utils";

export const SECTION_ICONS: Record<string, string> = {
  "html-basics": htmlBasics,
  "css-basics": cssBasics,
  "flexbox-frogger": flexboxFrogger,
  "grid-garden": gridGarden,
  "css-animations": cssAnimations,
  basics,
  conditionals,
  loops,
  dom,
  events,
  functions,
  functional,
  arrays,
  strings,
  "advanced-regex": advancedRegex,
  "dom-advanced": domAdvanced,
  observers,
  errors,
  async,
  fetch: fetchIcon,
  prototypes,
  oop,
  solid,
  "data-structures": dataStructures,
  algorithms,
  modules,
  concurrency,
  patterns,
  performance,
  tdd,
};

interface SectionIconProps {
  sectionId: string;
  fallbackEmoji?: string;
  alt?: string;
  className?: string;
}

/** Renders the cohesive 3D icon for a section, falling back to an emoji span. */
export function SectionIcon({ sectionId, fallbackEmoji, alt, className }: SectionIconProps) {
  const src = SECTION_ICONS[sectionId];
  if (!src) {
    return (
      <span className={cn("inline-block leading-none", className)} aria-hidden={!alt}>
        {fallbackEmoji ?? "✨"}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      width={512}
      height={512}
      loading="lazy"
      decoding="async"
      className={cn("object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.35)]", className)}
    />
  );
}
