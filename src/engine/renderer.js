import { Game } from './game.js';
import { assetManager } from './assetManager.js';
import { TILE_SIZE, ITEM_TYPE, MOVEMENT_DURATION } from './constants.js';
import { DIRECTION } from './game.js';

/**
 * Clear the entities canvas
 */
function clearCanvas() {
    const ctx = Game.entitiesCanvasCtx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draw player (Pacman) sprite with smooth animation
 */
function drawPlayer() {
    if (!Game.player) return;
    
    const player = Game.player;
    const ctx = Game.entitiesCanvasCtx;
    
    // Calculate animation progress (0.0 to 1.0)
    const progress = player.movementTick / MOVEMENT_DURATION;
    
    // Calculate pixel offset based on direction and progress
    let offsetX = 0;
    let offsetY = 0;
    
    switch(player.direction) {
        case DIRECTION.UP:
            offsetY = -progress * TILE_SIZE;
            break;
        case DIRECTION.DOWN:
            offsetY = progress * TILE_SIZE;
            break;
        case DIRECTION.LEFT:
            offsetX = -progress * TILE_SIZE;
            break;
        case DIRECTION.RIGHT:
            offsetX = progress * TILE_SIZE;
            break;
    }
    
    // Calculate display position (animation start tile + animation offset)
    const pixelX = player.animationStartTileX * TILE_SIZE + offsetX;
    const pixelY = player.animationStartTileY * TILE_SIZE + offsetY;
    
    // Get player sprite from assets
    const pacmanSprite = assetManager.getAsset('player');
    
    if (pacmanSprite) {
        // Draw sprite with animation
        ctx.drawImage(
            pacmanSprite,
            pixelX,
            pixelY,
            TILE_SIZE,
            TILE_SIZE
        );
    } else {
        // Fallback: draw placeholder rectangle
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
    }
}

/**
 * Draw all ghosts with smooth animation
 */
function drawGhosts() {
    const ctx = Game.entitiesCanvasCtx;
    const ghostAssets = ['greenGhost', 'pinkGhost', 'scaredGhost'];
    
    for (let i = 0; i < Game.ghosts.length; i++) {
        const ghost = Game.ghosts[i];
        
        // Calculate animation progress (0.0 to 1.0)
        const progress = ghost.movementTick / MOVEMENT_DURATION;
        
        // Calculate pixel offset based on direction and progress
        let offsetX = 0;
        let offsetY = 0;
        
        switch(ghost.direction) {
            case DIRECTION.UP:
                offsetY = -progress * TILE_SIZE;
                break;
            case DIRECTION.DOWN:
                offsetY = progress * TILE_SIZE;
                break;
            case DIRECTION.LEFT:
                offsetX = -progress * TILE_SIZE;
                break;
            case DIRECTION.RIGHT:
                offsetX = progress * TILE_SIZE;
                break;
        }
        
        // Calculate display position (animation start tile + animation offset)
        const pixelX = ghost.animationStartTileX * TILE_SIZE + offsetX;
        const pixelY = ghost.animationStartTileY * TILE_SIZE + offsetY;
        
        // Get ghost sprite from assets
        const ghostSprite = assetManager.getAsset(ghostAssets[ghost.id]);
        
        if (ghostSprite) {
            // Draw sprite with animation
            ctx.drawImage(
                ghostSprite,
                pixelX,
                pixelY,
                TILE_SIZE,
                TILE_SIZE
            );
        } else {
            // Fallback: draw placeholder rectangle with different color per ghost
            const colors = ['#ff0000', '#0000ff', '#ff69b4', '#ffa500'];
            ctx.fillStyle = colors[ghost.id];
            ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
        }
    }
}

/**
 * Draw all pellets on the map
 * Only draw on walkable tiles (not walls)
 */
function drawPellets() {
    const ctx = Game.entitiesCanvasCtx;
    
    // Loop through all tiles
    for (let y = 0; y < Game.map.length; y++) {
        for (let x = 0; x < Game.map[y].length; x++) {
            const tile = Game.map[y][x];
            
            // Only draw pellets on walkable tiles
            if (tile.walkable && tile.item === ITEM_TYPE.DOT) {
                const pixelX = x * TILE_SIZE + TILE_SIZE / 2;
                const pixelY = y * TILE_SIZE + TILE_SIZE / 2;
                
                // Draw white circle for pellet
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(pixelX, pixelY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

/**
 * Update HUD text elements
 */
function updateHUD() {
    // Update score
    const pointsElement = document.querySelector('.points');
    if (pointsElement) {
        pointsElement.textContent = `Puntos: ${Game.gameScore}`;
    }
    
    // Update lives
    const livesElement = document.querySelector('.lives');
    if (livesElement && Game.player) {
        livesElement.textContent = `Vidas: ${Game.player.lives}`;
    }
    
    // Update time
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const seconds = Math.floor(Game.gameTimer);
        timeElement.textContent = `Tiempo: ${seconds}s`;
    }
}

/**
 * Main render function - called each frame
 * Clears canvas and draws all entities
 */
export function renderFrame() {
    clearCanvas();
    drawPellets();
    drawPlayer();
    drawGhosts();
    updateHUD();
}