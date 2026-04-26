import type { Section } from "../types";

// Flexbox Frogger — guide frogs onto lily pads using justify-content / align-items.
const POND_CSS = `
  body{margin:0;font-family:'JetBrains Mono',monospace;background:linear-gradient(180deg,#0f0f17 0%,#0a2233 100%);color:#f5f5dc;}
  .pond{position:relative;height:300px;margin:24px;border-radius:18px;background:linear-gradient(180deg,#0e3a5c,#072134);box-shadow:inset 0 0 40px rgba(0,0,0,.5);overflow:hidden;}
  .pond::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(34,211,238,.15),transparent 60%);pointer-events:none;}
  .lilies{position:absolute;inset:0;display:flex;}
  .lily{font-size:48px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));}
  .frogs{position:absolute;inset:0;}
  .frog{font-size:48px;transition:all .5s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 4px 6px rgba(0,0,0,.4));}
  .label{position:absolute;top:8px;left:12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.5;}
`;

// Helper: returns true when each .frog is centered (within tol px) on the lily of the same index.
const ALIGN_TEST = (tol = 30) => `
  const frogs=[...document.querySelectorAll('.frog')];
  const lilies=[...document.querySelectorAll('.lily')];
  if(frogs.length!==lilies.length) return false;
  return frogs.every((f,i)=>{
    const a=f.getBoundingClientRect(), b=lilies[i].getBoundingClientRect();
    return Math.abs((a.left+a.width/2)-(b.left+b.width/2))<${tol} && Math.abs((a.top+a.height/2)-(b.top+b.height/2))<${tol};
  });
`;

