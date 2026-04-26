import type { Section } from "../types";

// Grid Garden — water vegetables by placing them on the right grid cells.
const GARDEN_CSS = `
  body{margin:0;font-family:'JetBrains Mono',monospace;background:#0f0f17;color:#f5f5dc;}
  .garden{display:grid;margin:24px;padding:8px;border-radius:14px;background:linear-gradient(180deg,#3a2a16,#1f1408);height:300px;gap:6px;}
  .plot{background:repeating-linear-gradient(45deg,#2a1d10,#2a1d10 8px,#332313 8px,#332313 16px);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:26px;color:rgba(255,255,255,.15);}
  .veg{font-size:42px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5));}
  .water{position:relative;}
  .water::before{content:'';position:absolute;inset:2px;border-radius:6px;background:radial-gradient(circle,rgba(34,211,238,.3),transparent 70%);animation:ripple 2s ease-in-out infinite;}
  @keyframes ripple{50%{transform:scale(1.05);opacity:.7;}}
  .label{font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.5;padding:0 24px;}
`;

// Helper to verify a vegetable's center sits on a target plot's center.
const cellHit = (vegSel: string, plotSel: string, tol = 30) =>
  `const v=document.querySelector('${vegSel}').getBoundingClientRect();const p=document.querySelector('${plotSel}').getBoundingClientRect();return Math.abs((v.left+v.width/2)-(p.left+p.width/2))<${tol}&&Math.abs((v.top+v.height/2)-(p.top+p.height/2))<${tol};`;

