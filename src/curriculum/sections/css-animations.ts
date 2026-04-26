import type { Section } from "../types";

// cssanimation.io style — make things move with transitions, transforms, keyframes.
const STAGE = `
  body{margin:0;font-family:'JetBrains Mono',monospace;background:radial-gradient(circle at 50% 30%,#1a1a3a,#0f0f17 70%);color:#f5f5dc;height:100vh;overflow:hidden;}
  .stage{display:flex;align-items:center;justify-content:center;height:100vh;}
  .target{width:90px;height:90px;border-radius:14px;background:linear-gradient(135deg,#facc15,#f59e0b);box-shadow:0 10px 30px rgba(250,204,21,.4);}
  .label{position:fixed;bottom:14px;left:0;right:0;text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.5;}
`;

// Helpers to test computed style after a short delay (animation must have started).
const waitAndTest = (ms: number, expr: string) =>
  `await new Promise(r=>setTimeout(r,${ms})); ${expr}`;

export const cssAnimationsSection: Section = {
  id: "css-animations",
  title: "CSS Animations ✨",
  emoji: "✨",
  blurb: "Bring elements to life with transforms, transitions and keyframes.",
  levels: [
    {
      id: "anim-1",
      title: "Spin It",
      emoji: "🌀",
      difficulty: 1,
      language: "css",
      theory: "`transform: rotate(deg)` rotates an element. Combined with `animation` + `@keyframes` it spins forever.",
      goal: "Make the box spin forever (1 full rotation every 2 seconds, linear).",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">spin level</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes spin {\n  /* from 0deg to 360deg */\n}\n\n#t {\n  /* apply animation */\n}\n`,
      steps: [
        {
          label: "Box rotates over time",
          test: waitAndTest(900, `const m1=getComputedStyle(document.getElementById('t')).transform; await new Promise(r=>setTimeout(r,400)); const m2=getComputedStyle(document.getElementById('t')).transform; return m1!==m2 && m1!=='none' && m2!=='none';`),
          hint: "Did you set animation: spin 2s linear infinite?",
        },
      ],
      hints: ["@keyframes spin { to { transform: rotate(360deg); } }", "#t { animation: spin 2s linear infinite; }"],
      solution: `@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n#t {\n  animation: spin 2s linear infinite;\n}`,
      quiz: [{ q: "Which makes an animation loop forever?", options: ["loop", "infinite", "repeat", "forever"], answer: 1 }],
    },
    {
      id: "anim-2",
      title: "Smooth Hover Grow",
      emoji: "📈",
      difficulty: 1,
      language: "css",
      theory: "`transition` interpolates property changes over time. Pair with `:hover` for smooth interactive states.",
      goal: "On :hover scale the box to 1.5×, with a 0.4s ease transition.",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">hover the box</div>`,
      previewCss: STAGE,
      starterCode: `#t {\n  transition: /* ... */;\n}\n#t:hover {\n  /* scale */\n}\n`,
      steps: [
        {
          label: "Transition includes transform 0.4s",
          test: `const t=getComputedStyle(document.getElementById('t')).transition; return /transform/.test(t) && /0\\.4s/.test(t);`,
        },
        {
          label: "Hover scales to 1.5",
          test: `const sheet=document.getElementById('__user_css').sheet; let ok=false; for(const r of sheet.cssRules){ if(r.selectorText && r.selectorText.includes(':hover') && /scale\\(\\s*1\\.5/.test(r.style.transform || '')) ok=true; } return ok;`,
        },
      ],
      hints: ["transition: transform .4s ease;", "#t:hover { transform: scale(1.5); }"],
      solution: `#t {\n  transition: transform .4s ease;\n}\n#t:hover {\n  transform: scale(1.5);\n}`,
      quiz: [{ q: "Which property animates between states?", options: ["animation", "transition", "transform", "filter"], answer: 1 }],
    },
    {
      id: "anim-3",
      title: "Bouncy Ball",
      emoji: "⚽",
      difficulty: 2,
      language: "css",
      theory: "Multi-step `@keyframes` use percentages. `cubic-bezier` lets you craft bouncy easing curves.",
      goal: "Animate the box up 100px and back down on a 1.2s loop named 'bounce' using ease-in-out.",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">bounce!</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes bounce {\n  /* 0%, 50%, 100% */\n}\n#t {\n  /* animation */\n}\n`,
      steps: [
        {
          label: "Box moves vertically",
          test: waitAndTest(300, `const t1=document.getElementById('t').getBoundingClientRect().top; await new Promise(r=>setTimeout(r,500)); const t2=document.getElementById('t').getBoundingClientRect().top; return Math.abs(t2-t1)>20;`),
        },
        {
          label: "Animation named 'bounce' applied",
          test: `getComputedStyle(document.getElementById('t')).animationName === 'bounce'`,
        },
      ],
      hints: ["@keyframes bounce { 50% { transform: translateY(-100px); } }", "animation: bounce 1.2s ease-in-out infinite;"],
      solution: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50%      { transform: translateY(-100px); }\n}\n#t {\n  animation: bounce 1.2s ease-in-out infinite;\n}`,
      quiz: [{ q: "Which timing function bounces hardest?", options: ["linear", "ease", "cubic-bezier(.68,-.55,.27,1.55)", "step-end"], answer: 2 }],
    },
    {
      id: "anim-4",
      title: "Pulse Glow",
      emoji: "💡",
      difficulty: 2,
      language: "css",
      theory: "Animate `box-shadow` and `opacity` together for glowing pulses. Use the `alternate` direction so the keyframes ping-pong.",
      goal: "Create a 'pulse' animation: box-shadow grows from small gold to large gold and back, every 1.5s, alternating.",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">pulse</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes pulse {\n  /* shadow grows */\n}\n#t {\n  /* alternate direction */\n}\n`,
      steps: [
        {
          label: "box-shadow changes over time",
          test: waitAndTest(300, `const s1=getComputedStyle(document.getElementById('t')).boxShadow; await new Promise(r=>setTimeout(r,700)); const s2=getComputedStyle(document.getElementById('t')).boxShadow; return s1!==s2;`),
        },
        {
          label: "Direction is alternate",
          test: `getComputedStyle(document.getElementById('t')).animationDirection === 'alternate'`,
        },
      ],
      hints: ["@keyframes pulse { to { box-shadow: 0 0 60px 20px gold; } }", "animation: pulse 1.5s ease-in-out infinite alternate;"],
      solution: `@keyframes pulse {\n  from { box-shadow: 0 0 0 0 gold; }\n  to   { box-shadow: 0 0 60px 20px gold; }\n}\n#t {\n  animation: pulse 1.5s ease-in-out infinite alternate;\n}`,
      quiz: [{ q: "`alternate` makes the animation…", options: ["restart", "reverse on each iteration", "skip frames", "pause"], answer: 1 }],
    },
    {
      id: "anim-5",
      title: "Flying Entrance",
      emoji: "🚀",
      difficulty: 3,
      language: "css",
      theory: "Combine `translate` + `opacity` + `forwards` (so the final state sticks) for cinematic intros.",
      goal: "Make the box fly in from below (200px down + opacity 0) to its resting place over 0.8s, ease-out, and STAY there.",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">entrance</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes flyIn {\n  /* from below + transparent */\n}\n#t {\n  /* fill-mode forwards */\n}\n`,
      steps: [
        {
          label: "Final opacity is 1 and transform settled",
          test: waitAndTest(1100, `const cs=getComputedStyle(document.getElementById('t')); return parseFloat(cs.opacity) > 0.95 && (cs.transform==='none' || /matrix/.test(cs.transform));`),
        },
        {
          label: "fill-mode forwards used",
          test: `getComputedStyle(document.getElementById('t')).animationFillMode === 'forwards'`,
        },
      ],
      hints: ["@keyframes flyIn { from { transform: translateY(200px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }", "animation: flyIn .8s ease-out forwards;"],
      solution: `@keyframes flyIn {\n  from { transform: translateY(200px); opacity: 0; }\n  to   { transform: translateY(0);     opacity: 1; }\n}\n#t {\n  animation: flyIn .8s ease-out forwards;\n}`,
      quiz: [{ q: "What does `forwards` do?", options: ["plays in reverse", "loops", "keeps the final state", "speeds up"], answer: 2 }],
    },
    {
      id: "anim-6",
      title: "Stagger With Delay",
      emoji: "⏱️",
      difficulty: 2,
      language: "css",
      theory: "`animation-delay` postpones the start. Different delays per child create a staggered cascade.",
      goal: "Three dots should pulse in sequence: dot1 at 0s, dot2 at 0.2s, dot3 at 0.4s. Reuse the same `pulse` keyframes (1s loop).",
      previewHtml: `<div class="stage" style="gap:18px"><div class="target" id="d1" style="width:50px;height:50px;border-radius:50%"></div><div class="target" id="d2" style="width:50px;height:50px;border-radius:50%"></div><div class="target" id="d3" style="width:50px;height:50px;border-radius:50%"></div></div><div class="label">loading dots</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes pulse {\n  /* scale up and back */\n}\n#d1, #d2, #d3 {\n  animation: pulse 1s ease-in-out infinite;\n}\n#d2 { /* delay */ }\n#d3 { /* delay */ }\n`,
      steps: [
        {
          label: "Dot 2 has 0.2s delay",
          test: `getComputedStyle(document.getElementById('d2')).animationDelay === '0.2s'`,
        },
        {
          label: "Dot 3 has 0.4s delay",
          test: `getComputedStyle(document.getElementById('d3')).animationDelay === '0.4s'`,
        },
        {
          label: "Dots animate over time",
          test: waitAndTest(300, `const t1=document.getElementById('d1').getBoundingClientRect().width; await new Promise(r=>setTimeout(r,500)); const t2=document.getElementById('d1').getBoundingClientRect().width; return Math.abs(t2-t1)>3;`),
        },
      ],
      hints: ["@keyframes pulse { 50% { transform: scale(1.4); } }", "#d2{ animation-delay: .2s; } #d3{ animation-delay: .4s; }"],
      solution: `@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%      { transform: scale(1.4); }\n}\n#d1,#d2,#d3 { animation: pulse 1s ease-in-out infinite; }\n#d2 { animation-delay: .2s; }\n#d3 { animation-delay: .4s; }`,
      quiz: [{ q: "Stagger effect uses…", options: ["animation-iteration-count", "animation-delay", "animation-fill-mode", "animation-name"], answer: 1 }],
    },
    {
      id: "anim-7",
      title: "Shake on Error",
      emoji: "💥",
      difficulty: 3,
      language: "css",
      theory: "Quick translateX swings simulate a shake. Use a short duration (~0.4s) and `ease-in-out` for a snappy feel.",
      goal: "Create a 'shake' animation: translateX between -10px and 10px four times over 0.4s, then settle. Apply to the target.",
      previewHtml: `<div class="stage"><div class="target" id="t"></div></div><div class="label">shake</div>`,
      previewCss: STAGE,
      starterCode: `@keyframes shake {\n  /* 0%, 25%, 50%, 75%, 100% */\n}\n#t {\n  animation: shake .4s ease-in-out infinite;\n}\n`,
      steps: [
        {
          label: "Animation name is 'shake'",
          test: `getComputedStyle(document.getElementById('t')).animationName === 'shake'`,
        },
        {
          label: "Target moves horizontally",
          test: waitAndTest(80, `const l1=document.getElementById('t').getBoundingClientRect().left; await new Promise(r=>setTimeout(r,150)); const l2=document.getElementById('t').getBoundingClientRect().left; return Math.abs(l2-l1)>3;`),
        },
      ],
      hints: ["@keyframes shake{ 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }"],
      solution: `@keyframes shake {\n  0%,100% { transform: translateX(0); }\n  25%     { transform: translateX(-10px); }\n  50%     { transform: translateX(10px); }\n  75%     { transform: translateX(-10px); }\n}\n#t { animation: shake .4s ease-in-out infinite; }`,
      quiz: [{ q: "Best easing for a snap-shake?", options: ["linear", "ease-in-out", "step-start", "ease-out"], answer: 1 }],
    },
    {
      id: "anim-8",
      title: "Conic Loader",
      emoji: "⏳",
      difficulty: 3,
      language: "css",
      theory: "Combine `conic-gradient` with `mask` or `border` plus `rotate` to make spinner UIs without images or JS.",
      goal: "Create a circular spinner: rotate the box continuously (1s linear) AND make it a circle with `border-radius: 50%`.",
      previewHtml: `<div class="stage"><div class="target" id="t" style="background:conic-gradient(from 0deg, transparent 0 70%, #facc15 70% 100%);"></div></div><div class="label">loading…</div>`,
      previewCss: STAGE,
      starterCode: `#t {\n  /* circle + spin forever in 1s linear */\n}\n@keyframes spin {\n  /* full rotation */\n}\n`,
      steps: [
        { label: "Border-radius is 50%", test: `getComputedStyle(document.getElementById('t')).borderRadius.includes('50%') || parseFloat(getComputedStyle(document.getElementById('t')).borderTopLeftRadius) > 30` },
        { label: "Animation duration 1s linear", test: `const cs=getComputedStyle(document.getElementById('t')); return cs.animationDuration==='1s' && cs.animationTimingFunction==='linear';` },
        {
          label: "Spinner actually rotates",
          test: waitAndTest(200, `const m1=getComputedStyle(document.getElementById('t')).transform; await new Promise(r=>setTimeout(r,300)); const m2=getComputedStyle(document.getElementById('t')).transform; return m1!==m2;`),
        },
      ],
      hints: ["#t{ border-radius:50%; animation: spin 1s linear infinite; }", "@keyframes spin{ to{ transform: rotate(360deg);} }"],
      solution: `#t {\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}`,
      quiz: [{ q: "Smoothest spinner timing?", options: ["ease", "linear", "ease-out", "step-end"], answer: 1 }],
    },
  ],
};
