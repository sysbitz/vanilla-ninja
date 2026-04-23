// Shared preview shells used across many levels.
export const STAGE_HTML = `
<div id="stage" class="stage">
  <div id="box" class="box"></div>
</div>`;

export const STAGE_CSS = `
  body { margin:0; font-family: 'JetBrains Mono', monospace; background: #0f0f17; color:#f5f5dc; }
  .stage { display:flex; align-items:center; justify-content:center; min-height: 260px; padding: 24px; }
  .box { width: 80px; height: 80px; background: #facc15; border-radius: 12px; transition: all .3s ease; }
  .panel { font-family:'JetBrains Mono',monospace; color:#f5f5dc; padding:8px 12px; border:1px solid #333; border-radius:8px; background:#1a1a24; }
`;
