// SandboxIframe — runs student JS in an isolated iframe and reports back via postMessage.
//
// Security:
//   • sandbox="allow-scripts" only (NO allow-same-origin) → null origin, no DOM/storage
//     access to the parent app, no cookies.
//   • Each instance uses a random token to validate messages.
//
// Protocol:
//   parent → iframe : { type:'run', token, html, css, code, tests }
//   iframe → parent : { type:'log', token, level, args }
//                    : { type:'result', token, ok, results: [{label, pass, error, hint}] }

import { useCallback, useEffect, useImperativeHandle, useRef, forwardRef, useMemo } from "react";

export type TestSpec = { label: string; test: string; hint?: string };
export type StepResult = { label: string; pass: boolean; error?: string; hint?: string };
export type LogEntry = { level: "log" | "warn" | "error" | "info"; args: unknown[] };

type RunOpts = { html?: string; css?: string; code: string; tests: TestSpec[] };

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
  return `<!doctype html><html><head><meta charset="utf-8">
<style id="__user_css"></style>
</head>
<body>
<div id="__root"></div>
<script>
(function(){
  const TOKEN = ${JSON.stringify(token)};
  const send = (msg) => parent.postMessage(Object.assign({ token: TOKEN }, msg), '*');

  // Console capture
  ['log','warn','error','info'].forEach(function(lvl){
    const orig = console[lvl].bind(console);
    console[lvl] = function(){
      try {
        const args = Array.from(arguments).map(function(a){
          if (a instanceof Error) return a.message;
          if (typeof a === 'object' && a !== null) { try { return JSON.stringify(a); } catch(_){ return String(a); } }
          return String(a);
        });
        send({ type:'log', level: lvl, args: args });
        if (window.__ctx) window.__ctx.logs.push(args.join(' '));
      } catch(_){}
      orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', function(e){
    send({ type:'log', level:'error', args:[String((e && e.message) || e)] });
  });
  window.addEventListener('unhandledrejection', function(e){
    send({ type:'log', level:'error', args:['Unhandled rejection: ' + ((e.reason && e.reason.message) || e.reason)] });
  });

  window.addEventListener('message', async function(ev){
    const data = ev.data || {};
    if (data.token !== TOKEN || data.type !== 'run') return;

    // Reset preview
    document.getElementById('__user_css').textContent = data.css || '';
    document.getElementById('__root').innerHTML = data.html || '';
    window.__ctx = { logs: [] };

    const tests = data.tests || [];
    // Each test runs inside an async IIFE so it can use await / return / multi-statement bodies.
    // A test passes when the IIFE resolves to a truthy value (or evaluates a truthy expression).
    const testBlock = tests.map(function(t){
      const body = t.test || 'false';
      // If body looks multi-statement (contains ; or return/await), run as-is; else wrap as `return (expr)`.
      const looksStatement = /(^|\\n|;)\\s*(return |await |let |const |var |if\\s*\\(|for\\s*\\(|while\\s*\\(|try\\s*\\{)/.test(body) || /;\\s*\\S/.test(body);
      const fnBody = looksStatement ? body : ('return (' + body + ');');
      return "try { var __v = await (async function(){ " + fnBody + " })(); __results.push({ label: " + JSON.stringify(t.label) +
             ", pass: !!__v, hint: " + JSON.stringify(t.hint || "") + " }); } " +
             "catch (err) { __results.push({ label: " + JSON.stringify(t.label) +
             ", pass: false, error: (err && err.message) || String(err), hint: " + JSON.stringify(t.hint || "") + " }); }";
    }).join("\\n");

    const wrapped =
      "return (async function(){\\n" +
      "  var __results = [];\\n" +
      "  try {\\n" + (data.code || "") + "\\n} catch (__e) { __results.push({ label: 'Code execution', pass: false, error: (__e && __e.message) || String(__e) }); send({ type:'log', level:'error', args:[(__e && __e.message) || String(__e)] }); }\\n" +
      "  await new Promise(function(r){ setTimeout(r, 80); });\\n" +
      "  " + testBlock + "\\n" +
      "  return __results;\\n" +
      "})();";

    let results = [];
    try {
      const fn = new Function('send', wrapped);
      results = await fn(send);
    } catch (err) {
      results = [{ label: 'Setup', pass: false, error: (err && err.message) || String(err) }];
    }
    send({ type:'result', ok: results.every(function(r){ return r.pass; }), results: results });
  });

  send({ type:'ready' });
})();
</script>
</body></html>`;
}

export const SandboxIframe = forwardRef<SandboxHandle, Props>(({ onLog, onResult, className }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Stable token per mount
  const token = useMemo(() => Math.random().toString(36).slice(2), []);
  const readyRef = useRef(false);
  const pendingRef = useRef<RunOpts | null>(null);
  const initialDoc = useMemo(() => buildSrcDoc(token), [token]);

  useEffect(() => {
    const handler = (ev: MessageEvent) => {
      const data: any = ev.data;
      if (!data || data.token !== token) return;
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
  }, [onLog, onResult, token]);

  const postRun = useCallback((opts: RunOpts) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ token, type: "run", ...opts }, "*");
  }, [token]);

  useImperativeHandle(ref, () => ({
    run: (opts) => {
      // Fresh iframe each run for clean slate
      readyRef.current = false;
      pendingRef.current = opts;
      const f = iframeRef.current;
      if (f) f.srcdoc = buildSrcDoc(token);
    },
    reset: () => {
      const f = iframeRef.current;
      if (f) f.srcdoc = buildSrcDoc(token);
    },
  }), [token]);

  return (
    <iframe
      ref={iframeRef}
      title="JS Sandbox Preview"
      sandbox="allow-scripts"
      className={className}
      srcDoc={initialDoc}
    />
  );
});

SandboxIframe.displayName = "SandboxIframe";
