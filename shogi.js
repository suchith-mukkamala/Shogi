(function () {
  "use strict";

  // =========================================================
  // 1. PAGE CONSTRUCTION
  // =========================================================
  document.title = "Shogi Games";

  const meta = document.createElement("meta");
  meta.name = "viewport"; meta.content = "width=device-width, initial-scale=1.0";
  document.head.appendChild(meta);

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect"; preconnect.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnect);

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap";
  document.head.appendChild(fontLink);

  const style = document.createElement("style");
  style.textContent = `
    :root{
      --paper:#eee5d3; --board:#d8ac6d; --walnut:#4a3220; --ink:#241a10; --ink-soft:#5b4a38;
      --line:#7a5230; --seal:#a13d2f; --seal-soft:#c96a54; --gold-glow:#d9b25c; --panel:rgba(255,255,255,0.35);
    }
    body.dark{
      --paper:#20180f; --board:#5a4630; --walnut:#e8dcc4; --ink:#ecdfc8; --ink-soft:#c9bda8;
      --line:#8a6a45; --seal:#e0685a; --seal-soft:#e88a7d; --gold-glow:#d9b25c; --panel:rgba(0,0,0,0.25);
    }
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;}
    .hidden{display:none !important;}
    body{
      background:var(--paper); min-height:100vh; display:flex; flex-direction:column; align-items:center;
      padding:24px 16px 48px; font-family:'Zen Kaku Gothic New','Hiragino Sans','Segoe UI',sans-serif; color:var(--ink);
      transition: background 0.2s ease, color 0.2s ease;
    }
    .titleblock{ text-align:center; margin-bottom:4px; }
    h1{ font-family:'Shippori Mincho',Georgia,serif; font-weight:700; font-size:2.1rem; letter-spacing:0.06em; margin:0 0 2px 0; color:var(--walnut); }
    .jp{ font-family:'Shippori Mincho',Georgia,serif; font-size:0.9rem; color:var(--ink-soft); letter-spacing:0.25em; margin:0; }
    #gameChoices{ display:flex; gap:16px; flex-wrap:wrap; justify-content:center; margin-top:24px; max-width:760px; }
    .gameCard{ width:210px; border:1px solid var(--line); border-radius:10px; background:var(--panel); padding:16px 14px; text-align:center; transition:transform .15s; }
    .gameCard:not(.disabled):hover{ transform:translateY(-3px); }
    .gameCard h2{ font-family:'Shippori Mincho',Georgia,serif; font-size:1.15rem; margin:0 0 6px 0; color:var(--walnut); }
    .gameCard p{ font-size:0.82rem; color:var(--ink-soft); line-height:1.5; min-height:3.2em; }
    .gameCard.disabled{ opacity:0.55; }
    .gameCard .soon{ display:block; font-size:0.68rem; color:var(--seal); font-weight:700; margin-top:2px; }
    .topLinks{ display:flex; gap:4px; flex-wrap:wrap; justify-content:center; margin-top:10px; }
    .linkBtn{ background:transparent; color:var(--ink-soft); padding:4px 10px; border-radius:4px; font-weight:500; text-decoration:underline; font-size:0.8rem; }
    .linkBtn:hover{ background:rgba(128,128,128,0.12); color:var(--ink); transform:none; }
    #setupBar,#settingsBar{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:center; margin-top:10px; padding:8px 16px; border:1px solid var(--line); border-radius:6px; background:var(--panel); font-size:0.82rem; }
    #setupBar label,#settingsBar label{ display:flex; align-items:center; gap:5px; color:var(--ink-soft); }
    #setupBar select{ font-family:inherit; font-size:0.82rem; padding:3px 6px; border-radius:4px; border:1px solid var(--line); background:var(--paper); color:var(--ink); }
    #statusBar{ margin:12px 0 8px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:center; }
    #status{ font-family:'Shippori Mincho',Georgia,serif; font-size:1.05rem; padding:6px 18px; border:1px solid var(--line); border-radius:3px; background:var(--panel); }
    #status.check{ color:var(--seal); border-color:var(--seal); font-weight:700; }
    #status.over{ color:var(--seal); font-weight:700; }
    #status.thinking{ color:var(--ink-soft); font-style:italic; }
    button{ font-family:inherit; font-weight:700; font-size:0.8rem; letter-spacing:0.02em; border:none; cursor:pointer; padding:7px 14px; border-radius:999px; background:var(--seal); color:#fbf1e6; }
    button:hover{ background:var(--seal-soft); }
    button:disabled{ background:#9a9086; cursor:default; opacity:0.6; }
    #hintRow{ margin-top:6px; }
    #playArea{ display:flex; gap:18px; flex-wrap:wrap; justify-content:center; align-items:flex-start; margin-top:14px; }
    #boardWrap{ position:relative; filter:drop-shadow(0 8px 18px rgba(40,25,10,0.25)); }
    canvas{ display:block; touch-action:none; cursor:pointer; }
    #historyPanel{ width:220px; max-height:520px; display:flex; flex-direction:column; border:1px solid var(--line); border-radius:8px; background:var(--panel); overflow:hidden; }
    #historyPanel h3{ margin:0; padding:8px 12px; font-family:'Shippori Mincho',Georgia,serif; font-size:0.95rem; border-bottom:1px solid var(--line); }
    #historyList{ overflow-y:auto; font-size:0.78rem; padding:4px; }
    #historyList table{ width:100%; border-collapse:collapse; }
    #historyList td{ padding:3px 6px; cursor:pointer; border-radius:3px; }
    #historyList td.moveNum{ color:var(--ink-soft); cursor:default; width:22px; }
    #historyList td.moveEntry:hover{ background:rgba(128,128,128,0.15); }
    #historyList td.current{ background:var(--seal); color:#fbf1e6; font-weight:700; }
    #reviewBanner{ background:var(--seal); color:#fbf1e6; font-size:0.75rem; padding:6px 10px; display:flex; align-items:center; justify-content:space-between; gap:6px; }
    #reviewBanner button{ background:#fbf1e6; color:var(--seal); padding:3px 8px; font-size:0.7rem; }
    #legend{ margin-top:16px; max-width:560px; text-align:center; font-size:0.8rem; line-height:1.6; color:var(--ink-soft); }
    #legend b{ color:var(--ink); }
    #legend .plus{ color:var(--seal); font-weight:700; }
    #shareRow{ margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; align-items:center; font-size:0.78rem; }
    #shareRow input{ font-family:inherit; font-size:0.78rem; padding:6px 8px; border-radius:6px; border:1px solid var(--line); background:var(--paper); color:var(--ink); width:220px; }
    #shareMsg{ color:var(--ink-soft); font-size:0.76rem; }
    .modal-overlay{ position:fixed; inset:0; background:rgba(20,14,8,0.5); display:flex; align-items:center; justify-content:center; z-index:50; }
    .modal-card{ background:var(--paper); border:1px solid var(--line); border-radius:8px; padding:20px 24px; text-align:center; max-width:340px; box-shadow:0 12px 30px rgba(0,0,0,0.35); }
    .modal-card p{ font-family:'Shippori Mincho',Georgia,serif; font-size:1.05rem; margin:0 0 14px 0; }
    .modal-buttons{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .modal-buttons button.secondary{ background:transparent; color:var(--ink); border:1px solid var(--line); }
    #walkthroughBody{ text-align:left; font-size:0.85rem; line-height:1.6; color:var(--ink-soft); margin-bottom:14px; }
    #walkthroughBody li{ margin-bottom:6px; }
    #statsTable{ text-align:left; font-size:0.82rem; margin-bottom:14px; }
    #statsTable table{ width:100%; border-collapse:collapse; }
    #statsTable td,#statsTable th{ padding:4px 8px; border-bottom:1px solid var(--line); }
  `;
  document.head.appendChild(style);

  document.body.innerHTML = `
    <div id="menuScreen">
      <div class="titleblock"><h1>Shogi Games</h1><p class="jp">将棋 &middot; choose your game</p></div>
      <div id="gameChoices">
        <div class="gameCard"><h2>Shogi</h2><p>The full 9&times;9 game, all the classic pieces, drops and promotions.</p><button class="playBtn" data-game="shogi">Play</button></div>
        <div class="gameCard"><h2>Dobutsu Shogi</h2><p>A tiny 3&times;4 board built for a quick, playful match.</p><button class="playBtn" data-game="dobutsu">Play</button></div>
        <div class="gameCard disabled"><h2>Mini Shogi <span class="soon">5&times;5 &middot; coming soon</span></h2><p>A faster middle ground between the two, on the way.</p><button class="playBtn" disabled>Play</button></div>
      </div>
    </div>

    <div id="gameScreen" class="hidden">
      <div class="titleblock"><h1 id="gameTitle">Shogi</h1><p class="jp" id="gameSubtitle"> TWO PLAYERS - ONE BOARD </p></div>
      <div class="topLinks">
        <button id="backBtn" class="linkBtn">&larr; Change game</button>
        <button id="helpBtn" class="linkBtn">How to play</button>
        <button id="statsBtn" class="linkBtn">Stats</button>
        <button id="darkModeBtn" class="linkBtn">Dark mode</button>
      </div>

      <div id="setupBar">
        <label>Mode <select id="modeSelect"><option value="pvp">Two Players</option><option value="cpu">Vs Computer</option></select></label>
        <label id="sideLabel" style="display:none;">Your side <select id="sideSelect"><option value="black">Black (moves first)</option><option value="white">White (moves second)</option></select></label>
        <label id="difficultyLabel" style="display:none;">Difficulty <select id="difficultySelect"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select></label>
      </div>

      <div id="settingsBar">
        <label><input type="checkbox" id="learningAidsChk"> Learning aids</label>
        <label><input type="checkbox" id="coordsChk" checked> Show coordinates</label>
        <label><input type="checkbox" id="soundChk" checked> Sound</label>
      </div>

      <div id="statusBar">
        <div id="status">Black's turn.</div>
        <button id="resetBtn">New Game</button>
        <button id="undoBtn">Undo</button>
        <button id="redoBtn">Redo</button>
        <button id="flipBtn">Flip board</button>
        <button id="resignBtn">Resign</button>
      </div>

      <div id="hintRow" class="hidden"><button id="hintBtn">Hint</button></div>

      <div id="playArea">
        <div id="boardWrap"><canvas id="board"></canvas></div>
        <div id="historyPanel">
          <h3>Moves</h3>
          <div id="reviewBanner" class="hidden"><span id="reviewLabel"></span><button id="returnLiveBtn">Return to live</button></div>
          <div id="historyList"><table id="historyTable"></table></div>
        </div>
      </div>

      <div id="legend"></div>

      <div id="shareRow">
        <button id="copyCodeBtn">Copy game code</button>
        <input id="loadCodeInput" placeholder="Paste a game code here...">
        <button id="loadCodeBtn">Load</button>
        <span id="shareMsg"></span>
      </div>

      <div class="modal-overlay hidden" id="promoModal">
        <div class="modal-card"><p>Promote this piece?</p>
          <div class="modal-buttons"><button id="promoYes">Promote</button><button class="secondary" id="promoNo">Keep as is</button></div>
        </div>
      </div>
      <div class="modal-overlay hidden" id="resignModal">
        <div class="modal-card"><p>Resign this game?</p>
          <div class="modal-buttons"><button id="resignYes">Yes, resign</button><button class="secondary" id="resignNo">Cancel</button></div>
        </div>
      </div>
      <div class="modal-overlay hidden" id="statsModal">
        <div class="modal-card"><p>Your record vs computer</p>
          <div id="statsTable"></div>
          <div class="modal-buttons"><button class="secondary" id="statsResetBtn">Reset stats</button><button id="statsCloseBtn">Close</button></div>
        </div>
      </div>
      <div class="modal-overlay hidden" id="walkthroughModal">
        <div class="modal-card"><p id="walkthroughTitle">How to play</p>
          <ul id="walkthroughBody"></ul>
          <div class="modal-buttons"><button id="walkthroughDone">Got it</button></div>
        </div>
      </div>
    </div>
  `;

   const menuScreen = document.getElementById("menuScreen");
  const gameScreen = document.getElementById("gameScreen");
  const modeSelect = document.getElementById("modeSelect");
  const sideSelect = document.getElementById("sideSelect");
  const difficultySelect = document.getElementById("difficultySelect");
  const sideLabel = document.getElementById("sideLabel");
  const difficultyLabel = document.getElementById("difficultyLabel");
  const learningAidsChk = document.getElementById("learningAidsChk");
  const coordsChk = document.getElementById("coordsChk");
  const soundChk = document.getElementById("soundChk");
 
  modeSelect.addEventListener("change", () => {
    const show = modeSelect.value === "cpu";
    sideLabel.style.display = show ? "flex" : "none";
    difficultyLabel.style.display = show ? "flex" : "none";
  });
  document.querySelectorAll(".playBtn[data-game]").forEach((btn) => {
    btn.addEventListener("click", () => enterGame(btn.dataset.game));
  });
  document.getElementById("backBtn").addEventListener("click", () => {
    gameScreen.classList.add("hidden"); menuScreen.classList.remove("hidden");
  });
 
  // =========================================================
  // 2. PALETTE (light/dark canvas colors)
  // =========================================================
  const PALETTES = {
    light: { board:"#d8ac6d", frame:"#4a3220", grid:"#7a5230", pieceBlack:"#ecd9ab", pieceWhite:"#f7eed9",
      inkText:"#241a10", seal:"#a13d2f", label:"#5b4a38", handActiveFill:"rgba(217,178,92,0.16)",
      handActiveBorder:"#d9b25c", lastMove:"rgba(217,178,92,0.9)", checkGlow:"rgba(161,61,47,0.55)",
      winGlow:"rgba(217,178,92,0.65)", threat:"rgba(190,50,40,0.14)", hint:"rgba(50,110,190,0.6)",
      moveDot:"rgba(74,50,32,0.35)", captureRing:"rgba(161,61,47,0.75)" },
    dark: { board:"#5a4630", frame:"#20160c", grid:"#8a6a45", pieceBlack:"#c9b78c", pieceWhite:"#e6dcc4",
      inkText:"#1a140d", seal:"#e0685a", label:"#c9bda8", handActiveFill:"rgba(217,178,92,0.12)",
      handActiveBorder:"#c9a44a", lastMove:"rgba(217,178,92,0.75)", checkGlow:"rgba(224,104,90,0.55)",
      winGlow:"rgba(217,178,92,0.6)", threat:"rgba(224,104,90,0.18)", hint:"rgba(120,180,240,0.6)",
      moveDot:"rgba(20,14,8,0.4)", captureRing:"rgba(224,104,90,0.8)" }
  };
  let PAL = PALETTES.light;
 
  // =========================================================
  // 3. GENERIC HELPERS
  // =========================================================
  const DIRS_DIAG = [[-1,-1],[-1,1],[1,-1],[1,1]];
  const DIRS_ORTHO = [[-1,0],[1,0],[0,-1],[0,1]];
  const DIRS_ALL8 = DIRS_ORTHO.concat(DIRS_DIAG);
 
  function other(p){ return p === "black" ? "white" : "black"; }
  function forwardDir(owner){ return owner === "black" ? -1 : 1; }
  function goldSteps(dir){ return [[dir,-1],[dir,0],[dir,1],[0,-1],[0,1],[-dir,0]]; }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function isBackRank(owner, row, rows){ return owner === "black" ? row === 0 : row === rows - 1; }
  function deepBoard(bd){ return bd.map(row => row.map(cell => cell ? Object.assign({}, cell) : null)); }
  function deepHands(h){ return { black: Object.assign({}, h.black), white: Object.assign({}, h.white) }; }
 
  // =========================================================
  // 4. GAME CONFIGS
  // =========================================================
  let CFG = null;
 
  const SHOGI_CONFIG = {
    id:"shogi", label:"Shogi", ROWS:9, COLS:9, cellSize:58,
    royalType:"K", hasTryRule:false, noDrawOnStalemate:false, showStarPoints:true, checkRepetition:true,
    learningAidsDefault:false,
    handOrder:["R","B","G","S","N","L","P"],
    legend: `<b>K</b> King &nbsp; <b>R</b> Rook &nbsp; <b>B</b> Bishop &nbsp; <b>G</b> Gold General &nbsp;
      <b>S</b> Silver General &nbsp; <b>N</b> Knight &nbsp; <b>L</b> Lance &nbsp; <b>P</b> Pawn
      <br>A piece marked with a <span class="plus">+</span> has promoted.`,
    walkthrough: [
      "Click one of your pieces to see its legal moves highlighted, then click a destination to move.",
      "Captured pieces join your hand below the board — click one, then click an empty square to drop it back into play.",
      "Some moves let you choose to promote; a few (like a Pawn reaching the last row) promote automatically.",
      "Checkmate the opponent's King to win."
    ],
    baseValue:{ P:1, L:3, N:4, S:5, G:6, B:8, R:10, K:0 },
    promotedValue:{ P:6, L:6, N:6, S:6, B:10, R:12 },
    difficulty:{ easy:{depth:0,timeMs:0}, medium:{depth:2,timeMs:600}, hard:{depth:3,timeMs:1800} },
    initialBoard(){
      const b = Array.from({length:9}, () => Array(9).fill(null));
      const back = ["L","N","S","G","K","G","S","N","L"];
      for (let c=0;c<9;c++){
        b[0][c] = { type: back[c], owner:"white", promoted:false };
        b[8][c] = { type: back[c], owner:"black", promoted:false };
      }
      b[1][1] = { type:"R", owner:"white", promoted:false };
      b[1][7] = { type:"B", owner:"white", promoted:false };
      b[7][1] = { type:"B", owner:"black", promoted:false };
      b[7][7] = { type:"R", owner:"black", promoted:false };
      for (let c=0;c<9;c++){
        b[2][c] = { type:"P", owner:"white", promoted:false };
        b[6][c] = { type:"P", owner:"black", promoted:false };
      }
      return b;
    },
    moveSetFor(piece){
      const dir = forwardDir(piece.owner);
      if (piece.promoted){
        if (piece.type === "B") return { slides: DIRS_DIAG, steps: DIRS_ORTHO };
        if (piece.type === "R") return { slides: DIRS_ORTHO, steps: DIRS_DIAG };
        return { steps: goldSteps(dir) };
      }
      switch (piece.type){
        case "P": return { steps: [[dir,0]] };
        case "L": return { slides: [[dir,0]] };
        case "N": return { steps: [[2*dir,-1],[2*dir,1]] };
        case "S": return { steps: [[dir,-1],[dir,0],[dir,1],[-dir,-1],[-dir,1]] };
        case "G": return { steps: goldSteps(dir) };
        case "K": return { steps: DIRS_ALL8 };
        case "B": return { slides: DIRS_DIAG };
        case "R": return { slides: DIRS_ORTHO };
      }
    },
    isPromotable(piece){ return ["P","L","N","S","B","R"].includes(piece.type) && !piece.promoted; },
    inZone(owner, row){ return owner === "black" ? row <= 2 : row >= CFG.ROWS - 3; },
    mustPromote(piece, destRow){
      if (piece.type === "P" || piece.type === "L") return piece.owner === "black" ? destRow === 0 : destRow === CFG.ROWS - 1;
      if (piece.type === "N") return piece.owner === "black" ? destRow <= 1 : destRow >= CFG.ROWS - 2;
      return false;
    },
    isDropLegal(bd, hands, player, type, r, c, checkUchi){
      if (bd[r][c]) return false;
      if (type === "P"){
        for (let i=0;i<CFG.ROWS;i++){ const p=bd[i][c]; if (p && p.owner===player && p.type==="P" && !p.promoted) return false; }
        if (player === "black" && r === 0) return false;
        if (player === "white" && r === CFG.ROWS-1) return false;
      }
      if (type === "L"){
        if (player === "black" && r === 0) return false;
        if (player === "white" && r === CFG.ROWS-1) return false;
      }
      if (type === "N"){
        if (player === "black" && r <= 1) return false;
        if (player === "white" && r >= CFG.ROWS-2) return false;
      }
      const nb = deepBoard(bd);
      nb[r][c] = { type:type, owner:player, promoted:false };
      if (isInCheck(nb, player)) return false;
      if (type === "P" && checkUchi !== false){
        const opp = other(player);
        if (isInCheck(nb, opp)){
          const oppMoves = allLegalMoves(nb, hands, opp, false);
          if (oppMoves.length === 0) return false;
        }
      }
      return true;
    }
  };
 
  const DOBUTSU_CONFIG = {
    id:"dobutsu", label:"Dobutsu Shogi", ROWS:4, COLS:3, cellSize:100,
    royalType:"L", hasTryRule:true, noDrawOnStalemate:true, showStarPoints:false, checkRepetition:false,
    learningAidsDefault:true,
    handOrder:["G","E","C"],
    legend: `<b>L</b> Lion &nbsp; <b>G</b> Giraffe &nbsp; <b>E</b> Elephant &nbsp; <b>C</b> Chick
      <br>A Chick reaching the far row promotes to a Hen (shown as <span class="plus">+C</span>).
      Marching your Lion safely into the opponent's home row is an instant win.`,
    walkthrough: [
      "Click a piece to see its legal moves, then click a destination to move it.",
      "Captured pieces join your hand — click one, then click an empty square to drop it.",
      "A Chick reaching the far row always promotes to a Hen.",
      "You win by capturing the Lion, checkmating it, or marching your own Lion safely into the opponent's home row."
    ],
    baseValue:{ L:0, G:4, E:4, C:2 },
    promotedValue:{ C:6 },
    difficulty:{ easy:{depth:0,timeMs:0}, medium:{depth:4,timeMs:500}, hard:{depth:7,timeMs:1500} },
    initialBoard(){
      const b = Array.from({length:4}, () => Array(3).fill(null));
      b[0][0] = { type:"G", owner:"white", promoted:false };
      b[0][1] = { type:"L", owner:"white", promoted:false };
      b[0][2] = { type:"E", owner:"white", promoted:false };
      b[1][1] = { type:"C", owner:"white", promoted:false };
      b[2][1] = { type:"C", owner:"black", promoted:false };
      b[3][0] = { type:"E", owner:"black", promoted:false };
      b[3][1] = { type:"L", owner:"black", promoted:false };
      b[3][2] = { type:"G", owner:"black", promoted:false };
      return b;
    },
    moveSetFor(piece){
      const dir = forwardDir(piece.owner);
      if (piece.type === "C" && piece.promoted) return { steps: goldSteps(dir) };
      switch (piece.type){
        case "L": return { steps: DIRS_ALL8 };
        case "G": return { steps: DIRS_ORTHO };
        case "E": return { steps: DIRS_DIAG };
        case "C": return { steps: [[dir,0]] };
      }
    },
    isPromotable(piece){ return piece.type === "C" && !piece.promoted; },
    inZone(owner, row){ return isBackRank(owner, row, CFG.ROWS); },
    mustPromote(piece, destRow){ return isBackRank(piece.owner, destRow, CFG.ROWS); },
    isDropLegal(bd, hands, player, type, r, c){
      if (bd[r][c]) return false;
      const nb = deepBoard(bd);
      nb[r][c] = { type:type, owner:player, promoted:false };
      if (isInCheck(nb, player)) return false;
      return true;
    }
  };
 
  // =========================================================
  // 5. GENERIC RULE ENGINE
  // =========================================================
  function pieceTargets(bd, r, c){
    const piece = bd[r][c];
    const ms = CFG.moveSetFor(piece);
    const targets = [];
    if (ms.steps){
      for (const [dr,dc] of ms.steps){
        const nr=r+dr, nc=c+dc;
        if (nr<0||nr>=CFG.ROWS||nc<0||nc>=CFG.COLS) continue;
        const t=bd[nr][nc];
        if (!t || t.owner!==piece.owner) targets.push([nr,nc]);
      }
    }
    if (ms.slides){
      for (const [dr,dc] of ms.slides){
        let nr=r+dr, nc=c+dc;
        while (nr>=0 && nr<CFG.ROWS && nc>=0 && nc<CFG.COLS){
          const t=bd[nr][nc];
          if (!t){ targets.push([nr,nc]); }
          else { if (t.owner!==piece.owner) targets.push([nr,nc]); break; }
          nr+=dr; nc+=dc;
        }
      }
    }
    return targets;
  }
  function findRoyal(bd, owner){
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p=bd[r][c]; if (p && p.owner===owner && p.type===CFG.royalType) return [r,c];
    }
    return null;
  }
  function isSquareAttacked(bd, r, c, byOwner){
    for (let i=0;i<CFG.ROWS;i++) for (let j=0;j<CFG.COLS;j++){
      const p=bd[i][j];
      if (p && p.owner===byOwner){
        const targets=pieceTargets(bd,i,j);
        for (const [tr,tc] of targets) if (tr===r && tc===c) return true;
      }
    }
    return false;
  }
  function isInCheck(bd, owner){
    const k=findRoyal(bd,owner); if (!k) return false;
    return isSquareAttacked(bd, k[0], k[1], other(owner));
  }
  function genMovesForPiece(bd, r, c){
    const piece=bd[r][c];
    const targets=pieceTargets(bd,r,c);
    const moves=[];
    const promotable=CFG.isPromotable(piece);
    for (const [tr,tc] of targets){
      const zoneMove = promotable && (CFG.inZone(piece.owner,r) || CFG.inZone(piece.owner,tr));
      const forced = promotable && CFG.mustPromote(piece, tr);
      if (forced){ moves.push({ from:[r,c], to:[tr,tc], promote:true }); }
      else if (zoneMove){ moves.push({ from:[r,c], to:[tr,tc], promote:false }); moves.push({ from:[r,c], to:[tr,tc], promote:true }); }
      else { moves.push({ from:[r,c], to:[tr,tc], promote:false }); }
    }
    return moves;
  }
  function simulateMove(bd, move){
    const nb = deepBoard(bd);
    const [fr,fc]=move.from, [tr,tc]=move.to;
    const piece = Object.assign({}, nb[fr][fc]);
    nb[fr][fc]=null;
    if (move.promote) piece.promoted=true;
    nb[tr][tc]=piece;
    return nb;
  }
  function isMoveLegal(bd, move, mover){ return !isInCheck(simulateMove(bd,move), mover); }
  function allLegalMoves(bd, hands, player, checkUchi){
    const moves=[];
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p=bd[r][c];
      if (p && p.owner===player){
        const pm=genMovesForPiece(bd,r,c);
        for (const m of pm) if (isMoveLegal(bd,m,player)) moves.push(m);
      }
    }
    for (const type of CFG.handOrder){
      if (hands[player][type] > 0){
        for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
          if (!bd[r][c] && CFG.isDropLegal(bd,hands,player,type,r,c,checkUchi)){
            moves.push({ drop:type, to:[r,c] });
          }
        }
      }
    }
    return moves;
  }
  function tryRuleWin(bd, player, move){
    if (!CFG.hasTryRule || move.drop) return false;
    const piece = bd[move.from[0]][move.from[1]];
    if (piece.type !== CFG.royalType) return false;
    return isBackRank(player, move.to[0], CFG.ROWS);
  }
 
  // =========================================================
  // 6. COMPUTER OPPONENT
  // =========================================================
  const WIN_SCORE = 100000;
  function pieceValue(p){ return p.promoted ? CFG.promotedValue[p.type] : CFG.baseValue[p.type]; }
  function lionAdvanceBonus(bd, owner){
    const k=findRoyal(bd,owner); if (!k) return 0;
    const targetRow = owner==="black" ? 0 : CFG.ROWS-1;
    const dist = Math.abs(k[0]-targetRow);
    return (CFG.ROWS-1-dist)*0.4;
  }
  function evaluate(bd, hnds, forPlayer){
    let score=0;
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p=bd[r][c]; if (p){ const v=pieceValue(p); score += (p.owner===forPlayer?v:-v); }
    }
    for (const t of CFG.handOrder){
      score += hnds[forPlayer][t]*CFG.baseValue[t];
      score -= hnds[other(forPlayer)][t]*CFG.baseValue[t];
    }
    if (CFG.hasTryRule){ score += lionAdvanceBonus(bd,forPlayer) - lionAdvanceBonus(bd,other(forPlayer)); }
    return score;
  }
  function applySim(bd, hnds, player, move){
    const nb=deepBoard(bd);
    const nh=deepHands(hnds);
    if (move.drop){
      nh[player][move.drop]--;
      nb[move.to[0]][move.to[1]] = { type:move.drop, owner:player, promoted:false };
    } else {
      const [fr,fc]=move.from, [tr,tc]=move.to;
      const piece=Object.assign({}, nb[fr][fc]);
      const captured=nb[tr][tc];
      if (captured){ nh[player][captured.type] = (nh[player][captured.type]||0)+1; }
      nb[fr][fc]=null;
      piece.promoted = piece.promoted || move.promote;
      nb[tr][tc]=piece;
    }
    return { nb, nh };
  }
  function moveScore(m, bd){
    let s=0;
    if (!m.drop){ const target=bd[m.to[0]][m.to[1]]; if (target) s += pieceValue(target)*10; if (m.promote) s += 3; }
    else s -= 1;
    return s;
  }
  function orderMoves(moves, bd){ moves.sort((a,b) => moveScore(b,bd)-moveScore(a,bd)); }
  function negamax(bd, hnds, player, depth, alpha, beta, deadline){
    if (depth===0 || Date.now()>deadline) return evaluate(bd,hnds,player);
    const moves = allLegalMoves(bd,hnds,player,false);
    if (moves.length===0){
      if (CFG.noDrawOnStalemate) return -(WIN_SCORE+depth);
      return isInCheck(bd,player) ? -(WIN_SCORE+depth) : 0;
    }
    orderMoves(moves,bd);
    let best=-Infinity;
    for (const m of moves){
      const val = moveValue(bd,hnds,player,m,depth,alpha,beta,deadline);
      if (val>best) best=val;
      if (best>alpha) alpha=best;
      if (alpha>=beta) break;
    }
    return best;
  }
  function moveValue(bd, hnds, player, move, depth, alpha, beta, deadline){
    if (tryRuleWin(bd,player,move)) return WIN_SCORE+depth;
    const { nb, nh } = applySim(bd,hnds,player,move);
    return -negamax(nb,nh,other(player),depth-1,-beta,-alpha,deadline);
  }
  function computeAIMove(bd, hnds, player, difficulty){
    const settings = CFG.difficulty[difficulty] || CFG.difficulty.medium;
    const rootMoves = allLegalMoves(bd,hnds,player,true);
    if (rootMoves.length===0) return null;
    if (settings.depth===0) return rootMoves[Math.floor(Math.random()*rootMoves.length)];
    const deadline = Date.now()+settings.timeMs;
    let bestMove=null;
    for (let d=1; d<=settings.depth; d++){
      orderMoves(rootMoves,bd);
      let alpha=-Infinity, beta=Infinity, currentBest=null, currentBestScore=-Infinity, timedOut=false;
      for (const m of rootMoves){
        if (Date.now()>deadline){ timedOut=true; break; }
        const val = moveValue(bd,hnds,player,m,d,alpha,beta,deadline);
        if (val>currentBestScore){ currentBestScore=val; currentBest=m; }
        if (currentBestScore>alpha) alpha=currentBestScore;
      }
      if (!timedOut && currentBest){ bestMove=currentBest; } else break;
    }
    if (!bestMove) bestMove = rootMoves[Math.floor(Math.random()*rootMoves.length)];
    return bestMove;
  }
 
  // =========================================================
  // 7. NOTATION + POSITION KEY (for history panel & repetition)
  // =========================================================
  function coordStr(r,c){ return String(CFG.COLS-c) + String.fromCharCode(97+r); }
  function notationFor(move, movedType, captured){
    const to = coordStr(move.to[0], move.to[1]);
    if (move.drop) return to + move.drop + "*";
    return to + movedType + (move.promote ? "+" : "") + (captured ? "x" : "");
  }
  function positionKey(){
    let s = turn + "|";
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p=board[r][c];
      s += p ? (p.owner[0]+p.type+(p.promoted?"+":"-")) : ".";
    }
    s += "|";
    for (const side of ["black","white"]) for (const t of CFG.handOrder) s += hands[side][t] + ",";
    return s;
  }
 
  // =========================================================
  // 8. GAME STATE
  // =========================================================
  let board, hands, turn, selected, candidateMoves, gameOver, winner, statusMsg, lastMove, pendingMatches;
  let whiteHandSlots = [], blackHandSlots = [];
  let mode = "pvp", humanSide = "black", difficulty = "medium", aiThinking = false;
  let history = [], liveIndex = 0, viewIndex = 0;
  let flipped = false, learningAids = false, hintMove = null;
  let darkMode = false, soundOn = true;
 
  function aiSide(){ return other(humanSide); }
  function isAITurn(){ return mode==="cpu" && turn===aiSide() && !gameOver; }
  function emptyHand(){ const h={}; for (const t of CFG.handOrder) h[t]=0; return h; }
  function reviewing(){ return viewIndex !== liveIndex; }
 
  function enterGame(id){
    CFG = id === "shogi" ? SHOGI_CONFIG : DOBUTSU_CONFIG;
    document.getElementById("gameTitle").textContent = CFG.label;
    document.getElementById("legend").innerHTML = CFG.legend + `
      <br>Mode, difficulty and settings apply on the next New Game.`;
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    learningAids = !!CFG.learningAidsDefault;
    learningAidsChk.checked = learningAids;
    applyLayout();
    newGame();
    maybeShowWalkthrough();
  }
 
  function newGame(){
    mode = modeSelect.value;
    humanSide = sideSelect.value;
    difficulty = difficultySelect.value;
    learningAids = learningAidsChk.checked;
 
    board = CFG.initialBoard();
    hands = { black: emptyHand(), white: emptyHand() };
    turn = "black";
    selected = null; candidateMoves = [];
    gameOver = false; winner = null;
    lastMove = null; pendingMatches = null; aiThinking = false; hintMove = null;
    statusMsg = "Black's turn.";
    history = [ snapshotNow(null) ];
    liveIndex = 0; viewIndex = 0;
    updateHistoryPanel();
    render();
    maybeTriggerAI();
  }
 
  function snapshotNow(notation){
    return {
      board: deepBoard(board), hands: deepHands(hands), turn, gameOver, winner, statusMsg, lastMove,
      notation, posKey: CFG.checkRepetition ? positionKey() : null
    };
  }
 
  function finalizeMove(notation){
    if (liveIndex < history.length - 1) history.length = liveIndex + 1;
    history.push(snapshotNow(notation));
    liveIndex = history.length - 1;
    viewIndex = liveIndex;
    updateHistoryPanel();
    if (gameOver) recordStats();
  }
 
  function restoreSnapshot(idx){
    const snap = history[idx];
    board = deepBoard(snap.board); hands = deepHands(snap.hands);
    turn = snap.turn; gameOver = snap.gameOver; winner = snap.winner;
    statusMsg = snap.statusMsg; lastMove = snap.lastMove;
    clearSelection(); hintMove = null;
    render();
  }
 
  function movesFromSelection(){
    if (!selected) return [];
    if (selected.kind === "board"){
      const [r,c] = selected.pos;
      return genMovesForPiece(board, r, c).filter(m => isMoveLegal(board, m, turn));
    }
    const type = selected.piece;
    const list = [];
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      if (!board[r][c] && CFG.isDropLegal(board, hands, turn, type, r, c, true)) list.push({ drop:type, to:[r,c] });
    }
    return list;
  }
  function clearSelection(){ selected = null; candidateMoves = []; }
 
  function applyMoveCommit(move){
    let movedType = null, captured = null, fromRC = null, toRC = move.to;
    if (move.drop){
      hands[turn][move.drop]--;
      board[move.to[0]][move.to[1]] = { type: move.drop, owner: turn, promoted:false };
      lastMove = { to: move.to };
      playSound("move");
    } else {
      const [fr,fc] = move.from, [tr,tc] = move.to;
      fromRC = [fr,fc];
      const piece = board[fr][fc];
      movedType = piece.type;
      captured = board[tr][tc];
      if (captured){
        hands[turn][captured.type] = (hands[turn][captured.type] || 0) + 1;
        if (captured.type === CFG.royalType){
          board[fr][fc] = null; piece.promoted = piece.promoted || move.promote; board[tr][tc] = piece;
          lastMove = { from: move.from, to: move.to };
          gameOver = true; winner = turn;
          clearSelection(); hintMove = null;
          statusMsg = "Checkmate — " + cap(winner) + " wins!";
          finalizeMove(notationFor(move, movedType, true));
          playSound("win");
          render();
          return;
        }
      }
      const animFrom = fromRC, animTo = toRC, animPiece = Object.assign({}, piece);
      board[fr][fc] = null;
      piece.promoted = piece.promoted || move.promote;
      board[tr][tc] = piece;
      lastMove = { from: move.from, to: move.to };
      playSound(captured ? "capture" : "move");
      startSlideAnimation(animFrom, animTo, animPiece);
    }
 
    if (CFG.hasTryRule && !move.drop && movedType === CFG.royalType && isBackRank(turn, move.to[0], CFG.ROWS)){
      gameOver = true; winner = turn;
      clearSelection(); hintMove = null;
      statusMsg = cap(winner) + "'s Lion reaches home — " + cap(winner) + " wins!";
      finalizeMove(notationFor(move, movedType, !!captured));
      playSound("win");
      render();
      return;
    }
 
    hintMove = null;
    endTurn(notationFor(move, movedType, !!captured));
  }
 
  function endTurn(notation){
    clearSelection();
    turn = other(turn);
    const chk = isInCheck(board, turn);
    const moves = allLegalMoves(board, hands, turn, true);
 
    if (CFG.checkRepetition){
      const key = positionKey();
      let count = 1;
      for (let i=0;i<=liveIndex;i++) if (history[i].posKey === key) count++;
      if (count >= 4){
        gameOver = true;
        statusMsg = "Repetition — draw (same position occurred four times).";
        finalizeMove(notation);
        render();
        return;
      }
    }
 
    if (moves.length === 0){
      gameOver = true;
      if (CFG.noDrawOnStalemate){
        winner = other(turn);
        statusMsg = (chk ? "Checkmate — " : "Stalemate — ") + cap(winner) + " wins!";
      } else if (chk){
        winner = other(turn);
        statusMsg = "Checkmate — " + cap(winner) + " wins!";
      } else {
        statusMsg = cap(turn) + " has no legal moves. Draw.";
      }
      finalizeMove(notation);
      playSound(winner ? "win" : "move");
      render();
      return;
    }
    if (chk) playSound("check");
    statusMsg = chk ? (cap(turn) + " is in check!") : (cap(turn) + "'s turn.");
    finalizeMove(notation);
    render();
    maybeTriggerAI();
  }
 
  function maybeTriggerAI(){
    if (!isAITurn()) return;
    aiThinking = true; statusMsg = "Computer is thinking..."; render();
    setTimeout(runAITurn, 250);
  }
  function runAITurn(){
    if (gameOver){ aiThinking = false; return; }
    const move = computeAIMove(board, hands, turn, difficulty);
    aiThinking = false;
    if (!move){ render(); return; }
    applyMoveCommit(move);
  }
 
  // ---- Undo / Redo ----
  function undo(){
    if (liveIndex <= 0) return;
    liveIndex--;
    if (mode === "cpu"){ while (liveIndex > 0 && history[liveIndex].turn === aiSide()) liveIndex--; }
    viewIndex = liveIndex;
    restoreSnapshot(liveIndex);
    maybeTriggerAI();
  }
  function redo(){
    if (liveIndex >= history.length - 1) return;
    liveIndex++;
    if (mode === "cpu"){ while (liveIndex < history.length-1 && history[liveIndex].turn === aiSide()) liveIndex++; }
    viewIndex = liveIndex;
    restoreSnapshot(liveIndex);
    maybeTriggerAI();
  }
 
  // ---- Resign ----
  function doResign(){
    if (gameOver) return;
    const resigningPlayer = mode === "cpu" ? humanSide : turn;
    winner = other(resigningPlayer);
    gameOver = true;
    clearSelection(); hintMove = null;
    statusMsg = cap(resigningPlayer) + " resigned — " + cap(winner) + " wins!";
    finalizeMove("resign");
    playSound("win");
    render();
  }
 
  // ---- History panel ----
  function updateHistoryPanel(){
    const tbl = document.getElementById("historyTable");
    let rows = "";
    for (let i=1;i<history.length;i+=2){
      const moveNum = Math.ceil(i/2);
      const blackCell = `<td class="moveEntry${i===viewIndex?' current':''}" data-idx="${i}">${history[i].notation||''}</td>`;
      const whiteCell = (i+1<history.length) ? `<td class="moveEntry${(i+1)===viewIndex?' current':''}" data-idx="${i+1}">${history[i+1].notation||''}</td>` : `<td></td>`;
      rows += `<tr><td class="moveNum">${moveNum}</td>${blackCell}${whiteCell}</tr>`;
    }
    tbl.innerHTML = rows;
    tbl.querySelectorAll(".moveEntry").forEach(td => {
      td.addEventListener("click", () => {
        const idx = parseInt(td.dataset.idx, 10);
        viewIndex = idx;
        restoreSnapshot(idx);
        updateHistoryPanel();
        updateReviewBanner();
      });
    });
    const list = document.getElementById("historyList");
    list.scrollTop = list.scrollHeight;
  }
  function updateReviewBanner(){
    const banner = document.getElementById("reviewBanner");
    if (reviewing()){
      banner.classList.remove("hidden");
      document.getElementById("reviewLabel").textContent = "Reviewing move " + viewIndex;
    } else {
      banner.classList.add("hidden");
    }
  }
  document.getElementById("returnLiveBtn").addEventListener("click", () => {
    viewIndex = liveIndex;
    restoreSnapshot(liveIndex);
    updateHistoryPanel();
    updateReviewBanner();
  });
 
  // ---- Stats (localStorage) ----
  function loadStats(){
    try { return JSON.parse(localStorage.getItem("shogi_stats_v1")) || {}; } catch(e){ return {}; }
  }
  function saveStats(s){ try { localStorage.setItem("shogi_stats_v1", JSON.stringify(s)); } catch(e){} }
  function recordStats(){
    if (mode !== "cpu" || !gameOver) return;
    const stats = loadStats();
    if (!stats[CFG.id]) stats[CFG.id] = {};
    if (!stats[CFG.id][difficulty]) stats[CFG.id][difficulty] = { w:0, l:0, d:0 };
    const bucket = stats[CFG.id][difficulty];
    if (!winner){ bucket.d++; }
    else if (winner === humanSide){ bucket.w++; }
    else { bucket.l++; }
    saveStats(stats);
  }
  function renderStatsTable(){
    const stats = loadStats();
    let html = "<table><tr><th>Game</th><th>Difficulty</th><th>W</th><th>L</th><th>D</th></tr>";
    for (const gid of ["shogi","dobutsu"]){
      const label = gid === "shogi" ? "Shogi" : "Dobutsu";
      for (const diff of ["easy","medium","hard"]){
        const b = (stats[gid] && stats[gid][diff]) || { w:0,l:0,d:0 };
        html += `<tr><td>${label}</td><td>${cap(diff)}</td><td>${b.w}</td><td>${b.l}</td><td>${b.d}</td></tr>`;
      }
    }
    html += "</table>";
    document.getElementById("statsTable").innerHTML = html;
  }
 
  // ---- Save / Load (compact shareable code, not a standard format) ----
  function encodeGameCode(){
    const payload = { g: CFG.id, m: mode, s: humanSide, d: difficulty, b: board, h: hands, t: turn, go: gameOver, w: winner };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }
  function decodeGameCode(code){
    const payload = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (payload.g !== "shogi" && payload.g !== "dobutsu") throw new Error("Unknown game id");
    return payload;
  }
  function loadGameCode(code){
    const payload = decodeGameCode(code);
    CFG = payload.g === "shogi" ? SHOGI_CONFIG : DOBUTSU_CONFIG;
    document.getElementById("gameTitle").textContent = CFG.label;
    document.getElementById("legend").innerHTML = CFG.legend + `<br>Mode, difficulty and settings apply on the next New Game.`;
    mode = payload.m; humanSide = payload.s; difficulty = payload.d;
    modeSelect.value = mode; sideSelect.value = humanSide; difficultySelect.value = difficulty;
    sideLabel.style.display = mode === "cpu" ? "flex" : "none";
    difficultyLabel.style.display = mode === "cpu" ? "flex" : "none";
    board = payload.b; hands = payload.h; turn = payload.t;
    gameOver = !!payload.go; winner = payload.w || null;
    selected = null; candidateMoves = []; lastMove = null; pendingMatches = null; aiThinking = false; hintMove = null;
    statusMsg = gameOver ? (winner ? (cap(winner)+" wins!") : "Draw.") : (cap(turn) + "'s turn.");
    applyLayout();
    history = [ snapshotNow(null) ]; liveIndex = 0; viewIndex = 0;
    updateHistoryPanel(); updateReviewBanner();
    render();
    maybeTriggerAI();
  }
 
  // =========================================================
  // 9. LAYOUT
  // =========================================================
  const SIDE_PAD = 30, LABEL_PAD = 22, GAP = 8;
  let CELL, BOARD_W, BOARD_H, boardX, boardY, whiteHandY, blackHandY, CANVAS_W, CANVAS_H, HAND_H, slotSize, gapX;
 
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
 
  function applyLayout(){
    CELL = CFG.cellSize;
    BOARD_W = CELL * CFG.COLS; BOARD_H = CELL * CFG.ROWS;
    slotSize = Math.round(CELL * 0.75); gapX = slotSize + 12;
    HAND_H = Math.max(90, slotSize + 55);
    boardX = SIDE_PAD; boardY = HAND_H + GAP + LABEL_PAD;
    whiteHandY = 0; blackHandY = boardY + BOARD_H + LABEL_PAD + GAP;
    CANVAS_W = BOARD_W + SIDE_PAD*2; CANVAS_H = blackHandY + HAND_H;
    canvas.width = CANVAS_W; canvas.height = CANVAS_H;
  }
 
  // =========================================================
  // 10. AUDIO (synthesized, no external files)
  // =========================================================
  let audioCtx = null;
  function ensureAudio(){
    if (!audioCtx){ try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }
  function tone(freq, duration, type, gainStart){
    if (!soundOn || !audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = type || "sine"; osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainStart || 0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  }
  function playSound(kind){
    if (!soundOn) return;
    if (kind === "move") tone(520, 0.07, "sine", 0.09);
    else if (kind === "capture") tone(300, 0.12, "triangle", 0.14);
    else if (kind === "check"){ tone(720,0.09,"square",0.07); setTimeout(()=>tone(500,0.11,"square",0.07), 90); }
    else if (kind === "win"){ [523,659,784].forEach((f,i)=>setTimeout(()=>tone(f,0.22,"sine",0.11), i*110)); }
  }
 
  // =========================================================
  // 11. PIECE SLIDE ANIMATION (decorative overlay, non-blocking)
  // =========================================================
  let anim = null;
  function startSlideAnimation(fromRC, toRC, piece){
    const from = cellCenter(fromRC[0], fromRC[1]);
    const to = cellCenter(toRC[0], toRC[1]);
    anim = { piece, fromX:from.x, fromY:from.y, toX:to.x, toY:to.y, startTime:performance.now(), duration:160, skipR:toRC[0], skipC:toRC[1] };
    requestAnimationFrame(stepAnimation);
  }
  function stepAnimation(now){
    if (!anim) return;
    const t = Math.min(1, (now - anim.startTime) / anim.duration);
    render();
    if (t < 1) requestAnimationFrame(stepAnimation);
    else anim = null;
  }
 
  // =========================================================
  // 12. MOUSE / DRAG INTERACTION
  // =========================================================
  function getCanvasCoords(evt){
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
  }
  function slotHit(slots, x, y){
    for (const s of slots) if (x>=s.x && x<=s.x+s.w && y>=s.y && y<=s.y+s.h) return s;
    return null;
  }
  let topHandOwner = "white", bottomHandOwner = "black", topHandSlots = [], bottomHandSlots = [];
  function hitTest(x, y){
    if (y >= whiteHandY && y < whiteHandY + HAND_H){
      const s = slotHit(topHandSlots, x, y);
      return s ? { kind:"hand", player:topHandOwner, piece:s.piece } : null;
    }
    if (y >= blackHandY && y < blackHandY + HAND_H){
      const s = slotHit(bottomHandSlots, x, y);
      return s ? { kind:"hand", player:bottomHandOwner, piece:s.piece } : null;
    }
    if (x >= boardX && x < boardX+BOARD_W && y >= boardY && y < boardY+BOARD_H){
      let r = Math.floor((y-boardY)/CELL), c = Math.floor((x-boardX)/CELL);
      if (flipped){ r = CFG.ROWS-1-r; c = CFG.COLS-1-c; }
      return { kind:"board", r, c };
    }
    return null;
  }
  function interactionBlocked(){
    return gameOver || pendingMatches || aiThinking || isAITurn() || reviewing();
  }
 
  function tryCommitToZone(zone){
    if (selected){
      const matches = candidateMoves.filter(m => m.to[0]===zone.r && m.to[1]===zone.c);
      if (matches.length > 0){
        if (matches.length === 2){ pendingMatches = matches; document.getElementById("promoModal").classList.remove("hidden"); }
        else { applyMoveCommit(matches[0]); }
        return;
      }
      if (selected.kind === "board" && selected.pos[0]===zone.r && selected.pos[1]===zone.c){ clearSelection(); render(); return; }
    }
    const piece = board[zone.r][zone.c];
    if (piece && piece.owner === turn){
      selected = { kind:"board", pos:[zone.r, zone.c] };
      candidateMoves = movesFromSelection();
    } else { clearSelection(); }
    render();
  }
 
  let dragStart = null, dragging = null, suppressNextClick = false;
 
  canvas.addEventListener("mousedown", (e) => {
    ensureAudio();
    if (interactionBlocked()) return;
    const { x, y } = getCanvasCoords(e);
    const zone = hitTest(x, y);
    if (!zone) return;
    const isOwnBoard = zone.kind==="board" && board[zone.r][zone.c] && board[zone.r][zone.c].owner===turn;
    const isOwnHand = zone.kind==="hand" && zone.player===turn && hands[turn][zone.piece]>0;
    if (isOwnBoard || isOwnHand) dragStart = { x, y, zone };
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!dragStart && !dragging) return;
    const { x, y } = getCanvasCoords(e);
    if (dragging){ dragging.currentX=x; dragging.currentY=y; render(); return; }
    if (Math.hypot(x-dragStart.x, y-dragStart.y) > 8){
      selected = dragStart.zone.kind==="board" ? { kind:"board", pos:[dragStart.zone.r, dragStart.zone.c] } : { kind:"hand", piece: dragStart.zone.piece };
      candidateMoves = movesFromSelection();
      dragging = { zone: dragStart.zone, currentX:x, currentY:y };
      dragStart = null; suppressNextClick = true;
      render();
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    if (dragging){
      const { x, y } = getCanvasCoords(e);
      const zone = hitTest(x, y);
      dragging = null;
      if (zone && zone.kind === "board") tryCommitToZone(zone); else render();
      return;
    }
    dragStart = null;
  });
  canvas.addEventListener("mouseleave", () => { if (dragging){ dragging=null; render(); } dragStart=null; });
 
  canvas.addEventListener("click", (e) => {
    if (suppressNextClick){ suppressNextClick=false; return; }
    ensureAudio();
    if (interactionBlocked()) return;
    const { x, y } = getCanvasCoords(e);
    const zone = hitTest(x, y);
    if (!zone){ clearSelection(); render(); return; }
    if (zone.kind === "hand"){
      if (zone.player !== turn){ render(); return; }
      if (!hands[turn][zone.piece]){ render(); return; }
      if (selected && selected.kind==="hand" && selected.piece===zone.piece){ clearSelection(); }
      else { selected = { kind:"hand", piece: zone.piece }; candidateMoves = movesFromSelection(); }
      render();
      return;
    }
    tryCommitToZone(zone);
  });
 
  document.getElementById("promoYes").addEventListener("click", () => {
    const m = pendingMatches.find(mv => mv.promote === true);
    pendingMatches = null; document.getElementById("promoModal").classList.add("hidden");
    applyMoveCommit(m);
  });
  document.getElementById("promoNo").addEventListener("click", () => {
    const m = pendingMatches.find(mv => mv.promote === false);
    pendingMatches = null; document.getElementById("promoModal").classList.add("hidden");
    applyMoveCommit(m);
  });
  document.getElementById("resetBtn").addEventListener("click", newGame);
  document.getElementById("undoBtn").addEventListener("click", undo);
  document.getElementById("redoBtn").addEventListener("click", redo);
  document.getElementById("flipBtn").addEventListener("click", () => { flipped = !flipped; render(); });
  document.getElementById("resignBtn").addEventListener("click", () => {
    if (gameOver) return;
    document.getElementById("resignModal").classList.remove("hidden");
  });
  document.getElementById("resignYes").addEventListener("click", () => {
    document.getElementById("resignModal").classList.add("hidden"); doResign();
  });
  document.getElementById("resignNo").addEventListener("click", () => {
    document.getElementById("resignModal").classList.add("hidden");
  });
 
  learningAidsChk.addEventListener("change", () => {
    learningAids = learningAidsChk.checked;
    document.getElementById("hintRow").classList.toggle("hidden", !learningAids);
    render();
  });
  coordsChk.addEventListener("change", render);
  soundChk.addEventListener("change", () => { soundOn = soundChk.checked; });
 
  document.getElementById("hintBtn").addEventListener("click", () => {
    if (interactionBlocked()) return;
    hintMove = computeAIMove(board, hands, turn, "medium");
    render();
  });
 
  document.getElementById("darkModeBtn").addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
    PAL = darkMode ? PALETTES.dark : PALETTES.light;
    render();
  });
 
  document.getElementById("statsBtn").addEventListener("click", () => {
    renderStatsTable();
    document.getElementById("statsModal").classList.remove("hidden");
  });
  document.getElementById("statsCloseBtn").addEventListener("click", () => document.getElementById("statsModal").classList.add("hidden"));
  document.getElementById("statsResetBtn").addEventListener("click", () => {
    saveStats({}); renderStatsTable();
  });
 
  document.getElementById("copyCodeBtn").addEventListener("click", () => {
    const code = encodeGameCode();
    const msg = document.getElementById("shareMsg");
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(() => { msg.textContent = "Copied!"; setTimeout(()=>msg.textContent="", 2000); })
        .catch(() => { msg.textContent = "Couldn't copy — code is in the box below."; document.getElementById("loadCodeInput").value = code; });
    } else {
      document.getElementById("loadCodeInput").value = code;
      msg.textContent = "Code ready to copy below.";
    }
  });
  document.getElementById("loadCodeBtn").addEventListener("click", () => {
    const msg = document.getElementById("shareMsg");
    const val = document.getElementById("loadCodeInput").value;
    try { loadGameCode(val); msg.textContent = "Loaded!"; setTimeout(()=>msg.textContent="", 2000); }
    catch(e){ msg.textContent = "That code didn't look right."; }
  });
 
  document.getElementById("helpBtn").addEventListener("click", showWalkthrough);
  document.getElementById("walkthroughDone").addEventListener("click", () => {
    document.getElementById("walkthroughModal").classList.add("hidden");
    try { localStorage.setItem("shogi_walkthrough_seen_"+CFG.id, "1"); } catch(e){}
  });
  function showWalkthrough(){
    document.getElementById("walkthroughTitle").textContent = "How to play " + CFG.label;
    document.getElementById("walkthroughBody").innerHTML = CFG.walkthrough.map(li => "<li>"+li+"</li>").join("");
    document.getElementById("walkthroughModal").classList.remove("hidden");
  }
  function maybeShowWalkthrough(){
    if (!learningAids) return;
    let seen = false;
    try { seen = !!localStorage.getItem("shogi_walkthrough_seen_"+CFG.id); } catch(e){}
    if (!seen) showWalkthrough();
  }
 
  // =========================================================
  // 13. RENDERING
  //
  // Flip is implemented by remapping which LOGICAL board cell is drawn at
  // each SCREEN grid position (screenCell = flipped ? mirror(cell) : cell),
  // never by rotating the canvas itself -- that would also rotate every
  // piece of text upside-down, which is the bug this version fixes.
  // =========================================================
  function screenRC(r, c){
    return flipped ? [CFG.ROWS-1-r, CFG.COLS-1-c] : [r, c];
  }
  function cellCenter(r, c){
    const [sr, sc] = screenRC(r, c);
    return { x: boardX + sc*CELL + CELL/2, y: boardY + sr*CELL + CELL/2 };
  }
  function cellTopLeft(r, c){
    const [sr, sc] = screenRC(r, c);
    return { x: boardX + sc*CELL, y: boardY + sr*CELL };
  }
 
  function drawPentagonPath(c, size){
    const hw=size*0.5, h=size;
    c.beginPath();
    c.moveTo(0,-h/2); c.lineTo(hw*0.62,-h/2+h*0.32); c.lineTo(hw,h/2); c.lineTo(-hw,h/2); c.lineTo(-hw*0.62,-h/2+h*0.32);
    c.closePath();
  }
  function drawPiece(cx, cy, size, piece){
    // A piece's orientation is fixed relative to the physical board (it points
    // away from its own owner). Flipping the board view flips how that looks
    // from here, same as walking around a real table -- hence the XOR with
    // the board-level `flipped` state, not just the owner check alone.
    const flip = (piece.owner === "white") !== flipped;
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.rotate(Math.PI);
    drawPentagonPath(ctx, size);
    ctx.fillStyle = piece.owner === "black" ? PAL.pieceBlack : PAL.pieceWhite;
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = piece.promoted ? PAL.seal : PAL.frame;
    ctx.stroke();
    ctx.restore();
 
    ctx.save();
    ctx.fillStyle = piece.promoted ? PAL.seal : PAL.inkText;
    ctx.font = "bold " + Math.round(size*0.34) + "px 'Shippori Mincho', Georgia, serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText((piece.promoted?"+":"") + piece.type, cx, cy + size*0.03);
    ctx.restore();
  }
 
  function drawBoardFrame(){
    ctx.fillStyle = PAL.board;
    ctx.fillRect(boardX, boardY, BOARD_W, BOARD_H);
    ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = PAL.frame;
    for (let i=0;i<CFG.ROWS;i++) if (i%2===0) ctx.fillRect(boardX, boardY+i*CELL, BOARD_W, CELL);
    ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = PAL.frame;
    ctx.strokeRect(boardX, boardY, BOARD_W, BOARD_H);
  }
  function drawGrid(){
    ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1;
    for (let i=1;i<CFG.COLS;i++){ ctx.beginPath(); ctx.moveTo(boardX+i*CELL,boardY); ctx.lineTo(boardX+i*CELL,boardY+BOARD_H); ctx.stroke(); }
    for (let i=1;i<CFG.ROWS;i++){ ctx.beginPath(); ctx.moveTo(boardX,boardY+i*CELL); ctx.lineTo(boardX+BOARD_W,boardY+i*CELL); ctx.stroke(); }
    if (CFG.showStarPoints){
      ctx.fillStyle = PAL.frame;
      for (const rr of [3,6]) for (const cc of [3,6]){ ctx.beginPath(); ctx.arc(boardX+cc*CELL, boardY+rr*CELL, 3, 0, Math.PI*2); ctx.fill(); }
    }
  }
  function drawCoordLabels(){
    if (!coordsChk.checked) return;
    ctx.fillStyle = PAL.label;
    ctx.font = "12px 'Zen Kaku Gothic New', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let c=0;c<CFG.COLS;c++){
      const sc = flipped ? CFG.COLS-1-c : c;
      ctx.fillText(String(CFG.COLS-c), boardX+sc*CELL+CELL/2, boardY-LABEL_PAD/2);
    }
    for (let r=0;r<CFG.ROWS;r++){
      const sr = flipped ? CFG.ROWS-1-r : r;
      ctx.fillText(String.fromCharCode(97+r), boardX+BOARD_W+LABEL_PAD/2, boardY+sr*CELL+CELL/2);
    }
  }
  function drawThreatOverlay(){
    if (!learningAids || gameOver) return;
    const opp = other(turn);
    ctx.save();
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      if (isSquareAttacked(board, r, c, opp)){
        const { x, y } = cellTopLeft(r, c);
        ctx.fillStyle = PAL.threat;
        ctx.fillRect(x, y, CELL, CELL);
      }
    }
    ctx.restore();
  }
  function drawHighlights(){
    if (selected && selected.kind === "board"){
      const [r,c] = selected.pos;
      const { x, y } = cellTopLeft(r,c);
      ctx.save(); ctx.strokeStyle = PAL.seal; ctx.lineWidth = 3;
      ctx.strokeRect(x+2, y+2, CELL-4, CELL-4);
      ctx.restore();
    }
    const seen = new Set();
    for (const m of candidateMoves){
      const key = m.to[0]+","+m.to[1]; if (seen.has(key)) continue; seen.add(key);
      const { x, y } = cellTopLeft(m.to[0], m.to[1]);
      const center = cellCenter(m.to[0], m.to[1]);
      const occupied = board[m.to[0]][m.to[1]];
      ctx.save();
      if (occupied){ ctx.strokeStyle = PAL.captureRing; ctx.lineWidth = 3; ctx.strokeRect(x+3, y+3, CELL-6, CELL-6); }
      else { ctx.fillStyle = PAL.moveDot; ctx.beginPath(); ctx.arc(center.x,center.y,7,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    if (lastMove){
      const { x, y } = cellTopLeft(lastMove.to[0], lastMove.to[1]);
      ctx.save(); ctx.strokeStyle = PAL.lastMove; ctx.lineWidth = 2;
      ctx.strokeRect(x+1, y+1, CELL-2, CELL-2);
      ctx.restore();
    }
    if (hintMove){
      ctx.save(); ctx.strokeStyle = PAL.hint; ctx.lineWidth = 3; ctx.setLineDash([5,4]);
      if (!hintMove.drop){
        const f = cellTopLeft(hintMove.from[0], hintMove.from[1]);
        ctx.strokeRect(f.x+3, f.y+3, CELL-6, CELL-6);
      }
      const t = cellTopLeft(hintMove.to[0], hintMove.to[1]);
      ctx.strokeRect(t.x+3, t.y+3, CELL-6, CELL-6);
      ctx.restore();
    }
    if (!gameOver){
      const k = findRoyal(board, turn);
      if (k && isInCheck(board, turn)) drawGlow(k[0], k[1], PAL.checkGlow);
    }
    if (gameOver && winner){
      const k = findRoyal(board, winner);
      if (k) drawGlow(k[0], k[1], PAL.winGlow);
    }
  }
  function drawGlow(r, c, color){
    const { x, y } = cellCenter(r,c);
    ctx.save();
    const grad = ctx.createRadialGradient(x,y,4,x,y,CELL*0.6);
    grad.addColorStop(0,color); grad.addColorStop(1,color.replace(/[\d.]+\)$/,"0)"));
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x,y,CELL*0.6,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  function drawPieces(){
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p = board[r][c];
      if (!p) continue;
      if (anim && r===anim.skipR && c===anim.skipC) continue;
      if (dragging && dragging.zone.kind==="board" && r===dragging.zone.r && c===dragging.zone.c) continue;
      const { x, y } = cellCenter(r,c);
      drawPiece(x, y, CELL*0.8, p);
    }
    if (anim){
      const t = Math.min(1, (performance.now() - anim.startTime) / anim.duration);
      const ease = 1 - Math.pow(1-t, 2);
      const x = anim.fromX + (anim.toX-anim.fromX)*ease;
      const y = anim.fromY + (anim.toY-anim.fromY)*ease;
      drawPiece(x, y, CELL*0.8, anim.piece);
    }
    if (dragging){
      const piece = selected.kind==="board" ? board[selected.pos[0]][selected.pos[1]] : { type: selected.piece, owner: turn, promoted:false };
      if (piece) drawPiece(dragging.currentX, dragging.currentY, CELL*0.8, piece);
    }
  }
  function drawHandStrip(player, y){
    const items = CFG.handOrder.filter(t => hands[player][t] > 0);
    const isActive = (turn === player) && !gameOver;
    ctx.save();
    ctx.fillStyle = isActive ? PAL.handActiveFill : "rgba(0,0,0,0.02)";
    ctx.fillRect(0, y, CANVAS_W, HAND_H);
    if (isActive){ ctx.strokeStyle = PAL.handActiveBorder; ctx.lineWidth = 2; ctx.strokeRect(2,y+2,CANVAS_W-4,HAND_H-4); }
    ctx.restore();
 
    ctx.save();
    ctx.fillStyle = PAL.label; ctx.font = "13px 'Zen Kaku Gothic New', sans-serif";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    let label = cap(player)+"'s hand";
    if (mode==="cpu" && player===aiSide()) label += " (computer)";
    ctx.fillText(label, boardX, y+8);
    ctx.restore();
 
    const slots = [];
    const startX = boardX, startY = y+30;
    for (let i=0;i<items.length;i++){
      const type = items[i];
      const sx = startX+i*gapX, sy = startY;
      slots.push({ piece:type, x:sx, y:sy, w:slotSize, h:slotSize+14 });
      const cx = sx+slotSize/2, cy = sy+slotSize/2;
      const isSel = selected && selected.kind==="hand" && selected.piece===type && turn===player;
      if (isSel){
        ctx.save(); ctx.strokeStyle = PAL.seal; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx,cy,slotSize*0.62,0,Math.PI*2); ctx.stroke(); ctx.restore();
      }
      drawPiece(cx, cy, slotSize*0.86, { type, owner:player, promoted:false });
      ctx.save();
      ctx.fillStyle = PAL.inkText; ctx.font = "bold 12px 'Zen Kaku Gothic New', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("x"+hands[player][type], cx, sy+slotSize+8);
      ctx.restore();
    }
    if (y === whiteHandY){ topHandOwner = player; topHandSlots = slots; }
    else { bottomHandOwner = player; bottomHandSlots = slots; }
  }
  function updateStatusDOM(){
    const el = document.getElementById("status");
    el.textContent = statusMsg;
    el.classList.remove("check","over","thinking");
    if (aiThinking) el.classList.add("thinking");
    else if (gameOver) el.classList.add("over");
    else if (statusMsg.indexOf("check") !== -1) el.classList.add("check");
    document.getElementById("undoBtn").disabled = liveIndex <= 0;
    document.getElementById("redoBtn").disabled = liveIndex >= history.length-1;
    document.getElementById("resignBtn").disabled = gameOver;
    updateReviewBanner();
  }
 
  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const topPlayer = flipped ? "black" : "white";
    const bottomPlayer = flipped ? "white" : "black";
    drawHandStrip(topPlayer, whiteHandY);
    drawBoardFrame();
    drawGrid();
    drawThreatOverlay();
    drawCoordLabels();
    drawHighlights();
    drawPieces();
    drawHandStrip(bottomPlayer, blackHandY);
    updateStatusDOM();
  }
 
  // Menu is shown by default; enterGame() starts a game when the person picks one.
})();
