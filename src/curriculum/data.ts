import type { Section } from "./types";
import { functionsSection } from "./sections/functions";
import { arraysSection } from "./sections/arrays";
import { asyncSection } from "./sections/async";
import { oopSection } from "./sections/oop";
import { solidSection } from "./sections/solid";
import { concurrencySection } from "./sections/concurrency";
import { patternsSection } from "./sections/patterns";
import { stringsSection } from "./sections/strings";
import { errorsSection } from "./sections/errors";
import { prototypesSection } from "./sections/prototypes";
import { modulesSection } from "./sections/modules";
import { domAdvancedSection } from "./sections/dom-advanced";
import { dataStructuresSection } from "./sections/data-structures";
import { fetchSection } from "./sections/fetch";
import { observersSection } from "./sections/observers";
import { performanceSection } from "./sections/performance";
import { advancedRegexSection } from "./sections/advanced-regex";
import { algorithmsSection } from "./sections/algorithms";
import { functionalSection } from "./sections/functional";
import { tddSection } from "./sections/tdd";
import { htmlBasicsSection } from "./sections/html-basics";
import { cssBasicsSection } from "./sections/css-basics";
import { flexboxFroggerSection } from "./sections/flexbox-frogger";
import { gridGardenSection } from "./sections/grid-garden";
import { cssAnimationsSection } from "./sections/css-animations";

/**
 * Default preview shell — a centered "stage" div the student can manipulate.
 * Levels can override `previewHtml` to render custom targets (frogs, balls, grids).
 */
const STAGE_HTML = `
<div id="stage" class="stage">
  <div id="box" class="box"></div>
</div>`;

const STAGE_CSS = `
  body { margin:0; font-family: 'JetBrains Mono', monospace; background: #0f0f17; color:#f5f5dc; }
  .stage { display:flex; align-items:center; justify-content:center; min-height: 260px; padding: 24px; }
  .box { width: 80px; height: 80px; background: #facc15; border-radius: 12px; transition: all .3s ease; }
`;

