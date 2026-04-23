import type { Section } from "../types";

export const patternsSection: Section = {
  id: "patterns",
  title: "Patterns & Performance",
  emoji: "⚡",
  blurb: "Singleton, Observer, debounce, throttle, leaks.",
  levels: [
    {
      id: "pat-1",
      title: "Singleton",
      emoji: "🔂",
      difficulty: 2,
      theory: "Ensure only ONE instance of something exists. Useful for shared config or caches.",
      goal: "Build factory `getConfig()` returning the SAME object every call.",
      starterCode: `// let instance; function getConfig(){ ... }\n`,
      steps: [
        { label: "Returns identical reference", test: `getConfig() === getConfig()` },
        { label: "Returns an object", test: `typeof getConfig() === 'object' && getConfig() !== null` },
      ],
      hints: ["Cache the first call in a closure."],
      solution: `let _i; function getConfig(){ if(!_i) _i = { theme:'dark' }; return _i; }`,
      quiz: [{ q: "Singletons are sometimes criticized for…", options: ["being fast", "hiding global state", "using closures", "being tiny"], answer: 1 }],
    },
    {
      id: "pat-2",
      title: "Observer / EventBus",
      emoji: "📡",
      difficulty: 3,
      theory: "Publish/subscribe lets parts of an app react to events without tight coupling.",
      goal: "Build `bus` with `on(event, fn)` and `emit(event, data)`. Multiple subscribers get called.",
      starterCode: `// const bus = { on(...), emit(...) };\n`,
      steps: [
        {
          label: "Subscribers receive emitted data",
          test: `(()=>{ let a=0,b=0; bus.on('hi', n=>a+=n); bus.on('hi', n=>b+=n); bus.emit('hi', 5); return a===5 && b===5; })()`,
        },
        {
          label: "Other events don't fire",
          test: `(()=>{ let x=0; bus.on('x', ()=>x++); bus.emit('y'); return x===0; })()`,
        },
      ],
      hints: ["Store handlers in a map of arrays."],
      solution: `const bus={ _h:{}, on(e,fn){ (this._h[e] ||= []).push(fn); }, emit(e,d){ (this._h[e]||[]).forEach(fn=>fn(d)); } };`,
      quiz: [{ q: "Observer pattern reduces…", options: ["coupling", "performance", "readability", "tests"], answer: 0 }],
    },
    {
      id: "pat-3",
      title: "Debounce",
      emoji: "🛑",
      difficulty: 3,
      theory: "Debounce delays calling fn until activity stops for `delay` ms. Great for search inputs.",
      goal: "Build `debounce(fn, delay)` returning a wrapped function. Repeated calls reset the timer.",
      starterCode: `function debounce(fn, delay){\n  // return wrapped\n}\n`,
      steps: [
        {
          label: "Only last call fires",
          test: `let n=0; const d = debounce(()=> n++, 30); d(); d(); d(); await new Promise(r=>setTimeout(r,80)); return n === 1;`,
        },
        {
          label: "Forwards arguments",
          test: `let v; const d = debounce(x => v=x, 20); d('hello'); await new Promise(r=>setTimeout(r,60)); return v === 'hello';`,
        },
      ],
      hints: ["let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), delay); };"],
      solution: `function debounce(fn,delay){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),delay); }; }`,
      quiz: [{ q: "Throttle differs from debounce by…", options: ["never firing", "firing at most once per interval", "running on idle", "being synchronous"], answer: 1 }],
    },
    {
      id: "pat-4",
      title: "Throttle",
      emoji: "🚦",
      difficulty: 3,
      theory: "Throttle ensures fn runs at most once per `interval` ms — even under heavy calls.",
      goal: "Build `throttle(fn, interval)`. First call fires immediately; subsequent calls within interval are ignored.",
      starterCode: `function throttle(fn, interval){\n  // return wrapped\n}\n`,
      steps: [
        {
          label: "Burst of 5 calls fires once",
          test: `let n=0; const t = throttle(()=> n++, 50); for(let i=0;i<5;i++) t(); await new Promise(r=>setTimeout(r,10)); return n === 1;`,
        },
        {
          label: "Fires again after interval",
          test: `let n=0; const t = throttle(()=> n++, 30); t(); await new Promise(r=>setTimeout(r,60)); t(); return n === 2;`,
        },
      ],
      hints: ["Track lastTime; only call when now - lastTime >= interval."],
      solution: `function throttle(fn,interval){ let last=0; return (...a)=>{ const now=Date.now(); if(now-last>=interval){ last=now; fn(...a); } }; }`,
      quiz: [{ q: "Use throttle for…", options: ["search input", "scroll/resize handlers", "fetch retries", "JSON parse"], answer: 1 }],
    },
  ],
};
