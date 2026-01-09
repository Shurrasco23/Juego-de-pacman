// Project constants (shared)
export const DEFAULT_TILE_SIZE = 32;
export const CONTROLS_HEIGHT = 120; // css pixels reserved for controls/footer

export const ITEM_TYPE = {
  NONE: 0,
  DOT: 1,
  POWER: 2
};

export const HUD_SELECTORS = {
  points: '.points',
  lives: '.lives',
  time: '.time'
};

export const SPRITESHEET_PATH = 'Imagenes/mazeSpritesheet.png';
// Pixel size of one tile inside the spritesheet image (e.g. 32px)
export const SPRITESHEET_TILE_PX = 32;

export default { DEFAULT_TILE_SIZE, CONTROLS_HEIGHT, ITEM_TYPE, HUD_SELECTORS, SPRITESHEET_PATH, SPRITESHEET_TILE_PX };