export const flexboxFroggerSection: Section = {
  id: "flexbox-frogger",
  title: "Flexbox Frogger 🐸",
  emoji: "🐸",
  blurb: "Land each frog on its lily pad with flexbox.",
  levels: [
    {
      id: "frog-1",
      title: "Swim Right",
      emoji: "➡️",
      difficulty: 1,
      language: "css",
      theory: "Flexbox aligns children along the MAIN axis (default: row). `justify-content: flex-end` pushes them to the right.",
      goal: "Move the frog onto the lily pad on the right.",
      previewHtml: `<div class="pond"><span class="label">level 1</span><div class="lilies"><div class="lily" style="position:absolute;right:24px;top:50%;transform:translateY(-50%)">🪷</div></div><div class="frogs"><div class="frog">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* push the frog to the right */\n}\n`,
      steps: [
        { label: "Frog lands on lily pad", test: `const f=document.querySelector('.frog').getBoundingClientRect(); const l=document.querySelector('.lily').getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<40;`, hint: "justify-content: flex-end;" },
      ],
      hints: ["display: flex; justify-content: flex-end;"],
      solution: `.frogs {\n  display: flex;\n  justify-content: flex-end;\n}`,
      quiz: [{ q: "Default flex-direction?", options: ["column", "row", "row-reverse", "wrap"], answer: 1 }],
    },
    {
      id: "frog-2",
      title: "Center Stage",
      emoji: "🎯",
      difficulty: 1,
      language: "css",
      theory: "`justify-content: center` centers along main axis. `align-items: center` centers along cross axis. Together → perfect center.",
      goal: "Place the frog on the centered lily pad (both horizontally AND vertically).",
      previewHtml: `<div class="pond"><span class="label">level 2</span><div class="lilies"><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div></div><div class="frogs"><div class="frog">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* center horizontally and vertically */\n  height: 300px;\n}\n`,
      steps: [
        { label: "Frog centered on lily", test: `const f=document.querySelector('.frog').getBoundingClientRect(); const l=document.querySelector('.lily').getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<40 && Math.abs((f.top+f.height/2)-(l.top+l.height/2))<40;` },
      ],
      hints: ["justify-content: center; align-items: center;"],
      solution: `.frogs {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 300px;\n}`,
      quiz: [{ q: "Which centers on the cross axis?", options: ["justify-content", "align-items", "place-items", "flex-grow"], answer: 1 }],
    },
    {
      id: "frog-3",
      title: "Three Frogs, Three Pads",
      emoji: "🐸🐸🐸",
      difficulty: 2,
      language: "css",
      theory: "`justify-content: space-between` distributes children evenly with the first/last touching edges.",
      goal: "Spread the 3 frogs so each lands on its lily pad (left, center, right).",
      previewHtml: `<div class="pond"><span class="label">level 3</span><div class="lilies"><div class="lily" style="position:absolute;left:24px;top:50%;transform:translateY(-50%)">🪷</div><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div><div class="lily" style="position:absolute;right:24px;top:50%;transform:translateY(-50%)">🪷</div></div><div class="frogs"><div class="frog">🐸</div><div class="frog">🐸</div><div class="frog">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* space them out */\n  align-items: center;\n  height: 300px;\n}\n`,
      steps: [
        { label: "Each frog on its pad", test: ALIGN_TEST(40) },
      ],
      hints: ["justify-content: space-between;"],
      solution: `.frogs {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 300px;\n}`,
      quiz: [{ q: "Equal space AROUND each item?", options: ["space-between", "space-around", "space-evenly", "stretch"], answer: 1 }],
    },
    {
      id: "frog-4",
      title: "Stack Vertically",
      emoji: "🪜",
      difficulty: 2,
      language: "css",
      theory: "`flex-direction: column` flips the main axis to vertical. Now `justify-content` controls the Y axis.",
      goal: "Stack the 3 frogs vertically and spread them between top and bottom of the pond.",
      previewHtml: `<div class="pond"><span class="label">level 4</span><div class="lilies"><div class="lily" style="position:absolute;left:50%;top:24px;transform:translateX(-50%)">🪷</div><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div><div class="lily" style="position:absolute;left:50%;bottom:24px;transform:translateX(-50%)">🪷</div></div><div class="frogs"><div class="frog">🐸</div><div class="frog">🐸</div><div class="frog">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* go vertical & spread */\n  align-items: center;\n  height: 300px;\n}\n`,
      steps: [
        { label: "Frogs stacked on pads", test: ALIGN_TEST(45) },
      ],
      hints: ["flex-direction: column; justify-content: space-between;"],
      solution: `.frogs {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  height: 300px;\n}`,
      quiz: [{ q: "flex-direction: column makes the main axis…", options: ["horizontal", "vertical", "diagonal", "absolute"], answer: 1 }],
    },
    {
      id: "frog-5",
      title: "Reverse the Order",
      emoji: "🔁",
      difficulty: 3,
      language: "css",
      theory: "`flex-direction: row-reverse` reverses the visual order without touching the HTML. Combined with align/justify you can solve tricky layouts.",
      goal: "The frogs are 🐸1 🐸2 🐸3 in markup. The pads expect 3,2,1 (right to left). Reverse the row.",
      previewHtml: `<div class="pond"><span class="label">level 5</span><div class="lilies"><div class="lily" style="position:absolute;left:40px;top:50%;transform:translateY(-50%)">🪷</div><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div><div class="lily" style="position:absolute;right:40px;top:50%;transform:translateY(-50%)">🪷</div></div><div class="frogs"><div class="frog" data-id="1">🐸</div><div class="frog" data-id="2">🐸</div><div class="frog" data-id="3">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* reverse + spread */\n  align-items: center;\n  height: 300px;\n}\n`,
      steps: [
        {
          label: "Frog #1 on RIGHT pad",
          test: `const f=document.querySelector('[data-id="1"]').getBoundingClientRect(); const l=document.querySelectorAll('.lily')[2].getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<50;`,
        },
        {
          label: "Frog #3 on LEFT pad",
          test: `const f=document.querySelector('[data-id="3"]').getBoundingClientRect(); const l=document.querySelectorAll('.lily')[0].getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<50;`,
        },
      ],
      hints: ["flex-direction: row-reverse; justify-content: space-between;"],
      solution: `.frogs {\n  display: flex;\n  flex-direction: row-reverse;\n  justify-content: space-between;\n  align-items: center;\n  height: 300px;\n}`,
      quiz: [{ q: "row-reverse changes…", options: ["the DOM order", "only the visual order", "accessibility tree only", "nothing"], answer: 1 }],
    },
    {
      id: "frog-6",
      title: "Wrap It Up",
      emoji: "📦",
      difficulty: 2,
      language: "css",
      theory: "By default flex items shrink to fit one line. `flex-wrap: wrap` lets them flow to the next row.",
      goal: "There are 6 wide frogs but only room for 3 per row. Wrap them onto two rows.",
      previewHtml: `<div class="pond" style="height:260px"><span class="label">level 6</span><div class="lilies"></div><div class="frogs" style="padding:14px;align-content:flex-start;">${"<div class=\"frog\" style=\"width:30%;text-align:center\">🐸</div>".repeat(6)}</div></div>`,
      previewCss: POND_CSS,
      starterCode: `.frogs {\n  display: flex;\n  /* allow wrapping + spacing */\n}\n`,
      steps: [
        {
          label: "Frogs flow onto 2 rows",
          test: `const frogs=[...document.querySelectorAll('.frog')]; const tops=new Set(frogs.map(f=>Math.round(f.getBoundingClientRect().top))); return tops.size>=2;`,
          hint: "flex-wrap: wrap;",
        },
      ],
      hints: ["display:flex; flex-wrap:wrap;"],
      solution: `.frogs {\n  display: flex;\n  flex-wrap: wrap;\n}`,
      quiz: [{ q: "Default flex-wrap value?", options: ["wrap", "nowrap", "wrap-reverse", "auto"], answer: 1 }],
    },
    {
      id: "frog-7",
      title: "Order Matters",
      emoji: "🔢",
      difficulty: 3,
      language: "css",
      theory: "`order` sets the visual order of a flex item. Default is 0; lower numbers come first; negative is allowed.",
      goal: "Frogs are in DOM order 1,2,3 but pads expect 3,1,2. Reorder with the `order` property — without changing HTML.",
      previewHtml: `<div class="pond"><span class="label">level 7</span><div class="lilies"><div class="lily" style="position:absolute;left:24px;top:50%;transform:translateY(-50%)">🪷</div><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div><div class="lily" style="position:absolute;right:24px;top:50%;transform:translateY(-50%)">🪷</div></div><div class="frogs" style="display:flex;justify-content:space-between;align-items:center;height:300px;"><div class="frog" id="f1">🐸</div><div class="frog" id="f2">🐸</div><div class="frog" id="f3">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `/* Use the order property to put #f3 first, then #f1, then #f2 */\n#f1 { }\n#f2 { }\n#f3 { }\n`,
      steps: [
        {
          label: "#f3 ends up on the LEFT pad",
          test: `const f=document.getElementById('f3').getBoundingClientRect(); const l=document.querySelectorAll('.lily')[0].getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<50;`,
        },
        {
          label: "#f2 ends up on the RIGHT pad",
          test: `const f=document.getElementById('f2').getBoundingClientRect(); const l=document.querySelectorAll('.lily')[2].getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<50;`,
        },
      ],
      hints: ["#f3 { order: -1; } #f2 { order: 1; }"],
      solution: `#f3 { order: -1; }\n#f1 { order: 0; }\n#f2 { order: 1; }`,
      quiz: [{ q: "Default `order` value?", options: ["1", "0", "-1", "auto"], answer: 1 }],
    },
    {
      id: "frog-8",
      title: "Flex Grow",
      emoji: "📏",
      difficulty: 3,
      language: "css",
      theory: "`flex-grow` distributes leftover space. `flex: 1` is shorthand for grow:1, shrink:1, basis:0 — making items share space equally.",
      goal: "Make the middle frog take TWICE the space of the outer two so it lands on the centered lily.",
      previewHtml: `<div class="pond"><span class="label">level 8</span><div class="lilies"><div class="lily" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">🪷</div></div><div class="frogs" style="display:flex;align-items:center;height:300px;"><div class="frog" style="flex:1;text-align:center">🐸</div><div class="frog" id="mid" style="text-align:center">🐸</div><div class="frog" style="flex:1;text-align:center">🐸</div></div></div>`,
      previewCss: POND_CSS,
      starterCode: `#mid {\n  /* take twice as much space */\n}\n`,
      steps: [
        {
          label: "Middle frog centered on lily",
          test: `const f=document.getElementById('mid').getBoundingClientRect(); const l=document.querySelector('.lily').getBoundingClientRect(); return Math.abs((f.left+f.width/2)-(l.left+l.width/2))<50;`,
        },
      ],
      hints: ["#mid { flex: 2; }"],
      solution: `#mid { flex: 2; }`,
      quiz: [{ q: "`flex: 1` means grow…", options: ["never", "equally with siblings", "twice", "fill 100%"], answer: 1 }],
    },
  ],
};
