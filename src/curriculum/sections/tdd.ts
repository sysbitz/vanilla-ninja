import type { Section } from "../types";

export const tddSection: Section = {
  id: "tdd",
  title: "Testing Mindset",
  emoji: "🧪",
  blurb: "Write asserts, test edge cases, mock dependencies.",
  levels: [
    {
      id: "tdd-1",
      title: "Tiny assert()",
      emoji: "✅",
      difficulty: 1,
      theory: "An assert library is just a function that throws if a condition is false. Pin behavior with assertions.",
      goal: "Build `assert(cond, msg)` that throws Error(msg) when !cond. assert(true,'ok') must NOT throw.",
      starterCode: `function assert(cond, msg){\n  // throw if !cond\n}\n`,
      steps: [
        { label: "true does not throw", test: `(()=>{ try { assert(true,'ok'); return true; } catch { return false; } })()` },
        { label: "false throws msg", test: `(()=>{ try { assert(false,'bad'); return false; } catch(e){ return e.message === 'bad'; } })()` },
      ],
      hints: ["if(!cond) throw new Error(msg);"],
      solution: `function assert(c,m){ if(!c) throw new Error(m); }`,
      quiz: [{ q: "Why assert?", options: ["force runtime checks", "syntax sugar", "deletes code", "encrypts"], answer: 0 }],
    },
    {
      id: "tdd-2",
      title: "Test Edge Cases",
      emoji: "🌒",
      difficulty: 2,
      theory: "Good tests cover: empty input, one item, many items, negatives, big numbers, types.",
      goal: "Function `clamp(n, lo, hi)` returns n bounded to [lo, hi]. Handle lo > hi gracefully (swap).",
      starterCode: `function clamp(n, lo, hi){\n  // bound n; if lo>hi, swap\n}\n`,
      steps: [
        { label: "in-range untouched", test: `clamp(5, 0, 10) === 5` },
        { label: "below lo clamps", test: `clamp(-3, 0, 10) === 0` },
        { label: "above hi clamps", test: `clamp(99, 0, 10) === 10` },
        { label: "swapped bounds OK", test: `clamp(5, 10, 0) === 5 && clamp(-1, 10, 0) === 0` },
      ],
      hints: ["if(lo>hi) [lo,hi]=[hi,lo]; return Math.min(hi, Math.max(lo, n));"],
      solution: `function clamp(n,lo,hi){ if(lo>hi) [lo,hi]=[hi,lo]; return Math.min(hi, Math.max(lo, n)); }`,
      quiz: [{ q: "Math.max(...) of zero args is…", options: ["0", "-Infinity", "NaN", "throws"], answer: 1 }],
    },
    {
      id: "tdd-3",
      title: "Spy Function (mock)",
      emoji: "🕵️",
      difficulty: 3,
      theory: "A spy records how it's called: `.calls` array of arg-arrays. Lets you assert interactions.",
      goal: "Build `spy()` returning a function with `.calls = []`. Each invocation pushes its arguments array.",
      starterCode: `function spy(){\n  // return fn with .calls\n}\n`,
      steps: [
        { label: "Records args", test: `(()=>{ const s=spy(); s(1,2); s('x'); return s.calls.length===2 && JSON.stringify(s.calls[0])==='[1,2]' && s.calls[1][0]==='x'; })()` },
      ],
      hints: ["const fn = (...a)=>{ fn.calls.push(a); }; fn.calls=[]; return fn;"],
      solution: `function spy(){ const fn=(...a)=>{ fn.calls.push(a); }; fn.calls=[]; return fn; }`,
      quiz: [{ q: "Spies are useful for…", options: ["benchmarking", "verifying interactions in tests", "encryption", "concurrency"], answer: 1 }],
    },
  ],
};
