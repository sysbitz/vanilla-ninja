import type { Section } from "../types";

export const functionalSection: Section = {
  id: "functional",
  title: "Functional JS",
  emoji: "λ",
  blurb: "Compose, pipe, immutability, lenses-lite.",
  levels: [
    {
      id: "fp-1",
      title: "compose(f, g)",
      emoji: "🔗",
      difficulty: 2,
      theory: "Function composition: `compose(f, g)(x) === f(g(x))`. Reads right-to-left.",
      goal: "Build `compose(f, g)` returning x => f(g(x)).",
      starterCode: `function compose(f, g){\n  // return x => f(g(x))\n}\n`,
      steps: [
        { label: "double-then-inc", test: `compose(x => x+1, x => x*2)(3) === 7` },
        { label: "string then upper", test: `compose(s => s.toUpperCase(), n => 'n='+n)(5) === 'N=5'` },
      ],
      hints: ["return x => f(g(x));"],
      solution: `function compose(f,g){ return x => f(g(x)); }`,
      quiz: [{ q: "compose(f,g)(x) equals…", options: ["g(f(x))", "f(g(x))", "f(x)+g(x)", "x"], answer: 1 }],
    },
    {
      id: "fp-2",
      title: "pipe(...fns)",
      emoji: "🚿",
      difficulty: 3,
      theory: "Pipe is left-to-right composition of any number of functions.",
      goal: "Build `pipe(...fns)` so `pipe(double, inc, square)(2)` runs them in order: 2→4→5→25.",
      starterCode: `function pipe(...fns){\n  // return x => fns.reduce(...)\n}\n`,
      steps: [
        {
          label: "left-to-right",
          test: `const double=x=>x*2, inc=x=>x+1, square=x=>x*x; return pipe(double, inc, square)(2) === 25;`,
        },
        {
          label: "single fn pipes",
          test: `return pipe(x => x+10)(5) === 15;`,
        },
      ],
      hints: ["return x => fns.reduce((acc, fn) => fn(acc), x);"],
      solution: `function pipe(...fns){ return x => fns.reduce((a,fn)=>fn(a), x); }`,
      quiz: [{ q: "pipe vs compose differ in…", options: ["speed", "evaluation order", "currying", "purity"], answer: 1 }],
    },
    {
      id: "fp-3",
      title: "Immutable Update",
      emoji: "🧊",
      difficulty: 2,
      theory: "Never mutate inputs. Use spread to produce a new object/array.",
      goal: "Function `setField(obj, key, value)` returns a NEW object with key set, original unchanged.",
      starterCode: `function setField(obj, key, value){\n  // return new object\n}\n`,
      steps: [
        { label: "Returns updated copy", test: `(()=>{ const o={a:1,b:2}; const n=setField(o,'b',9); return n.b===9 && n.a===1 && n!==o; })()` },
        { label: "Original unchanged", test: `(()=>{ const o={a:1}; setField(o,'a',9); return o.a===1; })()` },
      ],
      hints: ["return { ...obj, [key]: value };"],
      solution: `function setField(o,k,v){ return { ...o, [k]: v }; }`,
      quiz: [{ q: "Computed property keys use…", options: ["dot notation", "[brackets]", "Symbols only", "JSON"], answer: 1 }],
    },
    {
      id: "fp-4",
      title: "Tagged Template (sanitize)",
      emoji: "🏷️",
      difficulty: 3,
      theory: "A tagged template runs `tag(strings, ...values)`. You control how interpolations are processed.",
      goal: "Tag `safe` HTML-encodes `<` and `>` in interpolated values. ``safe`Hello ${'<b>x</b>'}` `` should equal 'Hello &lt;b&gt;x&lt;/b&gt;'.",
      starterCode: `function safe(strings, ...values){\n  // encode < and > in values, then zip\n}\n`,
      steps: [
        {
          label: "Encodes interpolated value",
          test: "return safe`Hello ${'<b>x</b>'}` === 'Hello &lt;b&gt;x&lt;/b&gt;';",
        },
      ],
      hints: ["values.map(v => String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;')); then zip with strings."],
      solution: `function safe(strings, ...values){ const enc = v => String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;'); return strings.reduce((acc, s, i) => acc + s + (i < values.length ? enc(values[i]) : ''), ''); }`,
      quiz: [{ q: "Tagged templates receive strings as…", options: ["a single string", "an array (with .raw)", "an object", "a function"], answer: 1 }],
    },
  ],
};
