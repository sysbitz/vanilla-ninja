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
  ],
};
