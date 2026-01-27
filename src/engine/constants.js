// Project constants

// Tile size in pixels (hardcoded for stability)
export const TILE_SIZE = 32;

// Css pixels reserved for control visual layout
export const CONTROLS_HEIGHT = 120;

// Movement animation duration (frames between tile moves)
// At 60fps: 60 frames = 1 tile per second (slow motion for debugging)
export const MOVEMENT_DURATION = 12;

//Number representation for the items of a tile
export const ITEM_TYPE = {
    NONE: 0,
    DOT: 1,
    POWER: 2,
}

//Represents the different states the app can be in
export const STATES = {
    MENU: 'menu',
    INGAME: 'ingame',
    SAVING_SCORE: 'saving_score',
    PAUSED: 'paused',
}

//No really sure whats the propuse of this at the moment
export const HUD_SELECTORS = {
    points: '.points',
    lives: '.lives',
    time: '.time'
}

//Sprite sheet coordinates for each tile type
export const SSCOORDS = {
        0:  {x: 0, y: 0}, // Non walkable
        1:  {x: 2, y: 3}, // North
        2:  {x: 0, y: 3}, // West
        3:  {x: 2, y: 2}, // Northwest
        4:  {x: 3, y: 3}, // East   
        5:  {x: 3, y: 2}, // Northeast
        6:  {x: 3, y: 0}, // Eastwest   
        7:  {x: 2, y: 1}, // North-West-East
        8:  {x: 1, y: 3}, // South
        9:  {x: 2, y: 0}, // North-South
        10: {x: 0, y: 2}, // Southwest
        11: {x: 0, y: 1}, // North-West-South
        12: {x: 1, y: 2}, // Southeast
        13: {x: 3, y: 1}, // North-East-South
        14: {x: 1, y: 1}, // West-East-South
        15: {x: 1, y: 0}  // North-West-East-South
}

// Asset root path
const ASSET_ROOT = '/pacman/assets/';

export const ASSET_PATHS = {
    // Background/Labyrinth
    labyrinthSpritesheet: {
        path: ASSET_ROOT + 'images/labyrinth_spritesheet.png',
        type: 'image'
    },
    
    // Controls/UI Arrows
    upArrow: {
        path: ASSET_ROOT + 'images/up_arrow.png',
        type: 'image'
    },
    downArrow: {
        path: ASSET_ROOT + 'images/down_arrow.png',
        type: 'image'
    },
    leftArrow: {
        path: ASSET_ROOT + 'images/left_arrow.png',
        type: 'image'
    },
    rightArrow: {
        path: ASSET_ROOT + 'images/right_arrow.png',
        type: 'image'
    },
    
    // Game Elements
    paddle: {
        path: ASSET_ROOT + 'images/paddle.png',
        type: 'image'
    },
    cherryBoost: {
        path: ASSET_ROOT + 'images/cherry_boost.png',
        type: 'image'
    },
    
    // Animated Sprites (GIFs)
    pacmanBackground: {
        path: ASSET_ROOT + 'gifs/pacman_background.gif',
        type: 'gif'
    },
    
    // Player
    player: {
        path: ASSET_ROOT + 'images/pacman.png',
        type: 'image'
    },

    // Ghosts
    redGhost: {
        path: ASSET_ROOT + 'images/red_ghost.png',
        type: 'image'
    },
    pinkGhost: {
        path: ASSET_ROOT + 'images/pink_ghost.png',
        type: 'image'
    },
    cyanGhost: {
        path: ASSET_ROOT + 'images/cyan_ghost.png',
        type: 'image'
    },
    orangeGhost: {
        path: ASSET_ROOT + 'images/orange_ghost.png',
        type: 'image'
    },
    scaredGhost: {
        path: ASSET_ROOT + 'images/scared_ghost.png',
        type: 'image'
    },
    
    // Levels
    level1: {
        path: ASSET_ROOT + 'maps/level1.txt',
        type: 'level'
    }
}
// Pixel size of one tile inside the labrinth spritesheet
export const SPRITESHEET_TILE_PX = 32;

export default { 
    TILE_SIZE, 
    CONTROLS_HEIGHT, 
    ITEM_TYPE, 
    HUD_SELECTORS, 
    ASSET_PATHS,
    SPRITESHEET_TILE_PX
};