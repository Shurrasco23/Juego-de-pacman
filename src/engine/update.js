import { Game, DIRECTION } from './game.js';
import { TILE_SIZE, ITEM_TYPE, MOVEMENT_DURATION } from './constants.js';

/**
 * Main update function - called each frame
 * Updates player position and checks collisions
 */
export function updateGameState() {
    // Update player movement (direction comes from input buffering)
    updateEntityMovement(Game.player, Game.player.bufferedDirection);
    updatePlayerDirection();
    
    // TODO: Update ghosts with AI-determined directions
    // for (let ghost of Game.ghosts) {
    //     let ghostDirection = getGhostAIDirection(ghost);
    //     updateEntityMovement(ghost, ghostDirection);
    // }
}

/**
 * Update entity movement tick and position
 * Works for both player and ghosts - generic entity movement
 * Parameters:
 *   entity: the entity to move (player or ghost object)
 *   nextDirection: the direction this entity wants to move (from input or AI)
 * 
 * PRINCIPLES:
 * 1. Hard lock during animation - only tick increments, no logic changes
 * 2. Position moves at animation START, not completion
 * 3. Direction changes only at tick reset (animation boundaries)
 */
function updateEntityMovement(entity, nextDirection) {
    if (!entity) return;
    
    // During animation only increment tick and return
    if (entity.movementTick > 0 && entity.movementTick < MOVEMENT_DURATION) {
        entity.movementTick++;
        return;
    }
    
    // At animation completion (tick reached threshold from previous animation)
    if (entity.movementTick >= MOVEMENT_DURATION) {
        entity.movementTick = 0;
        // Check collision now that we've arrived at the new tile (centered on tile)
        checkPelletCollision();
    }
    
    // Try to start a new movement
    if (entity.movementTick === 0) {
        let nextDir;
        
        // Check if the next intended direction is valid
        if (isDirectionValid(entity.tileX, entity.tileY, nextDirection)) {
            nextDir = nextDirection;
        } else {
            // Clear buffered direction if entity has one (player only) and it wasn't valid
            if (entity.bufferedDirection !== undefined) {
                entity.bufferedDirection = DIRECTION.NONE;
            }
            // Try to continue in current direction
            if (isDirectionValid(entity.tileX, entity.tileY, entity.direction)) {
                nextDir = entity.direction;
            // No valid direction to move
            } else {
                // No valid direction - reset animation start to current position to avoid stale animation offset
                entity.animationStartTileX = entity.tileX;
                entity.animationStartTileY = entity.tileY;
                return;
            } 
        }       
        
        // Update
        entity.direction = nextDir;
        const {nextX, nextY} = getNextTile(entity.tileX, entity.tileY, nextDir);
        
        // Store animation start position before moving
        entity.animationStartTileX = entity.tileX;
        entity.animationStartTileY = entity.tileY;
        
        // Update to new position
        entity.tileX = nextX;
        entity.tileY = nextY;
        
        // Start animation
        entity.movementTick = 1;
    }
}


/**
 * Update player's direction based on current input
 * Reads Game.inputState and sets player.bufferedDirection
 *
function updatePlayerDirection() {
    if (!Game.player) return;
    
    const player = Game.player;
    // Check which direction player is trying to go
    if (Game.inputState.up) {
        player.bufferedDirection = DIRECTION.UP;
    } 
    else if (Game.inputState.down) {
        player.bufferedDirection = DIRECTION.DOWN;
    } 
    else if (Game.inputState.left) {
        player.bufferedDirection = DIRECTION.LEFT;
    } 
    else if (Game.inputState.right) {
        player.bufferedDirection = DIRECTION.RIGHT;
    }
}

/**
 * Check if a tile is walkable
 * Returns true if tile exists and is walkable
 */

function isDirectionValid(tileX, tileY, direction) {
    if (direction === DIRECTION.NONE) {
        return false;
    }
    const tile = getNextTile(tileX, tileY, direction);
    
    if (tile === null) {
        return false;
    }
    
    const {nextX, nextY} = tile;
    
    // Check bounds
    if (nextY < 0 || nextY >= Game.map.length) {
        return false;
    }
    if (nextX < 0 || nextX >= Game.map[0].length) {
        return false;
    }
    
    // Check if tile is walkable
    if (!(Game.map[nextY][nextX].walkable)) {
        return false;
    }
    return true;
}

function getNextTile(tileX, tileY, direction) {
    let nextX = tileX;
    let nextY = tileY;
    
    switch(direction) {
        case DIRECTION.UP:
            nextY = tileY - 1;
            break;
        case DIRECTION.DOWN:
            nextY = tileY + 1;
            break;
        case DIRECTION.LEFT:
            nextX = tileX - 1;
            break;
        case DIRECTION.RIGHT:
            nextX = tileX + 1;
            break;
        default:
            return null;
    }
    return {nextX: nextX, nextY: nextY};
}
/**
 * Check if player is on a pellet and consume it
 * Adds score when pellet is eaten
 */
function checkPelletCollision() {
    if (!Game.player) return;
    
    const player = Game.player;
    const tileX = player.tileX;
    const tileY = player.tileY;
    
    // Check bounds
    if (tileY < 0 || tileY >= Game.map.length) return;
    if (tileX < 0 || tileX >= Game.map[0].length) return;
    
    // Get tile at player position
    const tile = Game.map[tileY][tileX];
    
    // If tile has a pellet, consume it
    if (tile && tile.item === ITEM_TYPE.DOT) {
        tile.item = ITEM_TYPE.NONE;
        Game.gameScore += 10;
    }
}
