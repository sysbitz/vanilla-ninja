import type { Section } from "../types";

const SHELL_CSS = `
  body{margin:0;font-family:'JetBrains Mono',monospace;background:#0f0f17;color:#f5f5dc;padding:24px;}
  .stage{display:flex;align-items:center;justify-content:center;gap:14px;min-height:240px;}
`;

export const cssBasicsSection: Section = {
  id: "css-basics",
  title: "CSS Foundations",
  emoji: "🎨",
  blurb: "Selectors, the box model, color and units.",
  levels: [
    {
      id: "css-1",
      title: "Color the Box",
      emoji: "🟪",
      difficulty: 1,
      language: "css",
      theory: "Class selectors start with `.classname`. Use `background-color` and `color` to style.",
      goal: "Make .box have a hot pink background and white text.",
      previewHtml: `<div class="stage"><div class="box">Hello</div></div>`,
      previewCss: `${SHELL_CSS}\n.box{padding:30px 40px;border-radius:12px;font-size:24px;font-weight:700;}`,
      starterCode: `.box {\n  /* your styles */\n}\n`,
      steps: [
        { label: "Background is hot pink", test: `getComputedStyle(document.querySelector('.box')).backgroundColor === 'rgb(255, 105, 180)'` },
        { label: "Text is white", test: `getComputedStyle(document.querySelector('.box')).color === 'rgb(255, 255, 255)'` },
      ],
      hints: ["background: hotpink; color: white;"],
      solution: `.box {\n  background: hotpink;\n  color: white;\n}`,
      quiz: [{ q: "What's the class selector for .btn?", options: ["#btn", ".btn", "btn", "*btn"], answer: 1 }],
    },
    {
      id: "css-2",
      title: "Box Model",
      emoji: "📦",
      difficulty: 1,
      language: "css",
      theory: "Every element is a box: content + padding + border + margin. `box-sizing: border-box` makes width include padding & border.",
      goal: "Give .card 24px padding, a 4px solid gold border, and 16px border-radius.",
      previewHtml: `<div class="stage"><div class="card">Card</div></div>`,
      previewCss: `${SHELL_CSS}\n.card{background:#1a1a24;color:#facc15;font-weight:700;}`,
      starterCode: `.card {\n  /* padding, border, border-radius */\n}\n`,
      steps: [
        { label: "Padding 24px", test: `getComputedStyle(document.querySelector('.card')).paddingTop === '24px'` },
        { label: "4px solid gold border", test: `const s=getComputedStyle(document.querySelector('.card')); return s.borderTopWidth==='4px' && s.borderTopStyle==='solid' && s.borderTopColor==='rgb(255, 215, 0)';` },
        { label: "Border-radius 16px", test: `getComputedStyle(document.querySelector('.card')).borderTopLeftRadius === '16px'` },
      ],
      hints: ["padding:24px; border:4px solid gold; border-radius:16px;"],
      solution: `.card {\n  padding: 24px;\n  border: 4px solid gold;\n  border-radius: 16px;\n}`,
      quiz: [{ q: "Which is OUTSIDE the border?", options: ["padding", "margin", "content", "outline-width"], answer: 1 }],
    },
    {
      id: "css-3",
      title: "Hover State",
      emoji: "👆",
      difficulty: 2,
      language: "css",
      theory: "Pseudo-classes like `:hover` apply styles on user interaction. Combine with `transition` for smoothness.",
      goal: "On .btn:hover, make the background 'crimson'. Also add a 0.3s transition on background-color.",
      previewHtml: `<div class="stage"><button class="btn">Hover me</button></div>`,
      previewCss: `${SHELL_CSS}\n.btn{padding:14px 28px;border:0;border-radius:8px;background:#facc15;color:#111;font-size:18px;font-weight:700;cursor:pointer;}`,
      starterCode: `.btn {\n  transition: /* ... */;\n}\n\n.btn:hover {\n  /* ... */\n}\n`,
      steps: [
        { label: "transition includes background-color 0.3s", test: `const t=getComputedStyle(document.querySelector('.btn')).transition; return /background-color/.test(t) && /0\\.3s/.test(t);` },
        {
          label: "Hover background is crimson",
          test: `const sheet=document.getElementById('__user_css').sheet; let found=false; for (const r of sheet.cssRules){ if(r.selectorText && r.selectorText.includes(':hover') && r.style.backgroundColor && (r.style.backgroundColor==='crimson' || r.style.backgroundColor==='rgb(220, 20, 60)')) found=true; } return found;`,
          hint: "Add .btn:hover { background: crimson; }",
        },
      ],
      hints: [".btn{ transition: background-color .3s; }", ".btn:hover{ background: crimson; }"],
      solution: `.btn {\n  transition: background-color .3s;\n}\n.btn:hover {\n  background: crimson;\n}`,
      quiz: [{ q: ":hover is a…", options: ["pseudo-element", "pseudo-class", "media query", "selector list"], answer: 1 }],
    },
    {
      id: "css-4",
      title: "Specificity",
      emoji: "🎯",
      difficulty: 2,
      language: "css",
      theory: "Specificity ranking: inline > id (#) > class (.) > tag. The MORE specific selector wins when rules conflict.",
      goal: "Without changing the HTML, make the text inside #target turn 'limegreen'. There's already a generic rule fighting you — beat it!",
      previewHtml: `<div class="stage"><p id="target" class="text">Color me lime!</p></div>`,
      previewCss: `${SHELL_CSS}\n.text{color:gray;font-size:24px;font-weight:700;}`,
      starterCode: `/* Use a more specific selector */\n`,
      steps: [
        { label: "#target text is limegreen", test: `getComputedStyle(document.getElementById('target')).color === 'rgb(50, 205, 50)'` },
      ],
      hints: ["#target { color: limegreen; }"],
      solution: `#target { color: limegreen; }`,
      quiz: [{ q: "Highest natural specificity?", options: [".class", "tag", "#id", "*"], answer: 2 }],
    },
  ],
};