export const SECTIONS: Section[] = [
  // ───────────────────────────── BASICS ─────────────────────────────
  {
    id: "basics",
    title: "JavaScript Basics",
    emoji: "🌱",
    blurb: "Variables, types and operators — the bedrock.",
    levels: [
      {
        id: "basics-1",
        title: "Hello, Variable",
        emoji: "📦",
        difficulty: 1,
        theory:
          "Variables store data. Use `let` for values that change, `const` for values that never reassign. Avoid `var` — it has confusing scoping rules.",
        goal: "Declare a const named `greeting` with the value 'Hello, JS!' and log it.",
        starterCode: `// Declare 'greeting' below and console.log it\n`,
        steps: [
          {
            label: "greeting equals 'Hello, JS!'",
            test: `typeof greeting !== 'undefined' && greeting === 'Hello, JS!'`,
            hint: "Use: const greeting = 'Hello, JS!';",
          },
          {
            label: "Logged to console",
            test: `__ctx.logs.some(l => String(l).includes('Hello, JS!'))`,
            hint: "Add console.log(greeting);",
          },
        ],
        hints: ["Use const, not let.", "Strings are wrapped in quotes."],
        solution: `const greeting = 'Hello, JS!';\nconsole.log(greeting);`,
        quiz: [
          {
            q: "Which keyword creates a value that cannot be reassigned?",
            options: ["var", "let", "const", "static"],
            answer: 2,
          },
          {
            q: "What does `typeof 'hi'` return?",
            options: ["'text'", "'string'", "'str'", "'object'"],
            answer: 1,
          },
        ],
      },
      {
        id: "basics-2",
        title: "Type Detective",
        emoji: "🔍",
        difficulty: 1,
        theory:
          "JavaScript has primitive types: string, number, boolean, undefined, null, bigint, symbol — plus object. Use `typeof` to inspect.",
        goal: "Create variables `a` (number 42), `b` (string 'cat'), `c` (boolean true). Then log their types.",
        starterCode: `// create a, b, c with the right types\n`,
        steps: [
          { label: "a is number 42", test: `a === 42 && typeof a === 'number'` },
          { label: "b is string 'cat'", test: `b === 'cat' && typeof b === 'string'` },
          { label: "c is boolean true", test: `c === true && typeof c === 'boolean'` },
        ],
        hints: ["No quotes around numbers or booleans."],
        solution: `const a = 42;\nconst b = 'cat';\nconst c = true;\nconsole.log(typeof a, typeof b, typeof c);`,
        quiz: [
          { q: "typeof null is…", options: ["'null'", "'undefined'", "'object'", "'none'"], answer: 2, explain: "Famous JS quirk!" },
        ],
      },
      {
        id: "basics-3",
        title: "Math Lab",
        emoji: "🧮",
        difficulty: 1,
        theory: "Operators: + - * / % **. Be careful: `+` also concatenates strings.",
        goal: "Compute the area of a circle with radius 5 into `area`. Use Math.PI.",
        starterCode: `const r = 5;\n// const area = ...\n`,
        steps: [
          { label: "area ≈ π·r²", test: `Math.abs(area - Math.PI * 25) < 0.0001` },
        ],
        hints: ["area = Math.PI * r ** 2"],
        solution: `const r = 5;\nconst area = Math.PI * r ** 2;\nconsole.log(area);`,
        quiz: [
          { q: "What is 2 ** 5?", options: ["10", "25", "32", "7"], answer: 2 },
          { q: "What does 7 % 3 return?", options: ["2", "1", "0", "2.33"], answer: 1 },
        ],
      },
      {
        id: "basics-4",
        title: "Template Strings",
        emoji: "🧵",
        difficulty: 1,
        theory: "Backticks let you embed expressions: `${'`Hello ${name}`'}`.",
        goal: "Build `msg` = 'I am 7 years old' from variables `name='Sam'` and `age=7`. Format: 'Sam is 7 years old'.",
        starterCode: `const name = 'Sam';\nconst age = 7;\n// const msg = ...\n`,
        steps: [
          { label: "msg matches expected", test: `msg === 'Sam is 7 years old'` },
        ],
        hints: ["Use `${name} is ${age} years old`"],
        solution: "const name = 'Sam';\nconst age = 7;\nconst msg = `${name} is ${age} years old`;\nconsole.log(msg);",
        quiz: [
          { q: "Template strings use which character?", options: ["'", '"', "`", "/"], answer: 2 },
        ],
      },
    ],
  },

  // ───────────────────── CONDITIONALS ─────────────────────
  {
    id: "conditionals",
    title: "Conditionals",
    emoji: "🚦",
    blurb: "Make decisions with if, ternary, and switch.",
    levels: [
      {
        id: "cond-1",
        title: "Traffic Light",
        emoji: "🚥",
        difficulty: 1,
        theory: "`if / else if / else` runs blocks based on conditions.",
        goal: "Write a function `light(color)` that returns 'GO' for 'green', 'SLOW' for 'yellow', 'STOP' for 'red'.",
        previewHtml: `<div class="stage"><div id="lamp" class="lamp"></div><div id="label" class="label">—</div></div>`,
        previewCss: `${STAGE_CSS}\n.lamp{width:100px;height:100px;border-radius:50%;background:#333;box-shadow:0 0 30px #000 inset;}\n.label{margin-left:24px;font-size:28px;font-weight:700;}`,
        starterCode: `function light(color) {\n  // return 'GO' / 'SLOW' / 'STOP'\n}\n\n// demo\nconst colors = ['green','yellow','red'];\nlet i = 0;\nsetInterval(() => {\n  const c = colors[i % 3];\n  document.getElementById('lamp').style.background = c;\n  document.getElementById('label').textContent = light(c);\n  i++;\n}, 700);`,
        steps: [
          { label: "green → GO", test: `light('green') === 'GO'` },
          { label: "yellow → SLOW", test: `light('yellow') === 'SLOW'` },
          { label: "red → STOP", test: `light('red') === 'STOP'` },
        ],
        hints: ["Use if / else if / else, or a switch."],
        solution: `function light(color){\n  if(color==='green') return 'GO';\n  if(color==='yellow') return 'SLOW';\n  if(color==='red') return 'STOP';\n}`,
        quiz: [
          { q: "Which is falsy?", options: ["'0'", "0", "[]", "{}"], answer: 1, explain: "Only the number 0 is falsy here." },
        ],
      },
      {
        id: "cond-2",
        title: "Ternary Twist",
        emoji: "❓",
        difficulty: 1,
        theory: "Ternary: `cond ? a : b` is a compact if/else expression.",
        goal: "Define `parity(n)` returning 'even' or 'odd' using ONE ternary.",
        starterCode: `function parity(n){\n  // return ternary expression\n}\n`,
        steps: [
          { label: "parity(2) === 'even'", test: `parity(2) === 'even'` },
          { label: "parity(7) === 'odd'", test: `parity(7) === 'odd'` },
          { label: "parity(0) === 'even'", test: `parity(0) === 'even'` },
        ],
        hints: ["return n % 2 === 0 ? 'even' : 'odd';"],
        solution: `function parity(n){ return n % 2 === 0 ? 'even' : 'odd'; }`,
        quiz: [
          { q: "Ternary syntax is…", options: ["a ? b : c", "if a then b else c", "a => b : c", "a ?? b : c"], answer: 0 },
        ],
      },
      {
        id: "cond-3",
        title: "Switch Master",
        emoji: "🎛️",
        difficulty: 2,
        theory: "`switch` matches a value against `case` labels. Don't forget `break`!",
        goal: "Implement `dayType(day)` — 'Mon'..'Fri' → 'work', 'Sat'/'Sun' → 'rest', else 'unknown'.",
        starterCode: `function dayType(day){\n  switch(day){\n    // cases here\n  }\n}`,
        steps: [
          { label: "Mon→work", test: `dayType('Mon')==='work'` },
          { label: "Sat→rest", test: `dayType('Sat')==='rest'` },
          { label: "Foo→unknown", test: `dayType('Foo')==='unknown'` },
          { label: "Fri→work", test: `dayType('Fri')==='work'` },
        ],
        hints: ["Use fall-through: case 'Mon': case 'Tue': ... return 'work';"],
        solution: `function dayType(day){\n  switch(day){\n    case 'Mon': case 'Tue': case 'Wed': case 'Thu': case 'Fri': return 'work';\n    case 'Sat': case 'Sun': return 'rest';\n    default: return 'unknown';\n  }\n}`,
        quiz: [
          { q: "Without break, switch will…", options: ["throw", "fall through to next case", "skip default", "loop"], answer: 1 },
        ],
      },
    ],
  },

  // ───────────────────── LOOPS ─────────────────────
  {
    id: "loops",
    title: "Loops & Iteration",
    emoji: "🔁",
    blurb: "Repeat work without repeating yourself.",
    levels: [
      {
        id: "loop-1",
        title: "Sum to N",
        emoji: "➕",
        difficulty: 1,
        theory: "`for (let i = 0; i < n; i++)` — classic counted loop.",
        goal: "Write `sumTo(n)` returning 1+2+…+n.",
        starterCode: `function sumTo(n){\n  // use a for loop\n}\n`,
        steps: [
          { label: "sumTo(5) === 15", test: `sumTo(5) === 15` },
          { label: "sumTo(100) === 5050", test: `sumTo(100) === 5050` },
          { label: "sumTo(0) === 0", test: `sumTo(0) === 0` },
        ],
        hints: ["let total = 0; for(let i=1;i<=n;i++) total += i;"],
        solution: `function sumTo(n){ let s=0; for(let i=1;i<=n;i++) s+=i; return s; }`,
        quiz: [{ q: "Which loop is best when you don't know iterations upfront?", options: ["for", "while", "for...of", "do...while"], answer: 1 }],
      },
      {
        id: "loop-2",
        title: "Bouncing Boxes",
        emoji: "🟨",
        difficulty: 2,
        theory: "Use a loop to create DOM elements dynamically.",
        goal: "Create exactly 10 div.box children inside #stage.",
        previewHtml: `<div id="stage" class="stage" style="flex-wrap:wrap;gap:8px"></div>`,
        previewCss: `${STAGE_CSS}\n.box{width:48px;height:48px;background:linear-gradient(135deg,#facc15,#f59e0b);border-radius:8px;animation:bob 1.2s ease-in-out infinite;}\n@keyframes bob{50%{transform:translateY(-10px);}}`,
        starterCode: `const stage = document.getElementById('stage');\n// create 10 boxes with classList 'box'\n`,
        steps: [
          { label: "Exactly 10 boxes", test: `document.querySelectorAll('#stage .box').length === 10` },
        ],
        hints: ["for(let i=0;i<10;i++){ const d=document.createElement('div'); d.className='box'; stage.appendChild(d); }"],
        solution: `const stage=document.getElementById('stage');\nfor(let i=0;i<10;i++){const d=document.createElement('div');d.className='box';stage.appendChild(d);}`,
        quiz: [{ q: "Which method appends a child?", options: ["add()", "appendChild()", "push()", "insert()"], answer: 1 }],
      },
      {
        id: "loop-3",
        title: "for...of vs for...in",
        emoji: "🔄",
        difficulty: 2,
        theory: "`for...of` iterates **values** (arrays). `for...in` iterates **keys** (objects).",
        goal: "Sum all values of object `prices = {a:10, b:20, c:30}` into `total` using for...in.",
        starterCode: `const prices = {a:10, b:20, c:30};\nlet total = 0;\n// loop here\n`,
        steps: [
          { label: "total === 60", test: `total === 60` },
        ],
        hints: ["for(const key in prices) total += prices[key];"],
        solution: `const prices={a:10,b:20,c:30};let total=0;for(const k in prices) total+=prices[k];`,
        quiz: [{ q: "for...of works on…", options: ["plain objects", "iterables (arrays, strings)", "numbers", "promises"], answer: 1 }],
      },
    ],
  },

  // ───────────────────── DOM ─────────────────────
  {
    id: "dom",
    title: "DOM Manipulation",
    emoji: "🎨",
    blurb: "Bend the page to your will.",
    levels: [
      {
        id: "dom-1",
        title: "Paint the Box",
        emoji: "🎨",
        difficulty: 1,
        theory: "`document.getElementById` selects an element. `.style` sets inline styles.",
        goal: "Make #box background color 'tomato' and width '160px'.",
        previewHtml: STAGE_HTML,
        previewCss: STAGE_CSS,
        starterCode: `const box = document.getElementById('box');\n// change box.style here\n`,
        steps: [
          { label: "background is tomato", test: `getComputedStyle(document.getElementById('box')).backgroundColor === 'rgb(255, 99, 71)'` },
          { label: "width is 160px", test: `document.getElementById('box').style.width === '160px'` },
        ],
        hints: ["box.style.backgroundColor = 'tomato';"],
        solution: `const box=document.getElementById('box');box.style.backgroundColor='tomato';box.style.width='160px';`,
        quiz: [{ q: "Which selects the FIRST match by CSS selector?", options: ["getElementById", "querySelector", "querySelectorAll", "find"], answer: 1 }],
      },
      {
        id: "dom-2",
        title: "Class Wizard",
        emoji: "🧙",
        difficulty: 1,
        theory: "Prefer `classList.add/remove/toggle` over inline styles.",
        goal: "Add the class 'active' to #box.",
        previewHtml: STAGE_HTML,
        previewCss: `${STAGE_CSS}\n.active{transform:rotate(45deg) scale(1.2);background:#22d3ee !important;}`,
        starterCode: `const box = document.getElementById('box');\n// add 'active' class\n`,
        steps: [
          { label: "box has class 'active'", test: `document.getElementById('box').classList.contains('active')` },
        ],
        hints: ["box.classList.add('active');"],
        solution: `document.getElementById('box').classList.add('active');`,
        quiz: [{ q: "classList.toggle does what?", options: ["adds always", "removes always", "adds if missing, removes if present", "errors"], answer: 2 }],
      },
      {
        id: "dom-3",
        title: "Build a List",
        emoji: "📜",
        difficulty: 2,
        theory: "Create elements with `document.createElement` and insert with `appendChild`.",
        goal: "Append 3 <li> with text 'one', 'two', 'three' into #list.",
        previewHtml: `<div class="stage"><ul id="list" class="list"></ul></div>`,
        previewCss: `${STAGE_CSS}\n.list{font-size:22px;list-style:square;color:#facc15;}`,
        starterCode: `const list = document.getElementById('list');\nconst items = ['one','two','three'];\n// build the list\n`,
        steps: [
          { label: "3 <li> children", test: `document.querySelectorAll('#list li').length === 3` },
          { label: "Texts match in order", test: `Array.from(document.querySelectorAll('#list li')).map(l=>l.textContent).join(',') === 'one,two,three'`},
        ],
        hints: ["items.forEach(t => { const li=document.createElement('li'); li.textContent=t; list.appendChild(li); });"],
        solution: `const list=document.getElementById('list');['one','two','three'].forEach(t=>{const li=document.createElement('li');li.textContent=t;list.appendChild(li);});`,
        quiz: [{ q: "Safer than innerHTML for plain text?", options: ["textContent", "innerText", "value", "innerHTML"], answer: 0 }],
      },
    ],
  },

  // ───────────────────── EVENTS (multi-step star level) ─────────────────────
  {
    id: "events",
    title: "Events",
    emoji: "🖱️",
    blurb: "Listen, react, delegate.",
    levels: [
      {
        id: "events-1",
        title: "Click Me",
        emoji: "👆",
        difficulty: 1,
        theory: "`element.addEventListener('click', handler)` runs handler on click.",
        goal: "When #box is clicked, set its background to 'lime'.",
        previewHtml: STAGE_HTML,
        previewCss: STAGE_CSS,
        starterCode: `const box = document.getElementById('box');\n// add a click listener\n`,
        steps: [
          {
            label: "Listener installed",
            test: `(() => { const b=document.getElementById('box'); b.click(); return getComputedStyle(b).backgroundColor === 'rgb(0, 255, 0)'; })()`,
            hint: "box.addEventListener('click', () => box.style.background='lime');",
          },
        ],
        hints: ["Use addEventListener('click', ...)"],
        solution: `document.getElementById('box').addEventListener('click', e => e.target.style.background='lime');`,
        quiz: [{ q: "How to stop a link from navigating?", options: ["return false", "e.stopPropagation()", "e.preventDefault()", "e.cancel()"], answer: 2 }],
      },
      {
        id: "events-2",
        title: "Frog Trainer (multi-step)",
        emoji: "🐸",
        difficulty: 3,
        theory:
          "Big leagues! You'll wire THREE separate behaviors on the frog. Each is graded independently — all must pass to clear the level.",
        goal:
          "1) Click frog → toggles class 'happy'. 2) Spacebar (window keydown) → adds class 'jump'. 3) Mouseover frog → sets text content of #score to 'WOW'.",
        previewHtml: `<div class="stage" style="flex-direction:column;gap:16px"><div id="frog" class="frog">🐸</div><div id="score" class="score">—</div></div>`,
        previewCss: `${STAGE_CSS}\n.frog{font-size:96px;cursor:pointer;transition:transform .25s ease;user-select:none;}\n.frog.happy{filter:drop-shadow(0 0 24px #22c55e);}\n.frog.jump{transform:translateY(-40px) scale(1.1);}\n.score{font-size:24px;font-weight:700;color:#facc15;}`,
        starterCode: `const frog = document.getElementById('frog');\nconst score = document.getElementById('score');\n\n// Step 1: click toggles 'happy'\n\n// Step 2: window keydown (Space) adds 'jump'\n\n// Step 3: mouseover frog sets score text to 'WOW'\n`,
        steps: [
          {
            label: "Step 1 — click toggles 'happy'",
            test: `(() => {
              const f = document.getElementById('frog');
              f.classList.remove('happy');
              f.click();
              const on = f.classList.contains('happy');
              f.click();
              const off = !f.classList.contains('happy');
              return on && off;
            })()`,
            hint: "frog.addEventListener('click', () => frog.classList.toggle('happy'));",
          },
          {
            label: "Step 2 — Space key adds 'jump'",
            test: `(() => {
              const f = document.getElementById('frog');
              f.classList.remove('jump');
              window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
              return f.classList.contains('jump');
            })()`,
            hint: "window.addEventListener('keydown', e => { if(e.code==='Space') frog.classList.add('jump'); });",
          },
          {
            label: "Step 3 — mouseover frog sets score 'WOW'",
            test: `(() => {
              const f = document.getElementById('frog');
              const s = document.getElementById('score');
              s.textContent = '—';
              f.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
              return s.textContent === 'WOW';
            })()`,
            hint: "frog.addEventListener('mouseover', () => score.textContent = 'WOW');",
          },
        ],
        hints: [
          "Each step is independent — wire three listeners.",
          "classList.toggle() flips a class on/off.",
          "For Space, check e.code === 'Space'.",
        ],
        solution: `const frog=document.getElementById('frog');\nconst score=document.getElementById('score');\nfrog.addEventListener('click', ()=> frog.classList.toggle('happy'));\nwindow.addEventListener('keydown', e => { if(e.code==='Space') frog.classList.add('jump'); });\nfrog.addEventListener('mouseover', ()=> score.textContent = 'WOW');`,
        quiz: [
          { q: "Event delegation means…", options: ["one listener on a parent handles many children", "deferring listeners", "using bind", "removing listeners"], answer: 0 },
          { q: "e.stopPropagation prevents…", options: ["default action", "bubbling to ancestors", "the listener", "all events"], answer: 1 },
        ],
      },
    ],
  },
];

// Append advanced sections (kept in separate files for scalability — easy to add 100+ levels).
SECTIONS.push(
  // ── HTML & CSS track (visual, game-like) ──
  htmlBasicsSection,
  cssBasicsSection,
  flexboxFroggerSection,
  gridGardenSection,
  cssAnimationsSection,
  // ── JS track ──
  functionsSection,
  functionalSection,
  arraysSection,
  stringsSection,
  advancedRegexSection,
  domAdvancedSection,
  observersSection,
  errorsSection,
  asyncSection,
  fetchSection,
  prototypesSection,
  oopSection,
  solidSection,
  dataStructuresSection,
  algorithmsSection,
  modulesSection,
  concurrencySection,
  patternsSection,
  performanceSection,
  tddSection,
);

export const ALL_LEVELS = SECTIONS.flatMap(s => s.levels.map(l => ({ section: s, level: l })));
export const TOTAL_LEVELS = ALL_LEVELS.length;
