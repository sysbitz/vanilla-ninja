// Curriculum types — keep extensible so we can grow to 100+ levels.

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index of correct option
  explain?: string;
};

export type TestStep = {
  /** Short label shown in the grader. */
  label: string;
  /**
   * Code executed INSIDE the sandbox iframe AFTER the student's code runs.
   * Must return true/false (or throw) to indicate pass/fail.
   * Has access to: window, document, and a global `__ctx` for shared state.
   */
  test: string;
  /** Hint shown when this step fails. */
  hint?: string;
};

export type Level = {
  id: string;
  title: string;
  emoji: string;
  difficulty: 1 | 2 | 3;
  theory: string; // markdown-ish (rendered as plain styled text + code blocks)
  goal: string;
  starterCode: string;
  /** HTML rendered into the sandbox preview before student code runs. */
  previewHtml?: string;
  /** Optional CSS injected into the preview. */
  previewCss?: string;
  steps: TestStep[];
  hints: string[];
  solution: string;
  quiz: QuizQuestion[];
};

export type Section = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  levels: Level[];
};
