// SandboxIframe — runs student code in an isolated iframe and reports back via postMessage.
//
// Security model:
//   • iframe is sandbox="allow-scripts" only (NO allow-same-origin) so the iframe is a
//     null origin and cannot touch the parent app, cookies, or storage.
//   • communication is via window.postMessage with a per-instance random token.
//
// Protocol:
//   parent → iframe : { type:'run', token, html, css, code, tests }
//   iframe → parent : { type:'log', token, level, args }
//                     { type:'result', token, ok, results: [{label, pass, error}] }

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from "react";

export type TestSpec = { label: string; test: string; hint?: string };
export type StepResult = { label: string; pass: boolean; error?: string; hint?: string };
export type LogEntry = { level: "log" | "warn" | "error" | "info"; args: unknown[] };

type RunOpts = {
  html?: string;
  css?: string;
  code: string;
  tests: TestSpec[];
};

export type SandboxHandle = {
  run: (opts: RunOpts) => void;
  reset: () => void;
};

type Props = {
  onLog?: (e: LogEntry) => void;
  onResult?: (results: StepResult[]) => void;
  className?: string;
};

function buildSrcDoc(token: string) {
  // The iframe page: receives messages, builds preview, runs student code, runs tests.
  return `<!doctype html><html><head><meta charset="utf-8"><style id="__user_css"></style></head>
<body>
<div id="__root"></div>
<script>
(function(){
  const TOKEN = ${JSON.stringify(token)};
  const send = (msg) => parent.postMessage(Object.assign({ token: TOKEN }, msg), '*');

  // Capture console
  ['log','warn','error','info'].forEach((lvl) => {
    const orig = console[lvl].bind(console);
    console[lvl] = function(){
      try {
        const args = Array.from(arguments).map((a) => {
          if (a instanceof Error) return a.message;
          if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
          return String(a);
        });
        send({ type:'log', level: lvl, args });
      } catch(e){}
      orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', (e) => {
    send({ type:'log', level:'error', args:[String(e.message || e.error)]});
  });
  window.addEventListener('unhandledrejection', (e) => {
    send({ type:'log', level:'error', args:['Unhandled promise rejection: ' + (e.reason && e.reason.message || e.reason)]});
  });

  window.addEventListener('message', async (ev) => {
    const data = ev.data || {};
    if (data.token !== TOKEN || data.type !== 'run') return;

    // Reset DOM + CSS
    document.getElementById('__user_css').textContent = data.css || '';
    document.getElementById('__root').innerHTML = data.html || '';

    // Shared context
    window.__ctx = { logs: [] };
    const origLog = console.log;
    console.log = function(){
      window.__ctx.logs.push(Array.from(arguments).map(String).join(' '));
      origLog.apply(console, arguments);
    };

    // Run student code as a function so 'return' won't error and let/const become locals.
    let runError = null;
    try {
      const fn = new Function(data.code + "\\n;return (typeof window!=='undefined')?window:undefined;");
      fn();
    } catch (err) {
      runError = err && err.message || String(err);
      send({ type:'log', level:'error', args:[runError] });
    }

    // Wait a tick so async DOM updates settle
    await new Promise(r => setTimeout(r, 60));

    const results = [];
    for (const t of (data.tests || [])) {
      if (runError) {
        results.push({ label: t.label, pass: false, error: 'Code threw: ' + runError, hint: t.hint });
        continue;
      }
      try {
        // Tests may use the locals defined by student code, so we eval inside the SAME
        // global scope by injecting a script tag. Function() can't see student's let/const,
        // but a script tag's top-level can — student declarations using var/function
        // become globals; let/const stay block-scoped. We tried-with new Function first,
        // fall back via window globals where possible.
        const __test = new Function('return (' + t.test + ');');
        const ok = !!__test();
        results.push({ label: t.label, pass: ok, hint: ok ? undefined : t.hint });
      } catch (err) {
        results.push({ label: t.label, pass: false, error: err && err.message || String(err), hint: t.hint });
      }
    }
    send({ type:'result', ok: results.every(r => r.pass), results });
  });

  send({ type:'ready' });
})();
</script>
</body></html>`;
}

