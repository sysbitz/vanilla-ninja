import type { Section } from "../types";

export const asyncSection: Section = {
  id: "async",
  title: "Asynchronous JS",
  emoji: "⏳",
  blurb: "Timers, Promises, async/await, fetch.",
  levels: [
    {
      id: "async-1",
      title: "setTimeout",
      emoji: "⏱️",
      difficulty: 1,
      theory: "`setTimeout(fn, ms)` schedules fn after ms milliseconds (non-blocking).",
      goal: "After 50ms, set window.flag to true.",
      starterCode: `// Use setTimeout to set window.flag = true after 50ms\n`,
      steps: [
        {
          label: "flag becomes true within 200ms",
          test: `await new Promise(r=>setTimeout(r,150)); return window.flag === true;`,
          hint: "setTimeout(()=> window.flag = true, 50);",
        },
      ],
      hints: ["setTimeout receives a function, NOT a function call."],
      solution: `setTimeout(()=> window.flag = true, 50);`,
      quiz: [{ q: "setTimeout(fn, 0) runs…", options: ["synchronously", "next microtask", "after current task completes", "never"], answer: 2 }],
    },
    {
      id: "async-2",
      title: "Promises",
      emoji: "🤝",
      difficulty: 2,
      theory: "A Promise represents a future value. Use `.then` or await.",
      goal: "Create `p` — a Promise that resolves to 42 after 30ms.",
      starterCode: `// const p = new Promise(...)\n`,
      steps: [
        {
          label: "p resolves to 42",
          test: `const v = await p; return v === 42;`,
          hint: "new Promise(res => setTimeout(()=> res(42), 30));",
        },
      ],
      hints: ["Promise constructor takes (resolve, reject) => {...}"],
      solution: `const p = new Promise(res => setTimeout(()=> res(42), 30));`,
      quiz: [{ q: ".then returns…", options: ["original promise", "a new promise", "the value", "void"], answer: 1 }],
    },
    {
      id: "async-3",
      title: "async / await",
      emoji: "🪄",
      difficulty: 2,
      theory: "`async` functions always return a Promise. `await` pauses for a Promise to settle.",
      goal: "Write async `wait(ms)` that resolves to ms after that delay.",
      starterCode: `async function wait(ms){\n  // return after ms\n}\n`,
      steps: [
        {
          label: "wait(20) resolves to 20",
          test: `const v = await wait(20); return v === 20;`,
        },
      ],
      hints: ["await new Promise(r => setTimeout(r, ms)); return ms;"],
      solution: `async function wait(ms){ await new Promise(r=>setTimeout(r,ms)); return ms; }`,
      quiz: [{ q: "await only works inside…", options: ["any function", "async functions/modules", "loops", "classes"], answer: 1 }],
    },
    {
      id: "async-4",
      title: "Promise.all",
      emoji: "🧬",
      difficulty: 3,
      theory: "`Promise.all([...])` resolves when ALL settle, rejects if ANY rejects.",
      goal: "Define `all3` = result of Promise.all on three promises resolving 1, 2, 3.",
      starterCode: `// const all3 = Promise.all([...]);\n`,
      steps: [
        {
          label: "all3 resolves to [1,2,3]",
          test: `const v = await all3; return JSON.stringify(v) === '[1,2,3]';`,
        },
      ],
      hints: ["Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])"],
      solution: `const all3 = Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);`,
      quiz: [{ q: "Which waits for first to settle (fulfill or reject)?", options: ["all", "any", "race", "allSettled"], answer: 2 }],
    },
  ],
};
