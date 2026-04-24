import type { Section } from "../types";
import { STAGE_CSS } from "../shared";

export const domAdvancedSection: Section = {
  id: "dom-advanced",
  title: "DOM & Events Pro",
  emoji: "🖱️",
  blurb: "Delegation, forms, drag, intersection, storage.",
  levels: [
    {
      id: "doma-1",
      title: "Event Delegation",
      emoji: "🎯",
      difficulty: 2,
      theory: "Attach ONE listener on a parent and inspect `event.target` to handle many children efficiently.",
      goal: "On click of any <li> inside #list, set window.lastClicked to that li's text. Use a SINGLE listener on #list.",
      previewHtml: `<div class="stage"><ul id="list" class="list"><li>apple</li><li>banana</li><li>cherry</li></ul></div>`,
      previewCss: `${STAGE_CSS}\n.list{font-size:22px;list-style:square;color:#facc15;cursor:pointer;}`,
      starterCode: `const list = document.getElementById('list');\n// add ONE listener on #list\n`,
      steps: [
        {
          label: "Clicking 'banana' sets window.lastClicked",
          test: `const lis = document.querySelectorAll('#list li'); lis[1].click(); return window.lastClicked === 'banana';`,
          hint: "Inside handler: if(e.target.tagName==='LI') window.lastClicked = e.target.textContent;",
        },
      ],
      hints: ["list.addEventListener('click', e => { if(e.target.tagName==='LI') window.lastClicked = e.target.textContent; });"],
      solution: `document.getElementById('list').addEventListener('click', e => { if(e.target.tagName==='LI') window.lastClicked = e.target.textContent; });`,
      quiz: [{ q: "Delegation reduces…", options: ["accuracy", "number of listeners", "event order", "DOM size"], answer: 1 }],
    },
    {
      id: "doma-2",
      title: "Form Submit + preventDefault",
      emoji: "📝",
      difficulty: 2,
      theory: "Prevent default form submission with `e.preventDefault()` to handle data in JS.",
      goal: "On submit of #f, prevent reload and store input value in window.submitted.",
      previewHtml: `<form id="f" class="stage"><input id="i" value="hello"/><button type="submit">Go</button></form>`,
      previewCss: `${STAGE_CSS}\ninput{padding:8px;border-radius:6px;border:1px solid #444;background:#222;color:#fff;}\nbutton{padding:8px 12px;margin-left:8px;border-radius:6px;background:#facc15;color:#111;border:0;cursor:pointer;}`,
      starterCode: `const f = document.getElementById('f');\n// add a submit listener\n`,
      steps: [
        {
          label: "submit captures input value",
          test: `f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', {cancelable:true})); await new Promise(r=>setTimeout(r,30)); return window.submitted === 'hello';`,
        },
      ],
      hints: ["f.addEventListener('submit', e=>{ e.preventDefault(); window.submitted = document.getElementById('i').value; });"],
      solution: `document.getElementById('f').addEventListener('submit', e=>{ e.preventDefault(); window.submitted = document.getElementById('i').value; });`,
      quiz: [{ q: "preventDefault stops…", options: ["bubbling", "the default browser action", "all listeners", "the event"], answer: 1 }],
    },
    {
      id: "doma-3",
      title: "Keyboard Input",
      emoji: "⌨️",
      difficulty: 2,
      theory: "`keydown` fires on every key. `event.key` is the readable key name ('Enter', 'a', 'ArrowUp').",
      goal: "On window keydown, append event.key into array window.keys (declare it). Test will dispatch 'a'.",
      starterCode: `window.keys = [];\n// add a keydown listener pushing event.key\n`,
      steps: [
        {
          label: "Captures dispatched key 'a'",
          test: `window.dispatchEvent(new KeyboardEvent('keydown', {key:'a'})); return window.keys[window.keys.length-1] === 'a';`,
        },
      ],
      hints: ["window.addEventListener('keydown', e => window.keys.push(e.key));"],
      solution: `window.keys=[]; window.addEventListener('keydown', e => window.keys.push(e.key));`,
      quiz: [{ q: "Which property gives the printable key?", options: ["keyCode", "key", "code", "which"], answer: 1 }],
    },
    {
      id: "doma-4",
      title: "localStorage",
      emoji: "💾",
      difficulty: 1,
      theory: "`localStorage.setItem(k,v)` saves a string per origin. `getItem` reads. JSON.stringify for objects.",
      goal: "Save object `{theme:'dark'}` under key 'prefs'. Read it back and parse into `prefs`.",
      starterCode: `// localStorage.setItem(...)\n// const prefs = JSON.parse(...)\n`,
      steps: [
        { label: "prefs.theme === 'dark'", test: `prefs && prefs.theme === 'dark'` },
        { label: "localStorage has key 'prefs'", test: `localStorage.getItem('prefs') !== null` },
      ],
      hints: ["localStorage.setItem('prefs', JSON.stringify({theme:'dark'}));"],
      solution: `localStorage.setItem('prefs', JSON.stringify({theme:'dark'}));\nconst prefs = JSON.parse(localStorage.getItem('prefs'));`,
      quiz: [{ q: "localStorage stores values as…", options: ["any type", "strings only", "JSON only", "buffers"], answer: 1 }],
    },
  ],
};
