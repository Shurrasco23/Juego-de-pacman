import { assetManager } from './assetManager.js';
import { TILE_SIZE, CONTROLS_HEIGHT, STATES} from './constants.js';

// Ghost AI states
export const GHOST_STATE = {
    SPAWNING: 'spawning',
    CHASING: 'chasing',
    RUNNING: 'running',
};

// Direction constants for movement
export const DIRECTION = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE',
};

// Player object structure (extends base entity with player-specific properties)
export function createPlayer(tileX, tileY) {
    return {
        type: 'player',
        tileX: tileX,                          // Current tile position (column)
        tileY: tileY,                          // Current tile position (row)
        animationStartTileX: tileX,            // Tile position where animation started
        animationStartTileY: tileY,            // Tile position where animation started
        direction: DIRECTION.NONE,             // Current facing direction
        bufferedDirection: DIRECTION.NONE,     // Buffered input direction (player-specific)
        movementTick: 0,                       // Animation counter for smooth movement
        lives: 3,                              // Player-specific: lives remaining
    };
}

// Ghost object structure
export function createGhost(id, tileX, tileY) {
    return {
        type: 'ghost',
        id: id,                               // Ghost identifier (0, 1, 2, 3)
        tileX: tileX,                        // Current tile position (column)
        tileY: tileY,                        // Current tile position (row)
        animationStartTileX: tileX,           // Tile position where animation started
        animationStartTileY: tileY,           // Tile position where animation started
        spriteCenter: { x: TILE_SIZE / 2, y: TILE_SIZE / 2 },  // Offset from top-left of sprite for center
        state: GHOST_STATE.SPAWNING,        // Current behavior state
        direction: DIRECTION.UP,            // Current facing direction
        movementTick: 0,                     // Animation counter for smooth movement
    };
}

/**
 * Main game object
 * Stores all game state in one place
 */
export const Game = {
    config: Object.freeze({ TILE_SIZE: TILE_SIZE, controlsHeight: CONTROLS_HEIGHT }),
    map: [],
    state: STATES.MENU,
    gameTimer: 0,
    gameScore: 0,
    
    // Entities
    player: null,
    ghosts: [],
    
    // Canvas contexts
    entitiesCanvasCtx: null,
    backgroundCanvasCtx: null,
    
    // Input state
    inputState: {
        up: false,
        down: false,
        left: false,
        right: false,
    },
}