/**
 * Important note about scoping: student code is wrapped in `new Function(...)`, so
 * `let`/`const` declarations are NOT visible from the test's `new Function`.
 * To accommodate the broad common case used in lessons we re-execute student code
 * AND tests together in a single `new Function`. See run() below.
 */

export const SandboxIframe = forwardRef<SandboxHandle, Props>(({ onLog, onResult, className }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const tokenRef = useRef<string>(Math.random().toString(36).slice(2));
  const readyRef = useRef(false);
  const pendingRef = useRef<RunOpts | null>(null);

  // Re-issue srcDoc on mount so we get a fresh token each instance.
  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const data: any = ev.data;
      if (!data || data.token !== tokenRef.current) return;
      if (data.type === "ready") {
        readyRef.current = true;
        if (pendingRef.current) {
          postRun(pendingRef.current);
          pendingRef.current = null;
        }
      } else if (data.type === "log") {
        onLog?.({ level: data.level, args: data.args });
      } else if (data.type === "result") {
        onResult?.(data.results);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onLog, onResult]);

  const postRun = useCallback((opts: RunOpts) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    // Combine student code + a synthetic eval call so tests can see the same scope.
    // We bundle each test into a single function alongside the student code.
    const wrappedCode = opts.code + `\n;window.__runTests = function(){\n  const __r = [];\n  ${opts.tests
      .map(
        (t, i) => `try { __r.push({ i:${i}, label:${JSON.stringify(t.label)}, pass: !!(${t.test}), hint:${JSON.stringify(t.hint || "")} }); }
catch(err){ __r.push({ i:${i}, label:${JSON.stringify(t.label)}, pass:false, error: err && err.message || String(err), hint:${JSON.stringify(t.hint || "")} }); }`
      )
      .join("\n  ")}\n  return __r;\n};`;

    // We pass empty tests array so the iframe runner doesn't try to evaluate them in the wrong scope.
    win.postMessage({ token: tokenRef.current, type: "run", html: opts.html, css: opts.css, code: wrappedCode, tests: [] }, "*");

    // Drain results from window.__runTests after a short delay via a follow-up message.
    setTimeout(() => {
      try {
        // We can't read iframe globals directly (no allow-same-origin). Instead, instruct
        // the iframe to run tests by evaluating and posting back. We do this by sending
        // a second 'run' with code that calls __runTests and console.logs a marker.
        const collectorCode = `try { const r = window.__runTests ? window.__runTests() : []; parent.postMessage({ token:${JSON.stringify(
          tokenRef.current
        )}, type:'result', ok: r.every(x=>x.pass), results: r.map(x=>({label:x.label,pass:x.pass,error:x.error,hint:x.hint})) }, '*'); } catch(e){ parent.postMessage({token:${JSON.stringify(
          tokenRef.current
        )}, type:'result', ok:false, results:[{label:'collector', pass:false, error:String(e)}]}, '*'); }`;
        win.postMessage({ token: tokenRef.current, type: "run", html: opts.html, css: opts.css, code: collectorCode, tests: [] }, "*");
      } catch {
        /* ignore */
      }
    }, 120);
  }, []);

  useImperativeHandle(ref, () => ({
    run: (opts) => {
      // Reset iframe each run for a clean slate.
      readyRef.current = false;
      pendingRef.current = opts;
      const f = iframeRef.current;
      if (f) f.srcdoc = buildSrcDoc(tokenRef.current);
    },
    reset: () => {
      const f = iframeRef.current;
      if (f) f.srcdoc = buildSrcDoc(tokenRef.current);
    },
  }), [postRun]);

  return (
    <iframe
      ref={iframeRef}
      title="JS Sandbox Preview"
      sandbox="allow-scripts"
      className={className}
      srcDoc={buildSrcDoc(tokenRef.current)}
    />
  );
});

SandboxIframe.displayName = "SandboxIframe";
