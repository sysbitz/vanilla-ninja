import type { Section } from "../types";

export const fetchSection: Section = {
  id: "fetch",
  title: "Fetch & Networking",
  emoji: "🌐",
  blurb: "fetch, JSON APIs, AbortController, retries.",
  levels: [
    {
      id: "fetch-1",
      title: "Mock fetch GET",
      emoji: "📥",
      difficulty: 2,
      theory: "`fetch(url)` returns a Promise of a Response. Call `.json()` for parsed body. We'll mock fetch in the sandbox.",
      goal: "Override `window.fetch` so any URL resolves to JSON `{ok:true, n:7}`. Then `data = await (await fetch('/x')).json()`.",
      starterCode: `// monkey-patch window.fetch\n// const data = await (await fetch('/x')).json();\n`,
      steps: [
        { label: "data.ok === true & data.n === 7", test: `return data && data.ok === true && data.n === 7;` },
      ],
      hints: ["window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ok:true, n:7}) });"],
      solution: `window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ok:true, n:7}) });\nconst data = await (await fetch('/x')).json();`,
      quiz: [{ q: "fetch rejects for…", options: ["any HTTP error", "network errors only", "404 only", "never"], answer: 1 }],
    },
    {
      id: "fetch-2",
      title: "Check response.ok",
      emoji: "✅",
      difficulty: 2,
      theory: "`fetch` does NOT reject on 4xx/5xx. Always check `response.ok` and throw yourself.",
      goal: "Mock fetch to return `{ ok:false, status:500 }`. Build async `safeGet()` that throws Error('HTTP 500') on non-ok. Capture msg in `caught`.",
      starterCode: `window.fetch = () => Promise.resolve({ ok:false, status:500, json:()=>Promise.resolve({}) });\nasync function safeGet(){\n  // throw on !response.ok\n}\nlet caught;\ntry { await safeGet(); } catch(e){ caught = e.message; }\n`,
      steps: [
        { label: "caught === 'HTTP 500'", test: `return caught === 'HTTP 500';` },
      ],
      hints: ["const r = await fetch('/x'); if(!r.ok) throw new Error('HTTP '+r.status);"],
      solution: `window.fetch = () => Promise.resolve({ ok:false, status:500, json:()=>Promise.resolve({}) });\nasync function safeGet(){ const r = await fetch('/x'); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }\nlet caught; try { await safeGet(); } catch(e){ caught=e.message; }`,
      quiz: [{ q: "Which status range means client error?", options: ["1xx", "2xx", "4xx", "5xx"], answer: 2 }],
    },
    {
      id: "fetch-3",
      title: "AbortController",
      emoji: "🛑",
      difficulty: 3,
      theory: "Pass `controller.signal` to fetch and call `controller.abort()` to cancel in-flight requests.",
      goal: "Mock fetch to honor `signal`: if aborted, reject with Error('aborted'). Start a request, abort immediately, capture caught.message.",
      starterCode: `window.fetch = (url, opts={}) => new Promise((res, rej) => {\n  if (opts.signal) opts.signal.addEventListener('abort', () => rej(new Error('aborted')));\n  setTimeout(() => res({ ok:true, json:()=>Promise.resolve({}) }), 100);\n});\nconst c = new AbortController();\n// start fetch with c.signal, then c.abort()\nlet caught;\n`,
      steps: [
        { label: "caught === 'aborted'", test: `await new Promise(r=>setTimeout(r,30)); return caught === 'aborted';` },
      ],
      hints: ["fetch('/x', {signal:c.signal}).catch(e => caught = e.message); c.abort();"],
      solution: `window.fetch=(u,o={})=>new Promise((res,rej)=>{ if(o.signal) o.signal.addEventListener('abort',()=>rej(new Error('aborted'))); setTimeout(()=>res({ok:true,json:()=>Promise.resolve({})}),100); });\nconst c=new AbortController(); let caught;\nfetch('/x',{signal:c.signal}).catch(e=>caught=e.message);\nc.abort();`,
      quiz: [{ q: "AbortController works with…", options: ["fetch only", "fetch + many DOM async APIs", "Promise.all only", "setTimeout"], answer: 1 }],
    },
    {
      id: "fetch-4",
      title: "Retry with Backoff",
      emoji: "🔁",
      difficulty: 3,
      theory: "On transient failures, retry a few times with increasing delays. Bail after N attempts.",
      goal: "Build async `retry(fn, n)` that calls fn(); on rejection, retries up to n times. After n+1 failures it rethrows. Track call count in `window.calls`.",
      starterCode: `window.calls = 0;\nasync function retry(fn, n){\n  // try fn(); on throw, retry up to n times\n}\n`,
      steps: [
        {
          label: "Calls fn 4 times for n=3 then throws",
          test: `window.calls=0; let err; try { await retry(async ()=>{ window.calls++; throw new Error('x'); }, 3); } catch(e){ err = e.message; } return window.calls === 4 && err === 'x';`,
        },
        {
          label: "Stops on first success",
          test: `window.calls=0; const v = await retry(async ()=>{ window.calls++; return 'ok'; }, 3); return v === 'ok' && window.calls === 1;`,
        },
      ],
      hints: ["for(let i=0;i<=n;i++){ try { return await fn(); } catch(e){ if(i===n) throw e; } }"],
      solution: `async function retry(fn,n){ for(let i=0;i<=n;i++){ try { return await fn(); } catch(e){ if(i===n) throw e; } } }`,
      quiz: [{ q: "Backoff usually grows…", options: ["linearly", "exponentially", "randomly only", "never"], answer: 1 }],
    },
  ],
};
