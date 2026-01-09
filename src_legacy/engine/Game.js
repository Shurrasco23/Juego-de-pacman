export const Game = {
    config: Object.freeze({TILE_SIZE:32, controlsHeight:120}),
    map: [],
    entities: [],
    managers: {},
    state: 'menu'
};

// Small helper: parse map text (0/1 grid) into Game.map structure
function parseMapData(text, assetSpriteCoords, tileSize){
  const lines = text.trim().split('\n');
  const rows = lines.length;
  const cols = lines[0].length;

  // Prepare Game.map as a 2D array of tile objects
  const map = [];

  // Convert each character into a boolean path map first
  const boolMap = lines.map(line => line.split('').map(c => c === '1'));

  for (let y = 0; y < rows; y++){
    const row = [];
    for (let x = 0; x < cols; x++){
      const isPath = boolMap[y][x];
      const tile = {
        walkeable: isPath,
        terrainSprite: null,
        item: 0
      };

      if (isPath) {
        // calculate bitmask for neighbors (N=1, W=2, E=4, S=8)
        let value = 0;
        if ((y > 0 && boolMap[y - 1][x]) || y == 0) value += 1; // N
        if ((x > 0 && boolMap[y][x - 1]) || x == 0) value += 2; // W
        if ((x < cols - 1 && boolMap[y][x + 1]) || x == cols - 1) value += 4; // E
        if ((y < rows - 1 && boolMap[y + 1][x]) || y == rows - 1) value += 8; // S

        const coords = (assetSpriteCoords && assetSpriteCoords[value]) ? assetSpriteCoords[value] : {x:0,y:0};
        tile.terrainSprite = {
          sx: coords.x * tileSize,
          sy: coords.y * tileSize
        };
      }

      row.push(tile);
    }
    map.push(row);
  }

  return { map, rows, cols };
}

export async function init(canvasEl){
  try {
    // --- 1) canvas and context setup ---
    // Use provided canvas element or find by id
    Game.canvas = canvasEl || document.getElementById('gameCanvas');
    Game.ctx = Game.canvas.getContext('2d');

    // --- 2) load AssetManager (sprites, coords) ---
    const { default: AssetManager } = await import('./AssetManager.js');
    Game.managers.asset = new AssetManager();
    // wait until assets (images) are loaded
    await Game.managers.asset.load();

    // --- 3) load InputManager (keyboard/touch) ---
    const { default: InputManager } = await import('./InputManager.js');
    Game.managers.input = new InputManager(Game.canvas);

    // --- 4) fetch and parse map ---
    const response = await fetch('mapa.txt');
    const text = await response.text();

    // determine tile size (basic approach: use configured TILE_SIZE)
    const TILE_SIZE = Game.config.TILE_SIZE;

    // parse map using asset spriteCoords provided by AssetManager
    const result = parseMapData(text, Game.managers.asset.spriteCoords, TILE_SIZE);
    Game.map = result.map;
    Game.mapRows = result.rows;
    Game.mapCols = result.cols;

    // adjust canvas to fit the map (width = cols * tileSize, height = rows * tileSize)
    Game.canvas.width = Game.mapCols * TILE_SIZE;
    Game.canvas.height = Game.mapRows * TILE_SIZE;

    // --- 5) start a simple render loop (for now only draws the map) ---
    function draw(){
      const ctx = Game.ctx;
      // clear
      ctx.clearRect(0,0,Game.canvas.width, Game.canvas.height);

      // draw tiles
      for (let y = 0; y < Game.map.length; y++){
        for (let x = 0; x < Game.map[y].length; x++){
          const tile = Game.map[y][x];
          if (tile.walkeable && tile.terrainSprite){
            ctx.drawImage(
              Game.managers.asset.spritesheet,
              tile.terrainSprite.sx,
              tile.terrainSprite.sy,
              TILE_SIZE, TILE_SIZE,
              x * TILE_SIZE,
              y * TILE_SIZE,
              TILE_SIZE, TILE_SIZE
            );
          } else {
            // fallback background for walls
            ctx.fillStyle = '#111144';
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    function loop(){
      draw();
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

  } catch (err) {
    console.error('There was an error when setting up the game:', err);
  }
}