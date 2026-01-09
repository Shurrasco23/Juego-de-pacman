// Game.js (skeleton)
// Responsibilities:
// - expose a single `Game` object that holds global state (config, map, entities, managers)
// - export an async `init(canvasEl)` that wires managers and starts the loop

import { DEFAULT_TILE_SIZE, CONTROLS_HEIGHT } from '../constants.js';

export const Game = {
  config: Object.freeze({ TILE_SIZE: DEFAULT_TILE_SIZE, controlsHeight: CONTROLS_HEIGHT }),
  map: [],
  entities: [],
  managers: {},
  state: 'menu',
  // runtime stats
  gameTime: 0,
  gameScore: 0,
  player: null
};

// Example init signature (implementation lives in original project)
export async function init(canvasEl){
  // Minimal wiring implementation using refactor modules.
  // 1) find canvas and context
  // mark refactor active so legacy listeners can check this flag
  window.__refactor_active = true;

  Game.canvas = canvasEl || document.getElementById('gameCanvas');
  if (!Game.canvas) throw new Error('No canvas found');
  Game.ctx = Game.canvas.getContext('2d');

  try {
    // 2) load AssetManager
    const { default: AssetManager } = await import('./AssetManager.js');
    Game.managers.asset = new AssetManager();
    await Game.managers.asset.load(); // load sprites

    // 3) load InputManager
    const { default: InputManager } = await import('./InputManager.js');
    Game.managers.input = new InputManager(Game.canvas);

    // 4) create Renderer (we'll pass TILE_SIZE and DPR after we compute layout)
    const { default: Renderer } = await import('./Renderer.js');

    // 5) fetch and parse map using Map parser
    const res = await fetch('mapa.txt');
    const text = await res.text();
    const { parseMapText } = await import('../game/Map.js');
    // compute an initial tile based on viewport and map size (responsive/totem support)
    const previewLines = text.trim().split('\n');
    const rows = previewLines.length; const cols = previewLines[0].length;
    const availableWidth = window.innerWidth;
    const availableHeight = Math.max(100, window.innerHeight - CONTROLS_HEIGHT);
    const tileCandidate = Math.floor(Math.min(availableWidth / cols, availableHeight / rows));
    const TILE = Math.max(8, Math.min(128, tileCandidate || DEFAULT_TILE_SIZE));
    // update config immutably
    Game.config = Object.freeze(Object.assign({}, Game.config, { TILE_SIZE: TILE }));

    const parsed = parseMapText(text, Game.managers.asset.spriteCoords, TILE);
    Game.map = parsed.map; Game.mapRows = parsed.rows; Game.mapCols = parsed.cols;
    // 6) adjust canvas size, handle DPR and cache static layer
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = Game.mapCols * TILE;
    const logicalHeight = Game.mapRows * TILE;
    Game.canvas.style.width = logicalWidth + 'px'; Game.canvas.style.height = logicalHeight + 'px';
    Game.canvas.width = Math.floor(logicalWidth * dpr); Game.canvas.height = Math.floor(logicalHeight * dpr);
    Game.ctx.setTransform(dpr,0,0,dpr,0,0);
    Game.managers.renderer = new Renderer(Game.canvas, { TILE_SIZE: TILE, dpr });
    Game.managers.renderer.renderStaticToCache(Game.map, Game.managers.asset);

    // 7) create Player at default spawn (1,1) as in original changes
    const { Player } = await import('../game/Player.js');
    Game.player = new Player(1,1, { TILE_SIZE: TILE });
    Game.entities.push(Game.player);

    // 7b) create simple ghosts based on map size (minimal migration of partner work)
    try {
      const { Ghost } = await import('../game/Ghost.js');
      // place two ghosts (top-right-ish and bottom-right-ish)
      const g1 = new Ghost(Math.max(2, Game.mapCols-3), 1, { TILE_SIZE: TILE });
      const g2 = new Ghost(Math.max(2, Game.mapCols-3), Math.max(2, Game.mapRows-3), { TILE_SIZE: TILE });
      Game.entities.push(g1, g2);
    } catch(e){ /* no ghost module or other issue - ignore */ }

    // 8) setup HUD and controls (optional)
    const { updateHUD } = await import('../ui/hud.js');
    updateHUD({ score: Game.gameScore, lives: 3, time: Game.gameTime });
    const { createControls } = await import('../ui/controls.js');
    const controlsContainer = document.querySelector('.controls');
    if (controlsContainer) createControls(controlsContainer, { onDirection: dir => { Game.player.requested = dir; } });

    // 9) start time counter
    setInterval(()=>{ Game.gameTime++; updateHUD({ time: Game.gameTime }); }, 1000);

    // helper: count remaining dots
    function dotsRemaining(){
      let c=0; for (let y=0;y<Game.map.length;y++) for (let x=0;x<Game.map[y].length;x++) if (Game.map[y][x].item===1) c++; return c;
    }

    // helper: check dot collision and update score
    function checkDotCollision(){
      const px = Game.player.tileX; const py = Game.player.tileY;
      if (py>=0 && py<Game.map.length && px>=0 && px<Game.map[0].length){
        const tile = Game.map[py][px];
        if (tile.item === 1){ // DOT
          tile.item = 0; Game.gameScore += 50; updateHUD({ score: Game.gameScore });
          if (dotsRemaining()===0) setTimeout(()=> reloadMapKeepScore(), 200);
        }
      }
    }

    // helper: reload map keeping score
    async function reloadMapKeepScore(){
      const r = await fetch('mapa.txt'); const t = await r.text();
      const p = parseMapText(t, Game.managers.asset.spriteCoords, TILE);
      Game.map = p.map; Game.mapRows = p.rows; Game.mapCols = p.cols;
      Game.managers.renderer.renderStaticToCache(Game.map, Game.managers.asset);
      // reset player position
      if (Game.player){ Game.player.tileX = 1; Game.player.tileY = 1; Game.player.x = 1; Game.player.y = 1; }
      // redraw hud
      updateHUD({ score: Game.gameScore });
    }

    // 10) main loop: update(dt) + render
    let last = performance.now();
    function loop(now){
      const dt = (now - last) / 1000; last = now;
      // update entities with input manager (pass Game for map/collision access)
      Game.entities.forEach(e => { try{ if (e.update) e.update(dt, Game.managers.input, Game); } catch(err){ console.error('entity.update failed', err); } });

      // draw
      const ctx = Game.ctx;
      Game.managers.renderer.render(ctx);

      // draw dynamic pellets (DOT)
      for (let y=0;y<Game.map.length;y++){
        for (let x=0;x<Game.map[y].length;x++){
          const tile = Game.map[y][x];
          if (tile.item === 1){
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x*TILE + TILE/2, y*TILE + TILE/2, 3, 0, Math.PI*2);
            ctx.fill();
          }
        }
      }

      // draw entities
      Game.entities.forEach(e => { if (e.render) e.render(ctx); });

      // collision: check dot pickup by player
      checkDotCollision();

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

  } catch (err){
    console.error('Game.init failed:', err);
    // create a simple error overlay for the user
    try {
      const existing = document.getElementById('game-error-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'game-error-overlay';
      overlay.style.position = 'fixed';
      overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
      overlay.style.background = 'rgba(0,0,0,0.85)';
      overlay.style.color = 'white';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 9999;
      overlay.innerHTML = `<div style="max-width:600px;padding:20px;text-align:center;"><h2>Game failed to start</h2><pre style="text-align:left;white-space:pre-wrap;">${String(err).replace(/</g,'&lt;')}</pre><button id="game-error-reload">Reload</button></div>`;
      document.body.appendChild(overlay);
      document.getElementById('game-error-reload').addEventListener('click', ()=> location.reload());
    } catch(e){ /* ignore overlay errors */ }
  }
}

// Note: this file is a non-invasive skeleton to compare structure. Copy or implement
// actual logic from the current `src/engine/Game.js` when ready.

// Convenience bootstrap export used by navigation/main
export function bootGame(canvasEl){
  return init(canvasEl || document.getElementById('gameCanvas'));
}
