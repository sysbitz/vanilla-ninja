import type { Section } from "../types";

export const concurrencySection: Section = {
  id: "concurrency",
  title: "Concurrency & Threads",
  emoji: "🧵",
  blurb: "Event loop, microtasks, Web Workers.",
  levels: [
    {
      id: "conc-1",
      title: "Microtasks vs Macrotasks",
      emoji: "🌀",
      difficulty: 3,
      theory: "Microtasks (Promise callbacks, queueMicrotask) run BEFORE the next macrotask (setTimeout). Inside a tick, microtasks drain first.",
      goal: "Push strings into `order = []` so the final order is `['sync','micro','macro']`. Use console.log markers + Promise + setTimeout.",
      starterCode: `const order = [];\norder.push('sync');\n// schedule micro & macro so order ends as ['sync','micro','macro']\n`,
      steps: [
        {
          label: "order is ['sync','micro','macro']",
          test: `await new Promise(r=>setTimeout(r,30)); return JSON.stringify(order) === '["sync","micro","macro"]';`,
        },
      ],
      hints: ["Promise.resolve().then(()=> order.push('micro')); setTimeout(()=> order.push('macro'), 0);"],
      solution: `const order=[]; order.push('sync'); Promise.resolve().then(()=>order.push('micro')); setTimeout(()=>order.push('macro'),0);`,
      quiz: [{ q: "Which runs first after sync code?", options: ["setTimeout 0", "queueMicrotask", "setInterval", "rAF"], answer: 1 }],
    },
    {
      id: "conc-2",
      title: "Web Worker (Blob)",
      emoji: "👷",
      difficulty: 3,
      theory: "Web Workers run JS on a SEPARATE thread. Communicate via postMessage. Spin one up from a Blob URL — no extra file needed.",
      goal: "Spawn a worker that, on receiving a number `n`, posts back `n*n`. Send 7 and store the result on `window.workerResult`.",
      starterCode: `const src = \`self.onmessage = e => self.postMessage(e.data * e.data);\`;\nconst url = URL.createObjectURL(new Blob([src], {type:'application/javascript'}));\n// const w = new Worker(url); wire onmessage; postMessage(7);\n`,
      steps: [
        {
          label: "workerResult === 49 within 300ms",
          test: `await new Promise(r=>setTimeout(r,250)); return window.workerResult === 49;`,
          hint: "w.onmessage = e => window.workerResult = e.data; w.postMessage(7);",
        },
      ],
      hints: ["Workers don't share memory by default — use postMessage."],
      solution: `const src='self.onmessage=e=>self.postMessage(e.data*e.data);';\nconst url=URL.createObjectURL(new Blob([src],{type:'application/javascript'}));\nconst w=new Worker(url);\nw.onmessage=e=> window.workerResult = e.data;\nw.postMessage(7);`,
      quiz: [{ q: "Workers share which by default?", options: ["DOM", "window", "nothing — message-passing", "localStorage live"], answer: 2 }],
    },
    {
      id: "conc-3",
      title: "requestAnimationFrame",
      emoji: "🎞️",
      difficulty: 2,
      theory: "`requestAnimationFrame(cb)` schedules cb before the next browser paint (~60fps).",
      goal: "Increment `window.frames` each animation frame. After 100ms it should be ≥ 3.",
      starterCode: `window.frames = 0;\n// schedule a recursive rAF loop\n`,
      steps: [
        {
          label: "frames >= 3 after ~100ms",
          test: `await new Promise(r=>setTimeout(r,150)); return window.frames >= 3;`,
        },
      ],
      hints: ["function tick(){ window.frames++; requestAnimationFrame(tick); } tick();"],
      solution: `window.frames=0; function tick(){ window.frames++; requestAnimationFrame(tick); } tick();`,
      quiz: [{ q: "rAF runs at roughly…", options: ["1 fps", "the display refresh rate", "100hz fixed", "whenever idle"], answer: 1 }],
    },
  ],
};
