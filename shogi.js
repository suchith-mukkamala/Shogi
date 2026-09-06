
(function () {
  "use strict";

  // =========================================================
  // 1. PAGE CONSTRUCTION
  // =========================================================

  document.title = "Shogi Games";

  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1.0";
  document.head.appendChild(meta);

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnect);

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap";
  document.head.appendChild(fontLink);

  const style = document.createElement("style");
  style.textContent = `
    :root{
      --paper: #eee5d3; --board: #d8ac6d; --walnut: #4a3220; --ink: #241a10;
      --ink-soft: #5b4a38; --line: #7a5230; --seal: #a13d2f; --seal-soft: #c96a54;
      --gold-glow: #d9b25c;
    }
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;}
    .hidden{ display:none !important; }
    body{
      background: var(--paper);
      background-image:
        radial-gradient(circle at 15% 20%, rgba(122,82,48,0.06) 0, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(122,82,48,0.06) 0, transparent 40%);
      min-height:100vh;
      display:flex; flex-direction:column; align-items:center;
      padding: 28px 16px 48px;
      font-family:'Zen Kaku Gothic New','Hiragino Sans','Segoe UI',sans-serif;
      color: var(--ink);
    }
    .titleblock{ text-align:center; margin-bottom:6px; }
    h1{
      font-family:'Shippori Mincho', Georgia, serif; font-weight:700;
      font-size:2.3rem; letter-spacing:0.06em; margin:0 0 2px 0; color: var(--walnut);
    }
    .jp{
      font-family:'Shippori Mincho', Georgia, serif; font-size:0.95rem;
      color: var(--ink-soft); letter-spacing:0.3em; margin:0;
    }
    #gameChoices{
      display:flex; gap:18px; flex-wrap:wrap; justify-content:center;
      margin-top:28px; max-width:760px;
    }
    .gameCard{
      width:220px; border:1px solid var(--line); border-radius:10px;
      background: rgba(255,255,255,0.35); padding:18px 16px; text-align:center;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .gameCard:not(.disabled):hover{ transform: translateY(-3px); box-shadow: 0 8px 18px rgba(74,50,32,0.18); }
    .gameCard h2{
      font-family:'Shippori Mincho', Georgia, serif; font-size:1.25rem; margin:0 0 8px 0; color: var(--walnut);
    }
    .gameCard p{ font-size:0.85rem; color: var(--ink-soft); line-height:1.5; min-height:3.5em; }
    .gameCard.disabled{ opacity:0.55; }
    .gameCard .soon{
      display:block; font-size:0.7rem; letter-spacing:0.05em; color: var(--seal);
      margin-top:2px; font-weight:700;
    }
    #setupBar{
      display:flex; align-items:center; gap:16px; flex-wrap:wrap; justify-content:center;
      margin-top: 14px; padding: 10px 18px; border:1px solid var(--line); border-radius:6px;
      background: rgba(255,255,255,0.3); font-size:0.86rem;
    }
    #setupBar label{ display:flex; align-items:center; gap:6px; color: var(--ink-soft); }
    #setupBar select{
      font-family:'Zen Kaku Gothic New', sans-serif; font-size:0.86rem; padding:4px 8px;
      border-radius:4px; border:1px solid var(--line); background:#fbf3e3; color: var(--ink);
    }
    #statusBar{ margin:14px 0 10px; min-height:30px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:center; }
    #status{
      font-family:'Shippori Mincho', Georgia, serif; font-size:1.15rem; font-weight:500;
      padding:6px 22px; border:1px solid var(--line); border-radius:3px; background: rgba(255,255,255,0.35);
    }
    #status.check{ color: var(--seal); border-color: var(--seal); font-weight:700; }
    #status.over{ color: var(--seal); font-weight:700; }
    #status.thinking{ color: var(--ink-soft); font-style: italic; }
    button{
      font-family:'Zen Kaku Gothic New', sans-serif; font-weight:700; font-size:0.88rem;
      letter-spacing:0.04em; border:none; cursor:pointer; padding:8px 18px; border-radius:999px;
      background: var(--seal); color:#fbf1e6; transition: transform 0.12s ease, background 0.15s ease;
    }
    button:hover{ background: var(--seal-soft); transform: translateY(-1px); }
    button:active{ transform: translateY(0); }
    button:disabled{ background:#b7a68e; cursor:default; transform:none; }
    .linkBtn{
      background:transparent; color: var(--ink-soft); padding:4px 8px; border-radius:4px;
      font-weight:500; text-decoration:underline; margin-bottom:6px;
    }
    .linkBtn:hover{ background: rgba(0,0,0,0.05); color: var(--ink); transform:none; }
    #boardWrap{ position:relative; filter: drop-shadow(0 10px 22px rgba(40,25,10,0.28)); }
    canvas{ display:block; touch-action:none; cursor:pointer; }
    #legend{ margin-top:18px; max-width:560px; text-align:center; font-size:0.82rem; line-height:1.7; color: var(--ink-soft); }
    #legend b{ color: var(--ink); }
    #legend .plus{ color: var(--seal); font-weight:700; }
    .modal-overlay{ position:fixed; inset:0; background: rgba(30,20,10,0.45); display:flex; align-items:center; justify-content:center; z-index:50; }
    .modal-card{ background: var(--paper); border:1px solid var(--line); border-radius:6px; padding:22px 26px; text-align:center; box-shadow:0 12px 30px rgba(0,0,0,0.3); }
    .modal-card p{ font-family:'Shippori Mincho', Georgia, serif; font-size:1.1rem; margin:0 0 16px 0; }
    .modal-buttons{ display:flex; gap:12px; justify-content:center; }
    .modal-buttons button.secondary{ background:transparent; color:var(--ink); border:1px solid var(--line); }
    .modal-buttons button.secondary:hover{ background: rgba(0,0,0,0.06); }
  `;
  document.head.appendChild(style);

  document.body.innerHTML = `
    <div id="menuScreen">
      <div class="titleblock">
        <h1>Shogi Games</h1>
        <p class="jp">将棋 &middot; choose your game</p>
      </div>
      <div id="gameChoices">
        <div class="gameCard">
          <h2>Shogi</h2>
          <p>The full 9&times;9 game, all the classic pieces, drops and promotions.</p>
          <button class="playBtn" data-game="shogi">Play</button>
        </div>
        <div class="gameCard">
          <h2>Dobutsu Shogi</h2>
          <p>A tiny 3&times;4 board built for a quick, playful match.</p>
          <button class="playBtn" data-game="dobutsu">Play</button>
        </div>
        <div class="gameCard disabled">
          <h2>Mini Shogi <span class="soon">5&times;5 &middot; coming soon</span></h2>
          <p>A faster middle ground between the two, on the way.</p>
          <button class="playBtn" disabled>Play</button>
        </div>
      </div>
    </div>

    <div id="gameScreen" class="hidden">
      <div class="titleblock">
        <h1 id="gameTitle">Shogi</h1>
        <p class="jp" id="gameSubtitle">TWO PLAYERS - ONE BOARD</p>
      </div>
      <button id="backBtn" class="linkBtn">&larr; Change game</button>

      <div id="setupBar">
        <label>Mode
          <select id="modeSelect">
            <option value="pvp">Two Players</option>
            <option value="cpu">Vs Computer</option>
          </select>
        </label>
        <label id="sideLabel" style="display:none;">Your side
          <select id="sideSelect">
            <option value="black">Black (moves first)</option>
            <option value="white">White (moves second)</option>
          </select>
        </label>
        <label id="difficultyLabel" style="display:none;">Difficulty
          <select id="difficultySelect">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <div id="statusBar">
        <div id="status">Black's turn.</div>
        <button id="resetBtn">New Game</button>
      </div>

      <div id="boardWrap">
        <canvas id="board"></canvas>
      </div>

      <div id="legend"></div>

      <div class="modal-overlay hidden" id="promoModal">
        <div class="modal-card">
          <p>Promote this piece?</p>
          <div class="modal-buttons">
            <button id="promoYes">Promote</button>
            <button class="secondary" id="promoNo">Keep as is</button>
          </div>
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

  modeSelect.addEventListener("change", () => {
    const show = modeSelect.value === "cpu";
    sideLabel.style.display = show ? "flex" : "none";
    difficultyLabel.style.display = show ? "flex" : "none";
  });

  document.querySelectorAll(".playBtn[data-game]").forEach((btn) => {
    btn.addEventListener("click", () => enterGame(btn.dataset.game));
  });
  document.getElementById("backBtn").addEventListener("click", () => {
    gameScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  });

  // =========================================================
  // 2. GENERIC HELPERS + DIRECTION TABLES (shared by every game)
  // =========================================================

  const DIRS_DIAG = [[-1,-1],[-1,1],[1,-1],[1,1]];
  const DIRS_ORTHO = [[-1,0],[1,0],[0,-1],[0,1]];
  const DIRS_ALL8 = DIRS_ORTHO.concat(DIRS_DIAG);

  function other(p){ return p === "black" ? "white" : "black"; }
  function forwardDir(owner){ return owner === "black" ? -1 : 1; }
  function goldSteps(dir){ return [[dir,-1],[dir,0],[dir,1],[0,-1],[0,1],[-dir,0]]; }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function isBackRank(owner, row, rows){ return owner === "black" ? row === 0 : row === rows - 1; }

  // =========================================================
  // 3. GAME CONFIGS — each one fully describes a variant's rules
  // =========================================================

  let CFG = null; // the active game's config; set by enterGame()

  const SHOGI_CONFIG = {
    id: "shogi", label: "Shogi",
    ROWS: 9, COLS: 9, cellSize: 58,
    royalType: "K", hasTryRule: false, noDrawOnStalemate: false, showStarPoints: true,
    handOrder: ["R","B","G","S","N","L","P"],
    legend: `<b>K</b> King &nbsp; <b>R</b> Rook &nbsp; <b>B</b> Bishop &nbsp; <b>G</b> Gold General &nbsp;
      <b>S</b> Silver General &nbsp; <b>N</b> Knight &nbsp; <b>L</b> Lance &nbsp; <b>P</b> Pawn
      <br>A piece marked with a <span class="plus">+</span> has promoted.`,
    baseValue: { P:1, L:3, N:4, S:5, G:6, B:8, R:10, K:0 },
    promotedValue: { P:6, L:6, N:6, S:6, B:10, R:12 },
    difficulty: {
      easy:   { depth:0, timeMs:0 },
      medium: { depth:2, timeMs:600 },
      hard:   { depth:3, timeMs:1800 }
    },
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
      if (piece.type === "P" || piece.type === "L"){
        return piece.owner === "black" ? destRow === 0 : destRow === CFG.ROWS - 1;
      }
      if (piece.type === "N"){
        return piece.owner === "black" ? destRow <= 1 : destRow >= CFG.ROWS - 2;
      }
      return false;
    },
    isDropLegal(bd, hands, player, type, r, c, checkUchi){
      if (bd[r][c]) return false;
      if (type === "P"){
        for (let i=0;i<CFG.ROWS;i++){
          const p = bd[i][c];
          if (p && p.owner === player && p.type === "P" && !p.promoted) return false;
        }
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
      const nb = bd.map(row => row.map(cell => cell ? Object.assign({}, cell) : null));
      nb[r][c] = { type: type, owner: player, promoted: false };
      if (isInCheck(nb, player)) return false;
      if (type === "P" && checkUchi !== false){
        const opp = other(player);
        if (isInCheck(nb, opp)){
          const oppMoves = allLegalMoves(nb, hands, opp, false);
          if (oppMoves.length === 0) return false; // illegal: pawn-drop checkmate
        }
      }
      return true;
    }
  };

  const DOBUTSU_CONFIG = {
    id: "dobutsu", label: "Dobutsu Shogi",
    ROWS: 4, COLS: 3, cellSize: 100,
    royalType: "L", hasTryRule: true, noDrawOnStalemate: true, showStarPoints: false,
    handOrder: ["G","E","C"],
    legend: `<b>L</b> Lion &nbsp; <b>G</b> Giraffe &nbsp; <b>E</b> Elephant &nbsp; <b>C</b> Chick
      <br>A Chick reaching the far row promotes to a Hen (shown as <span class="plus">+C</span>).
      Marching your Lion safely into the opponent's home row is an instant win.`,
    baseValue: { L:0, G:4, E:4, C:2 },
    promotedValue: { C:6 },
    difficulty: {
      easy:   { depth:0, timeMs:0 },
      medium: { depth:4, timeMs:500 },
      hard:   { depth:7, timeMs:1500 }
    },
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
      if (piece.type === "C" && piece.promoted) return { steps: goldSteps(dir) }; // Hen
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
    isDropLegal(bd, hands, player, type, r, c /*, checkUchi unused: Dobutsu has no drop restrictions */){
      if (bd[r][c]) return false;
      const nb = bd.map(row => row.map(cell => cell ? Object.assign({}, cell) : null));
      nb[r][c] = { type: type, owner: player, promoted: false };
      if (isInCheck(nb, player)) return false;
      return true;
    }
  };

  // =========================================================
  // 4. GENERIC RULE ENGINE (reads the active CFG)
  // =========================================================

  function pieceTargets(bd, r, c){
    const piece = bd[r][c];
    const ms = CFG.moveSetFor(piece);
    const targets = [];
    if (ms.steps){
      for (const [dr,dc] of ms.steps){
        const nr = r+dr, nc = c+dc;
        if (nr<0||nr>=CFG.ROWS||nc<0||nc>=CFG.COLS) continue;
        const t = bd[nr][nc];
        if (!t || t.owner !== piece.owner) targets.push([nr,nc]);
      }
    }
    if (ms.slides){
      for (const [dr,dc] of ms.slides){
        let nr = r+dr, nc = c+dc;
        while (nr>=0 && nr<CFG.ROWS && nc>=0 && nc<CFG.COLS){
          const t = bd[nr][nc];
          if (!t){ targets.push([nr,nc]); }
          else { if (t.owner !== piece.owner) targets.push([nr,nc]); break; }
          nr += dr; nc += dc;
        }
      }
    }
    return targets;
  }

  function findRoyal(bd, owner){
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p = bd[r][c];
      if (p && p.owner === owner && p.type === CFG.royalType) return [r,c];
    }
    return null;
  }

  function isSquareAttacked(bd, r, c, byOwner){
    for (let i=0;i<CFG.ROWS;i++) for (let j=0;j<CFG.COLS;j++){
      const p = bd[i][j];
      if (p && p.owner === byOwner){
        const targets = pieceTargets(bd, i, j);
        for (const [tr,tc] of targets) if (tr===r && tc===c) return true;
      }
    }
    return false;
  }

  function isInCheck(bd, owner){
    const k = findRoyal(bd, owner);
    if (!k) return false;
    return isSquareAttacked(bd, k[0], k[1], other(owner));
  }

  function genMovesForPiece(bd, r, c){
    const piece = bd[r][c];
    const targets = pieceTargets(bd, r, c);
    const moves = [];
    const promotable = CFG.isPromotable(piece);
    for (const [tr,tc] of targets){
      const zoneMove = promotable && (CFG.inZone(piece.owner,r) || CFG.inZone(piece.owner,tr));
      const forced = promotable && CFG.mustPromote(piece, tr);
      if (forced){
        moves.push({ from:[r,c], to:[tr,tc], promote:true });
      } else if (zoneMove){
        moves.push({ from:[r,c], to:[tr,tc], promote:false });
        moves.push({ from:[r,c], to:[tr,tc], promote:true });
      } else {
        moves.push({ from:[r,c], to:[tr,tc], promote:false });
      }
    }
    return moves;
  }

  function simulateMove(bd, move){
    const nb = bd.map(row => row.map(cell => cell ? Object.assign({}, cell) : null));
    const [fr,fc] = move.from, [tr,tc] = move.to;
    const piece = Object.assign({}, nb[fr][fc]);
    nb[fr][fc] = null;
    if (move.promote) piece.promoted = true;
    nb[tr][tc] = piece;
    return nb;
  }

  function isMoveLegal(bd, move, mover){
    const nb = simulateMove(bd, move);
    return !isInCheck(nb, mover);
  }

  function allLegalMoves(bd, hands, player, checkUchi){
    const moves = [];
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p = bd[r][c];
      if (p && p.owner === player){
        const pm = genMovesForPiece(bd, r, c);
        for (const m of pm) if (isMoveLegal(bd, m, player)) moves.push(m);
      }
    }
    for (const type of CFG.handOrder){
      if (hands[player][type] > 0){
        for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
          if (!bd[r][c] && CFG.isDropLegal(bd, hands, player, type, r, c, checkUchi)){
            moves.push({ drop: type, to:[r,c] });
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
  // 5. COMPUTER OPPONENT (minimax + alpha-beta + iterative deepening)
  // =========================================================

  const WIN_SCORE = 100000;

  function pieceValue(p){ return p.promoted ? CFG.promotedValue[p.type] : CFG.baseValue[p.type]; }

  function lionAdvanceBonus(bd, owner){
    const k = findRoyal(bd, owner);
    if (!k) return 0;
    const targetRow = owner === "black" ? 0 : CFG.ROWS - 1;
    const dist = Math.abs(k[0] - targetRow);
    return (CFG.ROWS - 1 - dist) * 0.4;
  }

  function evaluate(bd, hnds, forPlayer){
    let score = 0;
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p = bd[r][c];
      if (p){ const v = pieceValue(p); score += (p.owner === forPlayer ? v : -v); }
    }
    for (const t of CFG.handOrder){
      score += hnds[forPlayer][t] * CFG.baseValue[t];
      score -= hnds[other(forPlayer)][t] * CFG.baseValue[t];
    }
    if (CFG.hasTryRule){
      score += lionAdvanceBonus(bd, forPlayer) - lionAdvanceBonus(bd, other(forPlayer));
    }
    return score;
  }

  function applySim(bd, hnds, player, move){
    const nb = bd.map(row => row.map(cell => cell ? Object.assign({}, cell) : null));
    const nh = { black: Object.assign({}, hnds.black), white: Object.assign({}, hnds.white) };
    if (move.drop){
      nh[player][move.drop]--;
      nb[move.to[0]][move.to[1]] = { type: move.drop, owner: player, promoted:false };
    } else {
      const [fr,fc] = move.from, [tr,tc] = move.to;
      const piece = Object.assign({}, nb[fr][fc]);
      const captured = nb[tr][tc];
      if (captured){ nh[player][captured.type] = (nh[player][captured.type] || 0) + 1; }
      nb[fr][fc] = null;
      piece.promoted = piece.promoted || move.promote;
      nb[tr][tc] = piece;
    }
    return { nb, nh };
  }

  function moveScore(m, bd){
    let s = 0;
    if (!m.drop){
      const target = bd[m.to[0]][m.to[1]];
      if (target) s += pieceValue(target) * 10;
      if (m.promote) s += 3;
    } else {
      s -= 1;
    }
    return s;
  }
  function orderMoves(moves, bd){ moves.sort((a,b) => moveScore(b,bd) - moveScore(a,bd)); }

  function negamax(bd, hnds, player, depth, alpha, beta, deadline){
    if (depth === 0 || Date.now() > deadline){
      return evaluate(bd, hnds, player);
    }
    const moves = allLegalMoves(bd, hnds, player, false);
    if (moves.length === 0){
      if (CFG.noDrawOnStalemate) return -(WIN_SCORE + depth);
      return isInCheck(bd, player) ? -(WIN_SCORE + depth) : 0;
    }
    orderMoves(moves, bd);
    let best = -Infinity;
    for (const m of moves){
      const val = moveValue(bd, hnds, player, m, depth, alpha, beta, deadline);
      if (val > best) best = val;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  }

  function moveValue(bd, hnds, player, move, depth, alpha, beta, deadline){
    if (tryRuleWin(bd, player, move)) return WIN_SCORE + depth;
    const { nb, nh } = applySim(bd, hnds, player, move);
    return -negamax(nb, nh, other(player), depth-1, -beta, -alpha, deadline);
  }

  function computeAIMove(bd, hnds, player, difficulty){
    const settings = CFG.difficulty[difficulty] || CFG.difficulty.medium;
    const rootMoves = allLegalMoves(bd, hnds, player, true);
    if (rootMoves.length === 0) return null;
    if (settings.depth === 0){
      return rootMoves[Math.floor(Math.random() * rootMoves.length)];
    }
    const deadline = Date.now() + settings.timeMs;
    let bestMove = null;
    for (let d=1; d<=settings.depth; d++){
      orderMoves(rootMoves, bd);
      let alpha = -Infinity, beta = Infinity;
      let currentBest = null, currentBestScore = -Infinity, timedOut = false;
      for (const m of rootMoves){
        if (Date.now() > deadline){ timedOut = true; break; }
        const val = moveValue(bd, hnds, player, m, d, alpha, beta, deadline);
        if (val > currentBestScore){ currentBestScore = val; currentBest = m; }
        if (currentBestScore > alpha) alpha = currentBestScore;
      }
      if (!timedOut && currentBest){ bestMove = currentBest; }
      else break;
    }
    if (!bestMove) bestMove = rootMoves[Math.floor(Math.random() * rootMoves.length)];
    return bestMove;
  }

  // =========================================================
  // 6. GAME STATE
  // =========================================================

  let board, hands, turn, selected, candidateMoves, gameOver, winner, statusMsg, lastMove, pendingMatches;
  let whiteHandSlots = [], blackHandSlots = [];
  let mode = "pvp";
  let humanSide = "black";
  let difficulty = "medium";
  let aiThinking = false;

  function aiSide(){ return other(humanSide); }
  function isAITurn(){ return mode === "cpu" && turn === aiSide() && !gameOver; }
  function emptyHand(){ const h={}; for (const t of CFG.handOrder) h[t]=0; return h; }

  function enterGame(id){
    CFG = id === "shogi" ? SHOGI_CONFIG : DOBUTSU_CONFIG;
    document.getElementById("gameTitle").textContent = CFG.label;
    document.getElementById("legend").innerHTML = CFG.legend + `
      <br>Captured pieces join your hand below the board — click one, then click an empty square to drop it back into play.
      <br>Mode and difficulty changes apply on the next New Game.`;
    menuScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    applyLayout();
    newGame();
  }

  function newGame(){
    mode = modeSelect.value;
    humanSide = sideSelect.value;
    difficulty = difficultySelect.value;

    board = CFG.initialBoard();
    hands = { black: emptyHand(), white: emptyHand() };
    turn = "black";
    selected = null;
    candidateMoves = [];
    gameOver = false;
    winner = null;
    lastMove = null;
    pendingMatches = null;
    aiThinking = false;
    statusMsg = "Black's turn.";
    render();
    maybeTriggerAI();
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
      if (!board[r][c] && CFG.isDropLegal(board, hands, turn, type, r, c, true)){
        list.push({ drop:type, to:[r,c] });
      }
    }
    return list;
  }

  function clearSelection(){
    selected = null;
    candidateMoves = [];
  }

  function applyMoveCommit(move){
    let movedType = null;
    if (move.drop){
      hands[turn][move.drop]--;
      const [tr,tc] = move.to;
      board[tr][tc] = { type: move.drop, owner: turn, promoted:false };
      lastMove = { to: move.to };
    } else {
      const [fr,fc] = move.from, [tr,tc] = move.to;
      const piece = board[fr][fc];
      movedType = piece.type;
      const captured = board[tr][tc];
      if (captured){
        hands[turn][captured.type] = (hands[turn][captured.type] || 0) + 1;
        if (captured.type === CFG.royalType){
          board[fr][fc] = null;
          piece.promoted = piece.promoted || move.promote;
          board[tr][tc] = piece;
          lastMove = { from: move.from, to: move.to };
          gameOver = true; winner = turn;
          clearSelection();
          statusMsg = "Checkmate — " + cap(winner) + " wins!";
          render();
          return;
        }
      }
      board[fr][fc] = null;
      piece.promoted = piece.promoted || move.promote;
      board[tr][tc] = piece;
      lastMove = { from: move.from, to: move.to };
    }

    if (CFG.hasTryRule && !move.drop && movedType === CFG.royalType && isBackRank(turn, move.to[0], CFG.ROWS)){
      gameOver = true; winner = turn;
      clearSelection();
      statusMsg = cap(winner) + "'s Lion reaches home — " + cap(winner) + " wins!";
      render();
      return;
    }

    endTurn();
  }

  function endTurn(){
    clearSelection();
    turn = other(turn);
    const chk = isInCheck(board, turn);
    const moves = allLegalMoves(board, hands, turn, true);
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
      render();
      return;
    }
    statusMsg = chk ? (cap(turn) + " is in check!") : (cap(turn) + "'s turn.");
    render();
    maybeTriggerAI();
  }

  function maybeTriggerAI(){
    if (!isAITurn()) return;
    aiThinking = true;
    statusMsg = "Computer is thinking...";
    render();
    setTimeout(runAITurn, 250);
  }

  function runAITurn(){
    if (gameOver){ aiThinking = false; return; }
    const move = computeAIMove(board, hands, turn, difficulty);
    aiThinking = false;
    if (!move){ render(); return; }
    applyMoveCommit(move);
  }

  // =========================================================
  // 7. LAYOUT (recomputed per game, since board sizes differ)
  // =========================================================

  const SIDE_PAD = 30;
  const LABEL_PAD = 22;
  const GAP = 8;
  let CELL, BOARD_W, BOARD_H, boardX, boardY, whiteHandY, blackHandY, CANVAS_W, CANVAS_H, HAND_H, slotSize, gapX;

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  function applyLayout(){
    CELL = CFG.cellSize;
    BOARD_W = CELL * CFG.COLS;
    BOARD_H = CELL * CFG.ROWS;
    slotSize = Math.round(CELL * 0.75);
    gapX = slotSize + 12;
    HAND_H = Math.max(90, slotSize + 55);
    boardX = SIDE_PAD;
    boardY = HAND_H + GAP + LABEL_PAD;
    whiteHandY = 0;
    blackHandY = boardY + BOARD_H + LABEL_PAD + GAP;
    CANVAS_W = BOARD_W + SIDE_PAD * 2;
    CANVAS_H = blackHandY + HAND_H;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
  }

  // =========================================================
  // 8. MOUSE INTERACTION
  // =========================================================

  function getCanvasCoords(evt){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (evt.clientX - rect.left) * scaleX, y: (evt.clientY - rect.top) * scaleY };
  }

  function slotHit(slots, x, y){
    for (const s of slots){
      if (x>=s.x && x<=s.x+s.w && y>=s.y && y<=s.y+s.h) return s;
    }
    return null;
  }

  function hitTest(x, y){
    if (y >= whiteHandY && y < whiteHandY + HAND_H){
      const s = slotHit(whiteHandSlots, x, y);
      return s ? { kind:"hand", player:"white", piece:s.piece } : null;
    }
    if (y >= blackHandY && y < blackHandY + HAND_H){
      const s = slotHit(blackHandSlots, x, y);
      return s ? { kind:"hand", player:"black", piece:s.piece } : null;
    }
    if (x >= boardX && x < boardX + BOARD_W && y >= boardY && y < boardY + BOARD_H){
      const c = Math.floor((x - boardX) / CELL);
      const r = Math.floor((y - boardY) / CELL);
      return { kind:"board", r, c };
    }
    return null;
  }

  canvas.addEventListener("click", (e) => {
    if (gameOver || pendingMatches || aiThinking || isAITurn()) return;
    const { x, y } = getCanvasCoords(e);
    const zone = hitTest(x, y);
    if (!zone){ clearSelection(); render(); return; }

    if (zone.kind === "hand"){
      if (zone.player !== turn){ render(); return; }
      if (!hands[turn][zone.piece]){ render(); return; }
      if (selected && selected.kind === "hand" && selected.piece === zone.piece){
        clearSelection();
      } else {
        selected = { kind:"hand", piece: zone.piece };
        candidateMoves = movesFromSelection();
      }
      render();
      return;
    }

    if (selected){
      const matches = candidateMoves.filter(m => m.to[0] === zone.r && m.to[1] === zone.c);
      if (matches.length > 0){
        if (matches.length === 2){
          pendingMatches = matches;
          document.getElementById("promoModal").classList.remove("hidden");
        } else {
          applyMoveCommit(matches[0]);
        }
        return;
      }
      if (selected.kind === "board" && selected.pos[0] === zone.r && selected.pos[1] === zone.c){
        clearSelection(); render(); return;
      }
    }

    const piece = board[zone.r][zone.c];
    if (piece && piece.owner === turn){
      selected = { kind:"board", pos:[zone.r, zone.c] };
      candidateMoves = movesFromSelection();
    } else {
      clearSelection();
    }
    render();
  });

  document.getElementById("promoYes").addEventListener("click", () => {
    const m = pendingMatches.find(mv => mv.promote === true);
    pendingMatches = null;
    document.getElementById("promoModal").classList.add("hidden");
    applyMoveCommit(m);
  });
  document.getElementById("promoNo").addEventListener("click", () => {
    const m = pendingMatches.find(mv => mv.promote === false);
    pendingMatches = null;
    document.getElementById("promoModal").classList.add("hidden");
    applyMoveCommit(m);
  });
  document.getElementById("resetBtn").addEventListener("click", newGame);

  // =========================================================
  // 9. RENDERING (pieces are pentagons, drawn with canvas paths)
  // =========================================================

  function drawPentagonPath(c, size){
    const hw = size * 0.5, h = size;
    c.beginPath();
    c.moveTo(0, -h/2);
    c.lineTo(hw*0.62, -h/2 + h*0.32);
    c.lineTo(hw, h/2);
    c.lineTo(-hw, h/2);
    c.lineTo(-hw*0.62, -h/2 + h*0.32);
    c.closePath();
  }

  function drawPiece(cx, cy, size, piece){
    const flipped = piece.owner === "white";
    ctx.save();
    ctx.translate(cx, cy);
    if (flipped) ctx.rotate(Math.PI);
    drawPentagonPath(ctx, size);
    ctx.fillStyle = piece.owner === "black" ? "#ecd9ab" : "#f7eed9";
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = piece.promoted ? "#a13d2f" : "#3a2a1a";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = piece.promoted ? "#a13d2f" : "#241a10";
    ctx.font = "bold " + Math.round(size*0.34) + "px 'Shippori Mincho', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = (piece.promoted ? "+" : "") + piece.type;
    ctx.fillText(label, cx, cy + size*0.03);
    ctx.restore();
  }

  function cellCenter(r, c){
    return { x: boardX + c*CELL + CELL/2, y: boardY + r*CELL + CELL/2 };
  }

  function drawBoardFrame(){
    ctx.fillStyle = "#d8ac6d";
    ctx.fillRect(boardX, boardY, BOARD_W, BOARD_H);
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "#4a3220";
    for (let i=0;i<CFG.ROWS;i++){
      if (i % 2 === 0) ctx.fillRect(boardX, boardY + i*CELL, BOARD_W, CELL);
    }
    ctx.restore();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4a3220";
    ctx.strokeRect(boardX, boardY, BOARD_W, BOARD_H);
  }

  function drawGrid(){
    ctx.strokeStyle = "#7a5230";
    ctx.lineWidth = 1;
    for (let i=1;i<CFG.COLS;i++){
      ctx.beginPath();
      ctx.moveTo(boardX + i*CELL, boardY);
      ctx.lineTo(boardX + i*CELL, boardY + BOARD_H);
      ctx.stroke();
    }
    for (let i=1;i<CFG.ROWS;i++){
      ctx.beginPath();
      ctx.moveTo(boardX, boardY + i*CELL);
      ctx.lineTo(boardX + BOARD_W, boardY + i*CELL);
      ctx.stroke();
    }
    if (CFG.showStarPoints){
      ctx.fillStyle = "#4a3220";
      for (const rr of [3,6]) for (const cc of [3,6]){
        ctx.beginPath();
        ctx.arc(boardX+cc*CELL, boardY+rr*CELL, 3, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  function drawCoordLabels(){
    ctx.fillStyle = "#5b4a38";
    ctx.font = "12px 'Zen Kaku Gothic New', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let c=0;c<CFG.COLS;c++){
      ctx.fillText(String(CFG.COLS-c), boardX + c*CELL + CELL/2, boardY - LABEL_PAD/2);
    }
    for (let r=0;r<CFG.ROWS;r++){
      ctx.fillText(String.fromCharCode(97+r), boardX + BOARD_W + LABEL_PAD/2, boardY + r*CELL + CELL/2);
    }
  }

  function drawHighlights(){
    if (selected && selected.kind === "board"){
      const [r,c] = selected.pos;
      ctx.save();
      ctx.strokeStyle = "#a13d2f";
      ctx.lineWidth = 3;
      ctx.strokeRect(boardX + c*CELL + 2, boardY + r*CELL + 2, CELL-4, CELL-4);
      ctx.restore();
    }
    const seen = new Set();
    for (const m of candidateMoves){
      const key = m.to[0] + "," + m.to[1];
      if (seen.has(key)) continue;
      seen.add(key);
      const { x, y } = cellCenter(m.to[0], m.to[1]);
      const occupied = board[m.to[0]][m.to[1]];
      ctx.save();
      if (occupied){
        ctx.strokeStyle = "rgba(161,61,47,0.75)";
        ctx.lineWidth = 3;
        ctx.strokeRect(boardX + m.to[1]*CELL + 3, boardY + m.to[0]*CELL + 3, CELL-6, CELL-6);
      } else {
        ctx.fillStyle = "rgba(74,50,32,0.35)";
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (lastMove){
      const to = lastMove.to;
      ctx.save();
      ctx.strokeStyle = "rgba(217,178,92,0.9)";
      ctx.lineWidth = 2;
      ctx.strokeRect(boardX + to[1]*CELL + 1, boardY + to[0]*CELL + 1, CELL-2, CELL-2);
      ctx.restore();
    }
    if (!gameOver){
      const k = findRoyal(board, turn);
      if (k && isInCheck(board, turn)){
        const { x, y } = cellCenter(k[0], k[1]);
        ctx.save();
        const grad = ctx.createRadialGradient(x,y,4,x,y,CELL*0.6);
        grad.addColorStop(0, "rgba(161,61,47,0.55)");
        grad.addColorStop(1, "rgba(161,61,47,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x,y,CELL*0.6,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  function drawPieces(){
    for (let r=0;r<CFG.ROWS;r++) for (let c=0;c<CFG.COLS;c++){
      const p = board[r][c];
      if (p){
        const { x, y } = cellCenter(r,c);
        drawPiece(x, y, CELL*0.8, p);
      }
    }
  }

  function drawHandStrip(player, y){
    const items = CFG.handOrder.filter(t => hands[player][t] > 0);
    const isActive = (turn === player) && !gameOver;
    ctx.save();
    ctx.fillStyle = isActive ? "rgba(217,178,92,0.16)" : "rgba(0,0,0,0.02)";
    ctx.fillRect(0, y, CANVAS_W, HAND_H);
    if (isActive){
      ctx.strokeStyle = "#d9b25c";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, y+2, CANVAS_W-4, HAND_H-4);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#5b4a38";
    ctx.font = "13px 'Zen Kaku Gothic New', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    let label = cap(player) + "'s hand";
    if (mode === "cpu" && player === aiSide()) label += " (computer)";
    ctx.fillText(label, boardX, y + 8);
    ctx.restore();

    const slots = [];
    const startX = boardX;
    const startY = y + 30;
    for (let i=0;i<items.length;i++){
      const type = items[i];
      const sx = startX + i*gapX;
      const sy = startY;
      slots.push({ piece: type, x: sx, y: sy, w: slotSize, h: slotSize+14 });

      const cx = sx + slotSize/2, cy = sy + slotSize/2;
      const isSel = selected && selected.kind === "hand" && selected.piece === type && turn === player;
      if (isSel){
        ctx.save();
        ctx.strokeStyle = "#a13d2f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, slotSize*0.62, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }
      drawPiece(cx, cy, slotSize*0.86, { type: type, owner: player, promoted:false });

      ctx.save();
      ctx.fillStyle = "#241a10";
      ctx.font = "bold 12px 'Zen Kaku Gothic New', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("x" + hands[player][type], cx, sy + slotSize + 8);
      ctx.restore();
    }
    if (player === "white") whiteHandSlots = slots;
    else blackHandSlots = slots;
  }

  function updateStatusDOM(){
    const el = document.getElementById("status");
    el.textContent = statusMsg;
    el.classList.remove("check","over","thinking");
    if (aiThinking) el.classList.add("thinking");
    else if (gameOver) el.classList.add("over");
    else if (statusMsg.indexOf("check") !== -1) el.classList.add("check");
  }

  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawHandStrip("white", whiteHandY);
    drawBoardFrame();
    drawGrid();
    drawCoordLabels();
    drawHighlights();
    drawPieces();
    drawHandStrip("black", blackHandY);
    updateStatusDOM();
  }

})();
