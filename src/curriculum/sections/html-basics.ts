import type { Section } from "../types";

const SHELL_CSS = `
  body{margin:0;font-family:'JetBrains Mono',monospace;background:#0f0f17;color:#f5f5dc;padding:20px;line-height:1.5;}
  h1,h2,h3{color:#facc15;margin:.4em 0;}
  a{color:#22d3ee;}
  ul,ol{padding-left:22px;}
  img{max-width:100%;border-radius:8px;}
  form{display:flex;flex-direction:column;gap:8px;max-width:300px;}
  input,button,textarea,select{font-family:inherit;padding:8px;border-radius:6px;border:1px solid #444;background:#1a1a24;color:#f5f5dc;}
  button{background:#facc15;color:#111;border:0;cursor:pointer;font-weight:700;}
  table{border-collapse:collapse;}
  td,th{border:1px solid #333;padding:6px 10px;}
`;

export const htmlBasicsSection: Section = {
  id: "html-basics",
  title: "HTML Foundations",
  emoji: "🧱",
  blurb: "Semantic markup — structure first, style later.",
  levels: [
    {
      id: "html-1",
      title: "Hello, Heading",
      emoji: "📰",
      difficulty: 1,
      language: "html",
      theory: "HTML uses tags like <h1>…<h6> for headings and <p> for paragraphs. The <h1> is the page's main title — there should be only one.",
      goal: "Add an <h1> with the text 'JS Quest' and a <p> below saying 'Learn by playing.'",
      previewCss: SHELL_CSS,
      starterCode: `<!-- Write your HTML below -->\n`,
      steps: [
        { label: "Has exactly one <h1>", test: `document.querySelectorAll('h1').length === 1` },
        { label: "<h1> text is 'JS Quest'", test: `document.querySelector('h1')?.textContent.trim() === 'JS Quest'` },
        { label: "Has a <p> with the tagline", test: `Array.from(document.querySelectorAll('p')).some(p=>p.textContent.includes('Learn by playing'))` },
      ],
      hints: ["<h1>JS Quest</h1>", "<p>Learn by playing.</p>"],
      solution: `<h1>JS Quest</h1>\n<p>Learn by playing.</p>`,
      quiz: [
        { q: "Which tag is the main page heading?", options: ["<head>", "<h1>", "<title>", "<header>"], answer: 1 },
        { q: "How many <h1> per page (best practice)?", options: ["0", "1", "as many as you want", "exactly 6"], answer: 1 },
      ],
    },
    {
      id: "html-2",
      title: "Linking Out",
      emoji: "🔗",
      difficulty: 1,
      language: "html",
      theory: "Anchors <a href='URL'>label</a> create hyperlinks. Add target='_blank' to open in a new tab and rel='noopener' for safety.",
      goal: "Create a link to https://developer.mozilla.org with the text 'MDN', opening in a new tab.",
      previewCss: SHELL_CSS,
      starterCode: `<!-- Add the anchor here -->\n`,
      steps: [
        { label: "Has an <a>", test: `!!document.querySelector('a')` },
        { label: "href points to MDN", test: `document.querySelector('a')?.getAttribute('href') === 'https://developer.mozilla.org'` },
        { label: "Opens in a new tab", test: `document.querySelector('a')?.getAttribute('target') === '_blank'` },
        { label: "Link text is 'MDN'", test: `document.querySelector('a')?.textContent.trim() === 'MDN'` },
      ],
      hints: [`<a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN</a>`],
      solution: `<a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN</a>`,
      quiz: [{ q: "Which attribute opens a link in a new tab?", options: ["new", "target='_blank'", "open='new'", "href='_blank'"], answer: 1 }],
    },
    {
      id: "html-3",
      title: "Lists",
      emoji: "📋",
      difficulty: 1,
      language: "html",
      theory: "Use <ul> for unordered (bulleted) and <ol> for ordered (numbered) lists. Each item is an <li>.",
      goal: "Build an ordered list of 3 items: 'Plan', 'Code', 'Ship'.",
      previewCss: SHELL_CSS,
      starterCode: `<!-- Build the list -->\n`,
      steps: [
        { label: "Has an <ol>", test: `!!document.querySelector('ol')` },
        { label: "Has 3 <li> inside <ol>", test: `document.querySelectorAll('ol > li').length === 3` },
        { label: "Items in correct order", test: `Array.from(document.querySelectorAll('ol li')).map(l=>l.textContent.trim()).join(',') === 'Plan,Code,Ship'` },
      ],
      hints: ["<ol><li>Plan</li>...</ol>"],
      solution: `<ol>\n  <li>Plan</li>\n  <li>Code</li>\n  <li>Ship</li>\n</ol>`,
      quiz: [{ q: "Which produces a numbered list?", options: ["<ul>", "<ol>", "<list>", "<dl>"], answer: 1 }],
    },
    {
      id: "html-4",
      title: "Semantic Layout",
      emoji: "🏛️",
      difficulty: 2,
      language: "html",
      theory: "Use semantic tags — <header>, <nav>, <main>, <footer> — instead of generic <div>s. They help accessibility and SEO.",
      goal: "Build a page skeleton: <header> with <h1>'Site'</h1>, <nav>, <main>, <footer>.",
      previewCss: `${SHELL_CSS}\nheader,nav,main,footer{display:block;border:1px dashed #444;padding:8px;margin:6px 0;border-radius:6px;}`,
      starterCode: `<!-- Build the skeleton -->\n`,
      steps: [
        { label: "Has <header>", test: `!!document.querySelector('header')` },
        { label: "<h1> inside <header>", test: `document.querySelector('header h1')?.textContent.trim()==='Site'` },
        { label: "Has <nav>, <main>, <footer>", test: `!!document.querySelector('nav') && !!document.querySelector('main') && !!document.querySelector('footer')` },
      ],
      hints: ["<header><h1>Site</h1></header>"],
      solution: `<header><h1>Site</h1></header>\n<nav>links</nav>\n<main>content</main>\n<footer>© 2026</footer>`,
      quiz: [{ q: "Why use semantic tags?", options: ["shorter code", "accessibility & SEO", "they render faster", "they auto-style"], answer: 1 }],
    },
    {
      id: "html-5",
      title: "Forms 101",
      emoji: "📝",
      difficulty: 2,
      language: "html",
      theory: "Forms collect user input. Pair every <input> with a <label> via the `for` attribute matching the input's `id` for accessibility.",
      goal: "Build a form with a labeled email input (id='email', type='email', required) and a submit button labelled 'Sign up'.",
      previewCss: SHELL_CSS,
      starterCode: `<!-- Build the signup form -->\n`,
      steps: [
        { label: "Has a <form>", test: `!!document.querySelector('form')` },
        { label: "Email input correct", test: `const i=document.getElementById('email'); return !!i && i.type==='email' && i.required;` },
        { label: "Label binds to email", test: `document.querySelector('label[for=email]')!==null` },
        { label: "Submit button says 'Sign up'", test: `Array.from(document.querySelectorAll('button,input[type=submit]')).some(b => (b.textContent||b.value).trim()==='Sign up')` },
      ],
      hints: ["<label for='email'>Email</label><input id='email' type='email' required/>"],
      solution: `<form>\n  <label for="email">Email</label>\n  <input id="email" type="email" required/>\n  <button type="submit">Sign up</button>\n</form>`,
      quiz: [{ q: "What links a <label> to its input?", options: ["name", "id+for", "rel", "aria-label"], answer: 1 }],
    },
  ],
};