export const gridGardenSection: Section = {
  id: "grid-garden",
  title: "Grid Garden 🥕",
  emoji: "🌱",
  blurb: "Place each vegetable on the right grid cell.",
  levels: [
    {
      id: "grid-1",
      title: "First Sprout",
      emoji: "🌱",
      difficulty: 1,
      language: "css",
      theory: "`grid-column-start: N` places an item starting at column line N. Lines are numbered 1, 2, 3… from left.",
      goal: "Move the carrot 🥕 to column 3 (the third plot from the left).",
      previewHtml: `<div class="garden" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr;"><div class="plot">1</div><div class="plot">2</div><div class="plot water" data-target>3</div><div class="plot">4</div><div class="veg" id="carrot">🥕</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#carrot {\n  /* place on column 3 */\n}\n`,
      steps: [
        { label: "Carrot on plot 3", test: cellHit("#carrot", "[data-target]", 35) },
      ],
      hints: ["grid-column-start: 3;"],
      solution: `#carrot { grid-column-start: 3; }`,
      quiz: [{ q: "Grid lines start at…", options: ["0", "1", "-1", "any"], answer: 1 }],
    },
    {
      id: "grid-2",
      title: "End the Row",
      emoji: "🍅",
      difficulty: 1,
      language: "css",
      theory: "`grid-column: start / end` is shorthand. Negative numbers count from the end: -1 is the last line.",
      goal: "Send the tomato 🍅 to the LAST column using a negative line number.",
      previewHtml: `<div class="garden" style="grid-template-columns:repeat(5,1fr);grid-template-rows:1fr;"><div class="plot">1</div><div class="plot">2</div><div class="plot">3</div><div class="plot">4</div><div class="plot water" data-target>5</div><div class="veg" id="tomato">🍅</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#tomato {\n  /* use a negative grid line */\n}\n`,
      steps: [
        { label: "Tomato on last plot", test: cellHit("#tomato", "[data-target]", 35) },
      ],
      hints: ["grid-column-start: -2;  /* -1 is past last line */"],
      solution: `#tomato { grid-column-start: -2; }`,
      quiz: [{ q: "Which line is the LAST line of a 4-col grid?", options: ["4", "5", "-1", "0"], answer: 2 }],
    },
    {
      id: "grid-3",
      title: "Span Two Plots",
      emoji: "🌽",
      difficulty: 2,
      language: "css",
      theory: "Use `span N` to make an item cover N tracks, e.g. `grid-column: 2 / span 2`.",
      goal: "Make the corn 🌽 sit at column 2 and SPAN 2 columns (covering plots 2 and 3).",
      previewHtml: `<div class="garden" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr;"><div class="plot">1</div><div class="plot water" data-target1>2</div><div class="plot water" data-target2>3</div><div class="plot">4</div><div class="veg" id="corn">🌽</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#corn {\n  /* start at col 2, span 2 */\n}\n`,
      steps: [
        { label: "Corn covers plots 2-3", test: `const v=document.querySelector('#corn').getBoundingClientRect(); const a=document.querySelector('[data-target1]').getBoundingClientRect(); const b=document.querySelector('[data-target2]').getBoundingClientRect(); const cx=(v.left+v.width/2); return cx > a.left-10 && cx < b.right+10 && Math.abs(cx - (a.left+b.right)/2) < 50;` },
      ],
      hints: ["grid-column: 2 / span 2;"],
      solution: `#corn { grid-column: 2 / span 2; }`,
      quiz: [{ q: "What does `span 3` mean?", options: ["jump 3", "cover 3 tracks", "skip 3", "row 3"], answer: 1 }],
    },
    {
      id: "grid-4",
      title: "Two Dimensions",
      emoji: "🥦",
      difficulty: 3,
      language: "css",
      theory: "Combine `grid-row` and `grid-column` to position in 2D. Shorthand: `grid-area: rowStart / colStart / rowEnd / colEnd;`.",
      goal: "Plant the broccoli 🥦 in row 2, column 3.",
      previewHtml: `<div class="garden" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);"><div class="plot">1,1</div><div class="plot">1,2</div><div class="plot">1,3</div><div class="plot">2,1</div><div class="plot">2,2</div><div class="plot water" data-target>2,3</div><div class="veg" id="broccoli">🥦</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#broccoli {\n  /* row 2, column 3 */\n}\n`,
      steps: [
        { label: "Broccoli at (2,3)", test: cellHit("#broccoli", "[data-target]", 35) },
      ],
      hints: ["grid-row-start: 2; grid-column-start: 3;"],
      solution: `#broccoli {\n  grid-row-start: 2;\n  grid-column-start: 3;\n}`,
      quiz: [{ q: "grid-area shorthand order is…", options: ["col / row / col / row", "row-start / col-start / row-end / col-end", "x / y / w / h", "start / end"], answer: 1 }],
    },
    {
      id: "grid-5",
      title: "Repeat & fr",
      emoji: "🔁",
      difficulty: 2,
      language: "css",
      theory: "`repeat(N, 1fr)` creates N equal-width columns. The `fr` unit splits leftover space.",
      goal: "Define the garden's columns: 4 equal columns using repeat() and fr.",
      previewHtml: `<div class="garden" id="g" style="grid-template-rows:1fr;"><div class="plot">1</div><div class="plot">2</div><div class="plot">3</div><div class="plot">4</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#g {\n  /* grid-template-columns using repeat() */\n}\n`,
      steps: [
        {
          label: "Has 4 equal-width columns",
          test: `const cols=getComputedStyle(document.getElementById('g')).gridTemplateColumns.split(' ').filter(Boolean); if(cols.length!==4) return false; const w=parseFloat(cols[0]); return cols.every(c => Math.abs(parseFloat(c)-w) < 1);`,
        },
      ],
      hints: ["grid-template-columns: repeat(4, 1fr);"],
      solution: `#g {\n  grid-template-columns: repeat(4, 1fr);\n}`,
      quiz: [{ q: "1fr means…", options: ["1 pixel", "1 fragment", "one fraction of remaining space", "1 frame"], answer: 2 }],
    },
    {
      id: "grid-6",
      title: "Named Areas",
      emoji: "🏷️",
      difficulty: 3,
      language: "css",
      theory: "`grid-template-areas` lets you name regions and assign children with `grid-area`. Magical for page layouts.",
      goal: "Lay out a header / sidebar / main / footer page using named areas.",
      previewHtml: `<div class="garden" id="g" style="grid-template-columns:140px 1fr;grid-template-rows:60px 1fr 60px;height:300px;"><div class="plot" id="h">header</div><div class="plot" id="s">sidebar</div><div class="plot" id="m">main</div><div class="plot" id="f">footer</div></div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#g {\n  grid-template-areas:\n    /* "header header" */\n    /* "sidebar main" */\n    /* "footer footer" */;\n}\n#h { grid-area: header; }\n#s { grid-area: sidebar; }\n#m { grid-area: main; }\n#f { grid-area: footer; }\n`,
      steps: [
        {
          label: "Header spans full top row",
          test: `const h=document.getElementById('h').getBoundingClientRect(); const g=document.getElementById('g').getBoundingClientRect(); return Math.abs(h.width-g.width) < 12 && h.top < g.top + 30;`,
        },
        {
          label: "Footer spans full bottom row",
          test: `const f=document.getElementById('f').getBoundingClientRect(); const g=document.getElementById('g').getBoundingClientRect(); return Math.abs(f.width-g.width) < 12 && f.bottom > g.bottom - 30;`,
        },
        {
          label: "Sidebar is narrower than main",
          test: `const s=document.getElementById('s').getBoundingClientRect(); const m=document.getElementById('m').getBoundingClientRect(); return s.width < m.width;`,
        },
      ],
      hints: [`grid-template-areas: "header header" "sidebar main" "footer footer";`],
      solution: `#g {\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n}`,
      quiz: [{ q: "Named areas use which property on children?", options: ["grid-name", "grid-area", "area", "place-self"], answer: 1 }],
    },
    {
      id: "grid-7",
      title: "Auto-fit Magic",
      emoji: "✨",
      difficulty: 3,
      language: "css",
      theory: "`repeat(auto-fit, minmax(MIN, 1fr))` builds a responsive grid that adds/removes columns based on width — no media queries needed.",
      goal: "Make a responsive gallery: as many columns as fit, each at least 80px wide, sharing leftover space equally.",
      previewHtml: `<div class="garden" id="g" style="grid-auto-rows:80px;">${"<div class=\"plot\"></div>".repeat(12)}</div>`,
      previewCss: GARDEN_CSS,
      starterCode: `#g {\n  /* responsive columns */\n}\n`,
      steps: [
        {
          label: "Uses auto-fit + minmax",
          test: `const v=document.getElementById('g').style.gridTemplateColumns + getComputedStyle(document.getElementById('g')).gridTemplateColumns; return /minmax/.test(v) || document.getElementById('__user_css').textContent.match(/auto-fit[\\s\\S]*minmax/);`,
        },
        {
          label: "At least 3 columns visible",
          test: `const cols=getComputedStyle(document.getElementById('g')).gridTemplateColumns.split(' ').filter(Boolean); return cols.length >= 3;`,
        },
      ],
      hints: ["grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));"],
      solution: `#g {\n  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));\n}`,
      quiz: [{ q: "auto-fit vs auto-fill — auto-fit…", options: ["leaves empty tracks", "collapses empty tracks so items stretch", "ignores minmax", "is older syntax"], answer: 1 }],
    },
  ],
};
