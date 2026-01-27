import { Game, createGhost, createPlayer } from './game.js';
import { assetManager } from './assetManager.js';
import { SSCOORDS, TILE_SIZE, ITEM_TYPE, STATES } from './constants.js';
import { startGameLoop } from './gameLoop.js';
import { setupInput } from './input.js';



export async function initializeGame() {
    
    //Load assets
    await assetManager.loadAllAssets();

    //Get canvas contexts
    const backgroundCanvas = document.getElementById('labyrinthCanvas');
    const backgroundCtx = backgroundCanvas.getContext('2d');
    const entitiesCanvas = document.getElementById('entityCanvas');
    const entitiesCanvasCtx = entitiesCanvas.getContext('2d');
    
    //Store contexts in Game object
    Game.backgroundCanvasCtx = backgroundCtx;
    Game.entitiesCanvasCtx = entitiesCanvasCtx;
    
    // Store canvas elements for sizing
    Game.backgroundCanvas = backgroundCanvas;
    Game.entitiesCanvas = entitiesCanvas;

    // Process map and render labyrinth
    processMapData(assetManager.levels['level1']);

    //Render labyrinth to background canvas
    loadLabyrinthCanvas();
    
    //Create player at spawn position (1, 1)
    Game.player = createPlayer(1, 1);

    //Create ghosts at their spawn positions
    Game.ghosts.push(createGhost(0, 12, 7)); // Ghost 0
    Game.ghosts.push(createGhost(1, 13, 8)); // Ghost 1
    Game.ghosts.push(createGhost(2, 14, 7)); // Ghost 2

    //Setup input listeners (keyboard, touch, buttons)
    setupInput();
    
    console.log('Game initialized successfully');
    
    //Start the game loop
    startGameLoop();
}

function processMapData(text) {
    const lines = text.trim().split("\n");
    const rows = lines.length;
    const cols = lines[0].length;
    
    // Set fixed canvas dimensions based on map size (32px per tile)
    const canvasWidth = cols * TILE_SIZE;
    const canvasHeight = rows * TILE_SIZE;
    
    Game.backgroundCanvasCtx.canvas.width = canvasWidth;
    Game.backgroundCanvasCtx.canvas.height = canvasHeight;
    Game.entitiesCanvasCtx.canvas.width = canvasWidth;
    Game.entitiesCanvasCtx.canvas.height = canvasHeight;
    
    // Get game container and calculate max display size
    const gameContainer = document.getElementById('gameContainer');
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.7;
    
    // Calculate scale to fit within max dimensions while maintaining aspect ratio
    const scaleX = maxWidth / canvasWidth;
    const scaleY = maxHeight / canvasHeight;
    const scale = Math.min(1, scaleX, scaleY); // Never upscale, only fit smaller
    
    const displayWidth = canvasWidth * scale;
    const displayHeight = canvasHeight * scale;
    
    // Set canvas and container to calculated display size
    Game.backgroundCanvas.style.width = displayWidth + 'px';
    Game.backgroundCanvas.style.height = displayHeight + 'px';
    Game.entitiesCanvas.style.width = displayWidth + 'px';
    Game.entitiesCanvas.style.height = displayHeight + 'px';
    gameContainer.style.width = displayWidth + 'px';
    gameContainer.style.height = displayHeight + 'px';
    
    //Reset
    Game.map = [];

    //Creates a 2D boolean map where true indicates walkable tiles
    const boolMap = lines.map(line => line.split('').map(c => c === '1'));

    for (let y = 0; y < rows; y++){
        let rowData = [];
        for (let x = 0; x < cols; x++){
            const isPath = boolMap[y][x];

            let tile = {
                //Is walkable?
                walkable: isPath,
                //What item is on this tile?
                item: ITEM_TYPE.DOT,
                //Key for its sprite
                bitmask: 0
            };

            if (isPath) {
                //Calculate the key for its sprite
                tile.bitmask = calculateBitmask(boolMap, x, y, cols, rows);
            }
            rowData.push(tile);
        }
        Game.map.push(rowData);
    }
}

function calculateBitmask(boolMap, x, y, cols, rows){
    let value = 0;
    // Binary bitmasking for tile connections
    if (y > 0 && boolMap[y - 1][x]) value += 1;          // North
    if (x > 0 && boolMap[y][x - 1]) value += 2;          // West
    if (x < cols - 1 && boolMap[y][x + 1]) value += 4;   // East
    if (y < rows - 1 && boolMap[y + 1][x]) value += 8;   // South
    return value;
}

function loadLabyrinthCanvas() {
    const tileSize = TILE_SIZE;
    const map = Game.map;
    const ctx = Game.backgroundCanvasCtx;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tile = map[y][x];
            const pixelX = x * tileSize;
            const pixelY = y * tileSize;
            
            // Check if tile is walkable
            if (tile.walkable) {
                // Draw sprite for walkable path
                const coords = SSCOORDS[tile.bitmask] || {x: 0, y: 0};
                ctx.drawImage(
                    assetManager.getAsset('labyrinthSpritesheet'),
                    coords.x * tileSize, coords.y * tileSize,
                    tileSize, tileSize,
                    pixelX, pixelY, tileSize, tileSize
                );
            } else {
                // Fill non-walkable tile with dark blue (walls)
                ctx.fillStyle = '#111144';
                ctx.fillRect(pixelX, pixelY, tileSize, tileSize);
            }
        }
    }
}