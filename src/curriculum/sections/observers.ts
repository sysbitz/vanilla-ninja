import type { Section } from "../types";
import { STAGE_CSS } from "../shared";

export const observersSection: Section = {
  id: "observers",
  title: "Observers & Drag",
  emoji: "👁️",
  blurb: "IntersectionObserver, MutationObserver, drag & drop.",
  levels: [
    {
      id: "obs-1",
      title: "MutationObserver",
      emoji: "🔬",
      difficulty: 3,
      theory: "Watch DOM changes asynchronously with `new MutationObserver(cb).observe(target, options)`.",
      goal: "Observe child additions on #stage. When a child is appended, increment window.added.",
      previewHtml: `<div id="stage" class="stage"></div>`,
      previewCss: STAGE_CSS,
      starterCode: `window.added = 0;\nconst stage = document.getElementById('stage');\n// new MutationObserver(...).observe(stage, { childList:true });\n// then append two children to test\nstage.appendChild(document.createElement('div'));\nstage.appendChild(document.createElement('div'));\n`,
      steps: [
        {
          label: "added becomes 2",
          test: `await new Promise(r=>setTimeout(r,40)); return window.added === 2;`,
        },
      ],
      hints: ["new MutationObserver(muts => muts.forEach(m => window.added += m.addedNodes.length)).observe(stage,{childList:true});"],
      solution: `window.added=0; const stage=document.getElementById('stage');\nnew MutationObserver(ms=>ms.forEach(m=> window.added += m.addedNodes.length)).observe(stage,{childList:true});\nstage.appendChild(document.createElement('div'));\nstage.appendChild(document.createElement('div'));`,
      quiz: [{ q: "MutationObserver callbacks fire…", options: ["sync", "as a microtask", "next tick", "never"], answer: 1 }],
    },
    {
      id: "obs-2",
      title: "IntersectionObserver",
      emoji: "📍",
      difficulty: 3,
      theory: "Detect when an element enters/exits the viewport — perfect for lazy-loading and scroll animations.",
      goal: "Mock IntersectionObserver to immediately fire entry as intersecting. Increment window.seen for each observed element.",
      starterCode: `window.seen = 0;\n// Simulate: just call the callback synchronously per observe.\nclass FakeIO { constructor(cb){ this.cb=cb; } observe(el){ this.cb([{ target: el, isIntersecting: true }]); } }\nwindow.IntersectionObserver = FakeIO;\n\nconst io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) window.seen++; }));\n// observe 3 dummy elements\nfor(let i=0;i<3;i++) io.observe(document.createElement('div'));\n`,
      steps: [
        { label: "window.seen === 3", test: `return window.seen === 3;` },
      ],
      hints: ["Loop and call io.observe()."],
      solution: `// see starter — fully wired`,
      quiz: [{ q: "IntersectionObserver is great for…", options: ["typing latency", "lazy-loading & infinite scroll", "regex", "encryption"], answer: 1 }],
    },
    {
      id: "obs-3",
      title: "Drag-and-Drop Events",
      emoji: "🖱️",
      difficulty: 3,
      theory: "Drag flow: dragstart → dragover (preventDefault!) → drop. Without preventDefault on dragover, drop never fires.",
      goal: "On drop into #target, set window.dropped = true. Wire dragover (preventDefault) and drop handlers.",
      previewHtml: `<div class="stage"><div id="src" draggable="true" class="box">drag</div><div id="target" class="box" style="background:#22d3ee">drop</div></div>`,
      previewCss: STAGE_CSS,
      starterCode: `window.dropped = false;\nconst target = document.getElementById('target');\n// add dragover (preventDefault) and drop (set dropped=true)\n`,
      steps: [
        {
          label: "drop sets window.dropped",
          test: `target.dispatchEvent(new Event('dragover', {cancelable:true, bubbles:true})); target.dispatchEvent(new Event('drop', {cancelable:true, bubbles:true})); return window.dropped === true;`,
        },
      ],
      hints: ["target.addEventListener('dragover', e => e.preventDefault()); target.addEventListener('drop', () => window.dropped = true);"],
      solution: `const target=document.getElementById('target'); window.dropped=false;\ntarget.addEventListener('dragover', e => e.preventDefault());\ntarget.addEventListener('drop', () => window.dropped = true);`,
      quiz: [{ q: "Why preventDefault on dragover?", options: ["styling", "to allow drop to fire", "to stop bubbling", "for accessibility"], answer: 1 }],
    },
    {
      id: "obs-4",
      title: "Custom Events",
      emoji: "📣",
      difficulty: 2,
      theory: "Dispatch your own events with `new CustomEvent('name', { detail })` and listen with addEventListener.",
      goal: "Listen for 'level-up' on window. On dispatch, set window.xp to event.detail.xp. Dispatch one with detail {xp:42}.",
      starterCode: `// window.addEventListener('level-up', ...)\n// window.dispatchEvent(new CustomEvent('level-up', { detail:{xp:42} }));\n`,
      steps: [
        { label: "window.xp === 42", test: `return window.xp === 42;` },
      ],
      hints: ["e.detail.xp"],
      solution: `window.addEventListener('level-up', e => window.xp = e.detail.xp);\nwindow.dispatchEvent(new CustomEvent('level-up', { detail:{xp:42} }));`,
      quiz: [{ q: "Custom event payload lives on…", options: ["e.target", "e.detail", "e.value", "e.data"], answer: 1 }],
    },
  ],
};
