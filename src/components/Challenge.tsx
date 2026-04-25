import { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { Play, RefreshCw, Lightbulb, Eye, Check, X, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SandboxIframe, type SandboxHandle, type StepResult, type LogEntry } from "@/components/sandbox/SandboxIframe";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { celebrate } from "@/lib/confetti";
import type { Level } from "@/curriculum/types";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { profileService } from "@/services/profileService";

type Props = { level: Level; onAdvance?: () => void };

export function Challenge({ level, onAdvance }: Props) {
  const sandboxRef = useRef<SandboxHandle>(null);
  const [code, setCode] = useState(level.starterCode);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<StepResult[]>([]);
  const [manualPass, setManualPass] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>(() => level.quiz.map(() => -1));
  const { get, update } = useProgress();
  const { user, refreshProfile } = useAuth();
  const lp = get(level.id);

  // Reset on level change
  useEffect(() => {
    setCode(level.starterCode);
    setLogs([]);
    setResults([]);
    setHintIdx(0);
    setShowSolution(false);
    setQuizAnswers(level.quiz.map(() => -1));
    setManualPass(false);
    sandboxRef.current?.reset();
  }, [level.id]);

  const allStepsPass = manualPass || (results.length > 0 && results.every(r => r.pass));
  const quizPass =
    level.quiz.length === 0 ||
    quizAnswers.every((a, i) => a === level.quiz[i].answer);
  const fullyComplete = allStepsPass && quizPass;

  // On full completion, save progress + celebrate
  useEffect(() => {
    if (!fullyComplete) return;
    const stars: 1 | 2 | 3 = showSolution ? 1 : lp.attempts <= 2 ? 3 : 2;
    if (!lp.completed || stars > lp.stars) {
      const xpGain = !lp.completed ? stars * 10 : Math.max(0, (stars - lp.stars) * 5);
      update(level.id, { completed: true, stars });
      celebrate(stars);
      toast.success(`Level cleared — ${"⭐".repeat(stars)}${xpGain ? ` · +${xpGain} XP` : ""}`);
      if (user && xpGain > 0) {
        profileService.addXp(user.id, xpGain).then(() => refreshProfile()).catch(console.error);
      }
    }
  }, [fullyComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = () => {
    setLogs([]);
    setResults([]);
    update(level.id, { attempts: lp.attempts + 1 });
    sandboxRef.current?.run({
      html: level.previewHtml,
      css: level.previewCss,
      code,
      tests: level.steps,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full overflow-hidden">
      {/* LEFT: Theory + editor */}
      <div className="flex flex-col gap-4 min-h-0">
        <Card className="bg-gradient-card border-border/60 p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="text-4xl animate-float">{level.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold gradient-text">{level.title}</h2>
                <Badge variant="outline" className="font-mono text-xs">
                  {"●".repeat(level.difficulty)}{"○".repeat(3 - level.difficulty)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{level.theory}</p>
              <div className="mt-3 rounded-md bg-muted/40 border border-border/60 p-3 text-sm">
                <span className="font-bold text-primary">🎯 Goal: </span>
                {level.goal}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border/60 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">script.js</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setCode(level.starterCode)}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setHintIdx(i => Math.min(i + 1, level.hints.length)); }}>
                <Lightbulb className="h-3.5 w-3.5 mr-1" /> Hint
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowSolution(true); update(level.id, { solutionRevealed: true }); }}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> Solution
              </Button>
              <Button size="sm" onClick={run} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow-primary">
                <Play className="h-3.5 w-3.5 mr-1 fill-current" /> Run
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <CodeMirror
              value={code}
              onChange={setCode}
              extensions={[javascript({ jsx: false })]}
              theme={oneDark}
              height="100%"
              basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }}
            />
          </div>
          {hintIdx > 0 && (
            <div className="border-t border-border/60 p-3 bg-warning/10 text-sm">
              {level.hints.slice(0, hintIdx).map((h, i) => (
                <div key={i} className="flex gap-2 items-start"><Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" /><span>{h}</span></div>
              ))}
            </div>
          )}
          {showSolution && (
            <div className="border-t border-border/60 bg-secondary/10">
              <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-secondary">Solution</div>
              <pre className="p-3 text-xs font-mono overflow-auto bg-background/40">{level.solution}</pre>
              <div className="px-3 pb-3">
                <Button size="sm" variant="outline" onClick={() => setCode(level.solution)}>Load into editor</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* RIGHT: Preview, grader, console, quiz */}
      <div className="flex flex-col gap-4 min-h-0">
        <Card className="bg-card border-border/60 overflow-hidden">
          <div className="px-3 py-2 border-b border-border/60 text-xs font-mono uppercase tracking-wider text-muted-foreground">Preview</div>
          <div className="grid-bg">
            <SandboxIframe
              ref={sandboxRef}
              className="w-full h-[280px] bg-[#0f0f17]"
              onLog={(e) => setLogs(l => [...l, e])}
              onResult={setResults}
            />
          </div>
        </Card>

        <Card className="bg-card border-border/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Steps</div>
            <Button
              size="sm"
              variant={manualPass ? "secondary" : "outline"}
              onClick={() => setManualPass(v => !v)}
              className="h-7 text-xs"
            >
              {manualPass ? "✓ Marked done" : "Mark as done"}
            </Button>
          </div>
          <ul className="space-y-1.5">
            {level.steps.map((s, i) => {
              const r = results[i];
              const status = !r ? "pending" : r.pass ? "pass" : "fail";
              return (
                <li key={i} className={cn(
                  "flex items-start gap-2 text-sm rounded-md px-2 py-1.5 border",
                  status === "pass" && "bg-success/10 border-success/30 text-success",
                  status === "fail" && "bg-destructive/10 border-destructive/30",
                  status === "pending" && "bg-muted/20 border-border/40 text-muted-foreground"
                )}>
                  {status === "pass" ? <Check className="h-4 w-4 mt-0.5 shrink-0" /> :
                   status === "fail" ? <X className="h-4 w-4 mt-0.5 shrink-0 text-destructive" /> :
                   <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full border border-current" />}
                  <div className="flex-1">
                    <div>{s.label}</div>
                    {r && !r.pass && (r.error || r.hint) && (
                      <div className="text-xs opacity-80 mt-0.5">{r.error || r.hint}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="bg-card border-border/60 p-3 flex-1 min-h-[100px] flex flex-col">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Console</div>
          <div className="flex-1 overflow-auto font-mono text-xs space-y-1">
            {logs.length === 0 && <div className="text-muted-foreground/60">// console output will appear here</div>}
            {logs.map((l, i) => (
              <div key={i} className={cn(
                l.level === "error" && "text-destructive",
                l.level === "warn" && "text-warning",
              )}>
                <span className="opacity-60 mr-2">›</span>{l.args.join(" ")}
              </div>
            ))}
          </div>
        </Card>

        {allStepsPass && level.quiz.length > 0 && (
          <Card className="bg-gradient-card border-secondary/40 p-4 animate-pop">
            <div className="text-sm font-bold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Quick quiz to lock it in
            </div>
            <div className="space-y-3">
              {level.quiz.map((q, i) => (
                <div key={i}>
                  <div className="text-sm mb-1.5">{i + 1}. {q.q}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {q.options.map((o, j) => {
                      const picked = quizAnswers[i] === j;
                      const correct = q.answer === j;
                      return (
                        <button
                          key={j}
                          onClick={() => setQuizAnswers(a => a.map((v, k) => k === i ? j : v))}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-md border transition-all",
                            picked && correct && "bg-success/20 border-success text-success",
                            picked && !correct && "bg-destructive/20 border-destructive text-destructive",
                            !picked && "border-border hover:border-primary/60",
                          )}
                        >{o}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {fullyComplete && (
          <Button onClick={onAdvance} size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow-primary">
            Next level <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
